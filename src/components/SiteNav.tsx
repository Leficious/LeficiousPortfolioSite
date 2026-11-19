import { useState } from "react";
import { Link, NavLink, useLocation, useSearchParams } from "react-router-dom";
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

export type SpineVariant = "ribs" | "coins" | "vellum";

type SiteNavProps = {
  activeFolioSlug?: string | null;
  onSelectFolioSlug?: (slug: string) => void;
};

/** Raised leather bookbinding cord band with gold tooling highlight & deep shadow crease */
function RaisedSpineBand() {
  return (
    <div aria-hidden="true" className="my-1 w-full px-1.5">
      <div className="h-[5px] w-full border-y border-[#c89d62]/45 bg-gradient-to-b from-[#3d2b1f] via-[#211610] to-[#090604] shadow-[0_3px_5px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(244,214,162,0.38)]" />
    </div>
  );
}

export function SiteNav({ activeFolioSlug, onSelectFolioSlug }: SiteNavProps) {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { language, setLanguage, text, localizedPath } = useLanguage();
  const [storedVariant, setStoredVariant] = useState<SpineVariant>("ribs");

  const paramVariant = searchParams.get("spine");
  const variant: SpineVariant =
    paramVariant === "coins" || paramVariant === "vellum" || paramVariant === "ribs"
      ? paramVariant
      : storedVariant;

  if (
    (paramVariant === "coins" || paramVariant === "vellum" || paramVariant === "ribs") &&
    paramVariant !== storedVariant
  ) {
    setStoredVariant(paramVariant);
  }

  const cleanPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  const isHome = cleanPath === "/";

  const resumeHref =
    language === "zh"
      ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
      : "/resume/Leficious_Technical_Game_Designer_Resume.pdf";

  const folioItems = FOLIO_SLUGS.map(
    (slug) => projects.find((p) => p.slug === slug) ?? projects[0],
  );

  /* ==================== VARIANT-SPECIFIC NUMERAL STYLING (I - V) ==================== */
  const renderNumeralFace = (numeral: string, active: boolean) => {
    if (variant === "coins") {
      // Method B: Chased-Bronze & Ivory-Enamel Horological Coin Medallions
      return (
        <span
          style={{ borderRadius: "50%" }}
          className={`relative flex h-9.5 w-9.5 items-center justify-center border-2 font-numeral text-[14px] tracking-wider transition-all duration-200 ${
            active
              ? "scale-108 border-[#ebd09e] bg-gradient-to-b from-[#fbf3e2] to-[#dfd0b2] font-bold text-[#8f1616] shadow-[0_4px_12px_rgba(0,0,0,0.85),0_0_0_2px_#6e1515,inset_0_1px_0_rgba(255,255,255,0.9)]"
              : "border-[#c89d62]/65 bg-gradient-to-b from-[#2b1f17] to-[#140e0a] font-semibold text-[#ebd09e] shadow-[0_3px_8px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(244,214,162,0.28)] group-hover:border-[#ebd09e] group-hover:from-[#3a2a1f] group-hover:text-[#fff6e5]"
          }`}
        >
          {numeral}
        </span>
      );
    }

    if (variant === "vellum") {
      // Method C: High-Contrast Pinned Rag-Vellum Index Tickets
      return (
        <span
          style={{
            backgroundImage: 'url("/textures/rag-paper-tile.webp")',
            backgroundSize: "160px 160px",
          }}
          className={`victorian-ticket relative flex h-8.5 w-[58px] items-center justify-center gap-1 border font-numeral text-[13.5px] tracking-widest transition-all duration-200 ${
            active
              ? "scale-105 border-2 border-[#8f1616] bg-[#faf1de] font-bold text-[#8f1616] shadow-[0_5px_14px_rgba(0,0,0,0.85)]"
              : "border-[#7a582e]/80 bg-[#dfd0b3] font-bold text-[#1a120c] opacity-90 shadow-[0_3px_7px_rgba(0,0,0,0.65)] group-hover:bg-[#f2e6ce] group-hover:opacity-100"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1 w-1 rotate-45 ${active ? "bg-[#8f1616]" : "bg-[#684720]/70"}`}
          />
          <span>{numeral}</span>
        </span>
      );
    }

    // Method A (Default): Grand Tome Raised-Rib Gilt & Morocco Leather Compartments
    return (
      <span
        className={`victorian-ticket relative flex h-8.5 w-[56px] items-center justify-center border font-numeral text-[14.5px] tracking-[0.14em] transition-all duration-200 ${
          active
            ? "border-[#ebd09e] bg-gradient-to-b from-[#851818] to-[#520d0d] font-bold text-[#fff6e4] shadow-[0_4px_12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,232,188,0.45)]"
            : "border-[#c89d62]/48 bg-gradient-to-b from-[#241a13] to-[#140e0a] font-semibold text-[#ebd09e] shadow-[inset_0_1px_0_rgba(240,206,148,0.22),0_2px_6px_rgba(0,0,0,0.65)] group-hover:border-[#ebd09e]/85 group-hover:from-[#312319] group-hover:text-[#fff6e4]"
        }`}
      >
        {numeral}
      </span>
    );
  };

  /* ==================== VARIANT-SPECIFIC BOTTOM NAV STYLING ==================== */
  const renderSectionLinkClass = (isActive: boolean) => {
    if (variant === "coins") {
      // Method B: Sculpted Burnished-Brass Push-Plaque vs Gilt-Rimmed Ebony Key
      return `victorian-ticket relative mx-auto flex w-[72px] items-center justify-center py-2 text-[13.5px] font-display tracking-wide transition-all duration-200 ${
        isActive
          ? "brass-plaque font-bold"
          : "border border-[#c89d62]/55 bg-gradient-to-b from-[#261c15] to-[#130d09] font-semibold text-[#f3e7d0] shadow-[0_3px_8px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(238,204,146,0.24)] hover:border-[#ebd09e] hover:text-[#fff8ea]"
      }`;
    }

    if (variant === "vellum") {
      // Method C: Rag-Vellum & Oxblood Folder Index Strips
      return `relative mx-auto flex w-[74px] items-center justify-center border py-2 text-[13.5px] font-display tracking-wide transition-all duration-200 ${
        isActive
          ? "border-[#8f1616] border-l-[3.5px] bg-[#f5ead3] font-bold text-[#8f1616] shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          : "border-[#c89d62]/45 bg-[#221711] font-semibold text-[#f1e4cc] hover:border-[#ebd09e]/80 hover:bg-[#2d1f17] hover:text-[#fff7e8]"
      }`;
    }

    // Method A (Default): Gold-Tooled Morocco Leather Spine Title Labels
    return `relative mx-auto flex w-[74px] items-center justify-center border py-2 text-[13.5px] font-display tracking-wide transition-all duration-200 ${
      isActive
        ? "border-[#ebd09e] bg-gradient-to-b from-[#7d1717] to-[#4b0c0c] font-bold text-[#fff6e5] shadow-[0_4px_12px_rgba(0,0,0,0.85),inset_0_0_0_2px_rgba(235,208,158,0.25)]"
        : "border-[#c89d62]/50 bg-gradient-to-b from-[#241913] to-[#150e0a] font-semibold text-[#f2e6cf] shadow-[inset_0_1px_0_rgba(235,202,146,0.2)] hover:border-[#ebd09e]/85 hover:from-[#302219] hover:text-[#fff8ea]"
    }`;
  };

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-28 top-4 z-[200] -translate-y-24 border border-[#7a582e] bg-parchment px-4 py-2 text-sm font-semibold text-parchment-ink transition-transform focus:translate-y-0"
      >
        {text("Skip to content", "跳至主要内容")}
      </a>

      {/* Desktop 88px Embossed Leather & Double-Brass Vertical Book Spine */}
      <aside
        aria-label={text("Atelier Spine Navigation", "工作室侧脊导航")}
        className="site-header fixed inset-y-0 left-0 z-50 hidden w-[88px] flex-col items-center justify-between bg-gradient-to-r from-[#150f0b] via-[#0e0a07] to-[#080504] py-3.5 shadow-[8px_0_28px_rgba(0,0,0,0.9)] select-none lg:flex"
      >
        {/* Double vertical burnished-brass binding rods */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-[1.5px] bg-[#d4ae73]/72" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-[4px] w-px bg-[#c89d62]/32" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[3px] w-px bg-[#c89d62]/18" />

        {/* Top Crest + Vertical Engraved Wordmark */}
        <Link
          to={localizedPath("/")}
          viewTransition
          aria-label="Leficious — Home"
          className="group flex flex-col items-center gap-2.5 pt-0.5"
        >
          <AstrolabeCrest className="h-11 w-11 drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)]" />
          <span
            className="font-numeral text-[12px] font-bold tracking-[0.26em] text-[#e8c891] transition-colors group-hover:text-[#fff6e5]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            LEFICIOUS
          </span>
        </Link>

        {/* Center Roman Numeral Folio Jumpers (I - V) */}
        <nav aria-label={text("Case Folios I to V", "档案卷一至五")} className="flex w-full flex-col items-center">
          <div className="mb-1 flex items-center gap-1">
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-rubric" />
            <span className="font-numeral text-[9px] font-bold tracking-[0.22em] text-[#d8b47c] uppercase">
              {text("FOLIOS", "卷宗")}
            </span>
            <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-rubric" />
          </div>

          {variant === "ribs" && <RaisedSpineBand />}

          <div className={`flex w-full flex-col items-center ${variant === "ribs" ? "gap-0.5" : "gap-1.5 py-1"}`}>
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

              const itemNode = isHome && onSelectFolioSlug ? (
                <button
                  key={proj.slug}
                  type="button"
                  title={`${numeral} · ${proj.title}`}
                  onClick={() => onSelectFolioSlug(proj.slug)}
                  aria-current={active ? "true" : undefined}
                  className="group relative flex w-full cursor-pointer items-center justify-center py-0.5"
                >
                  {renderNumeralFace(numeral, active)}
                  {pointerNotch}
                </button>
              ) : (
                <Link
                  key={proj.slug}
                  to={localizedPath(`/projects/${proj.slug}`)}
                  viewTransition
                  title={`${numeral} · ${proj.title}`}
                  aria-current={active ? "page" : undefined}
                  className="group relative flex w-full items-center justify-center py-0.5"
                >
                  {renderNumeralFace(numeral, active)}
                  {pointerNotch}
                </Link>
              );

              return (
                <div key={proj.slug} className="flex w-full flex-col items-center">
                  {itemNode}
                  {variant === "ribs" && <RaisedSpineBand />}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Primary Pages, Language Switch & Embossed Bronze Résumé Plaque */}
        <div className="flex w-full flex-col items-center gap-2">
          <nav aria-label={text("Primary sections", "主要页面")} className="flex w-full flex-col items-center gap-1.5">
            <NavLink to={localizedPath("/")} end viewTransition className={({ isActive }) => renderSectionLinkClass(isActive)}>
              {text("Atelier", "案台")}
            </NavLink>
            <NavLink to={localizedPath("/gallery")} viewTransition className={({ isActive }) => renderSectionLinkClass(isActive)}>
              {text("Gallery", "画廊")}
            </NavLink>
            <NavLink to={localizedPath("/about")} viewTransition className={({ isActive }) => renderSectionLinkClass(isActive)}>
              {text("About", "档案")}
            </NavLink>
          </nav>

          <div
            className="mt-0.5 flex items-center gap-1.5 border border-warm/35 bg-[#19120d] px-2 py-0.5 font-numeral text-[10px]"
            aria-label={text("Choose language", "切换语言")}
          >
            {(["en", "zh"] as Language[]).map((opt, idx) => (
              <span key={opt} className="inline-flex items-center gap-1.5">
                {idx > 0 && <span aria-hidden="true" className="text-warm/55">/</span>}
                <button
                  type="button"
                  onClick={() => setLanguage(opt)}
                  aria-pressed={language === opt}
                  lang={opt === "zh" ? "zh-CN" : "en"}
                  className={`cursor-pointer px-0.5 transition-colors ${
                    language === opt ? "font-bold text-[#ebd09e]" : "text-muted-foreground hover:text-foreground"
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
            className="brass-plaque victorian-ticket flex w-[72px] items-center justify-center gap-1 px-2 py-2 text-center font-numeral text-[10.5px] font-bold tracking-[0.08em] uppercase transition-transform active:scale-95"
          >
            <span>{text("Résumé", "简历")}</span>
            <span aria-hidden="true" className="text-[10px]">↓</span>
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
