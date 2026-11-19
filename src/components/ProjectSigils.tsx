import { useId } from "react";

export type SigilHighlight = "verdigris" | "peacock" | "amethyst";

type ProjectSigilProps = {
  slug: string;
  variant?: "gilt" | "intaglio";
  highlight?: SigilHighlight;
  className?: string;
};

const HIGHLIGHT_PALETTES: Record<
  SigilHighlight,
  {
    enamelLight: string;
    enamelMid: string;
    enamelDark: string;
    specular: string;
    intaglioAccent: string;
  }
> = {
  // Option A: Victorian Malachite & Verdigris Patina (HSL ~152°, direct complement to Crimson & Oxblood)
  verdigris: {
    enamelLight: "#7ee8b5",
    enamelMid: "#2d8f62",
    enamelDark: "#13452e",
    specular: "#bcfce0",
    intaglioAccent: "#216b49",
  },
  // Option B: Horological Prussian Cobalt-Teal Cloisonné (HSL ~204°, direct 180° complement to Saddle-Cognac & Gold)
  peacock: {
    enamelLight: "#8ccdf7",
    enamelMid: "#2e77b0",
    enamelDark: "#143857",
    specular: "#c7e9ff",
    intaglioAccent: "#215885",
  },
  // Option C: Gothic Imperial Amethyst & Tarnished Sterling Silver (HSL ~282°)
  amethyst: {
    enamelLight: "#dfb8fa",
    enamelMid: "#8b4fb3",
    enamelDark: "#3f1b59",
    specular: "#edf1f7",
    intaglioAccent: "#613280",
  },
};

const DEGREE_TICKS = Array.from({ length: 24 }, (_, i) => {
  const deg = i * 15;
  const rad = (deg * Math.PI) / 180;
  const isCardinal = i % 6 === 0;
  const isOrdinal = i % 3 === 0 && !isCardinal;
  const rInner = isCardinal ? 63.5 : isOrdinal ? 64.8 : 66.2;
  const rOuter = 70.5;
  return {
    x1: (80 + Math.cos(rad) * rInner).toFixed(2),
    y1: (80 + Math.sin(rad) * rInner).toFixed(2),
    x2: (80 + Math.cos(rad) * rOuter).toFixed(2),
    y2: (80 + Math.sin(rad) * rOuter).toFixed(2),
    major: isCardinal || isOrdinal,
    skip: isCardinal, // cardinal slots hold sculpted cloisonné cabochons
  };
});

/**
 * Medium-ornate Victorian Cloisonné Enamel & Faceted Gold-Foil Heraldic Sigils.
 * Balances sculpted bevel-shaded metalwork, Gothic cusped tracery, and jewel-enamel
 * inlays (~48% ornate coverage / ~52% open negative space so leather breathes through
 * without ever reading sparse or collapsing into a solid mass).
 */
export function ProjectSigil({
  slug,
  variant = "gilt",
  highlight = "verdigris",
  className = "h-24 w-24",
}: ProjectSigilProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const goldBrightId = `sg-gb-${uid}`;
  const goldShadeId = `sg-gs-${uid}`;
  const enamelId = `sg-en-${uid}`;

  const isGilt = variant === "gilt";
  const pal = HIGHLIGHT_PALETTES[highlight];

  const goldStroke = isGilt ? `url(#${goldBrightId})` : "#382210";
  const goldFine = isGilt ? "#ebd09c" : "#5e3d1e";
  const goldFillBright = isGilt ? `url(#${goldBrightId})` : "#4a2e16";
  const goldFillShade = isGilt ? `url(#${goldShadeId})` : "#6e4927";
  const enamelFill = isGilt ? `url(#${enamelId})` : pal.intaglioAccent;
  const specColor = isGilt ? pal.specular : pal.intaglioAccent;

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
      className={`select-none overflow-visible ${
        isGilt
          ? "[filter:drop-shadow(0_3px_5px_rgba(0,0,0,0.92))_drop-shadow(0_0.5px_0_rgba(255,244,214,0.32))]"
          : "[filter:drop-shadow(0_1px_0_rgba(255,252,242,0.9))]"
      } ${className}`}
    >
      {isGilt && (
        <defs>
          <linearGradient id={goldBrightId} x1="14%" y1="8%" x2="86%" y2="92%">
            <stop offset="0%" stopColor="#fff7df" />
            <stop offset="46%" stopColor="#e8c486" />
            <stop offset="100%" stopColor="#ad8040" />
          </linearGradient>
          <linearGradient id={goldShadeId} x1="15%" y1="12%" x2="85%" y2="88%">
            <stop offset="0%" stopColor="#d9b375" />
            <stop offset="55%" stopColor="#9d7136" />
            <stop offset="100%" stopColor="#69481d" />
          </linearGradient>
          <linearGradient id={enamelId} x1="18%" y1="10%" x2="82%" y2="90%">
            <stop offset="0%" stopColor={pal.enamelLight} />
            <stop offset="48%" stopColor={pal.enamelMid} />
            <stop offset="100%" stopColor={pal.enamelDark} />
          </linearGradient>
        </defs>
      )}

      {/* ==================== 1. ASTROLABE PERIMETER & CLOISONNÉ ENAMEL HALO ==================== */}
      {/* Outer sculpted rim + inner degree ring */}
      <circle cx="80" cy="80" r="71.5" stroke={goldStroke} strokeWidth="1.75" opacity="0.95" />
      <circle cx="80" cy="80" r="65.2" stroke={goldFine} strokeWidth="0.9" opacity="0.72" />

      {/* 20 Horological degree ticks */}
      {DEGREE_TICKS.map(
        (t, idx) =>
          !t.skip && (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={goldFine}
              strokeWidth={t.major ? "1.25" : "0.75"}
              opacity={t.major ? "0.88" : "0.52"}
            />
          ),
      )}

      {/* 4 Diagonal Cloisonné Enamel Ribbon Channels (bridging the outer rim and central crest) */}
      <g fill="none" strokeLinecap="butt">
        {/* Enamel glaze arcs at NE, SE, SW, NW */}
        <path d="M 101.5 28.8 A 55.5 55.5 0 0 1 131.2 58.5" stroke={enamelFill} strokeWidth="4.2" opacity={isGilt ? "0.9" : "0.55"} />
        <path d="M 131.2 101.5 A 55.5 55.5 0 0 1 101.5 131.2" stroke={enamelFill} strokeWidth="4.2" opacity={isGilt ? "0.9" : "0.55"} />
        <path d="M 58.5 131.2 A 55.5 55.5 0 0 1 28.8 101.5" stroke={enamelFill} strokeWidth="4.2" opacity={isGilt ? "0.9" : "0.55"} />
        <path d="M 28.8 58.5 A 55.5 55.5 0 0 1 58.5 28.8" stroke={enamelFill} strokeWidth="4.2" opacity={isGilt ? "0.9" : "0.55"} />
        {/* Cloisonné gold wire borders framing the 4 enamel arcs */}
        <circle cx="80" cy="80" r="58.2" stroke={goldFine} strokeWidth="0.85" opacity="0.76" />
        <circle cx="80" cy="80" r="52.8" stroke={goldStroke} strokeWidth="1.15" opacity="0.86" />
      </g>

      {/* Inner 8-Cusp Gothic Quatrefoil / Rosette Frame */}
      <path
        d="M 80 32.5 Q 92 38 99.5 40.5 Q 102 48 113.5 46.5 Q 112 58 119.5 60.5 Q 122 68 127.5 80 Q 122 92 119.5 99.5 Q 112 102 113.5 113.5 Q 102 112 99.5 119.5 Q 92 122 80 127.5 Q 68 122 60.5 119.5 Q 58 112 46.5 113.5 Q 48 102 40.5 99.5 Q 38 92 32.5 80 Q 38 68 40.5 60.5 Q 48 58 46.5 46.5 Q 58 48 60.5 40.5 Q 68 38 80 32.5 Z"
        stroke={goldFine}
        strokeWidth="0.85"
        opacity="0.58"
      />

      {/* 4 Sculpted Cardinal Cloisonné Cabochons + Acanthus Volute Scrolls (N, E, S, W) */}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 80 80)`}>
          {/* Flanking Victorian S-scroll volutes */}
          <path
            d="M 63 10.5 C 67 4.2, 72.5 4.8, 74.8 9.8 M 97 10.5 C 93 4.2, 87.5 4.8, 85.2 9.8"
            stroke={goldFine}
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Beveled gold & jewel-enamel kite cabochon */}
          <polygon
            points="80,1.5 86,10.5 80,19.5 74,10.5"
            fill={enamelFill}
            stroke={goldStroke}
            strokeWidth="1.35"
          />
          <circle cx="79.2" cy="8.5" r="1.2" fill={specColor} opacity="0.9" />
        </g>
      ))}

      {/* 4 Ordinal Gilt Fleuron Diamonds + Enamel Pips (NE, SE, SW, NW) */}
      {[45, 135, 225, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 80 80)`}>
          <polygon
            points="80,4.5 83.2,10.2 80,15.2 76.8,10.2"
            fill={goldFillBright}
            stroke={goldFine}
            strokeWidth="0.8"
          />
          <circle cx="80" cy="24.5" r="1.7" fill={specColor} opacity="0.88" />
        </g>
      ))}

      {/* ==================== 2. BESPOKE FACETED HERALDIC CRESTS ==================== */}
      {slug === "still-life" && (
        /* FOLIO I · Still Life — Ornate Apothecary Balance Scales, Enamel Counterweight & Companion Lamp */
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Stepped Victorian pedestal & turned central column */}
          <polygon points="58,120 102,120 98,115.5 62,115.5" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.1" />
          <line x1="66" y1="112" x2="94" y2="112" stroke={goldStroke} strokeWidth="1.6" />
          <path d="M 78.2 44 H 81.8 L 83 112 H 77 Z" fill={goldFillShade} stroke={goldStroke} strokeWidth="1.1" />
          {/* Central column cloisonné boss */}
          <polygon points="80,73 85.5,81 80,89 74.5,81" fill={enamelFill} stroke={goldStroke} strokeWidth="1.25" />

          {/* Scrolled swan-neck balance beam */}
          <path
            d="M 38 62 C 48 52.5, 65 57.5, 80 57.5 C 95 57.5, 112 52.5, 122 62"
            stroke={goldStroke}
            strokeWidth="2.4"
          />
          <path
            d="M 38 62 C 35 64.5, 36.5 67.5, 40 66 M 122 62 C 125 64.5, 123.5 67.5, 120 66"
            stroke={goldFine}
            strokeWidth="1.25"
          />
          <circle cx="80" cy="57.5" r="5" fill={enamelFill} stroke={goldStroke} strokeWidth="1.4" />
          <circle cx="79" cy="56.3" r="1.2" fill={specColor} />

          {/* Left scale chains, gilded pan & 2-tone faceted counterweight prism */}
          <line x1="43" y1="60.5" x2="33.5" y2="92" stroke={goldFine} strokeWidth="1.05" />
          <line x1="43" y1="60.5" x2="52.5" y2="92" stroke={goldFine} strokeWidth="1.05" />
          <path d="M 30.5 92 Q 43 100 55.5 92 Z" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.2" />
          {/* Faceted counterweight (left enamel, right gold) */}
          <polygon points="43,75 35.5,83 37.5,91.5 43,91.5" fill={enamelFill} stroke={goldStroke} strokeWidth="1.0" />
          <polygon points="43,75 50.5,83 48.5,91.5 43,91.5" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.0" />

          {/* Right scale chains & gilded pan */}
          <line x1="117" y1="60.5" x2="107.5" y2="89.5" stroke={goldFine} strokeWidth="1.05" />
          <line x1="117" y1="60.5" x2="126.5" y2="89.5" stroke={goldFine} strokeWidth="1.05" />
          <path d="M 104.5 89.5 Q 117 97.5 129.5 89.5 Z" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.2" />

          {/* Articulated companion desk-lamp arching above right pan */}
          <path d="M 80 44 L 96 33.5 L 111.5 43.5" stroke={goldStroke} strokeWidth="1.8" />
          <circle cx="96" cy="33.5" r="2.2" fill={goldFillBright} />
          <polygon
            points="104,48.5 114,41.5 120.5,51.5"
            fill={enamelFill}
            stroke={goldStroke}
            strokeWidth="1.3"
          />
          {/* Warm light rays onto right pan */}
          <line x1="112" y1="53" x2="112" y2="61" stroke={specColor} strokeWidth="1.05" opacity="0.85" />
          <line x1="117" y1="54" x2="120" y2="62" stroke={specColor} strokeWidth="1.05" opacity="0.85" />
        </g>
      )}

      {slug === "an-echo-has-no-shape" && (
        /* FOLIO II · An Echo Has No Shape — Split-Bevel Pierced Monolith & Crescent Acoustic Wavefronts */
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Split-bevel central monolith (left gold-leaf, right cloisonné enamel, pierced inner slit) */}
          <polygon points="80,31 66,79 80,129" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.25" />
          <polygon points="80,31 94,79 80,129" fill={enamelFill} stroke={goldStroke} strokeWidth="1.25" />
          {/* Pierced dark resonance aperture inside the monolith */}
          <polygon
            points="80,52 84.8,79 80,107 75.2,79"
            fill={isGilt ? "#1a100b" : "#efe3c8"}
            stroke={goldFine}
            strokeWidth="0.95"
          />
          <circle cx="80" cy="79" r="2.6" fill={specColor} />

          {/* Inner pair of sculpted gold-foil crescent acoustic blades */}
          <path
            d="M 58 55 C 47 67, 47 91, 58 103 C 51.5 91, 51.5 67, 58 55 Z"
            fill={goldFillBright}
          />
          <path
            d="M 102 55 C 113 67, 113 91, 102 103 C 108.5 91, 108.5 67, 102 55 Z"
            fill={goldFillBright}
          />

          {/* Middle pair of luminous cloisonné enamel wavefront arcs */}
          <path d="M 48.5 46.5 A 45 45 0 0 0 48.5 111.5" stroke={enamelFill} strokeWidth="2.8" />
          <path d="M 111.5 46.5 A 45 45 0 0 1 111.5 111.5" stroke={enamelFill} strokeWidth="2.8" />
          {/* Outer fine gold harmonic echo arcs */}
          <path d="M 41 55 A 42 42 0 0 0 41 103" stroke={goldFine} strokeWidth="1.15" strokeDasharray="3 3.5" />
          <path d="M 119 55 A 42 42 0 0 1 119 103" stroke={goldFine} strokeWidth="1.15" strokeDasharray="3 3.5" />

          {/* 3 Acoustic Gate Nodes */}
          <polygon points="44.5,79 48,82.5 44.5,86 41,82.5" fill={specColor} />
          <polygon points="115.5,79 119,82.5 115.5,86 112,82.5" fill={specColor} />
        </g>
      )}

      {slug === "fallen-valkyrie" && (
        /* FOLIO III · Fallen Valkyrie — Sculpted Gold & Cloisonné Wing-Blades + Halberd Glaive */
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Left 3 sculpted lancet wing-blades (alternating gold-leaf & cloisonné enamel) */}
          <path
            d="M 72 64 C 55 56, 40 43, 33 32 C 36 48, 49 62, 70 69 Z"
            fill={goldFillBright}
            stroke={goldStroke}
            strokeWidth="0.95"
          />
          <path
            d="M 71 75 C 53 72, 39 65, 31 56 C 37 70, 51 80, 71 82 Z"
            fill={enamelFill}
            stroke={goldStroke}
            strokeWidth="1.05"
          />
          <path
            d="M 72 86 C 57 88, 45 85, 37 80 C 44 91, 56 96, 73 92 Z"
            fill={goldFillShade}
            stroke={goldFine}
            strokeWidth="0.9"
          />

          {/* Right 3 sculpted lancet wing-blades */}
          <path
            d="M 88 64 C 105 56, 120 43, 127 32 C 124 48, 111 62, 90 69 Z"
            fill={goldFillBright}
            stroke={goldStroke}
            strokeWidth="0.95"
          />
          <path
            d="M 89 75 C 107 72, 121 65, 129 56 C 123 70, 109 80, 89 82 Z"
            fill={enamelFill}
            stroke={goldStroke}
            strokeWidth="1.05"
          />
          <path
            d="M 88 86 C 103 88, 115 85, 123 80 C 116 91, 104 96, 87 92 Z"
            fill={goldFillShade}
            stroke={goldFine}
            strokeWidth="0.9"
          />

          {/* Central Valkyrie Glaive / Spearhead (split-bevel) */}
          <line x1="80" y1="44" x2="80" y2="128" stroke={goldStroke} strokeWidth="2.3" />
          <polygon points="80,23 72.5,45 80,41" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.1" />
          <polygon points="80,23 87.5,45 80,41" fill={goldFillShade} stroke={goldStroke} strokeWidth="1.1" />
          {/* Scrolled crossguard + central cloisonné boss-phase heart gem */}
          <path d="M 61 50 Q 80 59 99 50" stroke={goldStroke} strokeWidth="2.0" />
          <polygon
            points="80,57 87.5,69 80,81 72.5,69"
            fill={enamelFill}
            stroke={goldStroke}
            strokeWidth="1.4"
          />
          <circle cx="79" cy="66" r="1.4" fill={specColor} />
          {/* Lower pommel & phase pips */}
          <polygon points="80,102 84,108 80,114 76,108" fill={goldFillBright} />
          <circle cx="80" cy="128" r="2.6" fill={enamelFill} stroke={goldStroke} strokeWidth="1.0" />
        </g>
      )}

      {slug === "starshore" && (
        /* FOLIO IV · Starshore — Split-Bevel 8-Point Celestial Compass Rose & Armillary Orbit */
        <g strokeLinecap="round" strokeLinejoin="round">
          {/* Tilted double-band armillary ring */}
          <ellipse
            cx="80"
            cy="80"
            rx="49"
            ry="18.5"
            transform="rotate(-28 80 80)"
            stroke={enamelFill}
            strokeWidth="2.5"
            opacity="0.9"
          />
          <ellipse
            cx="80"
            cy="80"
            rx="49"
            ry="18.5"
            transform="rotate(-28 80 80)"
            stroke={goldFine}
            strokeWidth="0.95"
          />

          {/* 4 Minor Ordinal Compass Rays (filled with jewel cloisonné enamel) */}
          {[45, 135, 225, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 80 80)`}>
              <polygon
                points="80,41 86.5,73.5 80,80 73.5,73.5"
                fill={enamelFill}
                stroke={goldStroke}
                strokeWidth="1.1"
              />
            </g>
          ))}

          {/* 4 Major Cardinal Star Points (classic split-bevel bright gold vs shaded bronze) */}
          {[0, 90, 180, 270].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 80 80)`}>
              <polygon points="80,26 88,72 80,80" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.0" />
              <polygon points="80,26 80,80 72,72" fill={goldFillShade} stroke={goldStroke} strokeWidth="1.0" />
            </g>
          ))}

          {/* Central Celestial Astrolabe Jewel */}
          <circle cx="80" cy="80" r="7.5" fill={enamelFill} stroke={goldStroke} strokeWidth="1.6" />
          <circle cx="78.2" cy="78" r="1.8" fill={specColor} />
        </g>
      )}

      {slug !== "still-life" &&
        slug !== "an-echo-has-no-shape" &&
        slug !== "fallen-valkyrie" &&
        slug !== "starshore" && (
          /* FOLIO V · Sacred Forest — Sculpted Shrine Torii, Botanical Scrolls & Normal-Faceted Crystal */
          <g strokeLinecap="round" strokeLinejoin="round">
            {/* Crescent moon overhead */}
            <path
              d="M 72.5 29.5 A 9.5 9.5 0 1 0 87.5 29.5 A 7.6 7.6 0 1 1 72.5 29.5 Z"
              fill={enamelFill}
              stroke={goldFine}
              strokeWidth="0.95"
            />

            {/* Sculpted curved kasagi top lintel + nuki tie-beam */}
            <path
              d="M 34 46.5 Q 80 56 126 46.5 L 122 53 Q 80 61 38 53 Z"
              fill={goldFillBright}
              stroke={goldStroke}
              strokeWidth="1.15"
            />
            <path d="M 42 64.5 H 118" stroke={goldStroke} strokeWidth="2.8" />
            {/* Central shrine tablet (gakuzuka) */}
            <rect
              x="76.2"
              y="54.5"
              width="7.6"
              height="10.5"
              fill={enamelFill}
              stroke={goldStroke}
              strokeWidth="1.1"
            />

            {/* Tapered shrine pillars & plinths */}
            <polygon points="50,54 54.2,54 51.5,118 46.8,118" fill={goldFillBright} stroke={goldStroke} strokeWidth="1.0" />
            <polygon points="105.8,54 110,54 113.2,118 108.5,118" fill={goldFillShade} stroke={goldStroke} strokeWidth="1.0" />
            <line x1="41" y1="118.5" x2="57.5" y2="118.5" stroke={goldStroke} strokeWidth="2.2" />
            <line x1="102.5" y1="118.5" x2="119" y2="118.5" stroke={goldStroke} strokeWidth="2.2" />

            {/* Botanical fern/leaf curls flanking pillar bases */}
            <path
              d="M 46.5 113 C 38 110, 35 101, 40 96 C 42 101, 44 105, 47.5 107 M 113.5 113 C 122 110, 125 101, 120 96 C 118 101, 116 105, 112.5 107"
              stroke={enamelFill}
              strokeWidth="1.9"
            />

            {/* 4-Quadrant Normal-Shaded Spirit Crystal suspended in the gate */}
            <polygon points="80,72 70,91 80,91" fill={specColor} opacity="0.92" />
            <polygon points="80,72 90,91 80,91" fill={enamelFill} />
            <polygon points="80,110 70,91 80,91" fill={goldFillBright} />
            <polygon points="80,110 90,91 80,91" fill={goldFillShade} />
            <polygon points="80,72 90,91 80,110 70,91" stroke={goldStroke} strokeWidth="1.25" />

            {/* Floating forest spirit motes */}
            <circle cx="63" cy="82" r="1.6" fill={specColor} opacity="0.88" />
            <circle cx="97" cy="82" r="1.6" fill={specColor} opacity="0.88" />
          </g>
        )}
    </svg>
  );
}
