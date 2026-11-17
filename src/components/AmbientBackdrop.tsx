import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type TerrainPeak = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  amplitude: number;
  cosA: number;
  sinA: number;
  invSX2: number;
  invSY2: number;
  reach: number;
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
  const clean = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  if (clean.startsWith("/gallery")) return "gallery";
  if (clean.startsWith("/about")) return "about";
  if (clean.startsWith("/projects/")) return "project";
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

const CONTOUR_LEVELS = [0.18, 0.3, 0.42, 0.55, 0.68, 0.82, 0.96];
const HOT_STYLES = [
  "rgba(152, 220, 240, 0.34)",
  "rgba(152, 220, 240, 0.68)",
  "rgba(214, 174, 122, 0.34)",
  "rgba(214, 174, 122, 0.68)",
] as const;

export function AmbientBackdrop({ paused = false }: { paused?: boolean }) {
  const glowOrbRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const { pathname } = useLocation();

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // GPU-composited pointer glow orb (translate3d only, zero CSS gradient repaints)
  useEffect(() => {
    const desktopPointer = window.matchMedia("(min-width: 1280px) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktopPointer.matches || reducedMotion.matches) return;

    let frame = 0;
    let latestX = window.innerWidth * 0.5;
    let latestY = window.innerHeight * 0.38;

    const commit = () => {
      frame = 0;
      if (glowOrbRef.current) {
        glowOrbRef.current.style.transform = `translate3d(${(latestX - 380).toFixed(1)}px, ${(latestY - 380).toFixed(1)}px, 0)`;
      }
    };

    const trackPointer = (event: PointerEvent) => {
      latestX = event.clientX;
      latestY = event.clientY;
      if (!frame) {
        frame = window.requestAnimationFrame(commit);
      }
    };

    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
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

    const key = routeKey(pathname);
    const labels = pageLabels[key];
    const cellSize = 18;

    const pointer = {
      x: -1000,
      y: -1000,
      smoothX: -1000,
      smoothY: -1000,
      lastPulseX: -1000,
      lastPulseY: -1000,
      lastMoveTime: -9999,
      active: false,
    };

    let width = 0;
    let height = 0;
    let contentLeft = 0;
    let contentRight = 0;
    let leftPeaks: TerrainPeak[] = [];
    let rightPeaks: TerrainPeak[] = [];
    let allPeaks: TerrainPeak[] = [];
    let pulses: SonarPulse[] = [];
    let lastAmbientPulseTime = 0;
    let lastDrawTime = 0;
    let frame = 0;

    // Reusable typed buffers so draw() allocates zero objects per frame
    let fieldBuf = new Float32Array(4096);
    let sinXBuf = new Float32Array(256);
    let cosYBuf = new Float32Array(256);
    const hotBins = [
      new Float32Array(2048),
      new Float32Array(2048),
      new Float32Array(2048),
      new Float32Array(2048),
    ];
    const hotCounts = [0, 0, 0, 0];

    const pushHot = (bin: number, x1: number, y1: number, x2: number, y2: number) => {
      let buf = hotBins[bin];
      const idx = hotCounts[bin];
      if (idx + 4 > buf.length) {
        const grown = new Float32Array(buf.length * 2);
        grown.set(buf);
        hotBins[bin] = grown;
        buf = grown;
      }
      buf[idx] = x1;
      buf[idx + 1] = y1;
      buf[idx + 2] = x2;
      buf[idx + 3] = y2;
      hotCounts[bin] = idx + 4;
    };

    const buildTopography = () => {
      const random = seededRandom(`${key}-${pathname}-topography`);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);

      leftPeaks = [];
      rightPeaks = [];
      allPeaks = [];
      pulses = [];

      const contentWidth = Math.min(1152, width - 48);
      contentLeft = (width - contentWidth) / 2;
      contentRight = width - contentLeft;
      const available = Math.max(0, contentLeft - 20);
      if (!desktop.matches || available < 42) return;

      const maxCols = Math.ceil((contentLeft + 16) / cellSize) + 2;
      const maxRows = Math.ceil(height / cellSize) + 2;
      const needed = maxCols * maxRows;
      if (fieldBuf.length < needed) fieldBuf = new Float32Array(needed);
      if (sinXBuf.length < maxCols) sinXBuf = new Float32Array(maxCols);
      if (cosYBuf.length < maxRows) cosYBuf = new Float32Array(maxRows);

      const peaksPerSide = Math.max(4, Math.min(6, Math.round(height / 170)));

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

          const peak: TerrainPeak = {
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            amplitude,
            cosA: Math.cos(angle),
            sinA: Math.sin(angle),
            invSX2: 1 / (sigmaX * sigmaX),
            invSY2: 1 / (sigmaY * sigmaY),
            reach: Math.max(sigmaX, sigmaY) * 2.55,
            phase: random() * Math.PI * 2,
            side,
            elevationText: `+${elevMeters}M`,
          };
          allPeaks.push(peak);
          if (side === "left") leftPeaks.push(peak);
          else rightPeaks.push(peak);
        }
      });

      const labelStep = Math.max(1, Math.floor(allPeaks.length / labels.length));
      labels.forEach((label, index) => {
        const peak = allPeaks[Math.min(allPeaks.length - 1, index * labelStep)];
        if (peak) peak.label = label;
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      pointer.lastMoveTime = now;
      if (!pointer.active) {
        pointer.smoothX = event.clientX;
        pointer.smoothY = event.clientY;
        pointer.lastPulseX = event.clientX;
        pointer.lastPulseY = event.clientY;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;

      const inMarginBand =
        event.clientX < contentLeft + 90 || event.clientX > contentRight - 90;
      const dx = event.clientX - pointer.lastPulseX;
      const dy = event.clientY - pointer.lastPulseY;

      if (inMarginBand && dx * dx + dy * dy > 5184 && pulses.length < 6) {
        pointer.lastPulseX = event.clientX;
        pointer.lastPulseY = event.clientY;
        pulses.push({
          x: event.clientX,
          y: event.clientY,
          radius: 6,
          maxRadius: 230,
          speed: 2.4,
          warm: pulses.length % 2 === 1,
        });
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      pointer.lastMoveTime = performance.now();
      if (pulses.length < 7) {
        pulses.push({
          x: event.clientX,
          y: event.clientY,
          radius: 4,
          maxRadius: 280,
          speed: 3.2,
          warm: true,
        });
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const draw = (time: number) => {
      if (document.hidden) {
        frame = 0;
        return;
      }

      if (pausedRef.current) {
        frame = window.requestAnimationFrame(draw);
        return;
      }

      // Adaptive frame pacing: ~60fps when interactive/rippling, ~20fps during quiet ambient drift
      const recentlyMoved = time - pointer.lastMoveTime < 280;
      const minDelta = recentlyMoved || pulses.length > 0 ? 15.5 : 48;
      const dtMs = time - lastDrawTime;
      if (lastDrawTime > 0 && dtMs < minDelta) {
        if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
        return;
      }
      const stepScale = lastDrawTime > 0 ? Math.min(3, dtMs / 16.667) : 1;
      lastDrawTime = time;

      context.clearRect(0, 0, width, height);
      if (allPeaks.length === 0) {
        if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
        return;
      }

      const t = time * 0.00055;
      const influence = 210;

      if (pointer.active) {
        const alpha = 1 - Math.pow(0.84, stepScale);
        pointer.smoothX += (pointer.x - pointer.smoothX) * alpha;
        pointer.smoothY += (pointer.y - pointer.smoothY) * alpha;
      }

      if (!reducedMotion.matches && time - lastAmbientPulseTime > 3200) {
        lastAmbientPulseTime = time;
        const sourcePeak = allPeaks[Math.floor((time * 0.001) % allPeaks.length)];
        if (sourcePeak && pulses.length < 5) {
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

      for (let i = pulses.length - 1; i >= 0; i -= 1) {
        pulses[i].radius += pulses[i].speed * stepScale;
        if (pulses[i].radius >= pulses[i].maxRadius) {
          pulses.splice(i, 1);
        }
      }

      for (let i = 0; i < allPeaks.length; i += 1) {
        const peak = allPeaks[i];
        const driftX = !reducedMotion.matches ? Math.cos(t + peak.phase) * 7 : 0;
        const driftY = !reducedMotion.matches ? Math.sin(t * 0.85 + peak.phase) * 9 : 0;
        let px = peak.baseX + driftX;
        let py = peak.baseY + driftY;

        if (pointer.active) {
          const dx = px - pointer.smoothX;
          const dy = py - pointer.smoothY;
          const d2 = dx * dx + dy * dy;
          if (d2 < 44100 && d2 > 0.001) {
            const dist = Math.sqrt(d2);
            const wake = 1 - dist / influence;
            const push = wake * wake * 18;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }
        }
        peak.x = px;
        peak.y = py;
      }

      const rows = Math.ceil(height / cellSize);
      for (let r = 0; r <= rows; r += 1) {
        cosYBuf[r] = Math.cos(r * cellSize * 0.012 - t * 0.6);
      }

      (["left", "right"] as const).forEach((side) => {
        const minX = side === "left" ? 6 : Math.max(contentRight - 8, width - contentLeft + 8);
        const maxX = side === "left" ? contentLeft + 8 : width - 6;
        if (maxX - minX < 36) return;

        const cols = Math.ceil((maxX - minX) / cellSize);
        const stride = cols + 1;
        const sidePeaks = side === "left" ? leftPeaks : rightPeaks;
        const phaseSign = side === "left" ? t : -t;

        for (let c = 0; c <= cols; c += 1) {
          sinXBuf[c] = 0.08 * Math.sin((minX + c * cellSize) * 0.018 + phaseSign);
        }

        // Base ambient wave (1 multiply per grid vertex, zero inner trig)
        for (let r = 0; r <= rows; r += 1) {
          const cy = cosYBuf[r];
          const rowOff = r * stride;
          for (let c = 0; c <= cols; c += 1) {
            fieldBuf[rowOff + c] = sinXBuf[c] * cy;
          }
        }

        // Accumulate each Gaussian peak strictly inside its tight bounding box
        for (let k = 0; k < sidePeaks.length; k += 1) {
          const p = sidePeaks[k];
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
              if (d2 < 6.5) {
                fieldBuf[rowOff + c] += p.amplitude * Math.exp(-d2);
              }
            }
          }
        }

        // Cursor heightfield lens strictly inside 180px box if pointer is near this side
        if (pointer.active && pointer.smoothX > minX - 185 && pointer.smoothX < maxX + 185) {
          const c0 = Math.max(0, Math.floor((pointer.smoothX - 180 - minX) / cellSize));
          const c1 = Math.min(cols, Math.ceil((pointer.smoothX + 180 - minX) / cellSize));
          const r0 = Math.max(0, Math.floor((pointer.smoothY - 180) / cellSize));
          const r1 = Math.min(rows, Math.ceil((pointer.smoothY + 180) / cellSize));
          for (let r = r0; r <= r1; r += 1) {
            const cdy = r * cellSize - pointer.smoothY;
            const cdy2 = cdy * cdy;
            const rowOff = r * stride;
            for (let c = c0; c <= c1; c += 1) {
              const cdx = minX + c * cellSize - pointer.smoothX;
              const cd2 = cdx * cdx + cdy2;
              if (cd2 < 32000) {
                const norm = cd2 / 9500;
                fieldBuf[rowOff + c] += 0.34 * norm * Math.exp(-norm * 0.85);
              }
            }
          }
        }

        hotCounts[0] = 0;
        hotCounts[1] = 0;
        hotCounts[2] = 0;
        hotCounts[3] = 0;

        const pointerNearSide =
          pointer.active && pointer.smoothX > minX - 150 && pointer.smoothX < maxX + 150;
        const pulseCount = pulses.length;

        for (let levelIdx = 0; levelIdx < CONTOUR_LEVELS.length; levelIdx += 1) {
          const level = CONTOUR_LEVELS[levelIdx];
          const isIndexContour = levelIdx % 2 === 1;
          context.beginPath();

          for (let r = 0; r < rows; r += 1) {
            const y0 = r * cellSize;
            const rowOffset = r * stride;
            const nextRowOffset = (r + 1) * stride;

            for (let c = 0; c < cols; c += 1) {
              const vTL = fieldBuf[rowOffset + c];
              const vTR = fieldBuf[rowOffset + c + 1];
              const vBR = fieldBuf[nextRowOffset + c + 1];
              const vBL = fieldBuf[nextRowOffset + c];

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

                let x1 = x0;
                let y1 = y0;
                if (e1 === 0) {
                  const frac = (level - vTL) / (vTR - vTL || 1e-5);
                  x1 = x0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                } else if (e1 === 1) {
                  const frac = (level - vTR) / (vBR - vTR || 1e-5);
                  x1 = x0 + cellSize;
                  y1 = y0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                } else if (e1 === 2) {
                  const frac = (level - vBL) / (vBR - vBL || 1e-5);
                  x1 = x0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                  y1 = y0 + cellSize;
                } else {
                  const frac = (level - vTL) / (vBL - vTL || 1e-5);
                  y1 = y0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                }

                let x2 = x0;
                let y2 = y0;
                if (e2 === 0) {
                  const frac = (level - vTL) / (vTR - vTL || 1e-5);
                  x2 = x0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                } else if (e2 === 1) {
                  const frac = (level - vTR) / (vBR - vTR || 1e-5);
                  x2 = x0 + cellSize;
                  y2 = y0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                } else if (e2 === 2) {
                  const frac = (level - vBL) / (vBR - vBL || 1e-5);
                  x2 = x0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                  y2 = y0 + cellSize;
                } else {
                  const frac = (level - vTL) / (vBL - vTL || 1e-5);
                  y2 = y0 + (frac < 0 ? 0 : frac > 1 ? 1 : frac) * cellSize;
                }

                context.moveTo(x1, y1);
                context.lineTo(x2, y2);

                if (!pointerNearSide && pulseCount === 0) continue;

                const midX = (x1 + x2) * 0.5;
                const midY = (y1 + y2) * 0.5;
                let maxGlow = 0;
                let glowWarm = false;

                if (pointerNearSide) {
                  const pdx = midX - pointer.smoothX;
                  const pdy = midY - pointer.smoothY;
                  if (Math.abs(pdx) < 145 && Math.abs(pdy) < 145) {
                    const pDist2 = pdx * pdx + pdy * pdy;
                    if (pDist2 < 21025) {
                      maxGlow = (1 - Math.sqrt(pDist2) / 145) * 0.72;
                    }
                  }
                }

                for (let s = 0; s < pulseCount; s += 1) {
                  const pulse = pulses[s];
                  const reachR = pulse.radius + 22;
                  const sdx = midX - pulse.x;
                  const sdy = midY - pulse.y;
                  if (Math.abs(sdx) > reachR || Math.abs(sdy) > reachR) continue;
                  const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
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

                if (maxGlow > 0.16) {
                  const bin = (glowWarm ? 2 : 0) + (maxGlow > 0.45 ? 1 : 0);
                  pushHot(bin, x1, y1, x2, y2);
                }
              }
            }
          }

          context.strokeStyle = isIndexContour
            ? "rgba(134, 178, 196, 0.20)"
            : "rgba(118, 158, 176, 0.105)";
          context.lineWidth = isIndexContour ? 0.95 : 0.65;
          context.stroke();
        }

        // Draw all illuminated contour segments in 4 batched stroke calls total
        context.lineWidth = 1.25;
        for (let bin = 0; bin < 4; bin += 1) {
          const count = hotCounts[bin];
          if (count === 0) continue;
          const buf = hotBins[bin];
          context.beginPath();
          for (let idx = 0; idx < count; idx += 4) {
            context.moveTo(buf[idx], buf[idx + 1]);
            context.lineTo(buf[idx + 2], buf[idx + 3]);
          }
          context.strokeStyle = HOT_STYLES[bin];
          context.stroke();
        }
      });

      // Draw expanding sonar wave rings
      for (let i = 0; i < pulses.length; i += 1) {
        const pulse = pulses[i];
        const life = 1 - pulse.radius / pulse.maxRadius;
        context.beginPath();
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        context.strokeStyle = pulse.warm
          ? `rgba(197, 154, 104, ${(life * 0.24).toFixed(3)})`
          : `rgba(142, 208, 226, ${(life * 0.22).toFixed(3)})`;
        context.lineWidth = 0.85;
        context.stroke();
      }

      // Draw summit beacons and surveyor elevation callouts
      context.font = '8px "JetBrains Mono Variable", monospace';
      for (let i = 0; i < allPeaks.length; i += 1) {
        const peak = allPeaks[i];
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

        const arm = 3.5 + wake * 3.5;
        context.beginPath();
        context.moveTo(peak.x - arm, peak.y);
        context.lineTo(peak.x + arm, peak.y);
        context.moveTo(peak.x, peak.y - arm);
        context.lineTo(peak.x, peak.y + arm);
        context.strokeStyle =
          wake > 0.15
            ? `rgba(214, 174, 122, ${(0.42 + wake * 0.5).toFixed(2)})`
            : "rgba(148, 194, 207, 0.34)";
        context.lineWidth = 0.85;
        context.stroke();

        context.beginPath();
        context.arc(peak.x, peak.y, 1.5 + wake * 1.5, 0, Math.PI * 2);
        context.fillStyle =
          wake > 0.15
            ? `rgba(218, 178, 130, ${(0.55 + wake * 0.45).toFixed(2)})`
            : "rgba(148, 194, 207, 0.45)";
        context.fill();

        if (peak.label || wake > 0.2) {
          context.textAlign = peak.side === "left" ? "left" : "right";
          const offsetX = peak.side === "left" ? 8 : -8;
          const displayLabel = peak.label
            ? `${peak.label} ${peak.elevationText}`
            : peak.elevationText;
          context.fillStyle =
            wake > 0.15
              ? `rgba(218, 178, 130, ${(0.38 + wake * 0.52).toFixed(2)})`
              : "rgba(148, 176, 188, 0.30)";
          context.fillText(displayLabel, peak.x + offsetX, peak.y - 6);
        }
      }

      if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      } else if (!reducedMotion.matches && !frame) {
        lastDrawTime = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };

    buildTopography();
    window.addEventListener("resize", buildTopography);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    frame = window.requestAnimationFrame(draw);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildTopography);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="ambient-backdrop">
      <div className="ambient-backdrop__pattern" />
      <div className="ambient-backdrop__glow">
        <div ref={glowOrbRef} className="ambient-backdrop__glow-orb" />
      </div>
      <canvas key={pathname} ref={canvasRef} className="ambient-backdrop__map" />
    </div>
  );
}
