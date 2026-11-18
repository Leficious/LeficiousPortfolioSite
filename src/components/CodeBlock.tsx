import { useState } from "react";
import type { CodeSnippet } from "../lib/projects";
import { useLanguage } from "../lib/language";

export function CodeBlock({ language, title, code }: CodeSnippet) {
  const { text } = useLanguage();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-xs border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-warm">{language === "cpp" ? "C++" : "Python"}</span>
          {title && <span className="text-muted-foreground">{title}</span>}
        </div>
        <button type="button" onClick={copy} className="cursor-pointer font-mono text-muted-foreground transition-colors hover:text-foreground">
          {copied ? text("Copied", "已复制") : text("Copy", "复制")}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[0.84rem] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}
