import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type MapNode = {
  x: number;
  y: number;
  drawX: number;
  drawY: number;
  vx: number;
  vy: number;
  side: "left" | "right";
  tier: "hub" | "relay" | "node";
  label?: string;
  phase: number;
  echoWave: number;
};

type MapEdge = {
  from: number;
  to: number;
  phase: number;
  speed: number;
};

const pageLabels: Record<string, string[]> = {
  work: ["SPACE", "SYSTEM", "COMBAT", "FLOW"],
  gallery: ["FORM", "SHADER", "LIGHT", "SCENE"],
  about: ["DESIGN", "CRAFT", "RHYTHM", "PLAY"],
  project: ["TOPOLOGY", "MECHANIC", "PACING", "PAYOFF"],
};

function routeKey(pathname: string) {
  if (pathname.startsWith("/gallery")) return "gallery";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/projects/")) return "project";
  return "work";
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
    const key = routeKey(pathname);
    const labels = pageLabels[key];
    if (!desktop.matches) return;

    const pointer = {
      x: -1000,
      y: -1000,
      smoothX: -1000,
      smoothY: window.innerHeight * 0.4,
      active: false,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let contentLeft = 0;
    let contentRight = 0;
    let nodes: MapNode[] = [];
    let edges: MapEdge[] = [];
    let frame = 0;

    const buildMap = () => {
      const random = seededRandom(`${key}-${pathname}-ambient-map`);
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      edges = [];
      const contentWidth = Math.min(1152, width - 48);
      contentLeft = (width - contentWidth) / 2;
      contentRight = width - contentLeft;
      const available = Math.max(0, contentLeft - 24);
      if (!desktop.matches || available < 42) return;

      const countPerSide = Math.max(7, Math.min(16, Math.round(available / 15)));
      (["left", "right"] as const).forEach((side) => {
        for (let index = 0; index < countPerSide; index += 1) {
          const edgePadding = 20;
          const bandStart = side === "left" ? edgePadding : contentRight + 18;
          const bandEnd = side === "left" ? contentLeft - 18 : width - edgePadding;
          const x = bandStart + random() * Math.max(1, bandEnd - bandStart);
          // Stratified + jittered vertical distribution so the constellation spans the full height richly
          const baseBandY = ((index + 0.2 + random() * 0.6) / countPerSide) * (height - 76) + 38;
          const y = Math.max(36, Math.min(height - 36, baseBandY));
          const tier: MapNode["tier"] =
            index % 4 === 0 ? "hub" : index % 2 === 0 ? "relay" : "node";

          nodes.push({
            x,
            y,
            drawX: x,
            drawY: y,
            vx: 0,
            vy: 0,
            side,
            tier,
            phase: random(),
            echoWave: 0,
          });
        }
      });

      const labelStep = Math.max(1, Math.floor(nodes.length / labels.length));
      labels.forEach((label, index) => {
        const node = nodes[Math.min(nodes.length - 1, index * labelStep + (index % 2))];
        if (node) {
          node.label = label;
          node.tier = "hub";
        }
      });

      nodes.forEach((node, nodeIndex) => {
        const candidates = nodes
          .map((candidate, candidateIndex) => ({
            candidate,
            candidateIndex,
            distance: Math.hypot(candidate.x - node.x, candidate.y - node.y),
          }))
          .filter(
            ({ candidate, candidateIndex, distance }) =>
              candidate.side === node.side && candidateIndex > nodeIndex && distance < 280,
          )
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        candidates.forEach(({ candidateIndex }) =>
          edges.push({
            from: nodeIndex,
            to: candidateIndex,
            phase: random(),
            speed: 0.00024 + random() * 0.00022,
          }),
        );
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.active) {
        pointer.smoothX = event.clientX;
        pointer.smoothY = event.clientY;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const influence = 230;

      if (pointer.active) {
        pointer.smoothX += (pointer.x - pointer.smoothX) * 0.18;
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.18;
      }

      // 1. Live elevation gauge ticks along the left/right content boundary lines
      const plumbLeft = contentLeft - 10;
      const plumbRight = contentRight + 10;
      if (plumbLeft > 32) {
        [plumbLeft, plumbRight].forEach((plumbX, sideIdx) => {
          const isLeft = sideIdx === 0;
          const dir = isLeft ? -1 : 1;
          const tickSpacing = 48;
          const tickCount = Math.floor(height / tickSpacing);

          for (let i = 1; i < tickCount; i += 1) {
            const tickY = i * tickSpacing;
            const dy = pointer.active ? Math.abs(tickY - pointer.smoothY) : 999;
            const proximity = Math.max(0, 1 - dy / 150);
            const isMajor = i % 3 === 0;
            const len = (isMajor ? 7 : 3.5) + proximity * 8;

            context.beginPath();
            context.moveTo(plumbX, tickY);
            context.lineTo(plumbX + dir * len, tickY);
            context.strokeStyle =
              proximity > 0.08
                ? `rgba(148, 194, 207, ${0.14 + proximity * 0.36})`
                : `rgba(126, 166, 182, ${isMajor ? 0.14 : 0.06})`;
            context.lineWidth = isMajor || proximity > 0.25 ? 0.95 : 0.65;
            context.stroke();
          }

          if (pointer.active) {
            context.beginPath();
            context.moveTo(plumbX, pointer.smoothY - 3);
            context.lineTo(plumbX + 3, pointer.smoothY);
            context.lineTo(plumbX, pointer.smoothY + 3);
            context.lineTo(plumbX - 3, pointer.smoothY);
            context.closePath();
            context.fillStyle = "rgba(197, 154, 104, 0.55)";
            context.fill();
          }
        });
      }

      // 2. Update node positions with ambient orbital drift + spring-damper mouse repulsion
      nodes.forEach((node) => {
        const driftX = !reducedMotion.matches
          ? Math.cos(time * 0.0007 + node.phase * Math.PI * 2) * 3.5
          : 0;
        const driftY = !reducedMotion.matches
          ? Math.sin(time * 0.0009 + node.phase * Math.PI * 2) * 4.5
          : 0;

        const baseX = node.x + driftX;
        const baseY = node.y + driftY;

        const dx = baseX - pointer.x;
        const dy = baseY - pointer.y;
        const distance = pointer.active ? Math.hypot(dx, dy) : influence + 1;
        const wake = Math.max(0, 1 - distance / influence);
        const push = wake * wake * 22;

        // Subtle tangential swirl + radial repulsion
        const inv = distance > 0.001 ? 1 / distance : 0;
        const targetX = baseX + dx * inv * push - dy * inv * (wake * 5);
        const targetY = baseY + dy * inv * push + dx * inv * (wake * 5);

        node.vx = (node.vx + (targetX - node.drawX) * 0.1) * 0.78;
        node.vy = (node.vy + (targetY - node.drawY) * 0.1) * 0.78;
        node.drawX += node.vx;
        node.drawY += node.vy;

        // Trigger an expanding echo wave when cursor enters a hub's close radius
        if (node.tier === "hub" && wake > 0.45 && node.echoWave <= 0.02) {
          node.echoWave = 1;
        }
        if (node.echoWave > 0) {
          node.echoWave = Math.max(0, node.echoWave - 0.014);
        }
      });

      // 3. Draw network edges & traveling signal/echo pulses
      edges.forEach((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        if (!from || !to) return;

        const wakeFrom = pointer.active
          ? Math.max(0, 1 - Math.hypot(from.drawX - pointer.x, from.drawY - pointer.y) / influence)
          : 0;
        const wakeTo = pointer.active
          ? Math.max(0, 1 - Math.hypot(to.drawX - pointer.x, to.drawY - pointer.y) / influence)
          : 0;
        const wake = Math.max(wakeFrom, wakeTo);

        context.beginPath();
        context.moveTo(from.drawX, from.drawY);
        context.lineTo(to.drawX, to.drawY);
        context.strokeStyle =
          wake > 0.25
            ? `rgba(148, 202, 218, ${0.16 + wake * 0.34})`
            : `rgba(126, 166, 182, ${0.14 + wake * 0.24})`;
        context.lineWidth = wake > 0.12 ? 1.05 : 0.75;
        context.stroke();

        // Ambient + wake-accelerated traveling pulses along edges
        if (!reducedMotion.matches && (wake > 0.04 || edge.phase > 0.35)) {
          const speedBoost = 1 + wake * 1.6;
          const progress = (time * edge.speed * speedBoost + edge.phase) % 1;
          const pulseX = from.drawX + (to.drawX - from.drawX) * progress;
          const pulseY = from.drawY + (to.drawY - from.drawY) * progress;
          const pulseAlpha = wake > 0.05 ? 0.32 + wake * 0.62 : 0.22;

          context.beginPath();
          context.arc(pulseX, pulseY, 1.3 + wake * 1.2, 0, Math.PI * 2);
          context.fillStyle =
            from.tier === "hub" && wake > 0.2
              ? `rgba(197, 154, 104, ${pulseAlpha})`
              : `rgba(142, 208, 226, ${pulseAlpha})`;
          context.fill();
        }
      });

      // 4. Live Cursor Triangulation: tether the closest woken nodes directly to the cursor
      if (pointer.active) {
        const nearby = nodes
          .map((node) => ({
            node,
            dist: Math.hypot(node.drawX - pointer.smoothX, node.drawY - pointer.smoothY),
          }))
          .filter((item) => item.dist < influence * 0.92)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3);

        nearby.forEach(({ node, dist }) => {
          const tetherAlpha = Math.max(0, 1 - dist / (influence * 0.92)) * 0.32;
          context.beginPath();
          context.setLineDash([3, 4]);
          context.moveTo(pointer.smoothX, pointer.smoothY);
          context.lineTo(node.drawX, node.drawY);
          context.strokeStyle = `rgba(148, 194, 207, ${tetherAlpha})`;
          context.lineWidth = 0.8;
          context.stroke();
          context.setLineDash([]);

          // Midpoint range tick on the triangulation tether
          const midX = (pointer.smoothX + node.drawX) * 0.5;
          const midY = (pointer.smoothY + node.drawY) * 0.5;
          context.beginPath();
          context.arc(midX, midY, 1.2, 0, Math.PI * 2);
          context.fillStyle = `rgba(197, 154, 104, ${tetherAlpha * 1.4})`;
          context.fill();
        });
      }

      // 5. Draw nodes, waypoint hub rings, expanding echo waves, and topology labels
      nodes.forEach((node) => {
        const distance = pointer.active
          ? Math.hypot(node.drawX - pointer.x, node.drawY - pointer.y)
          : influence + 1;
        const wake = Math.max(0, 1 - distance / influence);
        const isHub = node.tier === "hub";
        const baseRadius = isHub ? 2.1 : node.tier === "relay" ? 1.6 : 1.3;
        const radius = baseRadius + wake * 2.8;

        // Expanding spatial echo ring when triggered
        if (node.echoWave > 0.01) {
          const progress = 1 - node.echoWave;
          const waveRadius = 8 + progress * 44;
          context.beginPath();
          context.arc(node.drawX, node.drawY, waveRadius, 0, Math.PI * 2);
          context.strokeStyle = `rgba(197, 154, 104, ${node.echoWave * 0.35})`;
          context.lineWidth = 0.85;
          context.stroke();
        }

        // Ambient outer ring for primary waypoint hubs
        if (isHub) {
          const hubRingRadius = 6.5 + wake * 6.5 + Math.sin(time * 0.002 + node.phase * 6) * 0.8;
          context.beginPath();
          context.arc(node.drawX, node.drawY, hubRingRadius, 0, Math.PI * 2);
          context.strokeStyle =
            wake > 0.15
              ? `rgba(197, 154, 104, ${0.22 + wake * 0.38})`
              : "rgba(137, 194, 211, 0.16)";
          context.lineWidth = 0.75;
          context.stroke();
        } else if (wake > 0.04) {
          context.beginPath();
          context.arc(node.drawX, node.drawY, 6 + wake * 7, 0, Math.PI * 2);
          context.strokeStyle = `rgba(137, 194, 211, ${wake * 0.24})`;
          context.lineWidth = 0.75;
          context.stroke();
        }

        // Core node dot
        context.beginPath();
        context.arc(node.drawX, node.drawY, radius, 0, Math.PI * 2);
        context.fillStyle =
          isHub && wake > 0.2
            ? `rgba(218, 178, 130, ${0.45 + wake * 0.5})`
            : `rgba(148, 194, 207, ${0.32 + wake * 0.64})`;
        context.fill();

        // Topology / design label
        if (node.label) {
          context.font = '8px "JetBrains Mono Variable", monospace';
          context.textAlign = node.side === "left" ? "left" : "right";
          context.fillStyle =
            wake > 0.2
              ? `rgba(218, 178, 130, ${0.42 + wake * 0.48})`
              : `rgba(148, 176, 188, ${0.3 + wake * 0.48})`;
          context.fillText(
            node.label,
            node.drawX + (node.side === "left" ? 10 : -10),
            node.drawY - 8,
          );
        }
      });

      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    buildMap();
    window.addEventListener("resize", buildMap);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildMap);
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
