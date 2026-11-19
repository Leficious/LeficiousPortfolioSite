import { useId } from "react";

type ProjectSigilProps = {
  slug: string;
  variant?: "gilt" | "intaglio";
  className?: string;
};

/**
 * Airy, open-linework Victorian gold-foil ("gilt") & blind-debossed ("intaglio")
 * bookbinding sigils (~82% open negative space so the leather or rag-vellum stock
 * breathes through crisp dual-weight strokes without clumping into a solid mass).
 */
export function ProjectSigil({
  slug,
  variant = "gilt",
  className = "h-24 w-24",
}: ProjectSigilProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gradId = `sigil-grad-${rawId}`;
  const isGilt = variant === "gilt";

  const strokePrimary = isGilt ? `url(#${gradId})` : "#382210";
  const strokeFine = isGilt ? "#ebd09c" : "#5e3d1e";
  const accentFill = isGilt ? "#fff0c8" : "#8f1616";

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={`select-none overflow-visible ${
        isGilt
          ? "[filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.9))]"
          : "[filter:drop-shadow(0_1px_0_rgba(255,252,242,0.9))]"
      } ${className}`}
    >
      {isGilt && (
        <defs>
          <linearGradient id={gradId} x1="15%" y1="8%" x2="85%" y2="92%">
            <stop offset="0%" stopColor="#fff6da" />
            <stop offset="48%" stopColor="#e8c589" />
            <stop offset="100%" stopColor="#b5894b" />
          </linearGradient>
        </defs>
      )}

      {/* Open Victorian Bookbinding Filigree Perimeter (crisp outer ring + beaded inner hairline) */}
      <circle cx="60" cy="60" r="54.5" stroke={strokePrimary} strokeWidth="1.45" opacity="0.94" />
      <circle
        cx="60"
        cy="60"
        r="49.5"
        stroke={strokeFine}
        strokeWidth="0.85"
        strokeDasharray="2.4 4.4"
        opacity="0.72"
      />

      {/* 4 Cardinal Victorian Trefoil / Scroll Finials + 4 Ordinal Micro-Pips */}
      <g stroke={strokeFine} strokeWidth="1.05" strokeLinecap="round" opacity="0.9">
        {/* North */}
        <path d="M51.5 6.5 Q60 1.2 68.5 6.5" />
        <polygon points="60,0.8 62.3,4.8 60,8.8 57.7,4.8" fill={accentFill} stroke="none" />
        {/* South */}
        <path d="M51.5 113.5 Q60 118.8 68.5 113.5" />
        <polygon points="60,111.2 62.3,115.2 60,119.2 57.7,115.2" fill={accentFill} stroke="none" />
        {/* West */}
        <path d="M6.5 51.5 Q1.2 60 6.5 68.5" />
        <polygon points="0.8,60 4.8,57.7 8.8,60 4.8,62.3" fill={accentFill} stroke="none" />
        {/* East */}
        <path d="M113.5 51.5 Q118.8 60 113.5 68.5" />
        <polygon points="111.2,60 115.2,57.7 119.2,60 115.2,62.3" fill={accentFill} stroke="none" />
        {/* 4 Ordinal Rim Pips (NE, SE, SW, NW) */}
        <circle cx="98.5" cy="21.5" r="1.35" fill={accentFill} stroke="none" opacity="0.8" />
        <circle cx="98.5" cy="98.5" r="1.35" fill={accentFill} stroke="none" opacity="0.8" />
        <circle cx="21.5" cy="98.5" r="1.35" fill={accentFill} stroke="none" opacity="0.8" />
        <circle cx="21.5" cy="21.5" r="1.35" fill={accentFill} stroke="none" opacity="0.8" />
      </g>

      {slug === "still-life" && (
        /* FOLIO I · Still Life — Victorian Apothecary Balance Scales & Companion Lamp Arc */
        <g stroke={strokePrimary} strokeLinecap="round" strokeLinejoin="round">
          <line x1="60" y1="29" x2="60" y2="91" strokeWidth="1.65" />
          <path d="M45 91 H75 M50.5 87.2 H69.5" strokeWidth="1.5" />
          <path d="M29 47 C38 42.8 50 44.5 60 44.5 C70 44.5 82 42.8 91 47" strokeWidth="1.55" />
          <circle cx="60" cy="44.5" r="3.1" strokeWidth="1.35" />
          {/* Left pan + counterweight */}
          <line x1="33" y1="46.5" x2="26.5" y2="70" stroke={strokeFine} strokeWidth="0.95" />
          <line x1="33" y1="46.5" x2="39.5" y2="70" stroke={strokeFine} strokeWidth="0.95" />
          <path d="M24 70 Q33 75 42 70" strokeWidth="1.45" />
          <polygon points="33,57.5 38,63.2 36,69.5 30,69.5 28,63.2" strokeWidth="1.2" />
          {/* Right pan */}
          <line x1="87" y1="46.5" x2="80.5" y2="68" stroke={strokeFine} strokeWidth="0.95" />
          <line x1="87" y1="46.5" x2="93.5" y2="68" stroke={strokeFine} strokeWidth="0.95" />
          <path d="M78 68 Q87 73 96 68" strokeWidth="1.45" />
          {/* Articulated companion lamp */}
          <path d="M60 29.5 L73 23 L84 32" strokeWidth="1.3" />
          <path d="M78.5 36.2 L87.2 30.5 L91.2 38.2 Z" strokeWidth="1.3" />
        </g>
      )}

      {slug === "an-echo-has-no-shape" && (
        /* FOLIO II · An Echo Has No Shape — Sightless Monolith & Open Acoustic Wavefronts */
        <g stroke={strokePrimary} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="60,24.5 70,58 60,93.5 50,58" strokeWidth="1.6" />
          <line x1="60" y1="24.5" x2="60" y2="93.5" stroke={strokeFine} strokeWidth="0.95" />
          <path d="M40.5 42.5 A24.5 24.5 0 0 0 40.5 77.5" strokeWidth="1.4" />
          <path d="M79.5 42.5 A24.5 24.5 0 0 1 79.5 77.5" strokeWidth="1.4" />
          <path d="M31 33.5 A38.5 38.5 0 0 0 31 86.5" stroke={strokeFine} strokeWidth="1.05" />
          <path d="M89 33.5 A38.5 38.5 0 0 1 89 86.5" stroke={strokeFine} strokeWidth="1.05" />
          <circle cx="60" cy="18" r="1.9" fill={accentFill} stroke="none" />
          <circle cx="35.5" cy="84.5" r="1.9" fill={accentFill} stroke="none" />
          <circle cx="84.5" cy="84.5" r="1.9" fill={accentFill} stroke="none" />
        </g>
      )}

      {slug === "fallen-valkyrie" && (
        /* FOLIO III · Fallen Valkyrie — Slender Glaive Spear & Open Feather-Blade Linework */
        <g stroke={strokePrimary} strokeLinecap="round" strokeLinejoin="round">
          <line x1="60" y1="26" x2="60" y2="97" strokeWidth="1.65" />
          <polygon points="60,16 64.5,28.5 60,25.6 55.5,28.5" strokeWidth="1.4" />
          <path d="M48.5 36.5 Q60 41.8 71.5 36.5" strokeWidth="1.4" />
          <path d="M54.5 46 C41.5 40 29 31.5 23.5 25 C27.5 37.5 37.5 47 53 52" strokeWidth="1.35" />
          <path d="M54 55.5 C41 53.5 29.5 48.5 23 44 C28.5 54 39.5 60 54 61" stroke={strokeFine} strokeWidth="1.15" />
          <path d="M55 64.5 C44.5 65.5 35 63.5 28.5 61 C34 68 43.5 70.5 55 69" stroke={strokeFine} strokeWidth="1.0" />
          <path d="M65.5 46 C78.5 40 91 31.5 96.5 25 C92.5 37.5 82.5 47 67 52" strokeWidth="1.35" />
          <path d="M66 55.5 C79 53.5 90.5 48.5 97 44 C91.5 54 80.5 60 66 61" stroke={strokeFine} strokeWidth="1.15" />
          <path d="M65 64.5 C75.5 65.5 85 63.5 91.5 61 C86 68 76.5 70.5 65 69" stroke={strokeFine} strokeWidth="1.0" />
          <polygon points="60,77 62.6,81 60,85 57.4,81" fill={accentFill} stroke="none" />
        </g>
      )}

      {slug === "starshore" && (
        /* FOLIO IV · Starshore — Hollow Astrolabe Compass Rose & Armillary Orbit */
        <g stroke={strokePrimary} strokeLinecap="round" strokeLinejoin="round">
          <ellipse
            cx="60"
            cy="60"
            rx="38.5"
            ry="15.5"
            transform="rotate(-28 60 60)"
            stroke={strokeFine}
            strokeWidth="1.05"
          />
          <polygon
            points="60,54.5 77.5,42.5 65.5,60 77.5,77.5 60,65.5 42.5,77.5 54.5,60 42.5,42.5"
            stroke={strokeFine}
            strokeWidth="1.0"
          />
          <polygon
            points="60,18 65.2,54.8 102,60 65.2,65.2 60,102 54.8,65.2 18,60 54.8,54.8"
            strokeWidth="1.55"
          />
          <circle cx="60" cy="60" r="3.8" strokeWidth="1.3" />
        </g>
      )}

      {slug !== "still-life" &&
        slug !== "an-echo-has-no-shape" &&
        slug !== "fallen-valkyrie" &&
        slug !== "starshore" && (
          /* FOLIO V · Sacred Forest — Slender Shrine Torii & Faceted Normal-Crystal */
          <g stroke={strokePrimary} strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 34.5 Q60 40.8 95 34.5" strokeWidth="1.7" />
            <path d="M29.5 39.2 Q60 44.2 90.5 39.2" stroke={strokeFine} strokeWidth="1.1" />
            <line x1="33.5" y1="48.5" x2="86.5" y2="48.5" strokeWidth="1.45" />
            <line x1="60" y1="40" x2="60" y2="48.5" strokeWidth="1.35" />
            <line x1="39.5" y1="39.5" x2="36.5" y2="92" strokeWidth="1.65" />
            <line x1="80.5" y1="39.5" x2="83.5" y2="92" strokeWidth="1.65" />
            <line x1="31" y1="92" x2="42.5" y2="92" strokeWidth="1.45" />
            <line x1="77.5" y1="92" x2="89" y2="92" strokeWidth="1.45" />
            <polygon points="60,56 67,69 60,82 53,69" strokeWidth="1.35" />
            <line x1="60" y1="56" x2="60" y2="82" stroke={strokeFine} strokeWidth="0.9" />
            <path d="M55 22.8 A6.8 6.8 0 1 0 65 22.8 A5.4 5.4 0 1 1 55 22.8 Z" strokeWidth="1.15" />
          </g>
        )}
    </svg>
  );
}
