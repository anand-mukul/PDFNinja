import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import React, { createContext, ReactNode, useRef, useState } from "react";
import { toast } from "sonner";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

interface Props {
  fileId: string;
  children: ReactNode;
}

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useUtils();
  const backupMessage = useRef<string>("");
  const currentAbort = useRef<AbortController | null>(null);

  const { mutate: sendMessage } = useMutation<
    ReadableStream<Uint8Array> | null,
    Error,
    { message: string },
    {
      previousMessages: Array<{
        createdAt: string;
        id: string;
        text: string;
        isUserMessage: boolean;
      }>;
    }
  >({
    mutationFn: async ({ message }: { message: string }) => {
      if (currentAbort.current) {
        try {
          currentAbort.current.abort();
        } catch {
          /* ignore */
        }
      }

      const ac = new AbortController();
      currentAbort.current = ac;

      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, message }),
        signal: ac.signal,
      });

      if (!res.ok) {
        let text = "Failed to send message";
        try {
          text = await res.text();
        } catch {
          /* ignore */
        }
        throw new Error(text || "Failed to send message");
      }

      return res.body;
    },

    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.getFileMessages.cancel();
      const previousMessages = utils.getFileMessages.getInfiniteData();

      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old) {
            return { pages: [], pageParams: [] };
          }

          const newPages = [...old.pages];
          const latest = newPages[0]!;

          latest.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latest.messages,
          ];

          newPages[0] = latest;
          return { ...old, pages: newPages };
        }
      );

      setIsLoading(true);

      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },

    onSuccess: async (stream) => {
      if (!stream) {
        setIsLoading(false);
        toast.error("Something went wrong. Please try again.");
        return;
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accResponse = "";

      try {
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            accResponse += decoder.decode(value, { stream: true });
          }

          utils.getFileMessages.setInfiniteData(
            { fileId, limit: INFINITE_QUERY_LIMIT },
            (old) => {
              if (!old) return { pages: [], pageParams: [] };

              const isAiResponseCreated = old.pages.some((page) =>
                page.messages.some((m) => m.id === "ai-response")
              );

              const updatedPages = old.pages.map((page, idx) => {
                if (idx === 0) {
                  let updatedMessages;
                  if (!isAiResponseCreated) {
                    updatedMessages = [
                      {
                        createdAt: new Date().toISOString(),
                        id: "ai-response",
                        text: accResponse,
                        isUserMessage: false,
                      },
                      ...page.messages,
                    ];
                  } else {
                    updatedMessages = page.messages.map((m) =>
                      m.id === "ai-response" ? { ...m, text: accResponse } : m
                    );
                  }
                  return { ...page, messages: updatedMessages };
                }
                return page;
              });

              return { ...old, pages: updatedPages };
            }
          );
        }

        const finalChunk = decoder.decode();
        if (finalChunk) accResponse += finalChunk;

        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            const updatedPages = old.pages.map((page, idx) => {
              if (idx === 0) {
                const updatedMessages = page.messages.map((m) =>
                  m.id === "ai-response" ? { ...m, text: accResponse } : m
                );
                return { ...page, messages: updatedMessages };
              }
              return page;
            });

            return { ...old, pages: updatedPages };
          }
        );
      } catch (readErr) {
        const e =
          readErr instanceof Error ? readErr : new Error(String(readErr));
        console.error("Error while reading stream:", e);
        toast.error("Connection interrupted. Please try again.");
        setMessage(backupMessage.current);
      } finally {
        setIsLoading(false);
        currentAbort.current = null;

        try {
          await utils.getFileMessages.invalidate({ fileId });
        } catch (invErr) {
          console.error("Failed to invalidate messages after stream:", invErr);
        }
      }
    },

    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      setIsLoading(false);

      try {
        if (context?.previousMessages) {
          utils.getFileMessages.setData(
            { fileId },
            { messages: context.previousMessages }
          );
        }
      } catch {
        /* ignore */
      }

      toast.error("Failed to send message. Please try again.");
    },

    onSettled: async () => {
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
