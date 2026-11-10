import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type ArchAnchor = {
  x: number;
  y: number;
  drawX: number;
  drawY: number;
  vx: number;
  vy: number;
  side: "left" | "right";
  depth: number;
  kind: "crosshair" | "compass" | "datum";
  radius: number;
  spanX: number;
  spanY: number;
};

type ArchSpan = {
  from: number;
  to: number;
  style: "orthogonal" | "chord";
};

function routeSeed(pathname: string) {
  if (pathname.startsWith("/gallery")) return "gallery-atelier";
  if (pathname.startsWith("/about")) return "about-atelier";
  if (pathname.startsWith("/projects/")) return `project-${pathname}`;
  return "work-atelier";
}

function seededRandom(seedText: string) {
  let seed = 2166136261;
  for (const character of seedText) {
    seed ^= character.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function AmbientBackdrop() {
  const backdropRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const desktopPointer = window.matchMedia("(min-width: 1280px) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktopPointer.matches || reducedMotion.matches) return;

    let frame = 0;
    const trackPointer = (event: PointerEvent) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        backdropRef.current?.style.setProperty("--ambient-x", `${event.clientX}px`);
        backdropRef.current?.style.setProperty("--ambient-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", trackPointer);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const desktop = window.matchMedia("(min-width: 1280px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches) return;

    const pointer = {
      x: -1000,
      y: -1000,
      smoothY: window.innerHeight * 0.4,
      active: false,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let contentLeft = 0;
    let contentRight = 0;
    let anchors: ArchAnchor[] = [];
    let spans: ArchSpan[] = [];
    let frame = 0;

    const buildExhibitionPlanes = () => {
      const random = seededRandom(routeSeed(pathname));
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      anchors = [];
      spans = [];
      const contentWidth = Math.min(1152, width - 48);
      contentLeft = (width - contentWidth) / 2;
      contentRight = width - contentLeft;
      const available = Math.max(0, contentLeft - 24);
      if (!desktop.matches || available < 42) return;

      const countPerSide = Math.max(6, Math.min(12, Math.round(available / 22)));
      const kinds: ArchAnchor["kind"][] = ["crosshair", "compass", "datum"];

      (["left", "right"] as const).forEach((side) => {
        const edgePadding = 26;
        const bandStart = side === "left" ? edgePadding : contentRight + 22;
        const bandEnd = side === "left" ? contentLeft - 22 : width - edgePadding;
        const bandWidth = Math.max(1, bandEnd - bandStart);

        for (let index = 0; index < countPerSide; index += 1) {
          // Stratified vertical placement for balanced architectural elevation spacing
          const tierY = ((index + 0.35 + random() * 0.3) / countPerSide) * (height - 110) + 55;
          const x = bandStart + (0.15 + random() * 0.7) * bandWidth;
          const depth = 0.45 + random() * 0.75;
          const kind = kinds[index % kinds.length];
          const radius = kind === "compass" ? 14 + random() * 16 : 4;
          const spanX = (random() > 0.5 ? 1 : -1) * (18 + random() * 28);
          const spanY = (random() > 0.5 ? 1 : -1) * (24 + random() * 42);

          anchors.push({
            x,
            y: tierY,
            drawX: x,
            drawY: tierY,
            vx: 0,
            vy: 0,
            side,
            depth,
            kind,
            radius,
            spanX,
            spanY,
          });
        }
      });

      anchors.forEach((anchor, idx) => {
        const neighbors = anchors
          .map((candidate, candidateIndex) => ({
            candidate,
            candidateIndex,
            distance: Math.hypot(candidate.x - anchor.x, candidate.y - anchor.y),
          }))
          .filter(
            ({ candidate, candidateIndex, distance }) =>
              candidate.side === anchor.side && candidateIndex > idx && distance < 260,
          )
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2);

        neighbors.forEach(({ candidateIndex }, nIdx) => {
          spans.push({
            from: idx,
            to: candidateIndex,
            style: nIdx === 0 ? "orthogonal" : "chord",
          });
        });
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      const influence = 240;

      if (pointer.active) {
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.14;
      }

      // 1. Subtle architectural elevation datum ticks along the inner margin plumb lines
      const plumbLeft = contentLeft - 14;
      const plumbRight = contentRight + 14;
      if (plumbLeft > 30) {
        [plumbLeft, plumbRight].forEach((plumbX, sideIdx) => {
          const isLeft = sideIdx === 0;
          const tickSpacing = 48;
          const tickCount = Math.floor(height / tickSpacing);

          for (let i = 1; i < tickCount; i += 1) {
            const tickY = i * tickSpacing;
            const dy = pointer.active ? Math.abs(tickY - pointer.smoothY) : 999;
            const dx = pointer.active ? Math.abs(plumbX - pointer.x) : 999;
            const proximity = Math.max(0, 1 - Math.hypot(dx * 0.35, dy) / 180);
            const isMajor = i % 3 === 0;
            const baseLen = isMajor ? 8 : 4;
            const len = baseLen + proximity * 10;
            const dir = isLeft ? -1 : 1;

            context.beginPath();
            context.moveTo(plumbX, tickY);
            context.lineTo(plumbX + dir * len, tickY);
            context.strokeStyle =
              proximity > 0.05
                ? `rgba(212, 180, 128, ${0.12 + proximity * 0.42})`
                : `rgba(185, 178, 168, ${isMajor ? 0.14 : 0.07})`;
            context.lineWidth = isMajor || proximity > 0.2 ? 1 : 0.75;
            context.stroke();
          }

          // Live horizontal elevation sighting hairline tracking cursor height
          if (pointer.active) {
            const sideDist = Math.abs(pointer.x - plumbX);
            const sightAlpha = Math.max(0.08, 0.32 - (sideDist / width) * 0.24);
            const dir = isLeft ? -1 : 1;

            context.beginPath();
            context.moveTo(plumbX, pointer.smoothY);
            context.lineTo(plumbX + dir * 26, pointer.smoothY);
            context.strokeStyle = `rgba(216, 184, 132, ${sightAlpha})`;
            context.lineWidth = 1;
            context.stroke();

            // Small diamond elevation marker on the plumb line
            context.beginPath();
            context.moveTo(plumbX, pointer.smoothY - 3.5);
            context.lineTo(plumbX + 3.5, pointer.smoothY);
            context.lineTo(plumbX, pointer.smoothY + 3.5);
            context.lineTo(plumbX - 3.5, pointer.smoothY);
            context.closePath();
            context.fillStyle = `rgba(216, 184, 132, ${sightAlpha + 0.18})`;
            context.fill();
          }
        });
      }

      // 2. Update anchor positions with spring physics + depth parallax from mouse
      anchors.forEach((anchor) => {
        const dx = anchor.x - pointer.x;
        const dy = anchor.y - pointer.y;
        const distance = pointer.active ? Math.hypot(dx, dy) : influence + 1;
        const wake = Math.max(0, 1 - distance / influence);

        // Gentle radial deflection + subtle parallax shift
        const radialPush = wake * wake * 18 * anchor.depth;
        const parallaxX = pointer.active ? ((pointer.x - width / 2) / width) * -10 * anchor.depth : 0;
        const parallaxY = pointer.active ? ((pointer.y - height / 2) / height) * -10 * anchor.depth : 0;

        const targetX =
          anchor.x + parallaxX + (distance > 0.001 ? (dx / distance) * radialPush : 0);
        const targetY =
          anchor.y + parallaxY + (distance > 0.001 ? (dy / distance) * radialPush : 0);

        // Smooth spring-damper integration
        anchor.vx = (anchor.vx + (targetX - anchor.drawX) * 0.08) * 0.78;
        anchor.vy = (anchor.vy + (targetY - anchor.drawY) * 0.08) * 0.78;
        anchor.drawX += anchor.vx;
        anchor.drawY += anchor.vy;
      });

      // 3. Draw architectural projection lines (orthogonal L-sections and structural chords)
      spans.forEach((span) => {
        const from = anchors[span.from];
        const to = anchors[span.to];
        if (!from || !to) return;

        const wakeFrom = pointer.active
          ? Math.max(0, 1 - Math.hypot(from.drawX - pointer.x, from.drawY - pointer.y) / influence)
          : 0;
        const wakeTo = pointer.active
          ? Math.max(0, 1 - Math.hypot(to.drawX - pointer.x, to.drawY - pointer.y) / influence)
          : 0;
        const wake = Math.max(wakeFrom, wakeTo);

        context.beginPath();
        if (span.style === "orthogonal") {
          // Architectural right-angle section projection (stepped horizontal -> vertical)
          const cornerX = to.drawX;
          const cornerY = from.drawY;
          context.moveTo(from.drawX, from.drawY);
          context.lineTo(cornerX, cornerY);
          context.lineTo(to.drawX, to.drawY);

          // Tiny right-angle registration tick at the corner when cursor is near
          if (wake > 0.06) {
            context.strokeStyle = `rgba(212, 180, 128, ${0.09 + wake * 0.26})`;
            context.lineWidth = 0.85;
            context.stroke();

            context.beginPath();
            context.arc(cornerX, cornerY, 1.5, 0, Math.PI * 2);
            context.fillStyle = `rgba(212, 180, 128, ${0.16 + wake * 0.38})`;
            context.fill();
            return;
          }
        } else {
          context.moveTo(from.drawX, from.drawY);
          context.lineTo(to.drawX, to.drawY);
        }

        context.strokeStyle =
          wake > 0.04
            ? `rgba(212, 180, 128, ${0.08 + wake * 0.24})`
            : "rgba(185, 178, 168, 0.075)";
        context.lineWidth = wake > 0.12 ? 0.9 : 0.65;
        context.stroke();
      });

      // 4. Draw architectural anchors (crosshairs, compass circles, and section datums)
      anchors.forEach((anchor) => {
        const distance = pointer.active
          ? Math.hypot(anchor.drawX - pointer.x, anchor.drawY - pointer.y)
          : influence + 1;
        const wake = Math.max(0, 1 - distance / influence);
        const alpha = 0.16 + wake * 0.56;
        const strokeColor =
          wake > 0.05
            ? `rgba(216, 184, 132, ${alpha})`
            : `rgba(190, 183, 172, ${0.15 * anchor.depth})`;

        if (anchor.kind === "compass") {
          const r = anchor.radius + wake * 6;
          context.beginPath();
          context.arc(anchor.drawX, anchor.drawY, r, 0, Math.PI * 2);
          context.strokeStyle =
            wake > 0.05
              ? `rgba(216, 184, 132, ${0.08 + wake * 0.28})`
              : "rgba(190, 183, 172, 0.07)";
          context.lineWidth = 0.75;
          context.stroke();

          // Inner center pinpoint
          context.beginPath();
          context.arc(anchor.drawX, anchor.drawY, 1.3 + wake * 1.2, 0, Math.PI * 2);
          context.fillStyle = strokeColor;
          context.fill();
        } else if (anchor.kind === "crosshair") {
          const arm = 4.5 + wake * 4.5;
          context.beginPath();
          context.moveTo(anchor.drawX - arm, anchor.drawY);
          context.lineTo(anchor.drawX + arm, anchor.drawY);
          context.moveTo(anchor.drawX, anchor.drawY - arm);
          context.lineTo(anchor.drawX, anchor.drawY + arm);
          context.strokeStyle = strokeColor;
          context.lineWidth = 0.85;
          context.stroke();
        } else {
          // Architectural corner bracket / datum mark
          const sx = Math.sign(anchor.spanX) * (6 + wake * 5);
          const sy = Math.sign(anchor.spanY) * (6 + wake * 5);
          context.beginPath();
          context.moveTo(anchor.drawX + sx, anchor.drawY);
          context.lineTo(anchor.drawX, anchor.drawY);
          context.lineTo(anchor.drawX, anchor.drawY + sy);
          context.strokeStyle = strokeColor;
          context.lineWidth = 0.9;
          context.stroke();

          context.beginPath();
          context.arc(anchor.drawX, anchor.drawY, 1.2 + wake, 0, Math.PI * 2);
          context.fillStyle = strokeColor;
          context.fill();
        }
      });

      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    buildExhibitionPlanes();
    window.addEventListener("resize", buildExhibitionPlanes);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildExhibitionPlanes);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [pathname]);

  return (
    <div ref={backdropRef} aria-hidden="true" className="ambient-backdrop">
      <div className="ambient-backdrop__pattern" />
      <div className="ambient-backdrop__glow" />
      <canvas key={pathname} ref={canvasRef} className="ambient-backdrop__map" />
    </div>
  );
}
