import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LamplightDustCanvas } from "./AtelierMotion";

type SurveyPeak = {
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
  bearingText: string;
};

type AstrolabePulse = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  crimson: boolean;
};

const ROUTE_SURVEY_LABELS: Record<string, string[]> = {
  atelier: ["MERIDIAN", "ZENITH", "APOGEE", "SOLSTICE"],
  gallery: ["RELIEF", "STRATA", "CONTOUR", "QUADRANT"],
  about: ["ORIGIN", "AXIS", "VANTAGE", "EQUINOX"],
  project: ["ANCHOR", "THRESHOLD", "AZIMUTH", "BEACON"],
};

const ROMAN_BEARINGS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

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

const CONTOUR_LEVELS = [0.18, 0.31, 0.44, 0.58, 0.72, 0.88];
const HOT_STYLES = [
  "rgba(232, 192, 124, 0.44)",
  "rgba(255, 228, 168, 0.88)",
  "rgba(186, 42, 42, 0.48)",
  "rgba(228, 66, 58, 0.86)",
] as const;

const OUTER_TICKS = Array.from({ length: 72 }, (_, idx) => {
  const deg = idx * 5;
  const rad = (deg * Math.PI) / 180;
  const major = deg % 30 === 0;
  const mid = deg % 15 === 0;
  const r1 = major ? 404 : mid ? 412 : 417;
  const r2 = 424;
  return {
    x1: (500 + Math.cos(rad) * r1).toFixed(1),
    y1: (500 + Math.sin(rad) * r1).toFixed(1),
    x2: (500 + Math.cos(rad) * r2).toFixed(1),
    y2: (500 + Math.sin(rad) * r2).toFixed(1),
    major,
    deg,
    lx: (500 + Math.cos(rad) * 391).toFixed(1),
    ly: (500 + Math.sin(rad) * 391).toFixed(1),
  };
});

const INNER_TICKS = Array.from({ length: 36 }, (_, idx) => {
  const rad = (idx * 10 * Math.PI) / 180;
  const major = idx % 3 === 0;
  const r1 = major ? 268 : 274;
  const r2 = 280;
  return {
    x1: (500 + Math.cos(rad) * r1).toFixed(1),
    y1: (500 + Math.sin(rad) * r1).toFixed(1),
    x2: (500 + Math.cos(rad) * r2).toFixed(1),
    y2: (500 + Math.sin(rad) * r2).toFixed(1),
    major,
  };
});

function routeKey(pathname: string) {
  const clean = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  if (clean.startsWith("/gallery")) return "gallery";
  if (clean.startsWith("/about")) return "about";
  if (clean.startsWith("/projects/")) return "project";
  return "atelier";
}

function routeBearing(pathname: string, stepIndex = 0) {
  const clean = pathname.replace(/^\/zh(?=\/|$)/, "") || "/";
  let base = 0;
  if (clean.startsWith("/gallery")) base = 60;
  else if (clean.startsWith("/about")) base = 120;
  else if (clean.startsWith("/projects/still-life")) base = 30;
  else if (clean.startsWith("/projects/an-echo-has-no-shape")) base = 90;
  else if (clean.startsWith("/projects/fallen-valkyrie")) base = 150;
  else if (clean.startsWith("/projects/starshore")) base = 210;
  else if (clean.startsWith("/projects/sacred-forest")) base = 270;
  return base + stepIndex * 28;
}

function seededRandom(seedText: string) {
  let seed = 2166136261;
  for (let i = 0; i < seedText.length; i += 1) {
    seed ^= seedText.charCodeAt(i);
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

/**
 * Persistent nocturnal Victorian obsidian-mahogany & gilded cartographic desk (`#080605`).
 * Combines:
 * 1. Interactive 60fps Marching Squares cartographic contour & astrolabe sonar field
 *    that warps under the cursor, illuminates molten gold & Venetian crimson contours,
 *    and emits concentric survey shockwaves on cursor sweeps & clicks.
 * 2. Rotating brass Celestial Astrolabe dial synchronized to folio transitions.
 * 3. Rising warm candlelit dust motes (`LamplightDustCanvas`).
 */
export function AmbientBackdrop({ dialStep = 0 }: { dialStep?: number }) {
  const { pathname } = useLocation();
  const contourCanvasRef = useRef<HTMLCanvasElement>(null);
  const bearing = routeBearing(pathname, dialStep);
  const innerBearing = -Math.round(bearing * 0.68);

  useEffect(() => {
    const canvas = contourCanvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches) return;

    const key = routeKey(pathname);
    const labels = ROUTE_SURVEY_LABELS[key];
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
    let spineOffset = 76;
    let bandLeftEnd = 0;
    let bandRightStart = 0;
    let leftPeaks: SurveyPeak[] = [];
    let rightPeaks: SurveyPeak[] = [];
    let allPeaks: SurveyPeak[] = [];
    let pulses: AstrolabePulse[] = [];
    let lastAmbientPulseTime = 0;
    let lastDrawTime = 0;
    let frame = 0;

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

    const buildCartography = () => {
      const random = seededRandom(`${key}-${pathname}-victorian-cartography`);
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      leftPeaks = [];
      rightPeaks = [];
      allPeaks = [];
      pulses = [];

      spineOffset = width >= 1024 ? 76 : 0;
      const usableW = width - spineOffset;
      const centerSpan = Math.min(960, usableW * 0.62);
      const centerMid = spineOffset + usableW * 0.5;
      bandLeftEnd = Math.max(spineOffset + 160, centerMid - centerSpan * 0.5 + 85);
      bandRightStart = Math.min(width - 160, centerMid + centerSpan * 0.5 - 85);

      const maxBandWidth = Math.max(bandLeftEnd - spineOffset, width - bandRightStart) + 32;
      const maxCols = Math.ceil(maxBandWidth / cellSize) + 3;
      const maxRows = Math.ceil(height / cellSize) + 3;
      const needed = maxCols * maxRows;
      if (fieldBuf.length < needed) fieldBuf = new Float32Array(needed);
      if (sinXBuf.length < maxCols) sinXBuf = new Float32Array(maxCols);
      if (cosYBuf.length < maxRows) cosYBuf = new Float32Array(maxRows);

      const peaksPerSide = Math.max(4, Math.min(6, Math.round(height / 175)));

      (["left", "right"] as const).forEach((side) => {
        const startX = side === "left" ? spineOffset + 22 : bandRightStart + 18;
        const endX = side === "left" ? bandLeftEnd - 18 : width - 26;
        const spanX = Math.max(36, endX - startX);

        for (let i = 0; i < peaksPerSide; i += 1) {
          const baseX = startX + (0.18 + random() * 0.64) * spanX;
          const baseY = ((i + 0.22 + random() * 0.56) / peaksPerSide) * (height - 110) + 55;
          const amplitude = 0.74 + random() * 0.44;
          const sigmaX = Math.max(42, Math.min(108, spanX * (0.3 + random() * 0.24)));
          const sigmaY = 78 + random() * 68;
          const angle = (random() - 0.5) * 0.9;
          const degBearing = Math.round((amplitude * 180) / 5) * 5;
          const roman = ROMAN_BEARINGS[(i + (side === "right" ? 4 : 0)) % ROMAN_BEARINGS.length];

          const peak: SurveyPeak = {
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
            bearingText: `${roman} · ${degBearing}°`,
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

      const inOuterDesk =
        event.clientX < bandLeftEnd + 95 || event.clientX > bandRightStart - 95;
      const dx = event.clientX - pointer.lastPulseX;
      const dy = event.clientY - pointer.lastPulseY;

      if (inOuterDesk && dx * dx + dy * dy > 4900 && pulses.length < 7) {
        pointer.lastPulseX = event.clientX;
        pointer.lastPulseY = event.clientY;
        pulses.push({
          x: event.clientX,
          y: event.clientY,
          radius: 6,
          maxRadius: 245,
          speed: 2.5,
          crimson: pulses.length % 2 === 1,
        });
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      pointer.lastMoveTime = performance.now();
      if (pulses.length < 8) {
        pulses.push({
          x: event.clientX,
          y: event.clientY,
          radius: 5,
          maxRadius: 310,
          speed: 3.3,
          crimson: true,
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

      const recentlyMoved = time - pointer.lastMoveTime < 320;
      const minDelta = recentlyMoved || pulses.length > 0 ? 15.5 : 46;
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

      const t = time * 0.00052;
      const influence = 225;

      if (pointer.active) {
        const alpha = 1 - Math.pow(0.83, stepScale);
        pointer.smoothX += (pointer.x - pointer.smoothX) * alpha;
        pointer.smoothY += (pointer.y - pointer.smoothY) * alpha;
      }

      if (!reducedMotion.matches && time - lastAmbientPulseTime > 3100) {
        lastAmbientPulseTime = time;
        const sourcePeak = allPeaks[Math.floor((time * 0.001) % allPeaks.length)];
        if (sourcePeak && pulses.length < 5) {
          pulses.push({
            x: sourcePeak.x,
            y: sourcePeak.y,
            radius: 4,
            maxRadius: 225,
            speed: 1.55,
            crimson: false,
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
        const driftX = !reducedMotion.matches ? Math.cos(t + peak.phase) * 7.5 : 0;
        const driftY = !reducedMotion.matches ? Math.sin(t * 0.85 + peak.phase) * 9.5 : 0;
        let px = peak.baseX + driftX;
        let py = peak.baseY + driftY;

        if (pointer.active) {
          const dx = px - pointer.smoothX;
          const dy = py - pointer.smoothY;
          const d2 = dx * dx + dy * dy;
          if (d2 < influence * influence && d2 > 0.001) {
            const dist = Math.sqrt(d2);
            const wake = 1 - dist / influence;
            const push = wake * wake * 20;
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
        const minX = side === "left" ? spineOffset + 6 : bandRightStart - 8;
        const maxX = side === "left" ? bandLeftEnd + 8 : width - 6;
        if (maxX - minX < 36) return;

        const cols = Math.ceil((maxX - minX) / cellSize);
        const stride = cols + 1;
        const sidePeaks = side === "left" ? leftPeaks : rightPeaks;
        const phaseSign = side === "left" ? t : -t;

        for (let c = 0; c <= cols; c += 1) {
          sinXBuf[c] = 0.085 * Math.sin((minX + c * cellSize) * 0.018 + phaseSign);
        }

        for (let r = 0; r <= rows; r += 1) {
          const cy = cosYBuf[r];
          const rowOff = r * stride;
          for (let c = 0; c <= cols; c += 1) {
            fieldBuf[rowOff + c] = sinXBuf[c] * cy;
          }
        }

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

        // Interactive cursor gravity/candle-lens ripple inside 190px radius
        if (pointer.active && pointer.smoothX > minX - 195 && pointer.smoothX < maxX + 195) {
          const c0 = Math.max(0, Math.floor((pointer.smoothX - 190 - minX) / cellSize));
          const c1 = Math.min(cols, Math.ceil((pointer.smoothX + 190 - minX) / cellSize));
          const r0 = Math.max(0, Math.floor((pointer.smoothY - 190) / cellSize));
          const r1 = Math.min(rows, Math.ceil((pointer.smoothY + 190) / cellSize));
          for (let r = r0; r <= r1; r += 1) {
            const cdy = r * cellSize - pointer.smoothY;
            const cdy2 = cdy * cdy;
            const rowOff = r * stride;
            for (let c = c0; c <= c1; c += 1) {
              const cdx = minX + c * cellSize - pointer.smoothX;
              const cd2 = cdx * cdx + cdy2;
              if (cd2 < 36100) {
                const norm = cd2 / 9800;
                fieldBuf[rowOff + c] += 0.38 * norm * Math.exp(-norm * 0.82);
              }
            }
          }
        }

        hotCounts[0] = 0;
        hotCounts[1] = 0;
        hotCounts[2] = 0;
        hotCounts[3] = 0;

        const pointerNearSide =
          pointer.active && pointer.smoothX > minX - 165 && pointer.smoothX < maxX + 165;
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
                let glowCrimson = false;

                if (pointerNearSide) {
                  const pdx = midX - pointer.smoothX;
                  const pdy = midY - pointer.smoothY;
                  if (Math.abs(pdx) < 160 && Math.abs(pdy) < 160) {
                    const pDist2 = pdx * pdx + pdy * pdy;
                    if (pDist2 < 25600) {
                      maxGlow = (1 - Math.sqrt(pDist2) / 160) * 0.82;
                    }
                  }
                }

                for (let s = 0; s < pulseCount; s += 1) {
                  const pulse = pulses[s];
                  const reachR = pulse.radius + 24;
                  const sdx = midX - pulse.x;
                  const sdy = midY - pulse.y;
                  if (Math.abs(sdx) > reachR || Math.abs(sdy) > reachR) continue;
                  const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
                  const ringDiff = Math.abs(sDist - pulse.radius);
                  if (ringDiff < 24) {
                    const life = 1 - pulse.radius / pulse.maxRadius;
                    const waveGlow = (1 - ringDiff / 24) * life * 0.96;
                    if (waveGlow > maxGlow) {
                      maxGlow = waveGlow;
                      glowCrimson = pulse.crimson;
                    }
                  }
                }

                if (maxGlow > 0.14) {
                  const bin = (glowCrimson ? 2 : 0) + (maxGlow > 0.44 ? 1 : 0);
                  pushHot(bin, x1, y1, x2, y2);
                }
              }
            }
          }

          context.strokeStyle = isIndexContour
            ? "rgba(212, 168, 102, 0.24)"
            : "rgba(176, 134, 74, 0.13)";
          context.lineWidth = isIndexContour ? 1.0 : 0.68;
          context.stroke();
        }

        // Batched molten-gold & Venetian-crimson contour highlights
        context.lineWidth = 1.4;
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

      // Expanding concentric brass & Venetian-crimson astrolabe survey rings
      for (let i = 0; i < pulses.length; i += 1) {
        const pulse = pulses[i];
        const life = 1 - pulse.radius / pulse.maxRadius;
        context.beginPath();
        context.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        context.strokeStyle = pulse.crimson
          ? `rgba(204, 48, 44, ${(life * 0.34).toFixed(3)})`
          : `rgba(228, 186, 118, ${(life * 0.32).toFixed(3)})`;
        context.lineWidth = 0.95;
        context.stroke();
      }

      // Victorian cartographic survey reticles & Cinzel bearing callouts
      context.font = '600 8.5px "Cinzel Variable", Georgia, serif';
      for (let i = 0; i < allPeaks.length; i += 1) {
        const peak = allPeaks[i];
        const pDist = pointer.active
          ? Math.hypot(peak.x - pointer.smoothX, peak.y - pointer.smoothY)
          : 999;
        let wake = Math.max(0, 1 - pDist / influence);

        for (let s = 0; s < pulses.length; s += 1) {
          const pulse = pulses[s];
          const ringDiff = Math.abs(Math.hypot(peak.x - pulse.x, peak.y - pulse.y) - pulse.radius);
          if (ringDiff < 34) {
            const life = 1 - pulse.radius / pulse.maxRadius;
            wake = Math.max(wake, (1 - ringDiff / 34) * life);
          }
        }

        const arm = 3.8 + wake * 4.2;
        context.beginPath();
        context.moveTo(peak.x - arm, peak.y);
        context.lineTo(peak.x + arm, peak.y);
        context.moveTo(peak.x, peak.y - arm);
        context.lineTo(peak.x, peak.y + arm);
        context.strokeStyle = `rgba(232, 192, 124, ${(0.28 + wake * 0.58).toFixed(3)})`;
        context.lineWidth = 0.85;
        context.stroke();

        // Small diamond pip at survey center
        context.beginPath();
        context.moveTo(peak.x, peak.y - 2.2);
        context.lineTo(peak.x + 2.2, peak.y);
        context.lineTo(peak.x, peak.y + 2.2);
        context.lineTo(peak.x - 2.2, peak.y);
        context.closePath();
        context.fillStyle =
          wake > 0.25
            ? `rgba(204, 44, 40, ${(0.55 + wake * 0.45).toFixed(3)})`
            : "rgba(200, 157, 98, 0.42)";
        context.fill();

        if (peak.label || wake > 0.18) {
          const textAlpha = peak.label ? 0.34 + wake * 0.58 : wake * 0.78;
          context.fillStyle = `rgba(238, 206, 150, ${textAlpha.toFixed(3)})`;
          const callout = peak.label ? `${peak.label} · ${peak.bearingText}` : peak.bearingText;
          const xOffset = peak.side === "right" ? -8 : 8;
          context.textAlign = peak.side === "right" ? "right" : "left";
          context.fillText(callout, peak.x + xOffset, peak.y - 5);
        }
      }

      if (!reducedMotion.matches) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const onVisibility = () => {
      if (!document.hidden && !frame && !reducedMotion.matches) {
        lastDrawTime = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };

    buildCartography();
    frame = window.requestAnimationFrame(draw);

    window.addEventListener("resize", buildCartography);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildCartography);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="celestial-mat pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#080605]"
    >
      {/* High-contrast candlelit mahogany center glow + deep obsidian vignette (ZERO blue!) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_54%_45%,rgba(68,42,24,0.52)_0%,rgba(18,12,9,0.94)_68%,#040302_100%)]" />
      <div
        className="absolute -inset-24 opacity-95"
        style={{
          background:
            "radial-gradient(640px circle at var(--spot-x) var(--spot-y), rgba(214, 170, 104, 0.13), rgba(143, 22, 22, 0.04) 45%, transparent 72%)",
        }}
      />

      {/* Interactive Cursor-Reactive Victorian Cartographic Contour & Astrolabe Sonar Canvas */}
      <canvas ref={contourCanvasRef} className="absolute inset-0 hidden lg:block" />

      {/* Outer Victorian drafting mat double-gilded frame hairlines on desktop */}
      <div className="absolute inset-y-3.5 left-[90px] right-4 hidden border border-[#c89d62]/36 lg:block">
        <div className="absolute inset-[3px] border border-[#c89d62]/16" />
        <span className="absolute -left-1 -top-1 h-3.5 w-3.5 border-l-2 border-t-2 border-[#e2be84]/85" />
        <span className="absolute -right-1 -top-1 h-3.5 w-3.5 border-r-2 border-t-2 border-[#e2be84]/85" />
        <span className="absolute -bottom-1 -left-1 h-3.5 w-3.5 border-b-2 border-l-2 border-[#e2be84]/85" />
        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 border-b-2 border-r-2 border-[#e2be84]/85" />
      </div>

      {/* Mathematical Celestial Astrolabe Etching in Burnished Bronze & Ivory Chalk */}
      <div
        className="absolute inset-0"
        style={{
          transform: "translate3d(calc(var(--mx) * -7px), calc(var(--my) * -5px), 0)",
        }}
      >
        <svg
          viewBox="0 0 1000 1000"
          className="absolute left-1/2 top-1/2 h-[min(126vh,1180px)] w-[min(126vh,1180px)] -translate-x-[47%] -translate-y-1/2 opacity-95"
          fill="none"
        >
          <line x1="40" y1="500" x2="960" y2="500" stroke="#f2e6cf" strokeWidth="0.6" opacity="0.09" />
          <line x1="500" y1="40" x2="500" y2="960" stroke="#f2e6cf" strokeWidth="0.6" opacity="0.09" />
          <line x1="150" y1="150" x2="850" y2="850" stroke="#c89d62" strokeWidth="0.55" strokeDasharray="4 6" opacity="0.14" />
          <line x1="850" y1="150" x2="150" y2="850" stroke="#c89d62" strokeWidth="0.55" strokeDasharray="4 6" opacity="0.14" />

          <g
            style={{
              transform: `rotate(${bearing}deg)`,
              transformOrigin: "500px 500px",
              transition: "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <g className="animate-astrolabe-cw">
              <circle cx="500" cy="500" r="424" stroke="#d4ae73" strokeWidth="1.05" opacity="0.3" />
              <circle cx="500" cy="500" r="404" stroke="#f2e6cf" strokeWidth="0.6" opacity="0.13" />
              <circle cx="500" cy="500" r="356" stroke="#c89d62" strokeWidth="0.55" strokeDasharray="2 5" opacity="0.16" />

              {OUTER_TICKS.map((t, idx) => (
                <g key={idx}>
                  <line
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={t.major ? "#deb97e" : "#f2e6cf"}
                    strokeWidth={t.major ? "1.05" : "0.55"}
                    opacity={t.major ? "0.38" : "0.14"}
                  />
                  {t.major && (
                    <text
                      x={t.lx}
                      y={t.ly}
                      fill="#deb97e"
                      opacity="0.36"
                      fontSize="8.5"
                      fontFamily="Cinzel Variable, serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {String(t.deg).padStart(3, "0")}°
                    </text>
                  )}
                </g>
              ))}

              <polygon points="500,96 850,702 150,702" stroke="#c89d62" strokeWidth="0.65" opacity="0.15" />
              <polygon points="500,904 850,298 150,298" stroke="#9e1e1e" strokeWidth="0.7" opacity="0.2" />
            </g>
          </g>

          <g
            style={{
              transform: `rotate(${innerBearing}deg)`,
              transformOrigin: "500px 500px",
              transition: "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <g className="animate-astrolabe-ccw">
              <circle cx="500" cy="500" r="280" stroke="#d4ae73" strokeWidth="0.9" opacity="0.26" />
              <circle cx="500" cy="438" r="218" stroke="#f2e6cf" strokeWidth="0.6" opacity="0.11" />
              <circle cx="500" cy="562" r="218" stroke="#c89d62" strokeWidth="0.6" opacity="0.13" />
              {INNER_TICKS.map((t, idx) => (
                <line
                  key={idx}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#d4ae73"
                  strokeWidth={t.major ? "0.95" : "0.55"}
                  opacity={t.major ? "0.32" : "0.14"}
                />
              ))}
            </g>
          </g>
        </svg>
      </div>

      <LamplightDustCanvas />
    </div>
  );
}
