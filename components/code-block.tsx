"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark, coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useThemeContext } from "@/context/themeContext";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { settings } = useThemeContext();
  const isDarkMode = settings.theme === "dark";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-muted/30 ">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {language}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={copyToClipboard}
          className="h-7 px-2 hover:bg-background"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Copy code</span>
            </>
          )}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto bg-code-bg">
        {/* <pre className="text-sm">
          <code className="font-mono text-foreground leading-relaxed"> */}
        <SyntaxHighlighter
          language="javascript"
          style={isDarkMode ? atomDark : coy}
        >
          {code}
        </SyntaxHighlighter>
        {/* </code>
        </pre> */}
      </div>
    </div>
  );
}
