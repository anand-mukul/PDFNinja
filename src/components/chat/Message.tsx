import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import React, { forwardRef } from "react";
import { Icons } from "../Icons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center rounded-sm transition-all",
            {
              "order-2 bg-violet-600 dark:bg-violet-700": message.isUserMessage,
              "order-1 bg-gray-200 dark:bg-gray-700": !message.isUserMessage,
              "opacity-0 scale-0 -mr-1": isNextMessageSamePerson,
              "opacity-100 scale-100": !isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-100 h-3/4 w-3/4" />
          ) : (
            <Icons.logo className="fill-gray-700 dark:fill-gray-300 h-3/4 w-3/4" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn(
              "px-4 py-2 rounded-lg inline-block transition-colors duration-300",
              {
                "bg-violet-600 text-white dark:bg-violet-700/90":
                  message.isUserMessage,
                "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100":
                  !message.isUserMessage,
                "rounded-br-none":
                  !isNextMessageSamePerson && message.isUserMessage,
                "rounded-bl-none":
                  !isNextMessageSamePerson && !message.isUserMessage,
              }
            )}
          >
            {typeof message.text === "string" ? (
              <div
                className={cn("prose dark:prose-invert", {
                  "text-zinc-50": message.isUserMessage,
                })}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn(
                  "text-xs select-none mt-1.5 w-full text-right transition-opacity",
                  {
                    "text-gray-500/80 dark:text-gray-400/80":
                      !message.isUserMessage,
                    "text-violet-300/90 dark:text-violet-200/80":
                      message.isUserMessage,
                  }
                )}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

Message.displayName = "Message";

export default Message;
