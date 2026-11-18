import { useEffect, useRef, type ReactNode } from "react";
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
 * Automatically pauses when the browser tab is hidden or prefers-reduced-motion is set.
 */
export function LamplightDustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

        // Brighten motes softly near the central desk-lamp pool
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
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] h-full w-full" />;
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
      className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
