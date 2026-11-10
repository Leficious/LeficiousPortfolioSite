import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type TerrainPeak = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  amplitude: number;
  sigmaX: number;
  sigmaY: number;
  angle: number;
  phase: number;
  side: "left" | "right";
  label?: string;
  elevationText: string;
};

type SonarPulse = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  warm: boolean;
};

const pageLabels: Record<string, string[]> = {
  work: ["SUMMIT", "RIDGE", "BASIN", "CREST"],
  gallery: ["RELIEF", "STRATA", "CONTOUR", "APEX"],
  about: ["ORIGIN", "AXIS", "VANTAGE", "HORIZON"],
  project: ["ANCHOR", "THRESHOLD", "VECTOR", "BEACON"],
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

// Marching Squares edge lookup table (pairs of edges [e1, e2] for each of the 16 cell bitmasks)
// Edges: 0 = top (tl-tr), 1 = right (tr-br), 2 = bottom (bl-br), 3 = left (tl-bl)
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

const CONTOUR_LEVELS = [0.18, 0.30, 0.42, 0.55, 0.68, 0.82, 0.96];

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
      smoothY: -1000,
      lastPulseX: -1000,
      lastPulseY: -1000,
      active: false,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let contentLeft = 0;
    let contentRight = 0;
    let peaks: TerrainPeak[] = [];
    let pulses: SonarPulse[] = [];
    let lastAmbientPulseTime = 0;
    let frame = 0;

    const buildTopography = () => {
      const random = seededRandom(`${key}-${pathname}-topography`);
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      peaks = [];
      pulses = [];
      const contentWidth = Math.min(1152, width - 48);
      contentLeft = (width - contentWidth) / 2;
      contentRight = width - contentLeft;
      const available = Math.max(0, contentLeft - 20);
      if (!desktop.matches || available < 42) return;

      const peaksPerSide = Math.max(4, Math.min(7, Math.round(height / 155)));

      (["left", "right"] as const).forEach((side) => {
        const bandStart = side === "left" ? 24 : contentRight + 24;
        const bandEnd = side === "left" ? contentLeft - 24 : width - 24;
        const bandSpan = Math.max(20, bandEnd - bandStart);

        for (let i = 0; i < peaksPerSide; i += 1) {
          const baseX = bandStart + (0.2 + random() * 0.6) * bandSpan;
          const baseY = ((i + 0.25 + random() * 0.5) / peaksPerSide) * (height - 100) + 50;
          const amplitude = 0.72 + random() * 0.42;
          const sigmaX = Math.max(38, Math.min(95, bandSpan * (0.28 + random() * 0.22)));
          const sigmaY = 75 + random() * 65;
          const angle = (random() - 0.5) * 0.85;
          const elevMeters = Math.round((amplitude * 160) / 5) * 5;

          peaks.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            amplitude,
            sigmaX,
            sigmaY,
            angle,
            phase: random() * Math.PI * 2,
            side,
            elevationText: `+${elevMeters}M`,
          });
        }
      });

      const labelStep = Math.max(1, Math.floor(peaks.length / labels.length));
      labels.forEach((label, index) => {
        const peak = peaks[Math.min(peaks.length - 1, index * labelStep)];
        if (peak) peak.label = label;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!pointer.active) {
        pointer.smoothX = event.clientX;
        pointer.smoothY = event.clientY;
        pointer.lastPulseX = event.clientX;
        pointer.lastPulseY = event.clientY;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;

      // Spawn an echolocation sonar ripple when moving through or near the margins
      const inMarginBand =
        event.clientX < contentLeft + 90 || event.clientX > contentRight - 90;
      const moveDist = Math.hypot(
        event.clientX - pointer.lastPulseX,
        event.clientY - pointer.lastPulseY,
      );

      if (inMarginBand && moveDist > 72 && pulses.length < 7) {
        pointer.lastPulseX = event.clientX;
        pointer.lastPulseY = event.clientY;
        pulses.push({
          x: event.clientX,
          y: event.clientY,
          radius: 6,
          maxRadius: 230,
          speed: 2.3,
          warm: pulses.length % 2 === 1,
        });
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (pulses.length < 8) {
        pulses.push({
          x: event.clientX,
          y: event.clientY,
          radius: 4,
          maxRadius: 290,
          speed: 3.1,
          warm: true,
        });
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const t = time * 0.00055;
      const influence = 210;

      if (pointer.active) {
        pointer.smoothX += (pointer.x - pointer.smoothX) * 0.16;
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.16;
      }

      // Periodic ambient sonar pulse from a summit beacon so the terrain is always alive
      if (!reducedMotion.matches && peaks.length > 0 && time - lastAmbientPulseTime > 2800) {
        lastAmbientPulseTime = time;
        const sourcePeak = peaks[Math.floor((time * 0.001) % peaks.length)];
        if (sourcePeak && pulses.length < 6) {
          pulses.push({
            x: sourcePeak.x,
            y: sourcePeak.y,
            radius: 4,
            maxRadius: 220,
            speed: 1.55,
            warm: false,
          });
        }
      }

      // Update active sonar pulses
      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        pulses[i].radius += pulses[i].speed;
        if (pulses[i].radius >= pulses[i].maxRadius) {
          pulses.splice(i, 1);
        }
      }

      // Gently animate peak positions & mouse gravitational deflection
      peaks.forEach((peak) => {
        const driftX = !reducedMotion.matches ? Math.cos(t + peak.phase) * 7 : 0;
        const driftY = !reducedMotion.matches ? Math.sin(t * 0.85 + peak.phase) * 9 : 0;
        let px = peak.baseX + driftX;
        let py = peak.baseY + driftY;

        if (pointer.active) {
          const dx = px - pointer.smoothX;
          const dy = py - pointer.smoothY;
          const dist = Math.hypot(dx, dy);
          if (dist < influence && dist > 0.01) {
            const wake = 1 - dist / influence;
            const push = wake * wake * 18;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }
        peak.x = px;
        peak.y = py;
      });

      // Evaluate scalar elevation field and draw Marching Squares contour isolines per side
      const cellSize = 12;
      (["left", "right"] as const).forEach((side) => {
        const minX = side === "left" ? 6 : Math.max(contentRight - 8, width - contentLeft + 8);
        const maxX = side === "left" ? contentLeft + 8 : width - 6;
        if (maxX - minX < 36) return;

        const cols = Math.ceil((maxX - minX) / cellSize);
        const rows = Math.ceil(height / cellSize);
        const stride = cols + 1;
        const field = new Float32Array((cols + 1) * (rows + 1));
        const sidePeaks = peaks.filter((p) => p.side === side);

        for (let r = 0; r <= rows; r += 1) {
          const y = r * cellSize;
          for (let c = 0; c <= cols; c += 1) {
            const x = minX + c * cellSize;
            let val =
              0.08 *
              Math.sin(x * 0.018 + (side === "left" ? t : -t)) *
              Math.cos(y * 0.012 - t * 0.6);

            for (let k = 0; k < sidePeaks.length; k += 1) {
              const p = sidePeaks[k];
              const dx = x - p.x;
              const dy = y - p.y;
              // Rotated elliptical Gaussian peak
              const cosA = Math.cos(p.angle);
              const sinA = Math.sin(p.angle);
              const rx = dx * cosA - dy * sinA;
              const ry = dx * sinA + dy * cosA;
              const d2 = (rx * rx) / (p.sigmaX * p.sigmaX) + (ry * ry) / (p.sigmaY * p.sigmaY);
              if (d2 < 6.5) {
                val += p.amplitude * Math.exp(-d2);
              }
            }

            // Cursor 3D heightfield lens: warps and elevates contours smoothly under the pointer
            if (pointer.active) {
              const cdx = x - pointer.smoothX;
              const cdy = y - pointer.smoothY;
              const cd2 = cdx * cdx + cdy * cdy;
              if (cd2 < 32000) {
                // Ring ridge + central depression lens around cursor
                const norm = cd2 / 9500;
                val += 0.34 * norm * Math.exp(-norm * 0.85);
              }
            }

            field[r * stride + c] = val;
          }
        }

        // Batch base contour segments per level for fast rendering, and collect sonar-lit segments
        const hotSegments: {
          x1: number;
          y1: number;
          x2: number;
          y2: number;
          intensity: number;
          warm: boolean;
        }[] = [];

        CONTOUR_LEVELS.forEach((level, levelIdx) => {
          const isIndexContour = levelIdx % 2 === 1;
          context.beginPath();

          for (let r = 0; r < rows; r += 1) {
            const y0 = r * cellSize;
            const rowOffset = r * stride;
            const nextRowOffset = (r + 1) * stride;

            for (let c = 0; c < cols; c += 1) {
              const vTL = field[rowOffset + c];
              const vTR = field[rowOffset + c + 1];
              const vBR = field[nextRowOffset + c + 1];
              const vBL = field[nextRowOffset + c];

              let mask = 0;
              if (vTL >= level) mask |= 8;
              if (vTR >= level) mask |= 4;
              if (vBR >= level) mask |= 2;
              if (vBL >= level) mask |= 1;
              if (mask === 0 || mask === 15) continue;

              const pairs = MS_EDGES[mask];
              const x0 = minX + c * cellSize;

              for (let pIdx = 0; pIdx < pairs.length; pIdx += 1) {
                const [e1, e2] = pairs[pIdx];

                const getEdgePoint = (edge: number): [number, number] => {
                  if (edge === 0) {
                    const frac = (level - vTL) / (vTR - vTL || 1e-5);
                    return [x0 + Math.max(0, Math.min(1, frac)) * cellSize, y0];
                  }
                  if (edge === 1) {
                    const frac = (level - vTR) / (vBR - vTR || 1e-5);
                    return [x0 + cellSize, y0 + Math.max(0, Math.min(1, frac)) * cellSize];
                  }
                  if (edge === 2) {
                    const frac = (level - vBL) / (vBR - vBL || 1e-5);
                    return [x0 + Math.max(0, Math.min(1, frac)) * cellSize, y0 + cellSize];
                  }
                  const frac = (level - vTL) / (vBL - vTL || 1e-5);
                  return [x0, y0 + Math.max(0, Math.min(1, frac)) * cellSize];
                };

                const [x1, y1] = getEdgePoint(e1);
                const [x2, y2] = getEdgePoint(e2);

                context.moveTo(x1, y1);
                context.lineTo(x2, y2);

                // Check if this contour segment is illuminated by the cursor or an expanding sonar wave
                const midX = (x1 + x2) * 0.5;
                const midY = (y1 + y2) * 0.5;
                let maxGlow = 0;
                let glowWarm = false;

                if (pointer.active) {
                  const pDist = Math.hypot(midX - pointer.smoothX, midY - pointer.smoothY);
                  if (pDist < 145) {
                    maxGlow = (1 - pDist / 145) * 0.72;
                  }
                }

                for (let s = 0; s < pulses.length; s += 1) {
                  const pulse = pulses[s];
                  const sDist = Math.hypot(midX - pulse.x, midY - pulse.y);
                  const ringDiff = Math.abs(sDist - pulse.radius);
                  if (ringDiff < 22) {
                    const life = 1 - pulse.radius / pulse.maxRadius;
                    const waveGlow = (1 - ringDiff / 22) * life * 0.95;
                    if (waveGlow > maxGlow) {
                      maxGlow = waveGlow;
                      glowWarm = pulse.warm;
                    }
                  }
                }

                if (maxGlow > 0.14) {
                  hotSegments.push({ x1, y1, x2, y2, intensity: maxGlow, warm: glowWarm });
                }
              }
            }
          }

          context.strokeStyle = isIndexContour
            ? "rgba(134, 178, 196, 0.20)"
            : "rgba(118, 158, 176, 0.105)";
          context.lineWidth = isIndexContour ? 0.95 : 0.65;
          context.stroke();
        });

        // Draw sonar-illuminated & cursor-lit contour segments
        for (let h = 0; h < hotSegments.length; h += 1) {
          const seg = hotSegments[h];
          context.beginPath();
          context.moveTo(seg.x1, seg.y1);
          context.lineTo(seg.x2, seg.y2);
          context.strokeStyle = seg.warm
            ? `rgba(214, 174, 122, ${seg.intensity * 0.85})`
            : `rgba(152, 220, 240, ${seg.intensity * 0.85})`;
          context.lineWidth = 1.25;
          context.stroke();
        }
      });

      // Draw expanding echolocation sonar wave rings
      pulses.forEach((pulse) => {
        const life = 1 - pulse.radius / pulse.maxRadius;
        context.beginPath();
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        context.strokeStyle = pulse.warm
          ? `rgba(197, 154, 104, ${life * 0.24})`
          : `rgba(142, 208, 226, ${life * 0.22})`;
        context.lineWidth = 0.85;
        context.stroke();
      });

      // Draw topographic summit beacons, crosshairs, and surveyor elevation callouts
      peaks.forEach((peak) => {
        const pDist = pointer.active
          ? Math.hypot(peak.x - pointer.smoothX, peak.y - pointer.smoothY)
          : 999;
        let wake = Math.max(0, 1 - pDist / influence);

        for (let s = 0; s < pulses.length; s += 1) {
          const pulse = pulses[s];
          const ringDiff = Math.abs(Math.hypot(peak.x - pulse.x, peak.y - pulse.y) - pulse.radius);
          if (ringDiff < 32) {
            const life = 1 - pulse.radius / pulse.maxRadius;
            wake = Math.max(wake, (1 - ringDiff / 32) * life);
          }
        }

        // Surveyor summit crosshair
        const arm = 3.5 + wake * 3.5;
        context.beginPath();
        context.moveTo(peak.x - arm, peak.y);
        context.lineTo(peak.x + arm, peak.y);
        context.moveTo(peak.x, peak.y - arm);
        context.lineTo(peak.x, peak.y + arm);
        context.strokeStyle =
          wake > 0.15
            ? `rgba(214, 174, 122, ${0.42 + wake * 0.5})`
            : "rgba(148, 194, 207, 0.34)";
        context.lineWidth = 0.85;
        context.stroke();

        // Summit pinpoint ring
        context.beginPath();
        context.arc(peak.x, peak.y, 1.5 + wake * 1.5, 0, Math.PI * 2);
        context.fillStyle =
          wake > 0.15
            ? `rgba(218, 178, 130, ${0.55 + wake * 0.45})`
            : "rgba(148, 194, 207, 0.45)";
        context.fill();

        // Elevation / spatial callout on labeled peaks
        if (peak.label || wake > 0.2) {
          context.font = '8px "JetBrains Mono Variable", monospace';
          context.textAlign = peak.side === "left" ? "left" : "right";
          const offsetX = peak.side === "left" ? 8 : -8;
          const displayLabel = peak.label
            ? `${peak.label} ${peak.elevationText}`
            : peak.elevationText;
          context.fillStyle =
            wake > 0.15
              ? `rgba(218, 178, 130, ${0.38 + wake * 0.52})`
              : "rgba(148, 176, 188, 0.30)";
          context.fillText(displayLabel, peak.x + offsetX, peak.y - 6);
        }
      });

      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    buildTopography();
    window.addEventListener("resize", buildTopography);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildTopography);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
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
