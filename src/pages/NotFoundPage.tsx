import { Link, useLocation } from "react-router-dom";
import { CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { Seo } from "../components/Seo";
import { useLanguage } from "../lib/language";

export function NotFoundPage({ message }: { message?: string }) {
  const { pathname } = useLocation();
  const { text, localizedPath } = useLanguage();
  const resolvedMessage = message ?? text("Folio not found", "未找到该卷宗页面");

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-20 text-foreground">
      <Seo
        title={text("Page not found | Leficious", "未找到页面 | Leficious")}
        description={text("The requested page could not be found.", "无法找到请求的页面。")}
        path={pathname}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="parchment-sheet relative mx-auto w-full max-w-lg border-[4px] border-[#15100d] px-8 pt-12 pb-10 text-center"
      >
        <CrimsonStamp className="pointer-events-none absolute -top-7 left-1/2 h-14 w-14 -translate-x-1/2" />
        <FolioCorners tone="parchment" />
        <div className="relative z-10">
          <p className="font-numeral text-xs font-bold tracking-[0.26em] text-rubric">ARCHIVE CDIV · 404</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-parchment-ink">{resolvedMessage}</h1>
          <p className="mt-2 text-[16px] text-parchment-muted">
            {text("This plate does not exist or has been re-indexed.", "该页面不存在，或已被归入其他卷宗。")}
          </p>
          <Link
            to={localizedPath("/")}
            viewTransition
            className="victorian-ticket mt-6 inline-flex items-center gap-2 bg-[#191310] px-5 py-2.5 font-numeral text-xs font-semibold tracking-[0.12em] text-[#f2e8d5] uppercase transition-colors hover:bg-[#2e231d]"
          >
            ← {text("Return to Atelier Desk", "返回案台卷宗")}
          </Link>
        </div>
      </main>
    </div>
  );
}
