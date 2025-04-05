"use client";

import { useState, FC } from "react"; // Import FC for functional component typing
import { useTheme } from "next-themes"; // Import useTheme
import Markdown, { Components } from "react-markdown"; // Import Components type
// Removed incorrect CodeProps import
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { Check, Clipboard } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import "./styles.css";

export default function MarkdownRenderer({ content }: { content: string }) {
  const { theme } = useTheme(); // Get current theme

  return (
    // Apply prose classes to a wrapping div
    <div className="prose dark:prose-invert max-w-none">
      <Markdown
        // Removed className from Markdown component
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        // Define components object with correct typing
        components={{
          // Use 'any' for code props temporarily
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || ""); // Extracts the language name
            const language = match ? match[1] : "txt"; // Default to txt if no language
            const codeText = String(children).trim();

          return !inline && match ? (
            <div className="relative group">
              <CopyButton code={codeText} />
              <span className="absolute top-2 right-8 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-80">
                {match ? language : "Text"}
              </span>

              <SyntaxHighlighter
                // Use theme from hook
                style={theme === "dark" ? oneDark : oneLight}
                language={language}
                {...props}
              >
                {codeText}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="text-white px-1 py-0.5 rounded" {...props}>
              {children}
            </code>
          );
        },
        // Remove math and inlineMath overrides - let rehype-katex handle them
      } as Components } // Assert type as Components
      >
        {content}
      </Markdown>
    </div>
  );
}

// Copy Button Component
const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      // Use theme-aware classes for copy button
      className="absolute top-2 right-2 bg-muted/50 text-muted-foreground hover:bg-muted p-1 rounded-md opacity-70 group-hover:opacity-100 transition-opacity"
    >
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Clipboard size={16} />
      )}
    </button>
  );
};
