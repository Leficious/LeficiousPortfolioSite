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
    <div className="slate-folio overflow-hidden border border-warm/38">
      <div className="flex items-center justify-between border-b border-warm/25 bg-[#120d0a]/90 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-numeral text-[11px] font-bold tracking-[0.14em] text-warm uppercase">
            {language === "cpp" ? "C++" : "PYTHON"}
          </span>
          {title && <span className="font-display italic text-muted-foreground">{title}</span>}
        </div>
        <button
          type="button"
          onClick={copy}
          className="cursor-pointer font-numeral text-[10.5px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-[#e2c088]"
        >
          {copied ? text("Copied", "已复制") : text("Copy", "复制")}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#0b0806]/90 p-5 font-mono text-[0.82rem] leading-relaxed text-[#ece2d0]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
