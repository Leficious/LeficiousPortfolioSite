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

  const spineLinkClass = (isActive: boolean) =>
    `relative flex w-full items-center justify-center py-2 text-[13px] font-display tracking-wide transition-colors ${
      isActive
        ? "bg-gradient-to-r from-[#8f1818]/52 via-[#c89d62]/18 to-transparent text-[#f7eedc] font-semibold before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#c42828]"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-24 top-4 z-[200] -translate-y-24 border border-[#7a582e] bg-parchment px-4 py-2 text-sm font-semibold text-parchment-ink transition-transform focus:translate-y-0"
      >
        {text("Skip to content", "跳至主要内容")}
      </a>

      {/* Desktop 76px Fixed Bookcloth & Double-Gilded Vertical Spine */}
      <aside
        aria-label={text("Atelier Spine Navigation", "工作室侧脊导航")}
        className="site-header fixed inset-y-0 left-0 z-50 hidden w-[76px] flex-col items-center justify-between bg-spine py-4 shadow-[6px_0_24px_rgba(0,0,0,0.85)] select-none lg:flex"
      >
        {/* Double vertical burnished-bronze binding hairlines */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[#c89d62]/62" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[3px] w-px bg-[#c89d62]/26" />

        {/* Top Crest + Vertical Engraved Wordmark */}
        <Link
          to={localizedPath("/")}
          viewTransition
          aria-label="Leficious — Home"
          className="group flex flex-col items-center gap-3 pt-1"
        >
          <AstrolabeCrest className="h-11 w-11 drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)]" />
          <span
            className="font-numeral text-[12px] font-semibold tracking-[0.28em] text-[#dec089] transition-colors group-hover:text-[#fbf3e4]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            LEFICIOUS
          </span>
        </Link>

        {/* Center Roman Numeral Folio Jumpers (I - V) */}
        <nav aria-label={text("Case Folios I to V", "档案卷一至五")} className="flex w-full flex-col items-center">
          <div className="w-10 border-t border-warm/40" />
          {FOLIO_SLUGS.map((slug) => projects.find((p) => p.slug === slug) ?? projects[0]).map((proj, idx) => {
            const numeral = ROMAN[idx] ?? String(idx + 1);
            const activeOnHome = isHome && activeFolioSlug === proj.slug;
            const activeOnProject = cleanPath === `/projects/${proj.slug}`;
            const active = activeOnHome || activeOnProject;

            if (isHome && onSelectFolioSlug) {
              return (
                <button
                  key={proj.slug}
                  type="button"
                  title={proj.title}
                  onClick={() => onSelectFolioSlug(proj.slug)}
                  aria-current={active ? "true" : undefined}
                  className={`relative flex w-full cursor-pointer flex-col items-center py-2 font-numeral text-xs tracking-widest transition-colors ${
                    active
                      ? "text-[#fbf3e4] font-bold after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:border-y-[5px] after:border-r-[6px] after:border-y-transparent after:border-r-[#c42828]"
                      : "text-muted-foreground/85 hover:text-[#f2dfc0]"
                  }`}
                >
                  {numeral}
                  <span aria-hidden="true" className="mt-2 block h-px w-5 bg-warm/28" />
                </button>
              );
            }

            return (
              <Link
                key={proj.slug}
                to={localizedPath(`/projects/${proj.slug}`)}
                viewTransition
                title={proj.title}
                aria-current={active ? "page" : undefined}
                className={`relative flex w-full flex-col items-center py-2 font-numeral text-xs tracking-widest transition-colors ${
                  active
                    ? "text-[#fbf3e4] font-bold after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:border-y-[5px] after:border-r-[6px] after:border-y-transparent after:border-r-[#c42828]"
                    : "text-muted-foreground/85 hover:text-[#f2dfc0]"
                }`}
              >
                {numeral}
                <span aria-hidden="true" className="mt-2 block h-px w-5 bg-warm/28" />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Primary Pages, Language Switch & Embossed Bronze Résumé Plaque */}
        <div className="flex w-full flex-col items-center gap-2">
          <nav aria-label={text("Primary sections", "主要页面")} className="flex w-full flex-col items-center">
            <NavLink to={localizedPath("/")} end viewTransition className={({ isActive }) => spineLinkClass(isActive)}>
              {text("Atelier", "案台")}
            </NavLink>
            <NavLink to={localizedPath("/gallery")} viewTransition className={({ isActive }) => spineLinkClass(isActive)}>
              {text("Gallery", "画廊")}
            </NavLink>
            <NavLink to={localizedPath("/about")} viewTransition className={({ isActive }) => spineLinkClass(isActive)}>
              {text("About", "档案")}
            </NavLink>
          </nav>

          <div
            className="mt-1 flex items-center gap-1 font-numeral text-[10px] text-muted-foreground"
            aria-label={text("Choose language", "切换语言")}
          >
            {(["en", "zh"] as Language[]).map((opt, idx) => (
              <span key={opt} className="inline-flex items-center gap-1">
                {idx > 0 && <span aria-hidden="true" className="text-warm/50">/</span>}
                <button
                  type="button"
                  onClick={() => setLanguage(opt)}
                  aria-pressed={language === opt}
                  lang={opt === "zh" ? "zh-CN" : "en"}
                  className={`cursor-pointer px-0.5 py-0.5 transition-colors ${
                    language === opt ? "font-bold text-[#e5c287]" : "hover:text-foreground"
                  }`}
                >
                  {opt === "en" ? "EN" : "中文"}
                </button>
              </span>
            ))}
          </div>

          <a
            href={resumeHref}
            download
            className="brass-plaque victorian-ticket mt-1 flex w-[58px] flex-col items-center px-1.5 py-2 text-center font-display text-[11px] font-bold leading-tight transition-transform active:scale-95"
          >
            <span>{text("Résumé", "简历")}</span>
            <span aria-hidden="true" className="mt-0.5 font-numeral text-[10px]">↓</span>
          </a>
        </div>
      </aside>

      {/* Mobile / Tablet Compact Top Bar (< lg) */}
      <header className="site-header sticky top-0 z-50 border-b border-warm/45 bg-spine/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-2.5">
          <Link to={localizedPath("/")} viewTransition className="inline-flex items-center gap-2.5">
            <AstrolabeCrest className="h-8 w-8" />
            <span className="font-numeral text-sm font-semibold tracking-[0.2em] text-[#e5c287]">LEFICIOUS</span>
          </Link>

          <div className="flex items-center gap-4 text-xs">
            <NavLink
              to={localizedPath("/")}
              end
              viewTransition
              className={({ isActive }) => (isActive ? "font-semibold text-[#fbf3e4]" : "text-muted-foreground")}
            >
              {text("Atelier", "案台")}
            </NavLink>
            <NavLink
              to={localizedPath("/gallery")}
              viewTransition
              className={({ isActive }) => (isActive ? "font-semibold text-[#fbf3e4]" : "text-muted-foreground")}
            >
              {text("Gallery", "画廊")}
            </NavLink>
            <NavLink
              to={localizedPath("/about")}
              viewTransition
              className={({ isActive }) => (isActive ? "font-semibold text-[#fbf3e4]" : "text-muted-foreground")}
            >
              {text("About", "档案")}
            </NavLink>
            <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "zh" : "en")}
              className="border border-warm/45 px-2 py-0.5 font-numeral text-[11px] text-[#e5c287]"
            >
              {language === "en" ? "中文" : "EN"}
            </button>
            <a href={resumeHref} download className="brass-plaque victorian-ticket px-2.5 py-1 text-[11px] font-semibold">
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
        <p className="font-display text-sm tracking-wide text-foreground/90">
          © {new Date().getFullYear()} Leficious · {text("Game, Level & Technical Design Atelier", "游戏、关卡与技术设计档案")}
        </p>
        <p className="font-numeral text-[11px] font-semibold tracking-[0.18em] text-warm">LOS ANGELES · CA</p>
      </div>
    </footer>
  );
}
