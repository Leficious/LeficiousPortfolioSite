import { useId } from "react";

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
