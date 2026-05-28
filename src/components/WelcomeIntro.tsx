import { useEffect, useRef, useState } from "react";

/**
 * Matrix / geometric grid overlay.
 * - Cursor pushes/distorts a lattice of dots & lines (field warp).
 * - Subtle scanline + noise dither kills color banding from large gradients.
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
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    const spacing = 28;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / spacing) + 2;
      rows = Math.ceil(height / spacing) + 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    // dither noise tile to break up banding
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
    const influence = 140;

    const tick = () => {
      t += 0.008;

      // base wash
      ctx.fillStyle = "rgb(14, 18, 26)";
      ctx.fillRect(0, 0, width, height);

      // dither layer kills the OKLCH banding
      ctx.fillStyle = noisePattern;
      ctx.fillRect(0, 0, width, height);

      // grid dots warped toward cursor
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const baseX = i * spacing;
          const baseY = j * spacing;
          let x = baseX;
          let y = baseY;
          let intensity = 0;

          if (mouse.active) {
            const dx = baseX - mouse.x;
            const dy = baseY - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < influence) {
              const f = 1 - dist / influence;
              const push = f * f * 18;
              const ang = Math.atan2(dy, dx);
              x += Math.cos(ang) * push;
              y += Math.sin(ang) * push;
              intensity = f;
            }
          }

          // subtle ambient drift
          const drift = Math.sin(t + (i + j) * 0.35) * 0.6;
          y += drift;

          const size = 1 + intensity * 2.2;
          const alpha = 0.18 + intensity * 0.6;
          ctx.fillStyle = `rgba(150, 180, 210, ${alpha})`;
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }

      // matrix-style scan ring around cursor
      if (mouse.active) {
        ctx.strokeStyle = "rgba(120, 180, 220, 0.18)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, influence, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = "rgba(120, 180, 220, 0.35)";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4 + (Math.sin(t * 6) + 1) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // crosshair
        ctx.strokeStyle = "rgba(170, 200, 220, 0.25)";
        ctx.beginPath();
        ctx.moveTo(mouse.x - 14, mouse.y);
        ctx.lineTo(mouse.x + 14, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 14);
        ctx.lineTo(mouse.x, mouse.y + 14);
        ctx.stroke();
      }

      // horizontal scanline
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
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
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
