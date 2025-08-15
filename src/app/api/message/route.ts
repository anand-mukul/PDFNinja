import { NextRequest } from "next/server";
import { db } from "@/db";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";

import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userId = user?.id;
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { fileId, message } = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({ where: { id: fileId, userId } });
    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId,
        fileId,
      },
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({
      model:
        process.env.GEMINI_EMBEDDING_MODEL || "models/gemini-embedding-001",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
      textKey: "pageContent",
    });

    const results = await vectorStore.similaritySearch(message, 4);

    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "asc" },
      take: 6,
    });

    const formattedPrevMessages = prevMessages.map((m) => ({
      role: m.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: m.text,
    }));

    const uiPrevMessages: UIMessage[] = formattedPrevMessages.map((m, i) => ({
      id: `history-${i}`,
      role: m.role,
      parts: [{ type: "text", text: m.content }],
    }));

    const contextText = (results || [])
      .map((r) => r.pageContent)
      .join("\n\n")
      .slice(0, 100_000);

    const systemText = `You are a helpful assistant. Use the following pieces of context (or previous conversation if needed) to answer the user's question in Markdown format.
If you don't know the answer, say you don't know. Do not hallucinate.

CONTEXT:
${contextText}
----------------
`;

    const uiMessages: UIMessage[] = [
      {
        id: "sys-1",
        role: "system",
        parts: [{ type: "text", text: systemText }],
      },
      ...uiPrevMessages,
      { id: "u-new", role: "user", parts: [{ type: "text", text: message }] },
    ];

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-pro";
    const model = google(modelName);

    const result = streamText({
      model,
      messages: convertToModelMessages(uiMessages),
      temperature: 0.0,
      maxOutputTokens: 2048,
      abortSignal: req.signal as AbortSignal,
    });

    const { textStream } = result;

    const encoder = new TextEncoder();
    let accumulated = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const textPart of textStream) {
            if (req.signal.aborted) {
              controller.close();
              return;
            }

            if (textPart) {
              controller.enqueue(encoder.encode(textPart));
              accumulated += textPart;
            }
          }

          const assistantText = accumulated.trim();
          if (assistantText.length > 0) {
            try {
              await db.message.create({
                data: {
                  text: assistantText,
                  isUserMessage: false,
                  userId,
                  fileId,
                },
              });
            } catch (saveErr) {
              const saveError =
                saveErr instanceof Error ? saveErr : new Error(String(saveErr));
              console.error("Failed to save assistant message:", saveError);
            }
          }

          controller.close();
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error("Error while streaming LLM output:", error);
          try {
            controller.error(error);
          } catch {
            /* ignore */
          }
        }
      },

      cancel(reason) {
        console.log("ReadableStream cancelled:", reason);
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("POST /api/message error:", error);
    return new Response(error.message || "Internal server error", {
      status: 500,
    });
  }
}
