import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef } from "react";

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
const COL_SLATE: readonly [number, number, number] = [107, 134, 155];
const COL_SLATE_HOT: readonly [number, number, number] = [142, 178, 204];
const COL_WHITE: readonly [number, number, number] = [220, 228, 236];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const prog = (t: number, s: number, d: number) => clamp01((t - s) / d);
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);
const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
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
      <path d={FRAME_MAIN_D} fill="#dce4ec" />
      <path d={FRAME_UR_D} fill="#dce4ec" />
      <polygon points={SLATE_POINTS} fill="#6b869b" opacity="0.88" />
      <g clipPath={`url(#${clipId})`} fill="none" stroke="#c59a68" strokeWidth="2.15">
        <circle cx="47" cy="50.2" r="10.8" />
        <circle cx="47" cy="50.2" r="18.0" />
        <circle cx="47" cy="50.2" r="25.2" />
      </g>
      <polygon points={CHEVRON_POINTS} fill="#c59a68" />
      <path d={L_MONOLITH_D} fill="#dce4ec" />
    </svg>
  );
}

/**
 * Sticky navbar lockup: still at rest while reading/scrolling, fires one silky
 * Wave Glide sonar pulse + wordmark glint on hover.
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
    slateRef.current?.setAttribute("fill", "#6b869b");
    glyphRefs.current.forEach((p) => p?.setAttribute("fill", "#dce4ec"));
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
          w2.setAttribute("opacity", "1");
          w2.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.65));
        }
        if (w3) {
          w3.setAttribute("r", (25.2 + shift).toFixed(2));
          w3.setAttribute("opacity", (1 - easeInOutCubic(clamp01(u / 0.88))).toFixed(2));
        }

        chevRef.current?.setAttribute("transform", `translate(0, ${(crest * 1.3).toFixed(2)})`);
        slateRef.current?.setAttribute("fill", lerpRgb(COL_SLATE, COL_SLATE_HOT, crest * 0.75));

        const sweepX = raw * 290 - 20;
        WORDMARK_GLYPHS.forEach((g, i) => {
          const dist = Math.abs(g.x + 12 - sweepX);
          const gl = dist < 32 ? Math.cos((dist / 32) * (Math.PI / 2)) : 0;
          glyphRefs.current[i]?.setAttribute("fill", lerpRgb(COL_WHITE, COL_BRASS_HOT, gl * 0.75));
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
        <path d={FRAME_MAIN_D} fill="#dce4ec" />
        <path d={FRAME_UR_D} fill="#dce4ec" />
        <polygon ref={slateRef} points={SLATE_POINTS} fill="#6b869b" opacity="0.88" />
        <g clipPath={`url(#${clipId})`} fill="none">
          <circle ref={(el) => { wRefs.current[0] = el; }} cx="47" cy="50.2" r="10.8" stroke="#c59a68" strokeWidth="2.15" />
          <circle ref={(el) => { wRefs.current[1] = el; }} cx="47" cy="50.2" r="18.0" stroke="#c59a68" strokeWidth="2.15" />
          <circle ref={(el) => { wRefs.current[2] = el; }} cx="47" cy="50.2" r="25.2" stroke="#c59a68" strokeWidth="2.15" />
          <circle ref={(el) => { wRefs.current[3] = el; }} cx="47" cy="50.2" r="32.4" stroke="#c59a68" strokeWidth="2.15" opacity="0" />
        </g>
        <polygon ref={chevRef} points={CHEVRON_POINTS} fill="#c59a68" />
        <path d={L_MONOLITH_D} fill="#dce4ec" />
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
              fill="#dce4ec"
              fillRule={g.evenOdd ? "evenodd" : undefined}
            />
          </g>
        ))}
      </svg>
      <span className="sr-only">Leficious</span>
    </span>
  );
}

export type HeroBootLockupHandle = {
  /** Advance lockup deterministically to elapsed seconds `t` (0.00 -> 1.35s). */
  step: (t: number) => void;
};

/**
 * Driven P03-E2 + LEFICIOUS Tactical Boot Sting lockup for the Boot Curtain.
 * Exposes `step(t)` so the parent curtain drives the entire sequence from a
 * single requestAnimationFrame loop with zero extra timers.
 */
export const HeroBootLockup = forwardRef<HeroBootLockupHandle>(function HeroBootLockup(_, ref) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const chClipId = `hero-ch-${uid}`;
  const slClipId = `hero-sl-${uid}`;
  const glintId = `hero-glint-${uid}`;

  const lasersRef = useRef<SVGGElement | null>(null);
  const reticleRef = useRef<SVGRectElement | null>(null);
  const assemblyRef = useRef<SVGGElement | null>(null);
  const shaftRef = useRef<SVGPolygonElement | null>(null);
  const baseRef = useRef<SVGPolygonElement | null>(null);
  const unifiedRef = useRef<SVGPathElement | null>(null);
  const ghostRef = useRef<SVGPathElement | null>(null);
  const fmRef = useRef<SVGPathElement | null>(null);
  const fuRef = useRef<SVGPathElement | null>(null);
  const fidsRef = useRef<SVGGElement | null>(null);
  const fidTlRef = useRef<SVGPathElement | null>(null);
  const fidTrRef = useRef<SVGPathElement | null>(null);
  const fidBtRef = useRef<SVGPathElement | null>(null);
  const slateRectRef = useRef<SVGRectElement | null>(null);
  const slateRef = useRef<SVGPolygonElement | null>(null);
  const chevRef = useRef<SVGPolygonElement | null>(null);
  const wRefs = useRef<(SVGCircleElement | null)[]>([]);
  const scanbarRef = useRef<SVGGElement | null>(null);
  const gradRef = useRef<SVGLinearGradientElement | null>(null);
  const glyphGrpRefs = useRef<(SVGGElement | null)[]>([]);
  const glyphPathRefs = useRef<(SVGPathElement | null)[]>([]);

  const step = useCallback(
    (t: number) => {
      // 0. Tactical Laser Pre-Lock (0.00 -> 0.24s)
      if (lasersRef.current && reticleRef.current) {
        if (t < 0.25) {
          const flicker = (t > 0.04 && t < 0.07) || (t > 0.11 && t < 0.135) ? 0.22 : 1.0;
          const fade = t < 0.15 ? clamp01(t / 0.035) : clamp01(1 - (t - 0.15) / 0.1);
          lasersRef.current.setAttribute("opacity", (fade * flicker * 0.85).toFixed(2));
          const rot = (1 - easeOutExpo(prog(t, 0, 0.19))) * 45;
          reticleRef.current.setAttribute("transform", `rotate(${rot.toFixed(1)} 47 50.2)`);
        } else {
          lasersRef.current.setAttribute("opacity", "0");
        }
      }

      // 1. Seamless L Assembly -> Single Unified Path at t >= 0.36s
      if (assemblyRef.current && unifiedRef.current && shaftRef.current && baseRef.current) {
        if (t < 0.36) {
          assemblyRef.current.style.display = "";
          unifiedRef.current.style.display = "none";
          const pSpire = easeOutExpo(prog(t, 0.05, 0.24));
          const pFoot = easeOutExpo(prog(t, 0.1, 0.24));
          shaftRef.current.setAttribute("transform", `translate(0, ${((1 - pSpire) * -36).toFixed(2)})`);
          shaftRef.current.style.opacity = String(clamp01(prog(t, 0.05, 0.045)));
          baseRef.current.setAttribute("transform", `translate(${((1 - pFoot) * -30).toFixed(2)}, 0)`);
          baseRef.current.style.opacity = String(clamp01(prog(t, 0.1, 0.045)));
        } else {
          assemblyRef.current.style.display = "none";
          unifiedRef.current.style.display = "";
        }
      }

      // HUD Wireframe Ghost Echo
      if (ghostRef.current) {
        if (t > 0.14 && t < 0.36) {
          const pg = easeOutExpo(prog(t, 0.14, 0.2));
          ghostRef.current.setAttribute(
            "transform",
            `translate(${((1 - pg) * 5.0).toFixed(2)}, ${((1 - pg) * -3.0).toFixed(2)})`,
          );
          ghostRef.current.setAttribute("opacity", ((1 - pg) * 0.82).toFixed(2));
        } else {
          ghostRef.current.setAttribute("opacity", "0");
        }
      }

      // 2. Counter-Vector 60° Breech-Lock Prism Clamp + Fiducials
      if (fmRef.current && fuRef.current) {
        const pFm = easeOutExpo(prog(t, 0.14, 0.3));
        const pFu = easeOutExpo(prog(t, 0.18, 0.3));
        fmRef.current.setAttribute(
          "transform",
          `translate(${((1 - pFm) * -14).toFixed(2)}, ${((1 - pFm) * 8).toFixed(2)})`,
        );
        fmRef.current.style.opacity = String(clamp01(prog(t, 0.14, 0.07)));
        fuRef.current.setAttribute(
          "transform",
          `translate(${((1 - pFu) * 14).toFixed(2)}, ${((1 - pFu) * -8).toFixed(2)})`,
        );
        fuRef.current.style.opacity = String(clamp01(prog(t, 0.18, 0.07)));
      }

      if (fidsRef.current && fidTlRef.current && fidTrRef.current && fidBtRef.current) {
        if (t > 0.2 && t < 0.56) {
          const pf = easeOutExpo(prog(t, 0.2, 0.2));
          const fadeF = t < 0.4 ? 1.0 : 1 - (t - 0.4) / 0.16;
          const spread = (1 - pf) * 7;
          fidTlRef.current.setAttribute("transform", `translate(${-spread}, ${-spread * 0.6})`);
          fidTrRef.current.setAttribute("transform", `translate(${spread}, ${-spread * 0.6})`);
          fidBtRef.current.setAttribute("transform", `translate(0, ${spread})`);
          fidsRef.current.setAttribute("opacity", (fadeF * 0.88).toFixed(2));
        } else {
          fidsRef.current.setAttribute("opacity", "0");
        }
      }

      // 3. Slate Counterweight Wipe & Lower Brass Chevron
      const pSl = easeOutQuart(prog(t, 0.24, 0.24));
      slateRectRef.current?.setAttribute("height", (26 * pSl).toFixed(2));
      const pCh = easeOutQuart(prog(t, 0.26, 0.24));

      // 4. Acoustic Fan-In (0.28 -> 0.64s) -> Signature Wave Glide Pulse (0.64 -> 1.26s)
      const baseR = [10.8, 18.0, 25.2];
      let chevRecoil = 0;
      let slateGlow = 0;
      let glintPos = -999;

      if (t <= 0.64) {
        const pWave = easeOutCubic(prog(t, 0.28, 0.36));
        const shift = (1 - pWave) * -5.4;
        const glow = Math.sin(clamp01(prog(t, 0.28, 0.34)) * Math.PI);
        baseR.forEach((br, i) => {
          const el = wRefs.current[i];
          if (!el) return;
          const fadeIn = clamp01(prog(t, 0.28 + i * 0.045, 0.16));
          el.setAttribute("r", (br + shift).toFixed(2));
          el.setAttribute("opacity", fadeIn.toFixed(2));
          el.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, glow * 0.75));
        });
        wRefs.current[3]?.setAttribute("opacity", "0");
      } else if (t < 1.26) {
        const raw = (t - 0.64) / 0.62;
        const u = easeInOutCubic(raw);
        const shift = u * 7.2;
        const crest = Math.sin(raw * Math.PI);

        const [w0, w1, w2, w3] = wRefs.current;
        if (w0) {
          w0.setAttribute("r", (3.6 + shift).toFixed(2));
          w0.setAttribute("opacity", easeInOutCubic(clamp01((u - 0.08) / 0.55)).toFixed(2));
          w0.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.75));
        }
        if (w1) {
          w1.setAttribute("r", (10.8 + shift).toFixed(2));
          w1.setAttribute("opacity", "1");
          w1.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.9));
        }
        if (w2) {
          w2.setAttribute("r", (18.0 + shift).toFixed(2));
          w2.setAttribute("opacity", "1");
          w2.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.65));
        }
        if (w3) {
          w3.setAttribute("r", (25.2 + shift).toFixed(2));
          w3.setAttribute("opacity", (1 - easeInOutCubic(clamp01(u / 0.88))).toFixed(2));
          w3.setAttribute("stroke", lerpRgb(COL_BRASS, COL_BRASS_HOT, crest * 0.35));
        }

        chevRecoil = crest * 1.15;
        slateGlow = crest * 0.75;
        glintPos = raw * 320 - 30;
      } else {
        baseR.forEach((br, i) => {
          const el = wRefs.current[i];
          if (!el) return;
          el.setAttribute("r", br.toFixed(2));
          el.setAttribute("opacity", "1");
          el.setAttribute("stroke", "#c59a68");
        });
        wRefs.current[3]?.setAttribute("opacity", "0");
      }

      if (chevRef.current) {
        chevRef.current.setAttribute(
          "transform",
          `translate(0, ${((1 - pCh) * 12 + chevRecoil).toFixed(2)})`,
        );
        chevRef.current.style.opacity = String(clamp01(prog(t, 0.26, 0.1)));
      }
      if (slateRef.current) {
        slateRef.current.setAttribute("fill", lerpRgb(COL_SLATE, COL_SLATE_HOT, slateGlow));
        slateRef.current.setAttribute("opacity", (0.88 + slateGlow * 0.1).toFixed(2));
      }

      // 5. Laser Scanbar + Synchronized Stencil Decode (0.18 -> 0.66s)
      const ps = easeOutQuart(prog(t, 0.18, 0.44));
      const sx = t <= 0.18 ? -10 : ps * 268;
      if (scanbarRef.current) {
        if (t > 0.18 && t < 0.66) {
          scanbarRef.current.setAttribute("transform", `translate(${Math.min(260, sx).toFixed(1)}, 0)`);
          const sFade = t < 0.54 ? 1.0 : 1 - (t - 0.54) / 0.12;
          scanbarRef.current.setAttribute("opacity", sFade.toFixed(2));
        } else {
          scanbarRef.current.setAttribute("opacity", "0");
        }
      }

      if (gradRef.current && glintPos > -100) {
        gradRef.current.setAttribute("x1", (glintPos - 28).toFixed(1));
        gradRef.current.setAttribute("x2", (glintPos + 28).toFixed(1));
      }

      WORDMARK_GLYPHS.forEach((g, i) => {
        const grp = glyphGrpRefs.current[i];
        const path = glyphPathRefs.current[i];
        if (!grp || !path) return;

        if (t < 0.7) {
          const distPast = sx - g.x;
          if (distPast < 0) {
            grp.style.opacity = "0";
          } else {
            const pLock = clamp01(distPast / 42);
            let jitterX = (1 - easeOutExpo(pLock)) * -6;
            let jitterY = 0;
            if (distPast < 14) {
              jitterX += i % 2 === 0 ? 1.8 : -1.8;
              jitterY = i % 2 === 0 ? -0.9 : 0.9;
            }
            grp.setAttribute("transform", `translate(${(g.x + jitterX).toFixed(2)}, ${jitterY.toFixed(2)})`);
            grp.style.opacity = clamp01(distPast / 8).toFixed(2);
            const heat = clamp01(1 - distPast / 34);
            path.setAttribute("fill", lerpRgb(COL_WHITE, COL_BRASS_HOT, heat));
          }
        } else {
          grp.setAttribute("transform", `translate(${g.x}, 0)`);
          grp.style.opacity = "1";
          path.setAttribute("fill", glintPos > -100 ? `url(#${glintId})` : "#dce4ec");
        }
      });
    },
    [glintId],
  );

  useImperativeHandle(ref, () => ({ step }), [step]);

  return (
    <div className="inline-flex items-center gap-5 sm:gap-7">
      <svg
        viewBox="0 0 96 96"
        aria-hidden="true"
        className="h-16 w-16 shrink-0 overflow-visible sm:h-20 sm:w-20"
      >
        <defs>
          <clipPath id={chClipId}>
            <polygon points={CHAMBER_POINTS} />
          </clipPath>
          <clipPath id={slClipId}>
            <rect ref={slateRectRef} x="16" y="22" width="18" height="0" />
          </clipPath>
        </defs>

        <g ref={lasersRef} opacity="0">
          <line x1="-12" y1="50.2" x2="108" y2="50.2" stroke="#c59a68" strokeWidth="0.65" strokeDasharray="3 2" />
          <line x1="47" y1="-10" x2="47" y2="104" stroke="#5f9bb0" strokeWidth="0.65" strokeDasharray="3 2" />
          <line x1="4.7" y1="15" x2="48" y2="90" stroke="#5f9bb0" strokeWidth="0.55" opacity="0.7" />
          <line x1="91.3" y1="15" x2="48" y2="90" stroke="#c59a68" strokeWidth="0.55" opacity="0.7" />
          <rect ref={reticleRef} x="43.5" y="46.7" width="7" height="7" fill="none" stroke="#f2d4a2" strokeWidth="1.1" />
        </g>

        <path ref={fmRef} d={FRAME_MAIN_D} fill="#dce4ec" style={{ opacity: 0 }} />
        <path ref={fuRef} d={FRAME_UR_D} fill="#dce4ec" style={{ opacity: 0 }} />

        <g ref={fidsRef} fill="none" stroke="#c59a68" strokeWidth="1.5" opacity="0">
          <path ref={fidTlRef} d="M 5.5 9.5 H -1.5 L 2.2 16.0" />
          <path ref={fidTrRef} d="M 90.5 9.5 H 97.5 L 93.8 16.0" />
          <path ref={fidBtRef} d="M 43.5 91.5 L 48.0 98.5 L 52.5 91.5" />
        </g>

        <g clipPath={`url(#${slClipId})`}>
          <polygon ref={slateRef} points={SLATE_POINTS} fill="#6b869b" opacity="0.88" />
        </g>

        <g clipPath={`url(#${chClipId})`} fill="none">
          <circle ref={(el) => { wRefs.current[0] = el; }} cx="47" cy="50.2" r="10.8" stroke="#c59a68" strokeWidth="2.05" opacity="0" />
          <circle ref={(el) => { wRefs.current[1] = el; }} cx="47" cy="50.2" r="18.0" stroke="#c59a68" strokeWidth="2.05" opacity="0" />
          <circle ref={(el) => { wRefs.current[2] = el; }} cx="47" cy="50.2" r="25.2" stroke="#c59a68" strokeWidth="2.05" opacity="0" />
          <circle ref={(el) => { wRefs.current[3] = el; }} cx="47" cy="50.2" r="32.4" stroke="#c59a68" strokeWidth="2.05" opacity="0" />
        </g>

        <polygon ref={chevRef} points={CHEVRON_POINTS} fill="#c59a68" style={{ opacity: 0 }} />
        <path ref={ghostRef} d={L_MONOLITH_D} fill="none" stroke="#6b869b" strokeWidth="1.1" opacity="0" />

        <g ref={assemblyRef}>
          <polygon ref={shaftRef} points="36.20,10.24 47.00,4.00 47.00,55.00 37.26,55.00 36.20,53.16" fill="#dce4ec" style={{ opacity: 0 }} />
          <polygon ref={baseRef} points="36.20,50.20 77.20,50.20 70.96,61.00 40.73,61.00 36.20,53.16" fill="#dce4ec" style={{ opacity: 0 }} />
        </g>
        <path ref={unifiedRef} d={L_MONOLITH_D} fill="#dce4ec" style={{ display: "none" }} />
      </svg>

      <div className="w-52 shrink-0 sm:w-72 md:w-80">
        <svg viewBox="0 -3 262 42" aria-hidden="true" className="block w-full overflow-visible">
          <defs>
            <linearGradient ref={gradRef} id={glintId} x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#dce4ec" />
              <stop offset="44%" stopColor="#dce4ec" />
              <stop offset="50%" stopColor="#f0ce98" />
              <stop offset="56%" stopColor="#dce4ec" />
              <stop offset="100%" stopColor="#dce4ec" />
            </linearGradient>
          </defs>
          <g>
            {WORDMARK_GLYPHS.map((g, i) => (
              <g key={i} ref={(el) => { glyphGrpRefs.current[i] = el; }} style={{ opacity: 0 }}>
                <path
                  ref={(el) => { glyphPathRefs.current[i] = el; }}
                  d={g.d}
                  fill="#dce4ec"
                  fillRule={g.evenOdd ? "evenodd" : undefined}
                />
              </g>
            ))}
          </g>
          <g ref={scanbarRef} opacity="0">
            <line x1="0" y1="-4" x2="0" y2="40" stroke="#f0ce98" strokeWidth="1.8" />
            <polygon points="-3,-5 3,-5 0,-1.5" fill="#c59a68" />
            <polygon points="-3,41 3,41 0,37.5" fill="#c59a68" />
          </g>
        </svg>
      </div>
    </div>
  );
});
