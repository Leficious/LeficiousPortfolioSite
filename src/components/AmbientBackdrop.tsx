import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type StaticPeak = {
  x: number;
  y: number;
  amplitude: number;
  cosA: number;
  sinA: number;
  invSX2: number;
  invSY2: number;
  reach: number;
};

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

const MS_EDGES: number[][][] = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[0, 1]],
  [[0, 3], [2, 1]],
  [[0, 2]],
  [[0, 3]],
  [[0, 3]],
  [[0, 2]],
  [[0, 1], [3, 2]],
  [[0, 1]],
  [[3, 1]],
  [[2, 1]],
  [[3, 2]],
  [],
];

const CONTOUR_LEVELS = [0.22, 0.36, 0.5, 0.65, 0.8];

/**
 * Quiet, static architectural contour relief in wide desktop gutters.
 * Renders once on mount/resize — zero animation loop, zero cursor tracking,
 * zero sonar pulses, and zero HUD labels.
 */
export function AmbientBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const desktop = window.matchMedia("(min-width: 1280px)");
    const cellSize = 16;

    const renderStaticContours = () => {
      if (!desktop.matches) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const contentWidth = Math.min(1152, width - 48);
      const contentLeft = (width - contentWidth) / 2;
      const contentRight = width - contentLeft;
      if (contentLeft < 60) return;

      const cleanRoute = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
      const random = seededRandom(`contour-${cleanRoute}`);
      const peaksPerSide = 4;
      const rows = Math.ceil(height / cellSize);

      (["left", "right"] as const).forEach((side) => {
        const minX = side === "left" ? 0 : Math.max(contentRight - 16, width - contentLeft);
        const maxX = side === "left" ? contentLeft + 16 : width;
        if (maxX - minX < 40) return;

        const cols = Math.ceil((maxX - minX) / cellSize);
        const stride = cols + 1;
        const field = new Float32Array((rows + 1) * stride);

        const peaks: StaticPeak[] = [];
        for (let i = 0; i < peaksPerSide; i += 1) {
          const x = minX + (0.18 + random() * 0.64) * (maxX - minX);
          const y = ((i + 0.2 + random() * 0.55) / peaksPerSide) * (height * 0.85) + 32;
          const amplitude = 0.72 + random() * 0.36;
          const sigmaX = Math.max(48, (maxX - minX) * (0.34 + random() * 0.22));
          const sigmaY = 95 + random() * 75;
          const angle = (random() - 0.5) * 0.75;
          peaks.push({
            x,
            y,
            amplitude,
            cosA: Math.cos(angle),
            sinA: Math.sin(angle),
            invSX2: 1 / (sigmaX * sigmaX),
            invSY2: 1 / (sigmaY * sigmaY),
            reach: Math.max(sigmaX, sigmaY) * 2.5,
          });
        }

        for (let r = 0; r <= rows; r += 1) {
          const y = r * cellSize;
          const rowOff = r * stride;
          for (let c = 0; c <= cols; c += 1) {
            const x = minX + c * cellSize;
            field[rowOff + c] = 0.06 * Math.sin(x * 0.014) * Math.cos(y * 0.011);
          }
        }

        for (const p of peaks) {
          const c0 = Math.max(0, Math.floor((p.x - p.reach - minX) / cellSize));
          const c1 = Math.min(cols, Math.ceil((p.x + p.reach - minX) / cellSize));
          const r0 = Math.max(0, Math.floor((p.y - p.reach) / cellSize));
          const r1 = Math.min(rows, Math.ceil((p.y + p.reach) / cellSize));

          for (let r = r0; r <= r1; r += 1) {
            const dy = r * cellSize - p.y;
            const rowOff = r * stride;
            for (let c = c0; c <= c1; c += 1) {
              const dx = minX + c * cellSize - p.x;
              const rx = dx * p.cosA - dy * p.sinA;
              const ry = dx * p.sinA + dy * p.cosA;
              const d2 = rx * rx * p.invSX2 + ry * ry * p.invSY2;
              if (d2 < 6.2) {
                field[rowOff + c] += p.amplitude * Math.exp(-d2);
              }
            }
          }
        }

        CONTOUR_LEVELS.forEach((level, levelIdx) => {
          const isIndex = levelIdx === 1 || levelIdx === 3;
          context.beginPath();

          for (let r = 0; r < rows; r += 1) {
            const y0 = r * cellSize;
            const rowOff = r * stride;
            const nextOff = (r + 1) * stride;

            for (let c = 0; c < cols; c += 1) {
              const vTL = field[rowOff + c];
              const vTR = field[rowOff + c + 1];
              const vBR = field[nextOff + c + 1];
              const vBL = field[nextOff + c];

              let mask = 0;
              if (vTL >= level) mask |= 8;
              if (vTR >= level) mask |= 4;
              if (vBR >= level) mask |= 2;
              if (vBL >= level) mask |= 1;
              if (mask === 0 || mask === 15) continue;

              const x0 = minX + c * cellSize;
              for (const [e1, e2] of MS_EDGES[mask]) {
                const interp = (edge: number): [number, number] => {
                  if (edge === 0) {
                    const f = Math.max(0, Math.min(1, (level - vTL) / (vTR - vTL || 1e-5)));
                    return [x0 + f * cellSize, y0];
                  }
                  if (edge === 1) {
                    const f = Math.max(0, Math.min(1, (level - vTR) / (vBR - vTR || 1e-5)));
                    return [x0 + cellSize, y0 + f * cellSize];
                  }
                  if (edge === 2) {
                    const f = Math.max(0, Math.min(1, (level - vBL) / (vBR - vBL || 1e-5)));
                    return [x0 + f * cellSize, y0 + cellSize];
                  }
                  const f = Math.max(0, Math.min(1, (level - vTL) / (vBL - vTL || 1e-5)));
                  return [x0, y0 + f * cellSize];
                };
                const [x1, y1] = interp(e1);
                const [x2, y2] = interp(e2);
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
              }
            }
          }

          context.strokeStyle = isIndex
            ? "rgba(197, 154, 104, 0.11)"
            : "rgba(236, 238, 239, 0.068)";
          context.lineWidth = isIndex ? 0.9 : 0.7;
          context.stroke();
        });
      });
    };

    renderStaticContours();
    window.addEventListener("resize", renderStaticContours);
    return () => window.removeEventListener("resize", renderStaticContours);
  }, [pathname]);

  return (
    <div aria-hidden="true" className="ambient-backdrop">
      <canvas ref={canvasRef} className="ambient-backdrop__map" />
    </div>
  );
}
