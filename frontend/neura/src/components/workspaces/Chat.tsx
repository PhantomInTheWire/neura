"use client";

import { useState, FormEvent } from "react";
import { Paperclip, Mic, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { Card, CardContent } from "@/components/ui/card"; // Import Card
// import { div } from "@/components/ui/div";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Hello! How can I help you today?",
      sender: "ai",
    },
    {
      id: 2,
      content: "I have a question about the component library.",
      sender: "user",
    },
    {
      id: 3,
      content: "Sure! I'd be happy to help. What would you like to know?",
      sender: "ai",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: input,
        sender: "user",
      },
    ]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          content: "This is an AI response to your message.",
          sender: "ai",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleAttachFile = () => {
    //
  };

  const handleMicrophoneClick = () => {
    //
  };

  return (
    // Removed container div with px-6
    // Wrapped main content in Card and CardContent
    <div className="p-6 w-full max-w-4xl h-full mx-auto">
      <Card className="flex flex-col h-full grow pb-0">
        <CardContent className="flex flex-col h-full px-4 pt-4">
          <div className="flex-1 overflow-hidden">
            <ChatMessageList className="h-full">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  variant={message.sender === "user" ? "sent" : "received"}
                  className="mb-4"
                >
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src={
                      message.sender === "user"
                        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&crop=faces&fit=crop"
                        : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                    }
                    fallback={message.sender === "user" ? "US" : "AI"}
                  />
                  <ChatBubbleMessage
                    variant={message.sender === "user" ? "sent" : "received"}
                  >
                    {message.content}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}

              {isLoading && (
                <ChatBubble variant="received" className="mb-4">
                  <ChatBubbleAvatar
                    className="h-8 w-8 shrink-0"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&crop=faces&fit=crop"
                    fallback="AI"
                  />
                  <ChatBubbleMessage isLoading />
                </ChatBubble>
              )}
            </ChatMessageList>
          </div>
          {/* Input Section */}
          {/* Removed border, padding, rounded-xl from wrapper div */}
          <div className="mt-4">
            <form
              onSubmit={handleSubmit}
              className="relative rounded-lg border shadow-sm focus-within:ring-0 focus-within:ring-ring bg-background" // Added bg-background for contrast
            >
              <ChatInput
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="min-h-12 resize-none rounded-lg border-0 p-3 shadow-none focus-visible:ring-0 bg-transparent"
              />
              <div className="flex items-center p-2 justify-between border-t">
                <div className="flex gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleAttachFile}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleMicrophoneClick}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="gap-1.5 cursor-pointer"
                >
                  Send
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
