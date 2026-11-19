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
    <div className="slate-folio overflow-hidden border border-[#d4ae73]/48 shadow-[0_18px_44px_rgba(0,0,0,0.74)]">
      <div className="flex items-center justify-between border-b border-warm/35 bg-[#120d0a]/94 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rotate-45 bg-rubric" aria-hidden="true" />
          <span className="font-numeral text-[11px] font-bold tracking-[0.16em] text-[#e2be84] uppercase">
            {language === "cpp" ? "C++" : "PYTHON"}
          </span>
          {title && <span className="font-display italic text-muted-foreground">{title}</span>}
        </div>
        <button
          type="button"
          onClick={copy}
          className="victorian-ticket cursor-pointer border border-warm/45 bg-[#1d1510] px-2.5 py-0.5 font-numeral text-[10px] font-bold tracking-widest text-[#e2be84] uppercase transition-colors [--ticket-border:rgba(200,157,98,0.45)] hover:bg-[#c89d62] hover:text-[#120b05] hover:[--ticket-border:#c89d62]"
        >
          {copied ? text("✓ Copied", "✓ 已复制") : text("Copy", "复制")}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[#0b0806]/90 p-5 font-mono text-[0.82rem] leading-relaxed text-[#ece2d0]">
        <code>{code}</code>
      </pre>
    </div>
  );
}
