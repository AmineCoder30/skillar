import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ContentBlock {
  title?: string;
  text?: string;
  code?: string;
}

interface MarkdownRendererProps {
  content: ContentBlock[];
  language?: string;
}

export function MarkdownRenderer({ content, language = 'javascript' }: MarkdownRendererProps) {
  return (
    <div className="space-y-6" dir='rtl'>
      {content.map((block, index, array) => {
        // Skip empty blocks
        if (!block.title && !block.text && !block.code) return null;
        
        // Calculate margins based on block type and position
        const isLast = index === array.length - 1;
        const nextBlock = !isLast ? array[index + 1] : null;
        const isNextBlockTitle = nextBlock?.title;
        const isNextBlockCode = nextBlock?.code;
        
        // Determine bottom margin based on next block type
        let bottomMargin = 'mb-6'; // Default margin
        if (isNextBlockTitle) bottomMargin = 'mb-8';
        else if (isNextBlockCode) bottomMargin = 'mb-4';
        
        if (block.title) {
          return (
            <div key={`title-${index}`} className={`${bottomMargin}`}>
              <h2 className="text-2xl font-bold text-foreground/90">
                {block.title}
              </h2>
              <div className="h-1 w-12 bg-primary/20 mt-2 rounded-full" />
            </div>
          );
        }
     
        if (block.text) {
          return (
            <div key={`text-${index}`} className={`prose dark:prose-invert max-w-none ${bottomMargin} text-foreground/90`}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                  a: ({ children, href }) => (
                    <a 
                      href={href} 
                      className="text-primary hover:underline underline-offset-4"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  h3: ({ children }) => <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground/90">{children}</h3>,
                  h4: ({ children }) => <h4 className="text-lg font-medium mt-4 mb-2 text-foreground/90">{children}</h4>,
                  code: ({ children }) => (
                    <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                  pre: ({ children }) => (
                    <div className="my-4">
                      {children}
                    </div>
                  ),
                }}
              >
                {block.text}
              </ReactMarkdown>
            </div>
          );
        }
        
        if (block.code) {
          return (
            <div key={`code-${index}`} className={`rounded-lg overflow-hidden border border-border/50 ${bottomMargin}`}>
              <div className="bg-muted/50 px-4 py-2 border-b border-border/50 flex justify-between items-center">
                <span className="text-xs font-mono text-muted-foreground">
                  {language}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(block.code || '')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Copy code"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                showLineNumbers={true}
                customStyle={{
                  margin: 0,
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  padding: '1rem',
                  backgroundColor: '#1e1e1e',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: 'var(--font-mono), monospace',
                  },
                }}
              >
                {block.code}
              </SyntaxHighlighter>
            </div>
          );
        }
      })}
    </div>
  );
}
