import { useState } from "react";
import type { CodeSnippet } from "../lib/projects";

export function CodeBlock({ language, title, code }: CodeSnippet) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono uppercase tracking-wider text-accent">{language === "cpp" ? "C++" : "Python"}</span>
          {title && <span className="font-mono text-muted-foreground">{title}</span>}
        </div>
        <button type="button" onClick={copy} className="font-mono text-muted-foreground transition-colors hover:text-foreground">
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-[0.85rem] leading-relaxed text-foreground"><code>{code}</code></pre>
    </div>
  );
}
