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
 * double-ring brass astrolabe. 100% vector SVG, zero raster assets.
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

      {/* Outer astrolabe degree bezel */}
      <circle cx="48" cy="48" r="46.8" fill="none" stroke="#c59a68" strokeWidth="1" opacity="0.82" />
      <circle cx="48" cy="48" r="42.2" fill="none" stroke="#c59a68" strokeWidth="0.6" opacity="0.45" />
      {ASTROLABE_TICKS.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke="#c59a68"
          strokeWidth={t.major ? "0.95" : "0.55"}
          opacity={t.major ? "0.85" : "0.45"}
        />
      ))}
      {/* Cardinal diamond finials */}
      <polygon points="48,0 50,3 48,6 46,3" fill="#dfc092" />
      <polygon points="48,90 50,93 48,96 46,93" fill="#c59a68" opacity="0.75" />

      {/* Inscribed P03-E2 crest */}
      <g transform="translate(10.5, 11) scale(0.78)">
        <path d={FRAME_MAIN_D} fill="#ece4d4" />
        <path d={FRAME_UR_D} fill="#ece4d4" />
        <g clipPath={`url(#${clipId})`} fill="none" stroke="#c59a68" strokeWidth="2.3">
          <circle cx="47" cy="50.2" r="10.8" />
          <circle cx="47" cy="50.2" r="18.0" />
          <circle cx="47" cy="50.2" r="25.2" />
        </g>
        <polygon points={CHEVRON_POINTS} fill="#c59a68" />
        <path d={L_MONOLITH_D} fill="#dfc092" />
      </g>
    </svg>
  );
}

/**
 * Symmetrical geometric Art-Nouveau / Art-Deco double-hairline corner filigree
 * for rag-parchment folios and dark-slate specimen plates.
 */
export function FolioCorners({
  tone = "parchment",
  inset = "inset-2.5 sm:inset-3.5",
}: {
  tone?: "parchment" | "slate";
  inset?: string;
}) {
  const stroke = tone === "parchment" ? "#8c683a" : "#c59a68";
  const accent = tone === "parchment" ? "#8b2624" : "#dfc092";

  const Corner = ({ rotate }: { rotate: string }) => (
    <svg
      viewBox="0 0 36 36"
      aria-hidden="true"
      className={`h-7 w-7 sm:h-8 sm:w-8 ${rotate}`}
      fill="none"
    >
      <path d="M1 35 V1 H35" stroke={stroke} strokeWidth="1.15" />
      <path d="M5 29 V5 H29" stroke={stroke} strokeWidth="0.75" opacity="0.78" />
      <path d="M1 13 L13 1" stroke={stroke} strokeWidth="0.8" opacity="0.7" />
      <path d="M5 17 C11 17 17 11 17 5" stroke={stroke} strokeWidth="0.8" opacity="0.75" />
      <polygon points="5,5 8.5,5 5,8.5" fill={accent} opacity="0.85" />
    </svg>
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${inset}`}>
      <div className="absolute inset-0 border border-current opacity-25" style={{ color: stroke }} />
      <div className="absolute inset-[3px] border border-current opacity-15" style={{ color: stroke }} />
      <div className="absolute left-0 top-0"><Corner rotate="rotate-0" /></div>
      <div className="absolute right-0 top-0"><Corner rotate="rotate-90" /></div>
      <div className="absolute right-0 bottom-0"><Corner rotate="rotate-180" /></div>
      <div className="absolute left-0 bottom-0"><Corner rotate="-rotate-90" /></div>
    </div>
  );
}

/**
 * Machined brass binding pin + taut suspension threads holding the active folio on Home.
 */
export function BrassPinThreads({ animKey }: { animKey?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none relative mx-auto -mb-3 h-11 w-72 sm:w-96 z-30">
      <svg viewBox="0 0 360 46" className="h-full w-full overflow-visible" fill="none">
        {/* Taut angled brass suspension threads */}
        <line x1="180" y1="9" x2="44" y2="45" stroke="#c59a68" strokeWidth="1.15" opacity="0.85" />
        <line x1="180" y1="9" x2="316" y2="45" stroke="#c59a68" strokeWidth="1.15" opacity="0.85" />
        {/* Grommet eyelets on the folio top edge */}
        <circle cx="44" cy="45" r="3" fill="#181513" stroke="#b58952" strokeWidth="1.2" />
        <circle cx="316" cy="45" r="3" fill="#181513" stroke="#b58952" strokeWidth="1.2" />
      </svg>
      {/* Central machined brass binding pin */}
      <div
        key={animKey}
        className="animate-pin-latch absolute left-1/2 top-0 -translate-x-1/2 grid h-5 w-5 place-items-center rounded-full border border-[#f3deb9]/70 bg-gradient-to-b from-[#e4c490] to-[#9b713d] shadow-[0_4px_10px_rgba(0,0,0,0.65)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#3a2610]" />
      </div>
    </div>
  );
}

/**
 * Crisp flat vector crimson letterpress / hanko seal (zero plastic 3D AI wax).
 */
export function CrimsonStamp({
  label = "ATELIER SEAL",
  className = "h-12 w-12",
  stamped = false,
}: {
  label?: string;
  className?: string;
  stamped?: boolean;
}) {
  const rawId = useId();
  const pathId = `seal-arc-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden="true"
      className={`shrink-0 select-none ${stamped ? "animate-stamp-press" : "-rotate-6"} ${className}`}
    >
      <defs>
        <path id={pathId} d="M 40,40 m -27,0 a 27,27 0 1,1 54,0 a 27,27 0 1,1 -54,0" />
      </defs>
      <circle cx="40" cy="40" r="36" fill="rgba(139, 38, 36, 0.08)" stroke="#8b2624" strokeWidth="2.1" strokeDasharray="48 3 26 2" />
      <circle cx="40" cy="40" r="31.5" fill="none" stroke="#8b2624" strokeWidth="0.85" opacity="0.85" />
      <circle cx="40" cy="40" r="18.5" fill="none" stroke="#8b2624" strokeWidth="0.85" opacity="0.8" />
      <text fill="#8b2624" fontSize="5.4" fontFamily="Cinzel Variable, serif" fontWeight="700" letterSpacing="2.1">
        <textPath href={`#${pathId}`} startOffset="4%">
          {label} · LEFICIOUS ·
        </textPath>
      </text>
      {/* Inscribed geometric L */}
      <path d="M35 28 V47 H48 L45.5 51 H31 V30.5 Z" fill="#8b2624" />
      <circle cx="44" cy="36" r="2.2" fill="#8b2624" />
    </svg>
  );
}

/**
 * Ornamental horizontal brass divider with central diamond finial.
 */
export function BrassRule({
  tone = "parchment",
  className = "",
}: {
  tone?: "parchment" | "slate";
  className?: string;
}) {
  const line = tone === "parchment" ? "bg-[#8c683a]/35" : "bg-warm/30";
  const gem = tone === "parchment" ? "border-[#8c683a] bg-[#8b2624]" : "border-warm bg-warm";
  return (
    <div aria-hidden="true" className={`flex items-center gap-2.5 ${className}`}>
      <span className={`h-px flex-1 ${line}`} />
      <span className={`h-1.5 w-1.5 rotate-45 border ${gem}`} />
      <span className={`h-px flex-1 ${line}`} />
    </div>
  );
}

/**
 * Global SVG <defs> filter that turns dark-background architectural blueprints
 * and wireframes into lampblack-and-sepia ink engravings on rag-parchment.
 */
export function InkPlateFilter() {
  return (
    <svg aria-hidden="true" className="pointer-events-none fixed h-0 w-0 overflow-hidden">
      <defs>
        <filter id="atelier-ink-plate" colorInterpolationFilters="sRGB">
          {/* Invert dark blueprint background to bright paper, desaturate, and tint to warm lampblack + sepia */}
          <feColorMatrix
            type="matrix"
            values="
              -0.33 -0.50 -0.17 0 0.94
              -0.33 -0.50 -0.17 0 0.90
              -0.33 -0.50 -0.17 0 0.82
               0     0     0    1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}
