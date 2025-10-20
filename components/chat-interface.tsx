"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles } from "lucide-react";
import type { Language } from "@/lib/translations";
import type { TechnologyId, TopicId } from "@/lib/content-data";
import { getTopicExplanation, generateFollowUpResponse } from "@/lib/ai-mock";
import { translations } from "@/lib/translations";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  codeExample?: {
    language: string;
    code: string;
  };
}

interface ChatInterfaceProps {
  technology: TechnologyId | null;
  topic: TopicId | null;
  language: Language;
}

export function ChatInterface({
  technology,
  topic,
  language,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    const fetchInitialContent = async () => {
      if (technology && topic) {
        try {
          const response = await getTopicExplanation(technology, topic, language);
          console.log("Initial explanation response:", response);
          
          // Convert the response to the Message format
          const newMessage = {
            id: Date.now().toString(),
            role: "assistant" as const,
            content: response.content,
            codeExample: response.codeExample,
          };
          
          setMessages([newMessage]);
          setSuggestedQuestions(response.suggestedQuestions || []);
        } catch (error) {
          console.error("Error fetching topic explanation:", error);
          // Set a fallback message if there's an error
          setMessages([{
            id: "error-1",
            role: "assistant",
            content: "Sorry, I couldn't load the content. Please try again later.",
          }]);
        }
      } else {
        setMessages([]);
        setSuggestedQuestions([]);
      }
    };

    fetchInitialContent();
  }, [technology, topic, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !technology || !topic) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const aiResponse = await generateFollowUpResponse(
        input,
        technology,
        topic,
        language
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse.content,
        codeExample: aiResponse.codeExample,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setSuggestedQuestions(aiResponse.suggestedQuestions || []);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Sorry, I encountered an error while generating a response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  const handleCopyMessage = (
    content: string,
    codeExample?: { language: string; code: string }
  ) => {
    let textToCopy = content;
    if (codeExample) {
      textToCopy += `\n\n\`\`\`${codeExample.language}\n${codeExample.code}\n\`\`\``;
    }
    navigator.clipboard.writeText(textToCopy);
  };

  const handleImproveMessage = (messageId: string) => {
    if (!technology || !topic) return;

    // Find the user message that prompted this AI response
    const messageIndex = messages.findIndex((m) => m.id === messageId);
    if (messageIndex > 0) {
      const previousUserMessage = messages[messageIndex - 1];
      if (previousUserMessage.role === "user") {
        // Regenerate response with a slight variation
        const aiResponse = generateFollowUpResponse(
          previousUserMessage.content + " (Please provide more details)",
          technology,
          topic,
          language
        );
        const improvedMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: aiResponse.content,
          codeExample: aiResponse.codeExample,
        };
        // Replace the old message with improved one
        setMessages((prev) => [
          ...prev.slice(0, messageIndex),
          improvedMessage,
          ...prev.slice(messageIndex + 1),
        ]);
        setSuggestedQuestions(aiResponse.suggestedQuestions);
      }
    }
  };

  if (!technology || !topic) {
    return (
      <div className="flex items-center justify-center h-full px-4">
        <div className="text-center space-y-4">
          <Sparkles className="h-12 w-12 md:h-16 md:w-16 mx-auto text-primary" />
          <h2 className="text-xl md:text-2xl font-bold">{t.selectTopic}</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-md">
            Choose a technology and topic from the navigation to start your
            learning journey
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              {...message}
              onCopy={
                message.role === "assistant"
                  ? () =>
                      handleCopyMessage(message.content, message.codeExample)
                  : undefined
              }
              onImprove={
                message.role === "assistant"
                  ? () => handleImproveMessage(message.id)
                  : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input section - fixed at bottom */}
      <div className="flex-shrink-0 ">
        {/* Suggested questions */}
        {/* {suggestedQuestions.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pt-2 ">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs rounded-full hover:bg-accent"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )} */}

        {/* Input field */}
        <div className="max-w-3xl mx-auto px-4 py-2">
          <div className="flex gap-2 items-center bg-muted/50 rounded-3xl px-4 py-2 border border-border focus-within:border-primary transition-colors">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t.typeMessage}
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
            />
            <Button
              onClick={handleSend}
              size="icon"
              disabled={!input.trim()}
              className="h-8 w-8 rounded-full shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Help text */}
        <div className="max-w-3xl mx-auto px-4 pb-2">
          <p className="text-primary text-center text-xs opacity-70">
            You can always ask follow-up questions for clarification.
          </p>
        </div>
      </div>
    </div>
  );
}
