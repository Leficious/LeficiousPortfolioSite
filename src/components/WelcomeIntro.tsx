import { useEffect, useRef, useState } from "react";

export function WelcomeIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Show only once per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("intro-seen") === "1") {
      setDismissed(true);
    }
  }, []);

  // Liquid cursor effect
  useEffect(() => {
    if (dismissed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: width / 2, y: height / 2 };
    const trail: { x: number; y: number; r: number; life: number }[] = [];

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      for (let i = 0; i < 2; i++) {
        trail.push({
          x: mouse.x + (Math.random() - 0.5) * 8,
          y: mouse.y + (Math.random() - 0.5) * 8,
          r: 60 + Math.random() * 40,
          life: 1,
        });
      }
      if (trail.length > 120) trail.splice(0, trail.length - 120);
    };
    window.addEventListener("pointermove", onMove);

    // ambient blobs
    const blobs = Array.from({ length: 5 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 140 + i * 30,
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (const b of blobs) {
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -b.r || b.x > width + b.r) b.vx *= -1;
        if (b.y < -b.r || b.y > height + b.r) b.vy *= -1;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, "rgba(120, 160, 200, 0.18)");
        g.addColorStop(1, "rgba(120, 160, 200, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.life -= 0.02;
        p.r *= 0.985;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(170, 210, 240, ${0.35 * p.life})`);
        g.addColorStop(0.6, `rgba(120, 160, 200, ${0.12 * p.life})`);
        g.addColorStop(1, "rgba(120, 160, 200, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // soft glow around cursor
      const cg = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 180);
      cg.addColorStop(0, "rgba(200, 225, 245, 0.25)");
      cg.addColorStop(1, "rgba(200, 225, 245, 0)");
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 180, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setLeaving(true);
    sessionStorage.setItem("intro-seen", "1");
    setTimeout(() => setDismissed(true), 600);
  };

  return (
    <div
      onClick={handleDismiss}
      onContextMenu={(e) => {
        e.preventDefault();
        handleDismiss();
      }}
      className={`fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-background transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ filter: "url(#liquid-goo)" }}
      aria-label="Welcome — click to enter"
      role="button"
    >
      {/* SVG filter for goo/liquid feel */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id="liquid-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Welcome
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-balance text-foreground md:text-6xl">
          I'm <span className="text-accent">leficious</span> — technical &amp;
          combat designer.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
          Prototypes, combat systems, AI, and the tools that ship them. Move
          your cursor. Click anywhere to enter.
        </p>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70 animate-pulse">
          ▸ click to continue
        </p>
      </div>
    </div>
  );
}
