"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import "./styles.css";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Markdown
      // className="text-muted-foreground"
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code({ node, inline, className, children, ...props }) {
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
                style={theme === "light" ? oneLight : oneDark}
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
        math({ value }) {
          return (
            <span className="my-4 flex justify-center">
              <span className="block">{value}</span>
            </span>
          );
        },
        inlineMath({ value }) {
          return <span className="px-1">{value}</span>;
        },
      }}
    >
      {content}
    </Markdown>
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
      className="absolute top-2 right-2 bg-gray-800 text-white p-1 rounded-md opacity-80 hover:opacity-100"
    >
      {copied ? (
        <Check size={16} className="text-green-400" />
      ) : (
        <Clipboard size={16} />
      )}
    </button>
  );
};
