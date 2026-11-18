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
    <div className="slate-folio overflow-hidden rounded-xs border border-warm/35">
      <div className="flex items-center justify-between border-b border-warm/25 bg-[#0c0f17]/85 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <span className="font-numeral text-[11px] font-bold tracking-wider text-warm">
            {language === "cpp" ? "C++" : "PYTHON"}
          </span>
          {title && <span className="text-muted-foreground">{title}</span>}
        </div>
        <button
          type="button"
          onClick={copy}
          className="cursor-pointer font-numeral text-[10.5px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-[#f2dfb9]"
        >
          {copied ? text("Copied", "已复制") : text("Copy", "复制")}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#0a0c12]/80 p-5 font-mono text-[0.83rem] leading-relaxed text-[#ece4d4]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
