import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

type Props = {
  language: "cpp" | "python";
  title?: string;
  code: string;
};

export function CodeBlock({ language, title, code }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const label = language === "cpp" ? "C++" : "Python";

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono uppercase tracking-wider text-accent">
            {label}
          </span>
          {title && (
            <span className="font-mono text-muted-foreground">{title}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="font-mono text-muted-foreground transition-colors hover:text-foreground"
        >
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language === "cpp" ? "cpp" : "python"}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1rem 1.25rem",
          background: "transparent",
          fontSize: "0.85rem",
          fontFamily: "var(--font-mono)",
        }}
        codeTagProps={{ style: { fontFamily: "var(--font-mono)" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
