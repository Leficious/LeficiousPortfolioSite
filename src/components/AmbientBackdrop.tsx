import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type MapNode = {
  x: number;
  y: number;
  drawX: number;
  drawY: number;
  side: "left" | "right";
  label?: string;
  phase: number;
};

type MapEdge = {
  from: number;
  to: number;
  phase: number;
};

const pageLabels: Record<string, string[]> = {
  work: ["INPUT", "STATE", "FEEDBACK", "OUTPUT"],
  gallery: ["SOURCE", "LAYER", "FRAME", "ARCHIVE"],
  about: ["DESIGN", "CODE", "ART", "PLAY"],
  project: ["RULE", "TUNE", "TEST", "RESULT"],
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
    const pointer = { x: -1000, y: -1000, active: false };
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: MapNode[] = [];
    let edges: MapEdge[] = [];
    let frame = 0;

    const buildMap = () => {
      const random = seededRandom(`${key}-ambient-map`);
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
      const contentLeft = (width - contentWidth) / 2;
      const contentRight = width - contentLeft;
      const available = Math.max(0, contentLeft - 24);
      if (!desktop.matches || available < 42) return;

      const countPerSide = Math.max(5, Math.min(14, Math.round(available / 17)));
      (["left", "right"] as const).forEach((side) => {
        for (let index = 0; index < countPerSide; index += 1) {
          const edgePadding = 20;
          const bandStart = side === "left" ? edgePadding : contentRight + 18;
          const bandEnd = side === "left" ? contentLeft - 18 : width - edgePadding;
          const x = bandStart + random() * Math.max(1, bandEnd - bandStart);
          const y = 38 + random() * Math.max(1, height - 76);
          nodes.push({ x, y, drawX: x, drawY: y, side, phase: random() });
        }
      });

      const labelStep = Math.max(1, Math.floor(nodes.length / labels.length));
      labels.forEach((label, index) => {
        const node = nodes[Math.min(nodes.length - 1, index * labelStep + (index % 2))];
        if (node) node.label = label;
      });

      nodes.forEach((node, nodeIndex) => {
        const candidates = nodes
          .map((candidate, candidateIndex) => ({
            candidate,
            candidateIndex,
            distance: Math.hypot(candidate.x - node.x, candidate.y - node.y),
          }))
          .filter(({ candidate, candidateIndex, distance }) => candidate.side === node.side && candidateIndex > nodeIndex && distance < 270)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 2);
        candidates.forEach(({ candidateIndex }) => edges.push({ from: nodeIndex, to: candidateIndex, phase: random() }));
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };
    const onPointerLeave = () => { pointer.active = false; };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const influence = 190;

      nodes.forEach((node) => {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const distance = pointer.active ? Math.hypot(dx, dy) : influence + 1;
        const wake = Math.max(0, 1 - distance / influence);
        const push = wake * wake * 16;
        const targetX = node.x + (distance > 0 ? (dx / distance) * push : 0);
        const targetY = node.y + (distance > 0 ? (dy / distance) * push : 0);
        node.drawX += (targetX - node.drawX) * 0.12;
        node.drawY += (targetY - node.drawY) * 0.12;
      });

      edges.forEach((edge) => {
        const from = nodes[edge.from];
        const to = nodes[edge.to];
        if (!from || !to) return;
        const wakeFrom = pointer.active ? Math.max(0, 1 - Math.hypot(from.drawX - pointer.x, from.drawY - pointer.y) / influence) : 0;
        const wakeTo = pointer.active ? Math.max(0, 1 - Math.hypot(to.drawX - pointer.x, to.drawY - pointer.y) / influence) : 0;
        const wake = Math.max(wakeFrom, wakeTo);

        context.beginPath();
        context.moveTo(from.drawX, from.drawY);
        context.lineTo(to.drawX, to.drawY);
        context.strokeStyle = `rgba(126, 166, 182, ${0.09 + wake * 0.28})`;
        context.lineWidth = wake > 0.1 ? 1 : 0.65;
        context.stroke();

        if (wake > 0.08 && !reducedMotion.matches) {
          const progress = (time * 0.00032 + edge.phase) % 1;
          const pulseX = from.drawX + (to.drawX - from.drawX) * progress;
          const pulseY = from.drawY + (to.drawY - from.drawY) * progress;
          context.beginPath();
          context.arc(pulseX, pulseY, 1.4 + wake, 0, Math.PI * 2);
          context.fillStyle = `rgba(142, 208, 226, ${0.25 + wake * 0.6})`;
          context.fill();
        }
      });

      nodes.forEach((node) => {
        const distance = pointer.active ? Math.hypot(node.drawX - pointer.x, node.drawY - pointer.y) : influence + 1;
        const wake = Math.max(0, 1 - distance / influence);
        const radius = 1.4 + wake * 2.7;
        context.beginPath();
        context.arc(node.drawX, node.drawY, radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(148, 194, 207, ${0.22 + wake * 0.72})`;
        context.fill();

        if (wake > 0.04) {
          context.beginPath();
          context.arc(node.drawX, node.drawY, 7 + wake * 7, 0, Math.PI * 2);
          context.strokeStyle = `rgba(137, 194, 211, ${wake * 0.22})`;
          context.lineWidth = 0.75;
          context.stroke();
        }

        if (node.label) {
          context.font = '8px "JetBrains Mono", monospace';
          context.textAlign = node.side === "left" ? "left" : "right";
          context.fillStyle = `rgba(148, 176, 188, ${0.22 + wake * 0.56})`;
          context.fillText(node.label, node.drawX + (node.side === "left" ? 9 : -9), node.drawY - 8);
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
