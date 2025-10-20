"use client";

import { CodeBlock } from "./code-block";
import { User, Bot, Copy, RefreshCw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MarkdownRenderer } from "./markdown-renderer";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string | Array<{
    title?: string;
    text?: string;
    code?: string;
  }>;
  codeExample?: {
    language: string;
    code: string;
  };
  onCopy?: () => void;
  onImprove?: () => void;
}

export function MessageBubble({
  role,
  content,
  codeExample,
  onCopy,
  onImprove,
}: MessageBubbleProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (onCopy) {
      onCopy();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`flex gap-4 mb-6 ${
        isUser ? "justify-end" : "justify-start"
      } group`}
    >
      {/* {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
      )} */}

      <div className={`flex-1 w-full ${isUser ? "flex justify-end" : ""}`}>
        <div className={`${isUser ? "max-w-[80%]" : "w-full"}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${
              isUser
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-transparent"
            }`}
          >
            {isUser ? (
              <div className="prose prose-sm max-w-none prose-invert">
                {content as string}
              </div>
            ) : (
              <MarkdownRenderer 
                content={Array.isArray(content) ? content : [{ text: content as string }]} 
                language={codeExample?.language} 
              />
            )}
          </div>

          {codeExample && (
            <div className="mt-3">
              <CodeBlock
                code={codeExample.code}
                language={codeExample.language}
              />
            </div>
          )}

          {!isUser && (onCopy || onImprove) && (
            <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onCopy && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2 text-xs hover:bg-accent rounded-lg"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              )}
              {onImprove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onImprove}
                  className="h-7 px-2 text-xs hover:bg-accent rounded-lg"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Improve
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
          <User className="h-5 w-5 text-accent-foreground" />
        </div>
      )}
    </div>
  );
}
