import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "../lib/language";
import { HeroBootLockup } from "./BrandMark";

const INTRO_STORAGE_KEY = "intro-p03e2-seen";
const emptySubscribe = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

/**
 * First-visit tactical blueprint entry stage featuring the P03-E2 boot sting
 * and interactive geometric dot lattice. Hydration-safe for SSR prerendering.
 */
export function WelcomeIntro() {
  const { text } = useLanguage();
  const hydrated = useSyncExternalStore(emptySubscribe, getClientHydrated, getServerHydrated);
  const [dismissed, setDismissed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shouldOpen = useMemo(() => {
    if (!hydrated) return false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("intro") === "1") return true;

      const cleanPath = window.location.pathname.replace(/\/$/, "") || "/";
      if (cleanPath !== "/" && cleanPath !== "/zh") return false;

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(pointer: coarse)").matches
      ) {
        return false;
      }

      return localStorage.getItem(INTRO_STORAGE_KEY) !== "1";
    } catch {
      return false;
    }
  }, [hydrated]);

  const active = shouldOpen && !dismissed;

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    const spacing = 30;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const noise = document.createElement("canvas");
    noise.width = noise.height = 128;
    const nctx = noise.getContext("2d")!;
    const img = nctx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 12;
    }
    nctx.putImageData(img, 0, 0);
    const noisePattern = ctx.createPattern(noise, "repeat")!;

    let t = 0;
    let raf = 0;
    let running = true;
    const influence = 200;
    const influenceSq = influence * influence;

    const tick = () => {
      if (!running) return;
      t += 0.008;
      if (mouse.active) {
        mouse.x += (mouse.tx - mouse.x) * 0.25;
        mouse.y += (mouse.ty - mouse.y) * 0.25;
      }

      ctx.fillStyle = "rgb(16, 21, 28)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = noisePattern;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(150, 180, 208, 0.16)";
      const drift = Math.sin(t) * 0.6;
      for (let j = 0; j < rows; j++) {
        const baseY = j * spacing + drift;
        for (let i = 0; i < cols; i++) {
          const baseX = i * spacing;
          if (mouse.active) {
            const dx = baseX - mouse.x;
            const dy = baseY - mouse.y;
            if (dx * dx + dy * dy < influenceSq) continue;
          }
          ctx.fillRect(baseX - 0.5, baseY - 0.5, 1, 1);
        }
      }

      if (mouse.active) {
        const ci = Math.floor(mouse.x / spacing);
        const cj = Math.floor(mouse.y / spacing);
        const r = Math.ceil(influence / spacing) + 1;
        for (let j = cj - r; j <= cj + r; j++) {
          if (j < 0 || j >= rows) continue;
          for (let i = ci - r; i <= ci + r; i++) {
            if (i < 0 || i >= cols) continue;
            const baseX = i * spacing;
            const baseY = j * spacing + drift;
            const dx = baseX - mouse.x;
            const dy = baseY - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 >= influenceSq) continue;
            const dist = Math.sqrt(d2);
            const f = 1 - dist / influence;
            const push = f * f * 32;
            const inv = dist > 0.001 ? 1 / dist : 0;
            const x = baseX + dx * inv * push;
            const y = baseY + dy * inv * push;
            const size = 1 + f * 3.0;
            const alpha = 0.22 + f * 0.68;
            const rCh = (165 + f * 65) | 0;
            const gCh = (182 + f * 42) | 0;
            const bCh = (196 + f * 24) | 0;
            ctx.fillStyle = `rgba(${rCh},${gCh},${bCh},${alpha})`;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }

        const halo = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          influence,
        );
        halo.addColorStop(0, "rgba(197, 154, 104, 0.09)");
        halo.addColorStop(0.5, "rgba(142, 190, 212, 0.04)");
        halo.addColorStop(1, "rgba(142, 190, 212, 0)");
        ctx.fillStyle = halo;
        ctx.fillRect(mouse.x - influence, mouse.y - influence, influence * 2, influence * 2);

        ctx.strokeStyle = "rgba(197, 154, 104, 0.24)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, influence, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(220, 228, 236, 0.45)";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4 + (Math.sin(t * 6) + 1) * 2.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(197, 154, 104, 0.36)";
        ctx.beginPath();
        ctx.moveTo(mouse.x - 16, mouse.y);
        ctx.lineTo(mouse.x + 16, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 16);
        ctx.lineTo(mouse.x, mouse.y + 16);
        ctx.stroke();
      }

      const scanY = ((t * 60) % (height + 60)) - 30;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "rgba(120, 180, 210, 0)");
      grad.addColorStop(0.5, "rgba(120, 180, 210, 0.045)");
      grad.addColorStop(1, "rgba(120, 180, 210, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, width, 60);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibilityChange = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [active]);

  const handleDismiss = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    try {
      localStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // Storage can be unavailable in privacy-restricted contexts.
    }
    window.setTimeout(() => setDismissed(true), 480);
  }, [leaving]);

  useEffect(() => {
    if (!active) return;
    const timer = window.setTimeout(handleDismiss, 5200);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleDismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, handleDismiss]);

  if (!active) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[100] cursor-crosshair overflow-hidden bg-background transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-labelledby="welcome-title"
      aria-describedby="welcome-description"
      aria-modal="true"
      role="dialog"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="edge-grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke="rgba(150,180,210,0.2)" strokeWidth="0.5" />
          </pattern>
          <pattern id="edge-tri" width="56" height="56" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="rgba(197,154,104,0.28)" strokeWidth="0.6">
              <path d="M4 12 V4 H12" />
              <path d="M52 28 H44" />
            </g>
            <circle cx="28" cy="28" r="0.9" fill="rgba(180,210,235,0.45)" />
          </pattern>
          <linearGradient id="fade-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fade-b" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fade-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fade-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0" stopColor="white" stopOpacity="1" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask="url(#mask-top)">
          <rect width="100%" height="140" fill="url(#edge-tri)" />
        </g>
        <mask id="mask-top">
          <rect width="100%" height="140" fill="url(#fade-t)" />
        </mask>

        <g mask="url(#mask-bot)">
          <rect y="0" width="100%" height="100%" fill="url(#edge-tri)" />
        </g>
        <mask id="mask-bot">
          <rect y="0" width="100%" height="100%" fill="black" />
          <rect y="0" width="100%" height="100%" fill="url(#fade-b)" style={{ maskType: "alpha" }} />
        </mask>

        <g mask="url(#mask-left)">
          <rect width="180" height="100%" fill="url(#edge-grid)" />
        </g>
        <mask id="mask-left">
          <rect width="180" height="100%" fill="url(#fade-l)" />
        </mask>

        <g mask="url(#mask-right)">
          <rect width="100%" height="100%" fill="url(#edge-grid)" />
        </g>
        <mask id="mask-right">
          <rect x="calc(100% - 180px)" width="180" height="100%" fill="url(#fade-r)" />
        </mask>
      </svg>

      <div className="pointer-events-none absolute inset-6 z-10">
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <div
            key={pos}
            className={`absolute h-4 w-4 border-warm/45 ${
              pos === "tl" ? "left-0 top-0 border-l border-t" : ""
            } ${pos === "tr" ? "right-0 top-0 border-r border-t" : ""} ${
              pos === "bl" ? "bottom-0 left-0 border-b border-l" : ""
            } ${pos === "br" ? "bottom-0 right-0 border-b border-r" : ""}`}
          />
        ))}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.38em] text-warm/90 sm:text-xs">
          {text("Lefi (Kevin) Shan · Portfolio", "单凯飞 Lefi Shan · 个人作品集")}
        </p>

        <div className="mt-7">
          <HeroBootLockup />
        </div>

        <h1
          id="welcome-title"
          className="mt-7 max-w-2xl font-display text-xl font-medium tracking-[-0.01em] text-foreground/95 sm:text-2xl"
        >
          {text("Game, level & technical design", "游戏、关卡与技术设计")}
        </h1>

        <p
          id="welcome-description"
          className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base"
        >
          {text(
            "Level architecture, spatial puzzles, combat systems, and 3D production. Move your cursor across the grid, or click anywhere to enter.",
            "涵盖关卡架构、空间解谜、战斗系统与 3D 场景制作。移动鼠标探索网格，或点击任意处进入。",
          )}
        </p>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDismiss();
          }}
          className="pointer-events-auto mt-9 rounded-full border border-warm/45 bg-background/75 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/90 transition-colors hover:border-warm hover:bg-warm/12 hover:text-foreground"
        >
          {text("Enter portfolio", "进入作品集")}
        </button>
      </div>
    </div>
  );
}
