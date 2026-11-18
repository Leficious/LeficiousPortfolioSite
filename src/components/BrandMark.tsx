import { useCallback, useEffect, useId, useRef } from "react";

type GlyphSpec = {
  x: number;
  d: string;
  evenOdd?: boolean;
};

const WORDMARK_GLYPHS: readonly GlyphSpec[] = [
  { x: 0, d: "M0 0 H8.40 V25.60 L10.13 28.60 H21.80 V36.00 H0 Z" },
  {
    x: 26.2,
    d: "M0 0 H27.80 L23.53 7.40 H8.40 V28.60 H28.00 V36.00 H0 Z M11.60 14.50 H25.20 L21.16 21.50 H11.60 Z",
  },
  {
    x: 59.3,
    d: "M0 0 H26.20 L21.93 7.40 H8.40 V36.00 H0 Z M11.60 14.50 H23.60 L19.56 21.50 H11.60 Z",
  },
  { x: 89.8, d: "M0 0 H8.40 V36.00 H0 Z" },
  {
    x: 103.2,
    d: "M11.60 -0.35 H29.20 L24.93 7.05 H12.00 C9.40 7.05 8.40 8.20 8.40 11.00 V25.00 C8.40 27.80 9.40 28.95 12.00 28.95 H28.80 V36.35 H11.60 C3.90 36.35 0 32.00 0 24.30 V11.70 C0 4.00 3.90 -0.35 11.60 -0.35 Z",
  },
  { x: 137.2, d: "M0 0 H8.40 V36.00 H0 Z" },
  {
    x: 150.6,
    d: "M 11.60 -0.35 H 22.00 C 29.70 -0.35 33.60 4.00 33.60 11.70 V 24.30 C 33.60 32.00 29.70 36.35 22.00 36.35 H 11.60 C 3.90 36.35 0 32.00 0 24.30 V 11.70 C 0 4.00 3.90 -0.35 11.60 -0.35 Z M 12.00 7.05 C 9.40 7.05 8.40 8.20 8.40 11.00 V 25.00 C 8.40 27.80 9.40 28.95 12.00 28.95 H 21.60 C 24.20 28.95 25.20 27.80 25.20 25.00 V 11.00 C 25.20 8.20 24.20 7.05 21.60 7.05 Z",
    evenOdd: true,
  },
  {
    x: 189.2,
    d: "M0 0 H8.40 V25.00 C8.40 27.80 9.40 28.95 12.00 28.95 H20.40 C23.00 28.95 24.00 27.80 24.00 25.00 V0 H32.40 V24.30 C32.40 32.00 28.50 36.35 20.80 36.35 H11.60 C3.90 36.35 0 32.00 0 24.30 Z",
  },
  {
    x: 226.6,
    d: "M10.20 -0.35 H30.80 L26.53 7.05 H10.80 C8.80 7.05 8.20 7.75 8.20 9.40 V12.40 C8.20 13.95 8.90 14.55 11.00 14.55 H21.60 C28.20 14.55 31.20 17.50 31.20 23.60 V26.60 C31.20 32.95 27.60 36.35 21.00 36.35 H0 L4.27 28.95 H20.40 C22.40 28.95 23.00 28.25 23.00 26.55 V23.30 C23.00 21.75 22.30 21.15 20.20 21.15 H9.60 C3.00 21.15 0 18.20 0 12.10 V9.40 C0 3.05 3.60 -0.35 10.20 -0.35 Z",
  },
];

const FRAME_MAIN_D =
  "M 31.80 15.00 H 4.70 L 48.00 90.00 L 62.20 65.40 H 57.82 L 48.00 82.40 L 11.28 18.80 H 31.80 Z";
const FRAME_UR_D =
  "M 51.40 15.00 H 91.30 L 73.52 45.80 H 69.13 L 84.72 18.80 H 51.40 Z";
const L_MONOLITH_D =
  "M 36.20 10.24 L 47.00 4.00 V 50.20 H 77.20 L 70.96 61.00 H 40.73 L 36.20 53.16 Z";
const SLATE_POINTS = "18.75,23.20 31.80,23.20 31.80,45.80";
const CHEVRON_POINTS =
  "42.23,65.40 44.60,65.40 48.00,71.30 51.40,65.40 53.77,65.40 48.00,75.40";
const CHAMBER_POINTS = "51.40,23.20 77.09,23.20 64.05,45.80 51.40,45.80";

const COL_BRASS: readonly [number, number, number] = [197, 154, 104];
const COL_BRASS_HOT: readonly [number, number, number] = [242, 212, 162];
const COL_GRAPHITE: readonly [number, number, number] = [122, 128, 138];
const COL_GRAPHITE_HOT: readonly [number, number, number] = [168, 174, 184];
const COL_WHITE: readonly [number, number, number] = [236, 238, 239];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

function lerpRgb(
  c1: readonly [number, number, number],
  c2: readonly [number, number, number],
  t: number,
) {
  const k = clamp01(t);
  const r = Math.round(c1[0] + (c2[0] - c1[0]) * k);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * k);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * k);
  return `rgb(${r},${g},${b})`;
}

/**
 * Quiet static P03-E2 crest for footer and static badges.
 */
export function BrandCrest({ className = "h-4 w-4" }: { className?: string }) {
  const rawId = useId();
  const clipId = `crest-ch-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className={`shrink-0 overflow-visible ${className}`}>
      <defs>
        <clipPath id={clipId}>
          <polygon points={CHAMBER_POINTS} />
        </clipPath>
      </defs>
      <path d={FRAME_MAIN_D} fill="#eceeef" />
      <path d={FRAME_UR_D} fill="#eceeef" />
      <polygon points={SLATE_POINTS} fill="#7a808a" opacity="0.88" />
      <g clipPath={`url(#${clipId})`} fill="none" stroke="#c59a68" strokeWidth="2.15">
        <circle cx="47" cy="50.2" r="10.8" />
        <circle cx="47" cy="50.2" r="18.0" />
        <circle cx="47" cy="50.2" r="25.2" />
      </g>
      <polygon points={CHEVRON_POINTS} fill="#c59a68" />
      <path d={L_MONOLITH_D} fill="#eceeef" />
    </svg>
  );
}

/**
 * Sticky navbar lockup: still at rest while reading/scrolling, fires one subtle
 * acoustic ring glide on hover.
 */
export function NavbarBrandLockup() {
  const rawId = useId();
  const clipId = `nav-ch-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const wRefs = useRef<(SVGCircleElement | null)[]>([]);
  const chevRef = useRef<SVGPolygonElement | null>(null);
  const slateRef = useRef<SVGPolygonElement | null>(null);
  const glyphRefs = useRef<(SVGPathElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const activeRef = useRef(false);

  const resetStatic = useCallback(() => {
    const baseR = [10.8, 18.0, 25.2];
    baseR.forEach((br, i) => {
      const el = wRefs.current[i];
      if (!el) return;
      el.setAttribute("r", br.toFixed(2));
      el.setAttribute("opacity", "1");
      el.setAttribute("stroke", "#c59a68");
    });
    if (wRefs.current[3]) {
      wRefs.current[3].setAttribute("opacity", "0");
    }
    chevRef.current?.setAttribute("transform", "translate(0, 0)");
    slateRef.current?.setAttribute("fill", "#7a808a");
    glyphRefs.current.forEach((p) => p?.setAttribute("fill", "#eceeef"));
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const triggerWaveGlide = useCallback(() => {
    if (activeRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    activeRef.current = true;
    const start = performance.now();
    const duration = 0.85;

    const step = (now: number) => {
      const elapsed = (now - start) / 1000;
      if (elapsed < duration) {
        const raw = elapsed / duration;
        const u = easeInOutCubic(raw);
        const shift = u * 7.2;
        const crest = Math.sin(raw * Math.PI);

        const [w0, w1, w2, w3] = wRefs.current;
        if (w0) {
          w0.setAttribute("r", (3.6 + shift).toFixed(2));
          w0.setAttribute("opacity", easeInOutCubic(clamp01((u - 0.08) / 0.55)).toFixed(2));
          w0.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.8));
        }
        if (w1) {
          w1.setAttribute("r", (10.8 + shift).toFixed(2));
          w1.setAttribute("opacity", "1");
          w1.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.9));
        }
        if (w2) {
          w2.setAttribute("r", (18.0 + shift).toFixed(2));
          w1?.setAttribute("opacity", "1");
          w2.setAttribute("opacity", "1");
          w2.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.65));
        }
        if (w3) {
          w3.setAttribute("r", (25.2 + shift).toFixed(2));
          w3.setAttribute("opacity", (1 - easeInOutCubic(clamp01(u / 0.88))).toFixed(2));
        }

        chevRef.current?.setAttribute("transform", `translate(0, ${(crest * 1.3).toFixed(2)})`);
        slateRef.current?.setAttribute("fill", lerpRgb(COL_GRAPHITE, COL_GRAPHITE_HOT, crest * 0.75));

        const sweepX = raw * 290 - 20;
        WORDMARK_GLYPHS.forEach((g, i) => {
          const dist = Math.abs(g.x + 12 - sweepX);
          const gl = dist < 32 ? Math.cos((dist / 32) * (Math.PI / 2)) : 0;
          glyphRefs.current[i]?.setAttribute("fill", lerpRgb(COL_WHITE, COL_BRASS_HOT, gl * 0.65));
        });

        rafRef.current = requestAnimationFrame(step);
      } else {
        resetStatic();
        activeRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [resetStatic]);

  return (
    <span
      onPointerEnter={triggerWaveGlide}
      className="inline-flex items-center gap-2 sm:gap-2.5"
    >
      <svg
        viewBox="0 0 96 96"
        aria-hidden="true"
        className="h-[21px] w-[21px] shrink-0 overflow-visible sm:h-[23px] sm:w-[23px]"
      >
        <defs>
          <clipPath id={clipId}>
            <polygon points={CHAMBER_POINTS} />
          </clipPath>
        </defs>
        <path d={FRAME_MAIN_D} fill="#eceeef" />
        <path d={FRAME_UR_D} fill="#eceeef" />
        <polygon ref={slateRef} points={SLATE_POINTS} fill="#7a808a" opacity="0.88" />
        <g clipPath={`url(#${clipId})`} fill="none">
          <circle ref={(el) => { wRefs.current[0] = el; }} cx="47" cy="50.2" r="10.8" stroke="#c59a68" strokeWidth="2.15" />
          <circle ref={(el) => { wRefs.current[1] = el; }} cx="47" cy="50.2" r="18.0" stroke="#c59a68" strokeWidth="2.15" />
          <circle ref={(el) => { wRefs.current[2] = el; }} cx="47" cy="50.2" r="25.2" stroke="#c59a68" strokeWidth="2.15" />
          <circle ref={(el) => { wRefs.current[3] = el; }} cx="47" cy="50.2" r="32.4" stroke="#c59a68" strokeWidth="2.15" opacity="0" />
        </g>
        <polygon ref={chevRef} points={CHEVRON_POINTS} fill="#c59a68" />
        <path d={L_MONOLITH_D} fill="#eceeef" />
      </svg>

      <svg
        viewBox="0 -0.5 258 37"
        aria-hidden="true"
        className="block w-[96px] shrink-0 overflow-visible sm:w-[106px]"
      >
        {WORDMARK_GLYPHS.map((g, i) => (
          <g key={i} transform={`translate(${g.x}, 0)`}>
            <path
              ref={(el) => { glyphRefs.current[i] = el; }}
              d={g.d}
              fill="#eceeef"
              fillRule={g.evenOdd ? "evenodd" : undefined}
            />
          </g>
        ))}
      </svg>
      <span className="sr-only">Leficious</span>
    </span>
  );
}
