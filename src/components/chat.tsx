"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AI } from "@/app/actions";
import { useState } from "react";
import { nanoid } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { UserMessage } from "./message";
import { ChatList } from "./chat-list";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { ArrowUpRight, Send } from "lucide-react";

export const Chat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const { formRef, onKeyDown } = useEnterSubmit();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = inputValue.trim();
    setInputValue("");
    if (!value) return;

    // Add user message UI
    setMessages((currentMessages: any[]) => [
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{value}</UserMessage>,
      },
    ]);

    try {
      // Submit and get response message
      const responseMessage = await submitUserMessage(value);
      setMessages((currentMessages: any[]) => [
        ...currentMessages,
        responseMessage,
      ]);
    } catch (error) {
      // You may want to show a toast or trigger an error state.
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <div className="mx-auto w-full max-w-2xl flex justify-center px-4">
            <Button
              variant={"outline"}
              onClick={async () => {
                setMessages((currentMessages: any[]) => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: (
                      <UserMessage>
                        Quiz me about chess with multiple choice questions.
                      </UserMessage>
                    ),
                  },
                ]);

                try {
                  const responseMessage = await submitUserMessage(
                    "Quiz me about chess with multiple choice questions."
                  );
                  setMessages((currentMessages: any[]) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                } catch (error) {
                  console.error(error);
                }
              }}
              className="text-center mx-auto py-8 sm:py-6 text-wrap space-x-2"
            >
              <ArrowUpRight size={18} className="" />
              <span className="flex-1">
                Quiz me about chess with multiple choice questions.
              </span>
            </Button>
            <h1 className="fixed text-center top-1/2 left-1/2 text-4xl md:text-6xl font-bold text-muted select-none -translate-x-1/2 -translate-y-1/2">
              Quiz Chatbot
            </h1>
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSubmit} ref={formRef}>
            <div className="relative flex items-center w-full px-2 overflow-hidden max-h-60 grow bg-background sm:rounded-md border sm:px-2">
              <Textarea
                onKeyDown={onKeyDown}
                tabIndex={0}
                placeholder="Send a message."
                className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] srcoll-hidden focus-visible:ring-none focus-visible:ring-transparent sm:text-sm border-transparent"
                name="message"
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="">
                <Button type="submit" size="icon" disabled={inputValue === ""}>
                  <Send size={18} />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
