import { useId, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavEncounterMode } from "../lib/atelierMotion";
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
        <circle cx="48" cy="48" r="46.8" fill="none" stroke="#d8b274" strokeWidth="1.1" opacity="0.92" />
        <circle cx="48" cy="48" r="42.2" fill="none" stroke="#c89d62" strokeWidth="0.7" opacity="0.58" />
        {ASTROLABE_TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="#d8b274"
            strokeWidth={t.major ? "1.05" : "0.6"}
            opacity={t.major ? "0.92" : "0.52"}
          />
        ))}
        <polygon points="48,0 50.2,3.2 48,6.4 45.8,3.2" fill="#ebd09e" />
        <polygon points="48,89.6 50.2,92.8 48,96 45.8,92.8" fill="#c89d62" opacity="0.85" />
      </g>

      <g transform="translate(10.5, 11) scale(0.78)">
        <path d={FRAME_MAIN_D} fill="#f4ead6" />
        <path d={FRAME_UR_D} fill="#f4ead6" />
        <g clipPath={`url(#${clipId})`} fill="none" stroke="#c89d62" strokeWidth="2.4">
          <circle cx="47" cy="50.2" r="10.8" />
          <circle cx="47" cy="50.2" r="18.0" />
          <circle cx="47" cy="50.2" r="25.2" />
        </g>
        <polygon points={CHEVRON_POINTS} fill="#c89d62" />
        <path d={L_MONOLITH_D} fill="#e2be84" />
      </g>
    </svg>
  );
}

/**
 * Four ornate chased Victorian antique-bronze acanthus scrollwork corner brackets
 * with crisp embossed hardware bevel & contact occlusion.
 */
export function BrassCornerClasps({ sizeClass = "h-12 w-12 sm:h-15 sm:w-15" }: { sizeClass?: string }) {
  const hwShadow =
    "select-none [filter:contrast(1.14)_brightness(1.06)_drop-shadow(0_3px_6px_rgba(0,0,0,0.88))_drop-shadow(0_1px_1px_rgba(0,0,0,0.95))]";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute -left-[2px] -top-[2px] ${hwShadow} ${sizeClass}`}
      />
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute -right-[2px] -top-[2px] rotate-90 ${hwShadow} ${sizeClass}`}
      />
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute -bottom-[2px] -right-[2px] rotate-180 ${hwShadow} ${sizeClass}`}
      />
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute -bottom-[2px] -left-[2px] -rotate-90 ${hwShadow} ${sizeClass}`}
      />
    </div>
  );
}

/**
 * Symmetrical embossed Victorian multi-scroll acanthus & Gothic rosette corner spandrels
 * with double-line blind-debossed plate-mark border.
 */
export function FolioCorners({
  tone = "parchment",
  inset = "inset-2.5 sm:inset-3.5",
  sizeClass = "h-10 w-10 sm:h-12 sm:w-12",
}: {
  tone?: "parchment" | "slate";
  inset?: string;
  sizeClass?: string;
}) {
  const isParchment = tone === "parchment";
  const stroke = isParchment ? "#684720" : "#d4ae73";
  const highlight = isParchment ? "rgba(255,252,242,0.88)" : "rgba(255,236,194,0.28)";
  const accent = isParchment ? "#8f1616" : "#e5c287";

  const Corner = ({ rotate }: { rotate: string }) => (
    <svg
      viewBox="0 0 52 52"
      aria-hidden="true"
      className={`${sizeClass} ${rotate}`}
      fill="none"
      style={{
        filter: isParchment
          ? "drop-shadow(0px 1px 0px rgba(255,252,242,0.9))"
          : "drop-shadow(0px 2px 3px rgba(0,0,0,0.85))",
      }}
    >
      {/* Outer & inner corner miters */}
      <path d="M1 50 V1 H50" stroke={stroke} strokeWidth="1.5" />
      <path d="M6 42 V6 H42" stroke={stroke} strokeWidth="0.95" opacity="0.9" />
      {/* Diagonal filigree brace & Victorian volute scrolls */}
      <path d="M1 19 L19 1" stroke={stroke} strokeWidth="0.95" opacity="0.85" />
      <path d="M6 30 C16 30 22 24 24 17 C25 13 22 10 19 12 C17 13 17 16 20 17" stroke={stroke} strokeWidth="1.05" />
      <path d="M30 6 C30 16 24 22 17 24 C13 25 10 22 12 19 C13 17 16 17 17 20" stroke={stroke} strokeWidth="1.05" />
      <path d="M6 16 C11 16 16 11 16 6" stroke={stroke} strokeWidth="0.9" opacity="0.85" />
      {/* Corner crimson/gold diamond cabochon & finial dots */}
      <polygon points="6,6 11.5,6 6,11.5" fill={accent} />
      <circle cx="14.5" cy="14.5" r="1.6" fill={accent} />
      <circle cx="35" cy="6" r="1.2" fill={stroke} />
      <circle cx="6" cy="35" r="1.2" fill={stroke} />
    </svg>
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset}`}>
      <div
        className="absolute inset-0 border"
        style={{
          borderColor: isParchment ? "rgba(104, 71, 32, 0.48)" : "rgba(212, 174, 115, 0.42)",
          boxShadow: `inset 0 1px 0 ${highlight}, 0 1px 0 ${highlight}`,
        }}
      />
      <div
        className="absolute inset-[4px] border"
        style={{
          borderColor: isParchment ? "rgba(104, 71, 32, 0.28)" : "rgba(212, 174, 115, 0.22)",
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
 * Taut burnished-bronze suspension cords + embossed Deep-Crimson Sealing-Wax Stamp
 * straddling the top-center border of the active folio.
 */
export function BrassPinThreads({ animKey }: { animKey?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none relative z-30 mx-auto -mb-6 h-16 w-80 sm:w-[460px]">
      <div key={animKey} className="animate-pin-pendulum h-full w-full">
        <svg viewBox="0 0 460 62" className="h-full w-full overflow-visible" fill="none">
          <line x1="230" y1="19" x2="52" y2="57" stroke="#c89d62" strokeWidth="1.4" opacity="0.9" />
          <line x1="230" y1="19" x2="408" y2="57" stroke="#c89d62" strokeWidth="1.4" opacity="0.9" />
          <circle cx="52" cy="57" r="3.4" fill="#140d09" stroke="#deb97e" strokeWidth="1.35" />
          <circle cx="408" cy="57" r="3.4" fill="#140d09" stroke="#deb97e" strokeWidth="1.35" />
        </svg>
      </div>
      <img
        src="/ornaments/crimson-wax-seal.webp"
        alt=""
        width="68"
        height="68"
        className="absolute left-1/2 top-0.5 h-14 w-14 -translate-x-1/2 select-none [filter:contrast(1.12)_saturate(1.12)_drop-shadow(0_7px_14px_rgba(0,0,0,0.82))_drop-shadow(0_2px_3px_rgba(0,0,0,0.92))] sm:h-15 sm:w-15"
      />
    </div>
  );
}

/**
 * Authentic embossed Deep-Crimson Sealing-Wax Stamp (`#7D1518`) with crisp relief shadow.
 */
export function CrimsonStamp({
  className = "h-13 w-13",
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
      className={`shrink-0 select-none object-contain [filter:contrast(1.12)_saturate(1.12)_drop-shadow(0_5px_10px_rgba(0,0,0,0.62))_drop-shadow(0_1.5px_2px_rgba(0,0,0,0.85))] ${
        stamped ? "animate-stamp-press" : "-rotate-3"
      } ${className}`}
    />
  );
}

/**
 * Ornamental Victorian horizontal divider.
 * When `ornate` is true, mounts the chased antique-bronze & Venetian garnet filigree centerpiece;
 * otherwise mounts an embossed double-rule & fleur-de-lis diamond motif.
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

  if (ornate) {
    return (
      <div aria-hidden="true" className={`flex items-center gap-3 ${className}`}>
        <div className="flex flex-1 items-center">
          <span
            className={`h-[1.5px] flex-1 ${
              isParchment
                ? "bg-gradient-to-r from-transparent via-[#6d4b22]/65 to-[#6d4b22] shadow-[0_1px_0_rgba(255,252,242,0.85)]"
                : "bg-gradient-to-r from-transparent via-[#c89d62]/55 to-[#e2be84]"
            }`}
          />
          <span
            className={`h-1.5 w-1.5 rotate-45 ${
              isParchment ? "bg-[#8f1616]" : "bg-[#e2be84]"
            }`}
          />
        </div>

        <img
          src="/ornaments/bronze-divider.webp"
          alt=""
          width="260"
          height="56"
          className={`h-6 w-auto shrink-0 select-none object-contain sm:h-7 ${
            isParchment
              ? "[filter:contrast(1.14)_drop-shadow(0_2px_3px_rgba(24,12,4,0.45))_drop-shadow(0_1px_0_rgba(255,252,242,0.85))]"
              : "[filter:contrast(1.16)_brightness(1.08)_drop-shadow(0_4px_10px_rgba(0,0,0,0.9))]"
          }`}
        />

        <div className="flex flex-1 items-center">
          <span
            className={`h-1.5 w-1.5 rotate-45 ${
              isParchment ? "bg-[#8f1616]" : "bg-[#e2be84]"
            }`}
          />
          <span
            className={`h-[1.5px] flex-1 ${
              isParchment
                ? "bg-gradient-to-l from-transparent via-[#6d4b22]/65 to-[#6d4b22] shadow-[0_1px_0_rgba(255,252,242,0.85)]"
                : "bg-gradient-to-l from-transparent via-[#c89d62]/55 to-[#e2be84]"
            }`}
          />
        </div>
      </div>
    );
  }

  const line = isParchment
    ? "bg-[#6d4b22]/55 shadow-[0_1px_0_rgba(255,252,242,0.85)]"
    : "bg-warm/45";
  const gem = isParchment ? "border-[#6d4b22] bg-[#8f1616]" : "border-[#e2be84] bg-[#8f1616]";
  const sideDot = isParchment ? "bg-[#6d4b22]" : "bg-[#d4ae73]";

  return (
    <div aria-hidden="true" className={`flex items-center gap-2 ${className}`}>
      <span className={`h-[1.2px] flex-1 ${line}`} />
      <span className={`h-1.5 w-1.5 rotate-45 ${sideDot}`} />
      <span className={`h-2.5 w-2.5 rotate-45 border ${gem}`} />
      <span className={`h-1.5 w-1.5 rotate-45 ${sideDot}`} />
      <span className={`h-[1.2px] flex-1 ${line}`} />
    </div>
  );
}

/**
 * Unified top Victorian Archival Header Rail shared across Atelier, Gallery, Project, and Dossier routes.
 * Supports Option A ("tabs" — die-cut physical folder tabs docked onto the rail rule) and
 * Option C ("crossbar" — centered heraldic brass & cloisonné switchboard).
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
  const { mode, navQuery } = useNavEncounterMode();

  const cleanPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  const activeSection: "atelier" | "gallery" | "about" =
    cleanPath.startsWith("/gallery") ? "gallery" : cleanPath.startsWith("/about") ? "about" : "atelier";

  const roomItems = [
    {
      id: "atelier" as const,
      roman: "I",
      label: text("Atelier & Reel", "作品案台与集锦"),
      to: `${localizedPath("/")}${navQuery}`,
      idleStock: "from-[#5d3a24] via-[#432818] to-[#2c190f]",
    },
    {
      id: "gallery" as const,
      roman: "II",
      label: text("Salon Gallery · 29", "视觉与技术画廊 · 29"),
      to: `${localizedPath("/gallery")}${navQuery}`,
      idleStock: "from-[#64221f] via-[#481715] to-[#2e0e0d]",
    },
    {
      id: "about" as const,
      roman: "III",
      label: text("About & Dossier", "个人档案与信函"),
      to: `${localizedPath("/about")}${navQuery}`,
      idleStock: "from-[#4a3121] via-[#342116] to-[#22140d]",
    },
  ];

  return (
    <div className={`relative z-30 mx-auto w-full ${maxWidthClass}`}>
      <header className="relative flex w-full flex-wrap items-end justify-between gap-3 border-b-[1.5px] border-[#c89d62]/52 pb-3 shadow-[0_1px_0_rgba(0,0,0,0.85)] xl:flex-nowrap">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
          <p className="font-display text-xl font-bold tracking-[0.18em] text-[#f7eedc] uppercase sm:text-[21px]">
            {eyebrow}
          </p>
          <span aria-hidden="true" className="hidden h-1.5 w-1.5 shrink-0 rotate-45 bg-[#b82222] sm:inline-block" />
          <p className="truncate font-display text-[15px] font-medium italic text-[#e38e84] sm:text-[16.5px]">{subtitle}</p>
        </div>

        <div className="flex shrink-0 items-end gap-2.5">
          {mode === "tabs" && (
            <nav
              aria-label={text("Primary Portfolio Volumes", "主要作品卷宗目录")}
              className="hidden items-end gap-1.5 -mb-[13px] lg:flex"
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
                      clipPath: "polygon(8px 0, calc(100% - 8px) 0, 100% 100%, 0 100%)",
                    }}
                    className={`group relative inline-flex items-center gap-1.5 px-3.5 transition-all duration-200 2xl:px-4.5 ${
                      active
                        ? "z-20 bg-gradient-to-b from-[#fbf3e2] to-[#e7d8ba] pt-2 pb-2.5 text-[#110b07] shadow-[0_-4px_14px_rgba(0,0,0,0.75),inset_0_2px_0_#8f1616]"
                        : `z-10 bg-gradient-to-b ${item.idleStock} pt-1.5 pb-2 text-[#f4ead6] shadow-[0_-3px_10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(246,218,170,0.45)] hover:-translate-y-0.5 hover:text-white`
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 shrink-0 rotate-45 ${
                        active ? "border border-[#684720] bg-[#2d8f62]" : "bg-[#e5c287]/80 group-hover:bg-[#7ee8b5]"
                      }`}
                    />
                    <span className="font-display text-[12.5px] font-bold tracking-[0.1em] uppercase whitespace-nowrap 2xl:text-[13.5px]">
                      <span className={active ? "text-rubric" : "text-[#ebc88d]"}>{item.roman}</span> · {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}

          {rightSlot && <div className="flex shrink-0 items-center gap-2">{rightSlot}</div>}
        </div>
      </header>

      {mode === "crossbar" && (
        <nav
          aria-label={text("Primary Portfolio Volumes", "主要作品卷宗目录")}
          className="mt-2.5 hidden items-center justify-center gap-3 lg:flex"
        >
          <span aria-hidden="true" className="h-px w-16 bg-gradient-to-r from-transparent to-[#c89d62]/65" />
          <div className="inline-flex items-center gap-1.5 border-[1.5px] border-[#d4ae73]/72 bg-[#120c08]/95 p-1 shadow-[0_12px_28px_rgba(0,0,0,0.88),inset_0_1px_0_rgba(255,236,198,0.22)]">
            {roomItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  viewTransition
                  aria-current={active ? "page" : undefined}
                  className={`victorian-ticket inline-flex items-center gap-2 px-5 py-1.5 font-display text-[13.5px] font-bold tracking-[0.13em] uppercase transition-all ${
                    active
                      ? "brass-plaque"
                      : `border border-[#ebc88d]/45 bg-gradient-to-b ${item.idleStock} text-[#f4ead6] hover:border-[#fff0c8] hover:text-white`
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rotate-45 ${
                      active ? "border border-[#140d09] bg-[#2d8f62]" : "bg-[#e5c287]"
                    }`}
                  />
                  <span>
                    {item.roman} · {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
          <span aria-hidden="true" className="h-px w-16 bg-gradient-to-l from-transparent to-[#c89d62]/65" />
        </nav>
      )}
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

const DIVIDER_PRESETS = [
  { idleW: "w-[38px]", padY: "py-4", stock: "bg-[#eadcc2]", overlap: "mt-0", tilt: "-rotate-[0.35deg]" },
  { idleW: "w-[33px]", padY: "py-3.5", stock: "bg-[#ded0b3]", overlap: "-mt-1.5", tilt: "rotate-[0.45deg]" },
  { idleW: "w-[41px]", padY: "py-4.5", stock: "bg-[#e5d6b9]", overlap: "mt-1.5", tilt: "-rotate-[0.3deg]" },
  { idleW: "w-[35px]", padY: "py-3.5", stock: "bg-[#d7c5a4]", overlap: "-mt-2", tilt: "rotate-[0.35deg]" },
  { idleW: "w-[39px]", padY: "py-4", stock: "bg-[#e1d2b4]", overlap: "-mt-1.5", tilt: "-rotate-[0.4deg]" },
  { idleW: "w-[36px]", padY: "py-3.5", stock: "bg-[#dbc9a8]", overlap: "mt-1", tilt: "rotate-[0.3deg]" },
] as const;

/**
 * Shared Right-Edge 4-Ply Layered Archival Paper Sheaf with an upper swallowtail
 * Venetian-oxblood bookmark flag and asymmetrical shingled die-cut paper separator dividers.
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
        clipPath: "polygon(0 0, 100% 5px, 100% calc(100% - 9px), 52% calc(100% - 1px), 0 100%)",
      }}
      className={`relative flex flex-col items-center gap-1.5 py-3.5 transition-all duration-250 ${
        active
          ? "w-[44px] border-r-[3.5px] border-r-[#d8b274] bg-gradient-to-r from-[#6e1515] to-[#8f1b1b] text-[#fbf3e4]"
          : "w-[34px] bg-gradient-to-r from-[#4b1010] to-[#681616] text-[#e6d2b2] group-hover:w-[38px] group-hover:from-[#611414] group-hover:to-[#821a1a] group-hover:text-[#fbf3e4]"
      }`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[3px] w-px bg-[#e2be84]/35" />
      <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#e2be84]" />
      <span
        className="font-numeral text-[10.5px] font-bold tracking-[0.16em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        {label}
      </span>
    </span>
  );

  return (
    <nav
      aria-label={ariaLabel}
      className="fixed right-2.5 top-6 bottom-8 z-40 hidden w-[64px] select-none xl:block 2xl:right-4"
    >
      {/* 4-Ply Layered Ledger Paper Sheaf Fore-Edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[15px] shadow-[-14px_6px_28px_rgba(0,0,0,0.9)]"
      >
        <span className="absolute top-3.5 bottom-2.5 left-[9px] w-[5px] border-y border-r border-[#5c4324]/60 bg-[#b8a27e]" />
        <span className="absolute top-1.5 bottom-4 left-[6px] w-[5px] border-y border-r border-[#684c29]/65 bg-[#c9b490] shadow-[1px_0_2px_rgba(0,0,0,0.55)]" />
        <span className="absolute top-2.5 bottom-1 left-[3px] w-[5px] border-y border-r border-[#73552f]/70 bg-[#dac7a5] shadow-[1px_0_2px_rgba(0,0,0,0.5)]" />
        <span
          className="absolute inset-y-0 left-0 w-[5px] border border-[#684720]/80 bg-[#ebd9ba] shadow-[2px_0_4px_rgba(0,0,0,0.55)]"
          style={{
            backgroundImage: 'url("/textures/rag-paper-tile.webp")',
            backgroundSize: "180px 180px",
          }}
        />
        {anyTabActive && <span className="absolute inset-y-2 left-[1px] w-[3.5px] bg-[#f8efdc]" />}
        {typeof progressPct === "number" && (
          <span
            style={{ height: `${Math.max(2, Math.min(100, progressPct)).toFixed(1)}%` }}
            className="absolute top-0 left-0 w-[2.5px] bg-gradient-to-b from-[#8f1616] via-[#b82222] to-[#d8b274] transition-[height] duration-150"
          />
        )}
      </div>

      {/* Asymmetrical Top-Indexed Cascade */}
      <div className="relative z-10 flex h-full flex-col items-start pt-5 pl-[11px]">
        {topFlag &&
          (() => {
            const flagClass = `group relative cursor-pointer transition-all duration-250 [filter:drop-shadow(2px_5px_7px_rgba(0,0,0,0.82))] active:scale-97 ${
              topFlag.active
                ? "z-30 translate-x-1 rotate-0"
                : "z-20 -rotate-[1deg] hover:translate-x-1 hover:rotate-0"
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

        <div className={`${topFlag ? "mt-6" : "mt-2"} flex flex-col items-start`}>
          {tabs.map((tab, idx) => {
            const active = Boolean(tab.active);
            const preset = DIVIDER_PRESETS[idx % DIVIDER_PRESETS.length];
            const wrapperClass = `group relative cursor-pointer transition-all duration-250 [filter:drop-shadow(2px_5px_7px_rgba(0,0,0,0.78))_drop-shadow(0_1px_1px_rgba(0,0,0,0.65))] active:scale-97 ${
              idx === 0 ? "mt-0" : preset.overlap
            } ${
              active
                ? "translate-x-0.5 rotate-0"
                : `${preset.tilt} hover:z-30 hover:translate-x-1 hover:rotate-0`
            }`;

            const tabInner = (
              <span
                style={{
                  clipPath: "polygon(0 0, 100% 11px, 100% calc(100% - 11px), 0 100%)",
                  backgroundImage: 'url("/textures/rag-paper-tile.webp")',
                  backgroundSize: "220px 220px",
                }}
                className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-250 ${
                  active
                    ? "w-[48px] border-r-[4px] border-r-rubric bg-[#f7edd8] py-4.5 text-rubric"
                    : `${preset.idleW} ${preset.padY} ${preset.stock} border-r border-r-[#684720]/65 text-[#1b130d] group-hover:w-[43px] group-hover:bg-[#f2e6cd]`
                }`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-[3px] w-px bg-[#684720]/35 shadow-[1px_0_0_rgba(255,252,242,0.75)]"
                />
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-3.5 bottom-3.5 right-[4px] w-px ${
                    active ? "bg-rubric/30" : "bg-[#684720]/25"
                  }`}
                />
                <span
                  aria-hidden="true"
                  style={{ borderRadius: "50%" }}
                  className={`h-2 w-2 shrink-0 border ${
                    active
                      ? "border-rubric bg-[#c89d62]"
                      : "border-[#5c3e1b] bg-[#18110c]/75 group-hover:bg-[#c89d62]"
                  }`}
                />
                <span
                  className={`max-h-[118px] overflow-hidden font-display text-[12px] tracking-wide whitespace-nowrap ${
                    active ? "font-bold" : "font-semibold"
                  }`}
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
