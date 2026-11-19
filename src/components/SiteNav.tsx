import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage, type Language } from "../lib/language";
import { projects } from "../lib/projects";
import { AstrolabeCrest } from "./AtelierChrome";

const ROMAN = ["I", "II", "III", "IV", "V"] as const;
const FOLIO_SLUGS = [
  "still-life",
  "an-echo-has-no-shape",
  "fallen-valkyrie",
  "starshore",
  "sacred-forest",
] as const;

type SiteNavProps = {
  activeFolioSlug?: string | null;
  onSelectFolioSlug?: (slug: string) => void;
};

export function SiteNav({ activeFolioSlug, onSelectFolioSlug }: SiteNavProps) {
  const { pathname } = useLocation();
  const { language, setLanguage, text, localizedPath } = useLanguage();

  const cleanPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  const isHome = cleanPath === "/";

  const resumeHref =
    language === "zh"
      ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
      : "/resume/Leficious_Technical_Game_Designer_Resume.pdf";

  const folioItems = FOLIO_SLUGS.map(
    (slug) => projects.find((p) => p.slug === slug) ?? projects[0],
  );

  const renderCoinMedallion = (label: string, active: boolean, isReel = false) => (
    <span
      style={{ borderRadius: "50%" }}
      className={`relative flex h-9.5 w-9.5 items-center justify-center border-2 font-display ${
        isReel ? "text-[11px]" : "text-[15px]"
      } tracking-wider transition-colors duration-200 ${
        active
          ? "border-[#fff2d4] bg-gradient-to-b from-[#fbf3e2] to-[#dfd0b2] font-bold text-[#8f1616] shadow-[0_4px_12px_rgba(0,0,0,0.85),0_0_0_2px_#6e1515,inset_0_1px_0_rgba(255,255,255,0.9)]"
          : "border-[#c89d62]/72 bg-gradient-to-b from-[#2b1f17] to-[#140e0a] font-bold text-[#ebd09e] shadow-[0_3px_8px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(244,214,162,0.28)] group-hover:border-[#ebd09e] group-hover:from-[#3a2a1f] group-hover:text-[#fff6e5]"
      }`}
    >
      {label}
    </span>
  );

  const reelActive = isHome && activeFolioSlug === "reel";

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-28 top-4 z-[200] -translate-y-24 border border-[#7a582e] bg-parchment px-4 py-2 text-sm font-semibold text-parchment-ink transition-transform focus:translate-y-0"
      >
        {text("Skip to content", "跳至主要内容")}
      </a>

      {/* Desktop 88px Chased-Bronze Coin Medallion Book Spine */}
      <aside
        aria-label={text("Atelier Spine Navigation", "工作室侧脊导航")}
        className="site-header fixed inset-y-0 left-0 z-50 hidden w-[88px] flex-col items-center justify-between border-r border-[#d4ad73]/42 bg-gradient-to-r from-[#120e0b] via-[#0c0907] to-[#070504] py-5 shadow-[8px_0_28px_rgba(0,0,0,0.9)] select-none lg:flex"
      >

        {/* Top Crest + Vertical Engraved Wordmark */}
        <Link
          to={localizedPath("/")}
          viewTransition
          onClick={() => {
            if (isHome && onSelectFolioSlug) onSelectFolioSlug("reel");
          }}
          aria-label="Leficious — Home & Reel"
          className="group flex flex-col items-center gap-2.5 pt-0.5"
        >
          <AstrolabeCrest className="h-11 w-11 drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)]" />
          <span
            className="font-display text-[13px] font-bold tracking-[0.26em] text-[#e8c891] uppercase transition-colors group-hover:text-[#fff6e5]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            LEFICIOUS
          </span>
        </Link>

        {/* Center Chased-Bronze & Ivory-Enamel Coin Medallions (Reel + Folios I - V) */}
        <nav aria-label={text("Showcase Reel & Case Folios I to V", "年度集锦与档案卷一至五")} className="flex w-full flex-col items-center">
          <div className="mb-1.5 flex items-center gap-1">
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-rubric" />
            <span className="font-display text-[10px] font-bold tracking-[0.2em] text-[#d8b47c] uppercase">
              {text("FOLIOS", "卷宗")}
            </span>
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-rubric" />
          </div>

          <div className="flex w-full flex-col items-center gap-1.5 py-0.5">
            {isHome && onSelectFolioSlug ? (
              <button
                type="button"
                title={text("2026 Master Design Reel", "2026 年度设计集锦")}
                onClick={() => onSelectFolioSlug("reel")}
                aria-current={reelActive ? "true" : undefined}
                className="group relative flex w-full cursor-pointer items-center justify-center py-0.5"
              >
                {renderCoinMedallion("▶", reelActive, true)}
                {reelActive && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 border-y-[6px] border-r-[7px] border-y-transparent border-r-[#ebd09e]"
                  />
                )}
              </button>
            ) : (
              <Link
                to={localizedPath("/")}
                viewTransition
                title={text("2026 Master Design Reel", "2026 年度设计集锦")}
                className="group relative flex w-full items-center justify-center py-0.5"
              >
                {renderCoinMedallion("▶", false, true)}
              </Link>
            )}

            {folioItems.map((proj, idx) => {
              const numeral = ROMAN[idx] ?? String(idx + 1);
              const activeOnHome = isHome && activeFolioSlug === proj.slug;
              const activeOnProject = cleanPath === `/projects/${proj.slug}`;
              const active = activeOnHome || activeOnProject;

              const pointerNotch = active ? (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 border-y-[6px] border-r-[7px] border-y-transparent border-r-[#ebd09e]"
                />
              ) : null;

              if (isHome && onSelectFolioSlug) {
                return (
                  <button
                    key={proj.slug}
                    type="button"
                    title={`${numeral} · ${proj.title}`}
                    onClick={() => onSelectFolioSlug(proj.slug)}
                    aria-current={active ? "true" : undefined}
                    className="group relative flex w-full cursor-pointer items-center justify-center py-0.5"
                  >
                    {renderCoinMedallion(numeral, active)}
                    {pointerNotch}
                  </button>
                );
              }

              return (
                <Link
                  key={proj.slug}
                  to={localizedPath(`/projects/${proj.slug}`)}
                  viewTransition
                  title={`${numeral} · ${proj.title}`}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex w-full items-center justify-center py-0.5"
                >
                  {renderCoinMedallion(numeral, active)}
                  {pointerNotch}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Foot: Centered 40px Vertical Language Toggle & Compact CV Plaque (24px clear margin on both sides — zero tangents) */}
        <div className="flex w-full flex-col items-center gap-3">
          <div
            role="group"
            aria-label={text("Choose language", "切换语言")}
            style={{
              clipPath:
                "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)",
            }}
            className="flex w-[40px] flex-col bg-gradient-to-b from-[#e5c489]/75 to-[#8c6736]/58 p-[1.25px] shadow-[0_4px_10px_rgba(0,0,0,0.75)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(4.25px 0, calc(100% - 4.25px) 0, 100% 4.25px, 100% calc(100% - 4.25px), calc(100% - 4.25px) 100%, 4.25px 100%, 0 calc(100% - 4.25px), 0 4.25px)",
              }}
              className="flex w-full flex-col divide-y divide-[#d4ad73]/30 overflow-hidden bg-[#140f0c]"
            >
              {(["en", "zh"] as Language[]).map((opt) => {
                const active = language === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setLanguage(opt)}
                    aria-pressed={active}
                    lang={opt === "zh" ? "zh-CN" : "en"}
                    className={`flex h-[27px] w-full cursor-pointer items-center justify-center font-display text-[11px] font-bold tracking-wider transition-colors ${
                      active
                        ? "bg-gradient-to-b from-[#fcf6e8] to-[#e4d6ba] text-rubric"
                        : "bg-transparent text-[#cfc2ad] hover:bg-[#221a14] hover:text-white"
                    }`}
                  >
                    {opt === "en" ? "EN" : "中文"}
                  </button>
                );
              })}
            </div>
          </div>

          <a
            href={resumeHref}
            download
            title={text("Download Résumé (PDF)", "下载简历 (PDF)")}
            aria-label={text("Download Résumé (PDF)", "下载简历 (PDF)")}
            className="victorian-ticket victorian-ticket-sm victorian-ticket-oxblood flex h-[30px] w-[40px] items-center justify-center gap-0.5 bg-gradient-to-b from-[#241b14] to-[#130e0a] font-display text-[10.5px] font-bold tracking-[0.06em] text-[#f4e4c3] uppercase transition-colors hover:from-[#5e1517] hover:to-[#3b0c0e] hover:text-white"
          >
            <span>{text("CV", "简历")}</span>
            {language === "en" && <span aria-hidden="true" className="text-[9.5px] text-[#e8c78c]">↓</span>}
          </a>
        </div>
      </aside>

      {/* Mobile / Tablet Compact Top Bar (< lg) */}
      <header className="site-header sticky top-0 z-50 border-b border-warm/45 bg-spine/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <Link to={localizedPath("/")} viewTransition className="inline-flex items-center gap-2.5">
            <AstrolabeCrest className="h-8 w-8" />
            <span className="font-display text-base font-bold tracking-[0.2em] text-[#e5c287]">LEFICIOUS</span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-display">
            <NavLink
              to={localizedPath("/")}
              end
              viewTransition
              className={({ isActive }) => (isActive ? "font-bold text-[#fbf3e4]" : "font-bold text-muted-foreground")}
            >
              {text("Atelier", "案台")}
            </NavLink>
            <NavLink
              to={localizedPath("/gallery")}
              viewTransition
              className={({ isActive }) => (isActive ? "font-bold text-[#fbf3e4]" : "font-bold text-muted-foreground")}
            >
              {text("Gallery", "画廊")}
            </NavLink>
            <NavLink
              to={localizedPath("/about")}
              viewTransition
              className={({ isActive }) => (isActive ? "font-bold text-[#fbf3e4]" : "font-bold text-muted-foreground")}
            >
              {text("About", "档案")}
            </NavLink>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="border border-warm/45 px-2 py-0.5 text-xs font-semibold text-[#e5c287]"
            >
              {language === "en" ? "中文" : "EN"}
            </button>
            <a href={resumeHref} download className="brass-plaque px-2.5 py-1 text-xs font-bold">
              {text("CV", "简历")} ↓
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  const { text } = useLanguage();
  return (
    <footer className="mt-16 border-t border-warm/35">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-[15px] tracking-wide text-foreground/90">
          © {new Date().getFullYear()} Leficious · {text("Game, Level & Technical Design Atelier", "游戏、关卡与技术设计档案")}
        </p>
        <p className="font-display text-xs font-bold tracking-[0.2em] text-warm uppercase">LOS ANGELES · CA</p>
      </div>
    </footer>
  );
}
