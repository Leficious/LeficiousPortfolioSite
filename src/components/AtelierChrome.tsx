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
 * double-ring tarnished antique-bronze astrolabe.
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
        <circle cx="48" cy="48" r="46.8" fill="none" stroke="#a88452" strokeWidth="1" opacity="0.85" />
        <circle cx="48" cy="48" r="42.2" fill="none" stroke="#a88452" strokeWidth="0.6" opacity="0.45" />
        {ASTROLABE_TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="#a88452"
            strokeWidth={t.major ? "0.95" : "0.55"}
            opacity={t.major ? "0.85" : "0.45"}
          />
        ))}
        <polygon points="48,0 50,3 48,6 46,3" fill="#c6a06a" />
        <polygon points="48,90 50,93 48,96 46,93" fill="#a88452" opacity="0.75" />
      </g>

      <g transform="translate(10.5, 11) scale(0.78)">
        <path d={FRAME_MAIN_D} fill="#e8dcc4" />
        <path d={FRAME_UR_D} fill="#e8dcc4" />
        <g clipPath={`url(#${clipId})`} fill="none" stroke="#a88452" strokeWidth="2.3">
          <circle cx="47" cy="50.2" r="10.8" />
          <circle cx="47" cy="50.2" r="18.0" />
          <circle cx="47" cy="50.2" r="25.2" />
        </g>
        <polygon points={CHEVRON_POINTS} fill="#a88452" />
        <path d={L_MONOLITH_D} fill="#c6a06a" />
      </g>
    </svg>
  );
}

/**
 * Four ornate chased Victorian antique-bronze acanthus scrollwork corner brackets.
 */
export function BrassCornerClasps({ sizeClass = "h-12 w-12 sm:h-15 sm:w-15" }: { sizeClass?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute left-0 top-0 select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] ${sizeClass}`}
      />
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute right-0 top-0 rotate-90 select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] ${sizeClass}`}
      />
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute bottom-0 right-0 rotate-180 select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] ${sizeClass}`}
      />
      <img
        src="/ornaments/bronze-corner.webp"
        alt=""
        className={`absolute bottom-0 left-0 -rotate-90 select-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.75)] ${sizeClass}`}
      />
    </div>
  );
}

/**
 * Symmetrical Victorian double-hairline & Gothic trefoil/filigree corner mounts
 * for rag-parchment folios and smoked-mahogany leather plates.
 */
export function FolioCorners({
  tone = "parchment",
  inset = "inset-2.5 sm:inset-3.5",
}: {
  tone?: "parchment" | "slate";
  inset?: string;
}) {
  const stroke = tone === "parchment" ? "#7a582e" : "#a88452";
  const accent = tone === "parchment" ? "#7d1919" : "#c6a06a";

  const Corner = ({ rotate }: { rotate: string }) => (
    <svg
      viewBox="0 0 42 42"
      aria-hidden="true"
      className={`h-8 w-8 sm:h-9 sm:w-9 ${rotate}`}
      fill="none"
    >
      <path d="M1 41 V1 H41" stroke={stroke} strokeWidth="1.25" />
      <path d="M5.5 34 V5.5 H34" stroke={stroke} strokeWidth="0.8" opacity="0.82" />
      <path d="M1 15 L15 1" stroke={stroke} strokeWidth="0.85" opacity="0.75" />
      <path d="M5.5 21 C13 21 21 13 21 5.5" stroke={stroke} strokeWidth="0.85" opacity="0.8" />
      <path d="M5.5 13 C9.5 13 13 9.5 13 5.5" stroke={stroke} strokeWidth="0.75" opacity="0.7" />
      <polygon points="5.5,5.5 9.5,5.5 5.5,9.5" fill={accent} opacity="0.9" />
    </svg>
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset}`}>
      <div className="absolute inset-0 border border-current opacity-30" style={{ color: stroke }} />
      <div className="absolute inset-[3.5px] border border-current opacity-18" style={{ color: stroke }} />
      <div className="absolute left-0 top-0"><Corner rotate="rotate-0" /></div>
      <div className="absolute right-0 top-0"><Corner rotate="rotate-90" /></div>
      <div className="absolute right-0 bottom-0"><Corner rotate="rotate-180" /></div>
      <div className="absolute left-0 bottom-0"><Corner rotate="-rotate-90" /></div>
    </div>
  );
}

/**
 * Taut dark-bronze suspension cords + authentic embossed Deep-Crimson Sealing-Wax Stamp
 * straddling the top-center border of the active folio (zero yellow circles!).
 */
export function BrassPinThreads({ animKey }: { animKey?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none relative z-30 mx-auto -mb-6 h-15 w-80 sm:w-[440px]">
      <div key={animKey} className="animate-pin-pendulum h-full w-full">
        <svg viewBox="0 0 440 58" className="h-full w-full overflow-visible" fill="none">
          <line x1="220" y1="18" x2="54" y2="54" stroke="#9e7a48" strokeWidth="1.25" opacity="0.85" />
          <line x1="220" y1="18" x2="386" y2="54" stroke="#9e7a48" strokeWidth="1.25" opacity="0.85" />
          <circle cx="54" cy="54" r="3" fill="#191310" stroke="#9e7a48" strokeWidth="1.2" />
          <circle cx="386" cy="54" r="3" fill="#191310" stroke="#9e7a48" strokeWidth="1.2" />
        </svg>
      </div>
      {/* Authentic Venetian Red Sealing-Wax Stamp straddling the top edge */}
      <img
        src="/ornaments/crimson-wax-seal.webp"
        alt=""
        width="64"
        height="64"
        className="absolute left-1/2 top-1 h-13 w-13 -translate-x-1/2 select-none drop-shadow-[0_6px_12px_rgba(0,0,0,0.72)] sm:h-14 sm:w-14"
      />
    </div>
  );
}

/**
 * Authentic embossed Deep-Crimson Sealing-Wax Stamp (`#7D1518`).
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
      className={`shrink-0 select-none object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.52)] ${
        stamped ? "animate-stamp-press" : "-rotate-3"
      } ${className}`}
    />
  );
}

/**
 * Ornamental horizontal Victorian bronze divider with central crimson diamond finial.
 */
export function BrassRule({
  tone = "parchment",
  className = "",
}: {
  tone?: "parchment" | "slate";
  className?: string;
}) {
  const line = tone === "parchment" ? "bg-[#7a582e]/42" : "bg-warm/32";
  const gem = tone === "parchment" ? "border-[#7a582e] bg-[#7d1919]" : "border-warm bg-[#7d1919]";
  return (
    <div aria-hidden="true" className={`flex items-center gap-2.5 ${className}`}>
      <span className={`h-px flex-1 ${line}`} />
      <span className={`h-2 w-2 rotate-45 border ${gem}`} />
      <span className={`h-px flex-1 ${line}`} />
    </div>
  );
}
