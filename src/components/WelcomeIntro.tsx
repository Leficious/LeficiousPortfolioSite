import { useEffect, useRef, useState } from "react";

/**
 * Matrix / geometric lattice intro.
 * Optimized: two-pass dot rendering (cheap ambient batch + warped hot zone),
 * cached noise dither, capped DPR, eased mouse.
 */
export function WelcomeIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("intro-seen") === "1") setDismissed(true);
  }, []);

  useEffect(() => {
    if (dismissed) return;
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

    // Cached dither noise — drawn once, painted as pattern (kills banding)
    const noise = document.createElement("canvas");
    noise.width = noise.height = 128;
    const nctx = noise.getContext("2d")!;
    const img = nctx.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 14;
    }
    nctx.putImageData(img, 0, 0);
    const noisePattern = ctx.createPattern(noise, "repeat")!;

    let t = 0;
    let raf = 0;
    const influence = 200;
    const influenceSq = influence * influence;

    const tick = () => {
      t += 0.008;
      if (mouse.active) {
        mouse.x += (mouse.tx - mouse.x) * 0.25;
        mouse.y += (mouse.ty - mouse.y) * 0.25;
      }

      ctx.fillStyle = "rgb(14, 18, 26)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = noisePattern;
      ctx.fillRect(0, 0, width, height);

      // PASS 1 — ambient dots (one fillStyle, no warp math, skips hot zone)
      ctx.fillStyle = "rgba(150, 180, 210, 0.18)";
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

      // PASS 2 — warped + brightened dots inside influence radius
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
            const push = f * f * 34;
            const inv = dist > 0.001 ? 1 / dist : 0;
            const x = baseX + dx * inv * push;
            const y = baseY + dy * inv * push;
            const size = 1 + f * 3.2;
            const alpha = 0.22 + f * 0.7;
            const tint = 180 + ((f * 70) | 0);
            ctx.fillStyle = `rgba(${tint - 30},${tint},${tint + 10},${alpha})`;
            ctx.fillRect(x - size / 2, y - size / 2, size, size);
          }
        }

        // brightness halo
        const halo = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, influence
        );
        halo.addColorStop(0, "rgba(180, 210, 235, 0.10)");
        halo.addColorStop(0.5, "rgba(150, 190, 220, 0.04)");
        halo.addColorStop(1, "rgba(150, 190, 220, 0)");
        ctx.fillStyle = halo;
        ctx.fillRect(mouse.x - influence, mouse.y - influence, influence * 2, influence * 2);

        // scan ring + crosshair
        ctx.strokeStyle = "rgba(150, 200, 230, 0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, influence, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(170, 210, 235, 0.45)";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4 + (Math.sin(t * 6) + 1) * 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(190, 215, 235, 0.3)";
        ctx.beginPath();
        ctx.moveTo(mouse.x - 16, mouse.y);
        ctx.lineTo(mouse.x + 16, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 16);
        ctx.lineTo(mouse.x, mouse.y + 16);
        ctx.stroke();
      }

      // moving scanline
      const scanY = ((t * 60) % (height + 60)) - 30;
      const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      grad.addColorStop(0, "rgba(120, 180, 220, 0)");
      grad.addColorStop(0.5, "rgba(120, 180, 220, 0.05)");
      grad.addColorStop(1, "rgba(120, 180, 220, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 30, width, 60);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [dismissed]);

  if (dismissed) return null;

  const handleDismiss = () => {
    setLeaving(true);
    sessionStorage.setItem("intro-seen", "1");
    setTimeout(() => setDismissed(true), 500);
  };

  return (
    <div
      onClick={handleDismiss}
      onContextMenu={(e) => {
        e.preventDefault();
        handleDismiss();
      }}
      className={`fixed inset-0 z-[100] cursor-crosshair overflow-hidden bg-background transition-opacity duration-500 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-label="Welcome — click to enter"
      role="button"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Edge geometric lattices — static SVG, cheap to render */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id="edge-grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0H0V22" fill="none" stroke="rgba(150,180,210,0.22)" strokeWidth="0.5" />
          </pattern>
          {/* Custom sci-fi HUD tile: notched frame + crosshair + corner ticks */}
          <pattern id="edge-tri" width="64" height="64" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="rgba(170,200,225,0.32)" strokeWidth="0.6">
              <path d="M6 2 H22 L26 6 V14 M58 6 V22 L54 26 H46 M58 58 H42 L38 54 V46 M6 58 V42 L10 38 H18" />
              <path d="M32 26 V38 M26 32 H38" />
              <circle cx="32" cy="32" r="1.2" fill="rgba(180,210,235,0.55)" stroke="none" />
              <path d="M2 2 H4 M2 2 V4 M62 2 H60 M62 2 V4 M2 62 H4 M2 62 V60 M62 62 H60 M62 62 V60" strokeWidth="0.9" />
              <path d="M14 32 H22 M42 32 H50 M32 14 V22 M32 42 V50" strokeDasharray="1 2" opacity="0.6" />
            </g>
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

        {/* top triangular lattice */}
        <g mask="url(#mask-top)">
          <rect width="100%" height="140" fill="url(#edge-tri)" />
        </g>
        <mask id="mask-top">
          <rect width="100%" height="140" fill="url(#fade-t)" />
        </mask>

        {/* bottom triangular lattice */}
        <g mask="url(#mask-bot)" transform="translate(0, 0)">
          <rect y="0" width="100%" height="100%" fill="url(#edge-tri)" />
        </g>
        <mask id="mask-bot">
          <rect y="0" width="100%" height="100%" fill="black" />
          <rect y="0" width="100%" height="100%" fill="url(#fade-b)" style={{ maskType: "alpha" }} />
        </mask>

        {/* left grid lattice */}
        <g mask="url(#mask-left)">
          <rect width="180" height="100%" fill="url(#edge-grid)" />
        </g>
        <mask id="mask-left">
          <rect width="180" height="100%" fill="url(#fade-l)" />
        </mask>

        {/* right grid lattice */}
        <g mask="url(#mask-right)">
          <rect width="100%" height="100%" fill="url(#edge-grid)" />
        </g>
        <mask id="mask-right">
          <rect x="calc(100% - 180px)" width="180" height="100%" fill="url(#fade-r)" />
        </mask>
      </svg>

      {/* corner registration marks */}
      <div className="pointer-events-none absolute inset-6 z-10">
        {(["tl", "tr", "bl", "br"] as const).map((pos) => (
          <div
            key={pos}
            className={`absolute h-4 w-4 border-foreground/30 ${
              pos === "tl" ? "left-0 top-0 border-l border-t" : ""
            } ${pos === "tr" ? "right-0 top-0 border-r border-t" : ""} ${
              pos === "bl" ? "bottom-0 left-0 border-b border-l" : ""
            } ${pos === "br" ? "bottom-0 right-0 border-b border-r" : ""}`}
          />
        ))}
      </div>

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.5em] text-muted-foreground md:text-base">
          ▘ ▝ ▖ ▗ &nbsp; Welcome &nbsp; ▘ ▝ ▖ ▗
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] text-balance text-foreground md:text-6xl">
          I'm <span className="text-accent">leficious</span> — technical &amp;
          combat designer.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
          Prototypes, combat systems, AI, and the tools that ship them. Move
          your cursor across the lattice. Click to enter.
        </p>
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground/70 animate-pulse">
          [ click to continue ]
        </p>
      </div>
    </div>
  );
}
