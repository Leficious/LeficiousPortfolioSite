import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { B04IntroSting } from "./BrandMark";
import { useInViewOnce } from "../lib/atelierMotion";

type DustMote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  speed: number;
  alpha: number;
  gold: boolean;
};

/**
 * Lightweight atmospheric dust motes drifting lazily through nocturnal desk lamplight.
 * Defers starting its rAF loop until `active` is true so initial font/texture decoding
 * has 100% uncontested CPU & GPU headroom.
 */
export function LamplightDustCanvas({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let rafId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const moteCount = width < 640 ? 14 : 28;
    const motes: DustMote[] = Array.from({ length: moteCount }, (_, idx) => ({
      x: ((idx * 137.5) % 100) * 0.01 * width,
      y: ((idx * 73.1) % 100) * 0.01 * height,
      r: 0.75 + (idx % 4) * 0.42,
      vy: -(0.12 + (idx % 5) * 0.045),
      vx: ((idx % 3) - 1) * 0.06,
      phase: idx * 0.9,
      speed: 0.008 + (idx % 4) * 0.003,
      alpha: 0.1 + (idx % 5) * 0.048,
      gold: idx % 2 === 0,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.54;
      const cy = height * 0.46;
      const maxDist = Math.max(width, height) * 0.62;

      for (const m of motes) {
        m.phase += m.speed;
        m.y += m.vy;
        m.x += m.vx + Math.sin(m.phase) * 0.14;

        if (m.y < -12) {
          m.y = height + 10;
          m.x = (m.x + width * 0.27) % width;
        }
        if (m.x < -12) m.x = width + 10;
        if (m.x > width + 12) m.x = -10;

        const dx = m.x - cx;
        const dy = m.y - cy;
        const distFactor = Math.max(0.22, 1 - Math.hypot(dx, dy) / maxDist);
        const pulse = 0.72 + 0.28 * Math.sin(m.phase * 1.7);
        const finalAlpha = m.alpha * distFactor * pulse;

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = m.gold
          ? `rgba(188, 146, 88, ${finalAlpha.toFixed(3)})`
          : `rgba(232, 220, 196, ${finalAlpha.toFixed(3)})`;
        ctx.fill();
      }

      if (!document.hidden) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const onVisibility = () => {
      window.cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = window.requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[1] h-full w-full transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

function preloadDecodeImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    const finish = () => resolve();
    if (img.complete) {
      if (typeof img.decode === "function") {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
      return;
    }
    img.onload = () => {
      if (typeof img.decode === "function") {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    };
    img.onerror = finish;
  });
}

export type IntroStage = "veiled" | "revealing" | "settled";

/**
 * Fast Asset-Gated Nocturnal Atelier Lamplight Curtain (~0.42s - 0.78s cap):
 * Holds a silent GPU-composited obsidian veil with a softly turning gilt AstrolabeCrest
 * until variable fonts, WebGL damask, vellum stock, wax seal, and above-the-fold folio
 * textures are decoded — then dissolves smoothly while triggering the 3-beat desk deal.
 */
export function AtelierIntroCurtain({
  backdropReady,
  pathname,
  onStageChange,
}: {
  backdropReady: boolean;
  pathname: string;
  onStageChange: (stage: IntroStage) => void;
}) {
  const [stage, setStage] = useState<IntroStage>("veiled");

  const backdropReadyResolveRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef<number>(typeof performance !== "undefined" ? performance.now() : 0);
  const revealedRef = useRef(false);

  const beginReveal = useCallback(
    (instant = false) => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      if (instant) {
        document.documentElement.dataset.atelierStage = "settled";
        setStage("settled");
        onStageChange("settled");
        return;
      }
      document.documentElement.dataset.atelierStage = "revealing";
      setStage("revealing");
      onStageChange("revealing");

      // Wait comfortably past the longest entrance keyframe (180ms delay + 540ms = 720ms)
      // so every animated element has reached 100% identity transform before settling.
      window.setTimeout(() => {
        document.documentElement.dataset.atelierStage = "settled";
        setStage("settled");
        onStageChange("settled");
      }, 860);
    },
    [onStageChange],
  );

  useEffect(() => {
    if (backdropReady && backdropReadyResolveRef.current) {
      backdropReadyResolveRef.current();
      backdropReadyResolveRef.current = null;
    }
  }, [backdropReady]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      beginReveal(true);
      return;
    }

    document.documentElement.dataset.atelierStage = "veiled";
    let cancelled = false;

    const cleanPath = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
    const criticalImages = [
      "/textures/vellum-rag-grunge.webp",
      "/ornaments/crimson-wax-seal.webp",
    ];
    if (cleanPath === "/") {
      criticalImages.push(
        "/reels/game-design-reel-2026.webp",
        "/projects/still-life/hero-poster.webp",
        "/projects/an-echo-has-no-shape/hero-poster.webp",
      );
    } else if (cleanPath === "/about") {
      criticalImages.push("/about/lefi-shan-portrait.webp");
    }

    const waitBackdrop = backdropReady
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          backdropReadyResolveRef.current = resolve;
        });

    const waitFonts =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready.then(() => undefined, () => undefined)
        : Promise.resolve();

    const waitAssets = Promise.all([
      waitFonts,
      waitBackdrop,
      ...criticalImages.map(preloadDecodeImage),
    ]);

    // Hard safety cap (1260ms) so slow networks never stall; minimum poise (1080ms) so the 8-layer B-04 + LEFICIØUS sting plays cleanly
    const maxCapTimer = window.setTimeout(() => {
      if (!cancelled) beginReveal();
    }, 1260);

    waitAssets.then(() => {
      if (cancelled || revealedRef.current) return;
      const elapsed = performance.now() - startedAtRef.current;
      const remaining = Math.max(0, 1080 - elapsed);
      window.setTimeout(() => {
        if (!cancelled) beginReveal();
      }, remaining);
    });

    const onEarlySkip = () => beginReveal();
    window.addEventListener("pointerdown", onEarlySkip, { once: true, passive: true });
    window.addEventListener("keydown", onEarlySkip, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(maxCapTimer);
      window.removeEventListener("pointerdown", onEarlySkip);
      window.removeEventListener("keydown", onEarlySkip);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (stage === "settled") return null;

  const isRevealing = stage === "revealing";

  return (
    <div
      aria-hidden="true"
      className={`atelier-intro-curtain fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#080605] select-none ${
        isRevealing
          ? "pointer-events-none opacity-0 scale-[1.015] transition-[opacity,scale] duration-[540ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Warm candle-ember & crimson ignition aura */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_circle_at_50%_47%,rgba(212,173,115,0.1)_0%,rgba(92,20,22,0.12)_38%,rgba(18,12,10,0.22)_62%,transparent_80%)]" />

      <div className="relative z-10 flex flex-col items-center">
        <B04IntroSting />
      </div>
    </div>
  );
}

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
