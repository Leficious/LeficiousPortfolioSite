import { useId, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../lib/language";

const FRAME_MAIN_D =
  "M 31.80 15.00 H 4.70 L 48.00 90.00 L 62.20 65.40 H 57.82 L 48.00 82.40 L 11.28 18.80 H 31.80 Z";
const FRAME_UR_D =
  "M 51.40 15.00 H 91.30 L 73.52 45.80 H 69.13 L 84.72 18.80 H 51.40 Z";
const L_MONOLITH_D =
  "M 36.20 10.24 L 47.00 4.00 V 50.20 H 77.20 L 70.96 61.00 H 40.73 L 36.20 53.16 Z";
const CHEVRON_POINTS =
  "42.23,65.40 44.60,65.40 48.00,71.30 51.40,65.40 53.77,65.40 48.00,75.40";
const CHAMBER_POINTS = "51.40,23.20 77.09,23.20 64.05,45.80 51.40,45.80";

const ASTROLABE_TICKS = Array.from({ length: 24 }, (_, idx) => {
  const angle = (idx * 15 * Math.PI) / 180;
  const major = idx % 2 === 0;
  const r1 = major ? 42.5 : 44.5;
  const r2 = 46.8;
  return {
    x1: (48 + Math.cos(angle) * r1).toFixed(2),
    y1: (48 + Math.sin(angle) * r1).toFixed(2),
    x2: (48 + Math.cos(angle) * r2).toFixed(2),
    y2: (48 + Math.sin(angle) * r2).toFixed(2),
    major,
  };
});

/**
 * Custom P03-E2 geometric L-monolith crest inscribed inside a mathematical
 * double-ring burnished antique-bronze astrolabe.
 */
export function AstrolabeCrest({ className = "h-11 w-11" }: { className?: string }) {
  const rawId = useId();
  const clipId = `ast-crest-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className={`shrink-0 overflow-visible ${className}`}>
      <defs>
        <clipPath id={clipId}>
          <polygon points={CHAMBER_POINTS} />
        </clipPath>
      </defs>

      <g className="origin-center transition-transform duration-700 ease-out group-hover:rotate-[30deg]">
        <circle cx="48" cy="48" r="46.8" fill="none" stroke="#e2be84" strokeWidth="1.1" opacity="0.92" />
        <circle cx="48" cy="48" r="42.2" fill="none" stroke="#d4ad73" strokeWidth="0.7" opacity="0.55" />
        {ASTROLABE_TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="#e2be84"
            strokeWidth={t.major ? "1.05" : "0.6"}
            opacity={t.major ? "0.9" : "0.48"}
          />
        ))}
        <polygon points="48,0 50.2,3.2 48,6.4 45.8,3.2" fill="#f3dfb9" />
        <polygon points="48,89.6 50.2,92.8 48,96 45.8,92.8" fill="#d4ad73" opacity="0.85" />
      </g>

      <g transform="translate(10.5, 11) scale(0.78)">
        <path d={FRAME_MAIN_D} fill="#f7f0e2" />
        <path d={FRAME_UR_D} fill="#f7f0e2" />
        <g clipPath={`url(#${clipId})`} fill="none" stroke="#d4ad73" strokeWidth="2.4">
          <circle cx="47" cy="50.2" r="10.8" />
          <circle cx="47" cy="50.2" r="18.0" />
          <circle cx="47" cy="50.2" r="25.2" />
        </g>
        <polygon points={CHEVRON_POINTS} fill="#d4ad73" />
        <path d={L_MONOLITH_D} fill="#ebd09e" />
      </g>
    </svg>
  );
}

/**
 * Airy, precision-beveled vector brass L-corner mounts (~88% open negative space,
 * zero dense raster noise, crisp at every zoom level).
 */
export function BrassCornerClasps({ sizeClass = "h-7 w-7 sm:h-8 sm:w-8" }: { sizeClass?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `bc-grad-${uid}`;

  const Clasp = ({ rotate, pos }: { rotate: string; pos: string }) => (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={`absolute ${pos} ${rotate} ${sizeClass} [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.82))]`}
    >
      <path d="M0 32 V0 H32 L28.8 3.2 H3.2 V28.8 Z" fill={`url(#${gradId})`} />
      <path d="M0.5 31 V0.5 H31" stroke="#fff4da" strokeWidth="0.7" opacity="0.75" />
      <path d="M3.2 14.5 A11.3 11.3 0 0 0 14.5 3.2" stroke={`url(#${gradId})`} strokeWidth="1.1" opacity="0.9" />
      <polygon points="0,0 5.6,0 0,5.6" fill="#fff0cc" opacity="0.85" />
      <circle cx="24.5" cy="1.6" r="0.9" fill="#2a190b" />
      <circle cx="1.6" cy="24.5" r="0.9" fill="#2a190b" />
    </svg>
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 select-none">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f7e3ba" />
            <stop offset="52%" stopColor="#d4ad73" />
            <stop offset="100%" stopColor="#8c6330" />
          </linearGradient>
        </defs>
      </svg>
      <Clasp pos="-left-[1px] -top-[1px]" rotate="rotate-0" />
      <Clasp pos="-right-[1px] -top-[1px]" rotate="rotate-90" />
      <Clasp pos="-bottom-[1px] -right-[1px]" rotate="rotate-180" />
      <Clasp pos="-bottom-[1px] -left-[1px]" rotate="-rotate-90" />
    </div>
  );
}

/**
 * Clean 19th-century Chiswick-Press stepped plate-mark corner spandrels.
 * Uses only 2 open architectural strokes + 1 tiny diamond finial so corners stay
 * light, crisp, and breathable even at small card sizes.
 */
export function FolioCorners({
  tone = "parchment",
  inset = "inset-2.5 sm:inset-3.5",
  sizeClass = "h-7 w-7 sm:h-8 sm:w-8",
}: {
  tone?: "parchment" | "slate";
  inset?: string;
  sizeClass?: string;
}) {
  const isParchment = tone === "parchment";
  const stroke = isParchment ? "#704e26" : "#d8b47c";
  const accent = isParchment ? "#8a181a" : "#f0d5a3";

  const Corner = ({ rotate }: { rotate: string }) => (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={`${sizeClass} ${rotate}`} fill="none">
      <path d="M0.6 26 V0.6 H26" stroke={stroke} strokeWidth="1.2" />
      <path d="M4.6 15.5 V7.6 H7.6 V4.6 H15.5" stroke={stroke} strokeWidth="0.95" opacity="0.82" />
      <polygon points="4.6,2.8 6.4,4.6 4.6,6.4 2.8,4.6" fill={accent} />
    </svg>
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset}`}>
      <div
        className="absolute inset-0 border"
        style={{
          borderColor: isParchment ? "rgba(112, 78, 38, 0.32)" : "rgba(216, 180, 124, 0.26)",
        }}
      />
      <div className="absolute left-0 top-0"><Corner rotate="rotate-0" /></div>
      <div className="absolute right-0 top-0"><Corner rotate="rotate-90" /></div>
      <div className="absolute right-0 bottom-0"><Corner rotate="rotate-180" /></div>
      <div className="absolute left-0 bottom-0"><Corner rotate="-rotate-90" /></div>
    </div>
  );
}

/**
 * Authentic photorealistic Deep-Crimson Melted Sealing-Wax Stamp (`crimson-wax-seal.webp`).
 */
export function CrimsonStamp({
  className = "h-12 w-12",
  stamped = false,
}: {
  label?: string;
  className?: string;
  stamped?: boolean;
}) {
  return (
    <img
      src="/ornaments/crimson-wax-seal.webp"
      alt=""
      aria-hidden="true"
      width="96"
      height="96"
      decoding="async"
      className={`shrink-0 select-none object-contain [filter:drop-shadow(0_5px_10px_rgba(0,0,0,0.68))_drop-shadow(0_1.5px_2px_rgba(0,0,0,0.86))] ${
        stamped ? "animate-stamp-press" : "-rotate-2"
      } ${className}`}
    />
  );
}

/**
 * Taut burnished-brass suspension wires + recessed brass grommet eyelets + central melted
 * crimson wax seal, locked rigidly to the folio header (zero wobble, exact 1:1 SVG aspect,
 * and 7.4px clear below the FolioCorners top rule).
 */
export function BrassPinThreads({ animKey }: { animKey?: string }) {
  void animKey;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const wireGradId = `wire-g-${uid}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-30 mx-auto -mb-[29px] h-[51px] w-[300px] select-none sm:-mb-[38px] sm:h-[68px] sm:w-[400px]"
    >
      <svg
        viewBox="0 0 400 68"
        fill="none"
        className="h-full w-full overflow-visible [filter:drop-shadow(0_1.5px_1.2px_rgba(0,0,0,0.45))]"
      >
        <defs>
          <linearGradient id={wireGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c79c5e" />
            <stop offset="50%" stopColor="#f2d7a4" />
            <stop offset="100%" stopColor="#c79c5e" />
          </linearGradient>
        </defs>

        {/* Taut brass suspension wires from beneath the wax seal out to the vellum grommets */}
        <line x1="200" y1="24" x2="28" y2="60" stroke={`url(#${wireGradId})`} strokeWidth="1.45" />
        <line x1="200" y1="24" x2="372" y2="60" stroke={`url(#${wireGradId})`} strokeWidth="1.45" />

        {/* Left & right sculpted brass grommet eyelets (cleanly below FolioCorners top rule) */}
        <circle cx="28" cy="60" r="4.2" fill="#d8b274" stroke="#5c3e1b" strokeWidth="0.9" />
        <circle cx="28" cy="60" r="2.1" fill="#14100c" />
        <circle cx="372" cy="60" r="4.2" fill="#d8b274" stroke="#5c3e1b" strokeWidth="0.9" />
        <circle cx="372" cy="60" r="2.1" fill="#14100c" />
      </svg>

      <CrimsonStamp className="absolute left-1/2 top-[2px] z-10 h-11 w-11 -translate-x-1/2 rotate-0 sm:h-14 sm:w-14" />
    </div>
  );
}

/**
 * Clean, airy horological & editorial divider rule (zero muddy raster centerpiece).
 */
export function BrassRule({
  tone = "parchment",
  ornate = false,
  className = "",
}: {
  tone?: "parchment" | "slate";
  ornate?: boolean;
  className?: string;
}) {
  const isParchment = tone === "parchment";
  const stroke = isParchment ? "#755228" : "#d8b47c";
  const gem = isParchment ? "#8a181a" : "#f0d5a3";

  if (ornate) {
    return (
      <div aria-hidden="true" className={`flex items-center gap-3 ${className}`}>
        <span
          className={`h-px flex-1 ${
            isParchment
              ? "bg-gradient-to-r from-transparent via-[#755228]/50 to-[#755228]/85"
              : "bg-gradient-to-r from-transparent via-[#d4ad73]/45 to-[#e5c58d]/85"
          }`}
        />

        <svg viewBox="0 0 92 16" fill="none" className="h-4 w-[92px] shrink-0 overflow-visible">
          <line x1="0" y1="8" x2="26" y2="8" stroke={stroke} strokeWidth="1" opacity="0.8" />
          <line x1="66" y1="8" x2="92" y2="8" stroke={stroke} strokeWidth="1" opacity="0.8" />
          <polygon points="18,8 21,5.6 24,8 21,10.4" fill={stroke} opacity="0.85" />
          <polygon points="68,8 71,5.6 74,8 71,10.4" fill={stroke} opacity="0.85" />
          <polygon points="30,8 46,1.6 62,8 46,14.4" stroke={stroke} strokeWidth="1.15" />
          <circle cx="46" cy="8" r="3.6" stroke={stroke} strokeWidth="0.95" opacity="0.85" />
          <polygon points="46,5.8 48.2,8 46,10.2 43.8,8" fill={gem} />
        </svg>

        <span
          className={`h-px flex-1 ${
            isParchment
              ? "bg-gradient-to-l from-transparent via-[#755228]/50 to-[#755228]/85"
              : "bg-gradient-to-l from-transparent via-[#d4ad73]/45 to-[#e5c58d]/85"
          }`}
        />
      </div>
    );
  }

  const line = isParchment ? "bg-[#755228]/42" : "bg-warm/38";

  return (
    <div aria-hidden="true" className={`flex items-center gap-2.5 ${className}`}>
      <span className={`h-px flex-1 ${line}`} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: stroke }} />
      <span className="h-2 w-2 rotate-45 border" style={{ borderColor: stroke, backgroundColor: gem }} />
      <span className="h-1.5 w-1.5 rotate-45" style={{ backgroundColor: stroke }} />
      <span className={`h-px flex-1 ${line}`} />
    </div>
  );
}

/**
 * Unified top Victorian Archival Header Rail shared across Atelier, Gallery, Project, and Dossier routes.
 * Docks 3 cohesive ebony-morocco & sunlit-vellum folder tabs directly onto the header rule
 * alongside the brushed champagne-brass action plaque at top-right.
 */
export function AtelierHeaderRail({
  eyebrow = "LEFICIOUS",
  subtitle,
  rightSlot,
  maxWidthClass = "max-w-[1380px]",
}: {
  eyebrow?: string;
  subtitle: string;
  rightSlot?: ReactNode;
  maxWidthClass?: string;
}) {
  const { pathname } = useLocation();
  const { text, localizedPath } = useLanguage();

  const cleanPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  const activeSection: "atelier" | "gallery" | "about" =
    cleanPath.startsWith("/gallery") ? "gallery" : cleanPath.startsWith("/about") ? "about" : "atelier";

  const roomItems = [
    {
      id: "atelier" as const,
      roman: "I",
      label: text("Atelier & Reel", "作品案台与集锦"),
      to: localizedPath("/"),
    },
    {
      id: "gallery" as const,
      roman: "II",
      label: text("Gallery", "画廊"),
      to: localizedPath("/gallery"),
    },
    {
      id: "about" as const,
      roman: "III",
      label: text("About & Dossier", "个人档案与信函"),
      to: localizedPath("/about"),
    },
  ];

  return (
    <div className={`atelier-header-rail relative z-30 mx-auto w-full ${maxWidthClass}`}>
      <header className="relative flex w-full flex-wrap items-center justify-between gap-3 border-b border-[#d4ad73]/38 pb-3.5 xl:flex-nowrap">
        <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5 xl:flex-nowrap">
          <p className="shrink-0 font-display text-xl font-bold tracking-[0.18em] text-[#f7f0e2] uppercase sm:text-[22px]">
            {eyebrow}
          </p>
          <span aria-hidden="true" className="hidden h-1.5 w-1.5 shrink-0 rotate-45 bg-[#d4ad73] sm:inline-block" />
          <p className="truncate font-display text-[16px] font-medium italic text-[#e6dac6] sm:text-[17.5px]">
            {subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 2xl:gap-3">
          <nav
            aria-label={text("Primary Portfolio Volumes", "主要作品卷宗目录")}
            className="hidden items-center gap-1.5 lg:flex"
          >
            {roomItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  viewTransition
                  aria-current={active ? "page" : undefined}
                  style={{
                    clipPath:
                      "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                  }}
                  className={`group relative inline-flex h-[36px] p-[1.5px] transition-colors duration-200 ${
                    active
                      ? "bg-gradient-to-b from-[#fff3d6] via-[#dfb97b] to-[#b5894b] shadow-[0_4px_12px_rgba(0,0,0,0.65)]"
                      : "bg-gradient-to-b from-[#e5c489]/75 to-[#8c6736]/58 shadow-[0_3px_8px_rgba(0,0,0,0.55)] hover:from-[#fff0cc] hover:to-[#c89d62]"
                  }`}
                >
                  <span
                    style={{
                      clipPath:
                        "polygon(5.12px 0, calc(100% - 5.12px) 0, 100% 5.12px, 100% calc(100% - 5.12px), calc(100% - 5.12px) 100%, 5.12px 100%, 0 calc(100% - 5.12px), 0 5.12px)",
                    }}
                    className={`inline-flex h-full items-center px-3.5 transition-colors xl:px-4 ${
                      active
                        ? "bg-gradient-to-b from-[#fcf6e8] to-[#eae0c8] text-[#14100c]"
                        : "bg-gradient-to-b from-[#211913] via-[#17110d] to-[#100c09] text-[#ede2cf] group-hover:from-[#2c2119] group-hover:to-[#18120e] group-hover:text-white"
                    }`}
                  >
                    <span className="font-display text-[13px] font-bold tracking-[0.08em] uppercase whitespace-nowrap xl:text-[13.5px]">
                      <span className={active ? "text-rubric" : "text-[#e8c78c]"}>{item.roman}</span> · {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {rightSlot && (
            <>
              <span aria-hidden="true" className="hidden h-4.5 w-px bg-[#d4ad73]/38 lg:block" />
              <div className="flex shrink-0 items-center">{rightSlot}</div>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export type SheafFlagSpec = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  to?: string;
  download?: boolean;
};

export type SheafTabSpec = {
  id: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
  to?: string;
};

/**
 * Flush Right-Edge Bound Book-Block & Mahogany Fore-Edge Dock (`right-0 inset-y-0`).
 * Mirrors the left spine architecturally so the viewport reads as an open folio volume,
 * with die-cut rag-vellum index tabs & a Venetian-carmine bookmark flag projecting
 * inward (leftward) from between the stepped bound pages instead of floating in mid-air.
 */
export function ArchivalPaperSheaf({
  ariaLabel,
  topFlag,
  tabs,
  progressPct,
}: {
  ariaLabel: string;
  topFlag?: SheafFlagSpec;
  tabs: SheafTabSpec[];
  progressPct?: number;
}) {
  const anyTabActive = tabs.some((t) => t.active);

  const renderFlagInner = (active: boolean, label: string) => (
    <span
      style={{
        clipPath: "polygon(0 6px, 100% 0, 100% 100%, 0 calc(100% - 6px))",
      }}
      className={`relative flex flex-col items-center gap-1.5 py-3 transition-all duration-200 2xl:py-3.5 ${
        active
          ? "w-[44px] border-l-[3px] border-l-[#ebd09e] bg-gradient-to-l from-[#6b1416] to-[#8c1a1d] text-[#faf3e6] shadow-[inset_-4px_0_6px_rgba(10,3,3,0.45)]"
          : "w-[36px] border-l border-l-[#d4ad73]/45 bg-gradient-to-l from-[#420d0f] to-[#631417] text-[#ead8bc] shadow-[inset_-4px_0_6px_rgba(10,3,3,0.52)] group-hover:w-[40px] group-hover:from-[#581214] group-hover:to-[#7c191c] group-hover:text-[#faf3e6]"
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#ebd09e]" />
      <span
        className="font-numeral text-[11.5px] font-bold tracking-[0.14em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        {label}
      </span>
    </span>
  );

  return (
    <nav
      aria-label={ariaLabel}
      className="atelier-fore-edge fixed inset-y-0 right-0 z-40 hidden w-[70px] select-none xl:flex xl:flex-col xl:items-end xl:justify-center"
    >
      {/* Full-Height Bound Morocco Board Lip + 4-Ply Stepped Rag-Vellum Page Stack Docked Flush at right-0 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[22px] shadow-[-16px_0_34px_rgba(0,0,0,0.94)]"
      >
        {/* Outer ebony-mahogany book-cover board & gilt bevel */}
        <span className="absolute inset-y-0 right-0 w-[7px] border-l border-[#d4ad73]/48 bg-gradient-to-l from-[#070504] via-[#120d09] to-[#1d150f]" />

        {/* Stepped 4-ply rag-vellum page block running full height */}
        <span className="absolute inset-y-0 right-[7px] w-[4px] border-l border-[#5c4324]/70 bg-[#b8a382]" />
        <span className="absolute inset-y-0 right-[10.5px] w-[4px] border-l border-[#684c29]/75 bg-[#ccb896] shadow-[-1px_0_2px_rgba(0,0,0,0.45)]" />
        <span className="absolute inset-y-0 right-[14px] w-[4px] border-l border-[#73552f]/78 bg-[#dfd0b0] shadow-[-1px_0_2px_rgba(0,0,0,0.4)]" />
        <span className="absolute inset-y-0 right-[17.5px] w-[4.5px] border-x border-[#684720]/82 bg-[#f1e5cc] shadow-[-2px_0_5px_rgba(0,0,0,0.55)]" />

        {/* Subtle paper-edge deckle grain along outermost vellum ply */}
        <span
          className="absolute inset-y-0 right-[17.5px] w-[4.5px] opacity-25 mix-blend-multiply"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(84,56,24,0.38) 0px, rgba(84,56,24,0.38) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {anyTabActive && <span className="absolute inset-y-5 right-[18.5px] w-[2px] bg-[#fbf4e6]" />}

        {/* Live silk reading-progress ribbon along the inner fore-edge seam */}
        {typeof progressPct === "number" && (
          <span
            style={{ height: `${Math.max(2, Math.min(100, progressPct)).toFixed(1)}%` }}
            className="absolute top-0 right-[19.5px] w-[2.5px] bg-gradient-to-b from-[#8a181a] via-[#b82225] to-[#e2be84] transition-[height] duration-150"
          />
        )}

        {/* Sculpted bookbinding headband (top) & tailband (bottom) brass clasps */}
        <span className="absolute top-0 right-0 h-[16px] w-[22px] border-b border-[#d4ad73]/65 bg-gradient-to-b from-[#261b13] to-[#120c08] shadow-[0_3px_8px_rgba(0,0,0,0.8)]" />
        <span className="absolute bottom-0 right-0 h-[16px] w-[22px] border-t border-[#d4ad73]/65 bg-gradient-to-t from-[#261b13] to-[#120c08] shadow-[0_-3px_8px_rgba(0,0,0,0.8)]" />
      </div>

      {/* Inward-Projecting Die-Cut Index Cascade (tucked physically behind the outermost page lip at right-[19px]) */}
      <div className="relative z-10 flex flex-col items-end py-7 pr-[19px]">
        {topFlag &&
          (() => {
            const flagClass = `group relative cursor-pointer transition-transform duration-200 [filter:drop-shadow(-3px_4px_7px_rgba(0,0,0,0.84))] ${
              topFlag.active ? "z-30" : "z-20 hover:-translate-x-0.5"
            }`;
            if (topFlag.to) {
              return (
                <Link to={topFlag.to} viewTransition className={flagClass}>
                  {renderFlagInner(Boolean(topFlag.active), topFlag.label)}
                </Link>
              );
            }
            if (topFlag.href) {
              return (
                <a href={topFlag.href} download={topFlag.download} className={flagClass}>
                  {renderFlagInner(Boolean(topFlag.active), topFlag.label)}
                </a>
              );
            }
            return (
              <button
                type="button"
                onClick={topFlag.onClick}
                aria-current={topFlag.active ? "true" : undefined}
                className={flagClass}
              >
                {renderFlagInner(Boolean(topFlag.active), topFlag.label)}
              </button>
            );
          })()}

        <div className={`${topFlag ? "mt-3.5 2xl:mt-4.5" : ""} flex flex-col items-end gap-1`}>
          {tabs.map((tab, idx) => {
            const active = Boolean(tab.active);
            const wrapperClass = `group relative cursor-pointer transition-transform duration-200 [filter:drop-shadow(-3px_4px_7px_rgba(0,0,0,0.8))] ${
              active ? "" : "hover:z-30 hover:-translate-x-0.5"
            }`;

            const tabInner = (
              <span
                style={{
                  clipPath: "polygon(0 9px, 100% 0, 100% 100%, 0 calc(100% - 9px))",
                }}
                className={`relative flex flex-col items-center justify-center overflow-hidden py-2.5 transition-all duration-200 2xl:py-3.5 ${
                  active
                    ? "w-[45px] border-l-[3px] border-l-rubric bg-[#fbf4e6] text-rubric shadow-[inset_-4px_0_6px_rgba(68,46,20,0.22)]"
                    : "w-[36px] border-l border-l-[#755228]/65 bg-[#eee3cc] text-[#1c140e] shadow-[inset_-5px_0_7px_rgba(44,28,12,0.28)] group-hover:w-[40px] group-hover:bg-[#f7efe0]"
                }`}
              >
                <span
                  aria-hidden="true"
                  style={{
                    backgroundImage: 'url("/textures/rag-paper-tile.webp")',
                    backgroundSize: "220px 220px",
                  }}
                  className="pointer-events-none absolute inset-0 opacity-[0.11] mix-blend-multiply"
                />
                <span
                  className="relative z-10 max-h-[146px] overflow-hidden font-display text-[13px] font-bold tracking-[0.03em] whitespace-nowrap"
                  style={{ writingMode: "vertical-rl" }}
                >
                  {tab.label}
                </span>
              </span>
            );

            if (tab.to) {
              return (
                <Link
                  key={tab.id}
                  to={tab.to}
                  viewTransition
                  aria-current={active ? "page" : undefined}
                  style={{ zIndex: active ? 35 : 25 - idx }}
                  className={wrapperClass}
                >
                  {tabInner}
                </Link>
              );
            }

            if (tab.href) {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  aria-current={active ? "true" : undefined}
                  style={{ zIndex: active ? 35 : 25 - idx }}
                  className={wrapperClass}
                >
                  {tabInner}
                </a>
              );
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={tab.onClick}
                aria-current={active ? "true" : undefined}
                style={{ zIndex: active ? 35 : 25 - idx }}
                className={wrapperClass}
              >
                {tabInner}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
