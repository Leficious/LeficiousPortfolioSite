import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { LamplightDustCanvas } from "./AtelierMotion";

type GearSpec = {
  x: number;
  y: number;
  teeth: number;
  pitchR: number;
  spokes: number;
  ratioFromRoot: number;
  phaseOffset: number;
  sign: 1 | -1;
  hasCompassNeedle?: boolean;
  hasRomanDial?: boolean;
  caption?: string;
};

type GearTrain = {
  side: "left" | "right";
  gears: GearSpec[];
  angle: number;
  omega: number;
  baseOmega: number;
};

type CompassNeedleState = {
  angle: number;
  vel: number;
};

type SparkMote = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  crimson: boolean;
};

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

const DIAL_ROMANS = ["XII", "III", "VI", "IX"] as const;

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

function shortestAngleDiff(from: number, to: number) {
  let diff = ((to - from + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return diff;
}

function meshGear(
  parent: GearSpec,
  teeth: number,
  moduleSize: number,
  bearingDeg: number,
  spokes: number,
  extra?: Partial<GearSpec>,
): GearSpec {
  const pitchR = (teeth * moduleSize) / 2;
  const phi = (bearingDeg * Math.PI) / 180;
  const dist = parent.pitchR + pitchR + 0.8;
  const x = parent.x + Math.cos(phi) * dist;
  const y = parent.y + Math.sin(phi) * dist;
  const ratioFromRoot = parent.ratioFromRoot * (parent.teeth / teeth);
  const sign = (parent.sign * -1) as 1 | -1;
  // Exact horological tooth-valley phase lock
  const phaseOffset =
    phi + Math.PI - (parent.phaseOffset - phi) * (parent.teeth / teeth) + Math.PI / teeth;

  return {
    x,
    y,
    teeth,
    pitchR,
    spokes,
    ratioFromRoot,
    phaseOffset,
    sign,
    ...extra,
  };
}

/**
 * Persistent nocturnal Victorian Clocktower & Horological Escapement Desk (`#080605`).
 * Zero modern topographic blobs — features:
 * 1. Mathematically meshed 19th-century watchmaker brass gear trains with ruby jewel arbors
 *    recessed into the left & right mahogany desk wells; sweeping the cursor winds their
 *    flywheel momentum and casts directional candle-gold specular glints across the gear teeth.
 * 2. Spring-damped Victorian magnetic compass needles & a central astrolabe alidade sight-rule
 *    that smoothly track the cursor's live bearing across the desk.
 * 3. Crisp mechanical escapement ratchet impulse + gold-leaf candle sparks on click.
 */
export function AmbientBackdrop({ dialStep = 0 }: { dialStep?: number }) {
  const { pathname } = useLocation();
  const clockworkCanvasRef = useRef<HTMLCanvasElement>(null);
  const dialKickRef = useRef(0);
  const bearing = routeBearing(pathname, dialStep);
  const innerBearing = -Math.round(bearing * 0.68);

  useEffect(() => {
    dialKickRef.current += 1;
  }, [dialStep, pathname]);

  useEffect(() => {
    const canvas = clockworkCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!desktop.matches) return;

    let width = 0;
    let height = 0;
    let spineOffset = 76;
    let trains: GearTrain[] = [];
    let needles: CompassNeedleState[] = [];
    const sparks: SparkMote[] = [];
    let alidadeAngle = -Math.PI * 0.35;
    let alidadeVel = 0;
    let lastKickSeen = dialKickRef.current;
    let lastTime = 0;
    let frame = 0;

    const pointer = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      smoothX: -1000,
      smoothY: -1000,
      speed: 0,
      lastMoveTime: -9999,
      active: false,
    };

    const buildClockwork = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      spineOffset = width >= 1024 ? 76 : 0;
      const mod = Math.max(2.7, Math.min(3.45, width / 560));

      // Left Horological Escapement Train (recessed in left mahogany desk well)
      const leftAnchorX = spineOffset + Math.max(92, (width - spineOffset) * 0.085);
      const leftAnchorY = height * 0.49;
      const lRoot: GearSpec = {
        x: leftAnchorX,
        y: leftAnchorY,
        teeth: 54,
        pitchR: (54 * mod) / 2,
        spokes: 6,
        ratioFromRoot: 1,
        phaseOffset: 0,
        sign: 1,
        hasRomanDial: true,
        caption: "CHRONO · I",
      };
      const lUpper = meshGear(lRoot, 34, mod, -68, 5, {
        hasCompassNeedle: true,
        caption: "VERNIER · N",
      });
      const lTopEsc = meshGear(lUpper, 22, mod, -38, 4);
      const lLower = meshGear(lRoot, 28, mod, 66, 5, {
        hasCompassNeedle: true,
        caption: "ESCAPEMENT",
      });

      // Right Horological Orrery Train (recessed in right mahogany desk well)
      const rightAnchorX = width - Math.max(106, (width - spineOffset) * 0.09);
      const rightAnchorY = height * 0.51;
      const rRoot: GearSpec = {
        x: rightAnchorX,
        y: rightAnchorY,
        teeth: 58,
        pitchR: (58 * mod) / 2,
        spokes: 6,
        ratioFromRoot: 1,
        phaseOffset: 0.2,
        sign: -1,
        hasRomanDial: true,
        caption: "ORRERY · II",
      };
      const rUpper = meshGear(rRoot, 36, mod, -114, 5, {
        hasCompassNeedle: true,
        caption: "AZIMUTH",
      });
      const rLower = meshGear(rRoot, 30, mod, 116, 5, {
        hasCompassNeedle: true,
        caption: "MERIDIAN",
      });
      const rPinion = meshGear(rLower, 20, mod, 150, 4);

      trains = [
        {
          side: "left",
          gears: [lRoot, lUpper, lTopEsc, lLower],
          angle: 0.3,
          omega: 0.09,
          baseOmega: 0.09,
        },
        {
          side: "right",
          gears: [rRoot, rUpper, rLower, rPinion],
          angle: 0.8,
          omega: 0.08,
          baseOmega: 0.08,
        },
      ];

      const totalNeedles = trains.reduce(
        (acc, tr) => acc + tr.gears.filter((g) => g.hasCompassNeedle).length,
        0,
      );
      needles = Array.from({ length: totalNeedles }, () => ({ angle: -Math.PI / 2, vel: 0 }));
    };

    const spawnSparks = (x: number, y: number, count: number, burst = false) => {
      for (let i = 0; i < count; i += 1) {
        if (sparks.length >= 42) break;
        const ang = Math.random() * Math.PI * 2;
        const spd = (burst ? 0.85 : 0.32) + Math.random() * (burst ? 1.65 : 0.65);
        sparks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - (0.35 + Math.random() * 0.45),
          life: 0,
          maxLife: 34 + Math.random() * 28,
          size: 1.1 + Math.random() * 1.4,
          crimson: i % 4 === 0,
        });
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      pointer.lastMoveTime = now;

      if (!pointer.active) {
        pointer.prevX = e.clientX;
        pointer.prevY = e.clientY;
        pointer.smoothX = e.clientX;
        pointer.smoothY = e.clientY;
      } else {
        pointer.prevX = pointer.x;
        pointer.prevY = pointer.y;
      }

      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;

      const dx = pointer.x - pointer.prevX;
      const dy = pointer.y - pointer.prevY;
      const stepDist = Math.hypot(dx, dy);
      pointer.speed = Math.min(48, pointer.speed * 0.65 + stepDist * 0.55);

      // Wind nearby horological gear trains when sweeping the cursor near them
      for (let tIdx = 0; tIdx < trains.length; tIdx += 1) {
        const tr = trains[tIdx];
        let minDist = 9999;
        for (let gIdx = 0; gIdx < tr.gears.length; gIdx += 1) {
          const g = tr.gears[gIdx];
          const d = Math.hypot(pointer.x - g.x, pointer.y - g.y) - g.pitchR;
          if (d < minDist) minDist = d;
        }
        if (minDist < 220 && stepDist > 0.5) {
          const proximity = 1 - Math.max(0, minDist) / 220;
          tr.omega = Math.min(2.6, tr.omega + proximity * stepDist * 0.0085);
          if (stepDist > 14 && Math.random() < 0.35 && !reducedMotion.matches) {
            spawnSparks(pointer.x, pointer.y, 1, false);
          }
        }
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      pointer.lastMoveTime = performance.now();
      // Crisp mechanical escapement ratchet impulse on click
      for (let i = 0; i < trains.length; i += 1) {
        trains[i].omega = Math.min(3.1, trains[i].omega + 1.25);
      }
      if (!reducedMotion.matches) {
        spawnSparks(e.clientX, e.clientY, 8, true);
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const drawGear = (gear: GearSpec, theta: number, glow: number, lightAngle: number) => {
      const { x, y, teeth, pitchR, spokes } = gear;
      const addendum = Math.min(4.6, pitchR * 0.075 + 1.5);
      const dedendum = addendum * 1.15;
      const outerR = pitchR + addendum;
      const rootR = pitchR - dedendum;
      const rimInnerR = rootR - Math.max(4.5, pitchR * 0.11);
      const hubR = Math.max(8, pitchR * 0.22);
      const step = (Math.PI * 2) / teeth;

      ctx.save();
      ctx.translate(x, y);

      // 1. Toothed Involute-Trapezoid Brass Rim
      ctx.save();
      ctx.rotate(theta);
      ctx.beginPath();
      for (let i = 0; i < teeth; i += 1) {
        const a = i * step;
        const a0 = a - step * 0.34;
        const a1 = a - step * 0.15;
        const a2 = a + step * 0.15;
        const a3 = a + step * 0.34;
        if (i === 0) {
          ctx.moveTo(Math.cos(a0) * rootR, Math.sin(a0) * rootR);
        } else {
          ctx.lineTo(Math.cos(a0) * rootR, Math.sin(a0) * rootR);
        }
        ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
        ctx.lineTo(Math.cos(a3) * rootR, Math.sin(a3) * rootR);
      }
      ctx.closePath();

      const baseFillAlpha = 0.045 + glow * 0.09;
      ctx.fillStyle = `rgba(204, 158, 92, ${baseFillAlpha.toFixed(3)})`;
      ctx.fill();

      const strokeAlpha = 0.24 + glow * 0.56;
      ctx.lineWidth = glow > 0.25 ? 1.2 : 0.9;
      ctx.strokeStyle = `rgba(232, 190, 122, ${strokeAlpha.toFixed(3)})`;
      ctx.stroke();

      // Inner chapter ring & Breguet watchmaker spokes
      ctx.beginPath();
      ctx.arc(0, 0, rimInnerR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(200, 157, 98, ${(0.2 + glow * 0.42).toFixed(3)})`;
      ctx.lineWidth = 0.85;
      ctx.stroke();

      for (let s = 0; s < spokes; s += 1) {
        const sa = (s * Math.PI * 2) / spokes;
        const ca = Math.cos(sa);
        const sna = Math.sin(sa);
        const px = -sna * 2.1;
        const py = ca * 2.1;

        ctx.beginPath();
        ctx.moveTo(ca * hubR + px, sna * hubR + py);
        ctx.lineTo(ca * rimInnerR + px * 0.55, sna * rimInnerR + py * 0.55);
        ctx.lineTo(ca * rimInnerR - px * 0.55, sna * rimInnerR - py * 0.55);
        ctx.lineTo(ca * hubR - px, sna * hubR - py);
        ctx.closePath();
        ctx.fillStyle = `rgba(186, 142, 82, ${(0.08 + glow * 0.14).toFixed(3)})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(220, 178, 112, ${(0.22 + glow * 0.44).toFixed(3)})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // Roman dial chapter ring on primary barrel wheels
      if (gear.hasRomanDial && rimInnerR > 48) {
        const dialR = rimInnerR - 11;
        ctx.beginPath();
        ctx.arc(0, 0, dialR, 0, Math.PI * 2);
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = `rgba(218, 176, 112, ${(0.18 + glow * 0.34).toFixed(3)})`;
        ctx.lineWidth = 0.65;
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.font = '600 8.5px "Cinzel Variable", Georgia, serif';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(238, 204, 146, ${(0.28 + glow * 0.52).toFixed(3)})`;
        for (let rIdx = 0; rIdx < 4; rIdx += 1) {
          const ra = (rIdx * Math.PI) / 2 - Math.PI / 2;
          ctx.fillText(
            DIAL_ROMANS[rIdx],
            Math.cos(ra) * (dialR - 9),
            Math.sin(ra) * (dialR - 9),
          );
        }
      }
      ctx.restore();

      // 2. Directional Candle-Lantern Specular Arc facing the Cursor!
      if (glow > 0.06) {
        ctx.beginPath();
        ctx.arc(0, 0, pitchR, lightAngle - 0.72, lightAngle + 0.72);
        ctx.strokeStyle = `rgba(255, 232, 178, ${(glow * 0.72).toFixed(3)})`;
        ctx.lineWidth = 1.45;
        ctx.stroke();
      }

      // 3. Center Brass Chaton Collar & Crimson Ruby 17-Jewel Pivot Bearing
      ctx.beginPath();
      ctx.arc(0, 0, hubR, 0, Math.PI * 2);
      ctx.fillStyle = "#0e0a08";
      ctx.fill();
      ctx.strokeStyle = `rgba(228, 188, 124, ${(0.38 + glow * 0.5).toFixed(3)})`;
      ctx.lineWidth = 1.05;
      ctx.stroke();

      // Ruby jewel bearing in the center arbor
      const rubyR = Math.max(3.2, hubR * 0.34);
      ctx.beginPath();
      ctx.arc(0, 0, rubyR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(176, 28, 28, ${(0.68 + glow * 0.32).toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(244, 206, 142, ${(0.45 + glow * 0.45).toFixed(3)})`;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      if (gear.caption) {
        ctx.font = '600 8px "Cinzel Variable", Georgia, serif';
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(228, 192, 134, ${(0.24 + glow * 0.54).toFixed(3)})`;
        ctx.fillText(gear.caption, 0, outerR + 13);
      }

      ctx.restore();
    };

    const drawCompassNeedle = (gear: GearSpec, needleAngle: number, glow: number) => {
      const len = gear.pitchR * 0.76;
      ctx.save();
      ctx.translate(gear.x, gear.y);
      ctx.rotate(needleAngle);

      // North-seeking Venetian crimson pointer half
      ctx.beginPath();
      ctx.moveTo(len, 0);
      ctx.lineTo(0, -3.2);
      ctx.lineTo(-4, 0);
      ctx.lineTo(0, 3.2);
      ctx.closePath();
      ctx.fillStyle = `rgba(198, 36, 34, ${(0.72 + glow * 0.28).toFixed(3)})`;
      ctx.fill();

      // South-seeking burnished gold counterweight half
      ctx.beginPath();
      ctx.moveTo(-len * 0.72, 0);
      ctx.lineTo(0, -2.6);
      ctx.lineTo(0, 2.6);
      ctx.closePath();
      ctx.fillStyle = `rgba(238, 202, 138, ${(0.62 + glow * 0.36).toFixed(3)})`;
      ctx.fill();

      ctx.restore();
    };

    const draw = (time: number) => {
      if (document.hidden) {
        frame = 0;
        return;
      }

      const recentlyActive =
        time - pointer.lastMoveTime < 900 ||
        sparks.length > 0 ||
        trains.some((tr) => tr.omega > tr.baseOmega + 0.03);
      const minDelta = recentlyActive ? 15.5 : 42;
      const dtMs = time - lastTime;
      if (lastTime > 0 && dtMs < minDelta) {
        if (!reducedMotion.matches) frame = window.requestAnimationFrame(draw);
        return;
      }
      const dt = lastTime > 0 ? Math.min(0.05, dtMs / 1000) : 0.016;
      lastTime = time;

      // Kick gear trains when the user switches folios or routes!
      if (lastKickSeen !== dialKickRef.current) {
        lastKickSeen = dialKickRef.current;
        for (let i = 0; i < trains.length; i += 1) {
          trains[i].omega = Math.min(2.8, trains[i].omega + 1.15);
        }
      }

      if (pointer.active) {
        const lerp = 1 - Math.pow(0.0015, dt);
        pointer.smoothX += (pointer.x - pointer.smoothX) * lerp;
        pointer.smoothY += (pointer.y - pointer.smoothY) * lerp;
      }
      pointer.speed *= Math.pow(0.08, dt);

      ctx.clearRect(0, 0, width, height);

      // Center of the Celestial Astrolabe (`left-1/2` inside the main area)
      const astroCx = spineOffset + (width - spineOffset) * 0.5;
      const astroCy = height * 0.5;

      // Update & draw the cursor-tracking Brass Alidade Sight-Rule on the Celestial Astrolabe
      if (pointer.active && !reducedMotion.matches) {
        const targetAlidade = Math.atan2(pointer.smoothY - astroCy, pointer.smoothX - astroCx);
        const diff = shortestAngleDiff(alidadeAngle, targetAlidade);
        alidadeVel += diff * 18 * dt;
        alidadeVel *= Math.pow(0.04, dt);
        alidadeAngle += alidadeVel * dt;
      }

      const astroR = Math.min(height * 0.63, 590) * 0.848;
      ctx.save();
      ctx.translate(astroCx, astroCy);
      ctx.rotate(alidadeAngle);
      // Slender astrolabe vernier sight-line & glowing rim cursor pip
      ctx.beginPath();
      ctx.moveTo(-astroR * 0.96, 0);
      ctx.lineTo(astroR * 0.96, 0);
      ctx.strokeStyle = pointer.active
        ? "rgba(232, 192, 124, 0.16)"
        : "rgba(200, 157, 98, 0.07)";
      ctx.lineWidth = 0.85;
      ctx.stroke();

      //Vernier pointer reticle riding along the outer astrolabe degree ring
      ctx.beginPath();
      ctx.moveTo(astroR + 7, 0);
      ctx.lineTo(astroR - 5, -4.5);
      ctx.lineTo(astroR - 2, 0);
      ctx.lineTo(astroR - 5, 4.5);
      ctx.closePath();
      ctx.fillStyle = pointer.active ? "rgba(246, 212, 146, 0.78)" : "rgba(200, 157, 98, 0.32)";
      ctx.fill();

      if (pointer.active) {
        ctx.beginPath();
        ctx.arc(0, 0, astroR, -0.16, 0.16);
        ctx.strokeStyle = "rgba(255, 226, 166, 0.58)";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      ctx.restore();

      // Update & render Left and Right Horological Gear Trains + Spring-Damped Compass Needles
      let needleCursor = 0;
      for (let tIdx = 0; tIdx < trains.length; tIdx += 1) {
        const tr = trains[tIdx];
        if (!reducedMotion.matches) {
          tr.angle += tr.omega * dt;
          // Smooth flywheel coast-down back toward base horological escapement speed
          tr.omega += (tr.baseOmega - tr.omega) * (1 - Math.pow(0.14, dt));
        }

        // Faint brass linkage lines connecting the arbors in the train
        ctx.beginPath();
        for (let gIdx = 1; gIdx < tr.gears.length; gIdx += 1) {
          const g = tr.gears[gIdx];
          const prev = gIdx === 2 && tr.side === "left" ? tr.gears[1] : gIdx === 3 && tr.side === "right" ? tr.gears[2] : tr.gears[0];
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(g.x, g.y);
        }
        ctx.strokeStyle = "rgba(200, 157, 98, 0.14)";
        ctx.lineWidth = 1;
        ctx.stroke();

        for (let gIdx = 0; gIdx < tr.gears.length; gIdx += 1) {
          const g = tr.gears[gIdx];
          const gearTheta = g.phaseOffset + tr.angle * g.ratioFromRoot * g.sign;

          let glow = 0;
          let lightAngle = -Math.PI * 0.75;
          if (pointer.active) {
            const dx = pointer.smoothX - g.x;
            const dy = pointer.smoothY - g.y;
            const dist = Math.hypot(dx, dy);
            lightAngle = Math.atan2(dy, dx);
            glow = Math.max(0, 1 - Math.max(0, dist - g.pitchR * 0.5) / 310);
          }

          drawGear(g, gearTheta, glow, lightAngle);

          if (g.hasCompassNeedle && needles[needleCursor]) {
            const ns = needles[needleCursor];
            const targetAng = pointer.active
              ? Math.atan2(pointer.smoothY - g.y, pointer.smoothX - g.x)
              : -Math.PI / 2 + Math.sin(time * 0.0007 + needleCursor) * 0.18;

            if (!reducedMotion.matches) {
              const err = shortestAngleDiff(ns.angle, targetAng);
              // Underdamped magnetic compass needle spring physics
              ns.vel += err * 34 * dt;
              ns.vel *= Math.pow(0.025, dt);
              ns.angle += ns.vel * dt;
            } else {
              ns.angle = targetAng;
            }

            drawCompassNeedle(g, ns.angle, glow);
            needleCursor += 1;
          }
        }
      }

      // Render rising warm gold-leaf & crimson ember sparks from cursor sweeps/clicks
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const sp = sparks[i];
        sp.life += dt * 60;
        if (sp.life >= sp.maxLife) {
          sparks.splice(i, 1);
          continue;
        }
        sp.x += sp.vx * (dt * 60);
        sp.y += sp.vy * (dt * 60);
        sp.vx *= 0.97;
        const alpha = Math.sin((sp.life / sp.maxLife) * Math.PI) * 0.85;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.crimson
          ? `rgba(214, 48, 42, ${alpha.toFixed(3)})`
          : `rgba(255, 224, 158, ${alpha.toFixed(3)})`;
        ctx.fill();
      }

      if (!reducedMotion.matches) {
        frame = window.requestAnimationFrame(draw);
      }
    };

    const onVisibility = () => {
      if (!document.hidden && !frame && !reducedMotion.matches) {
        lastTime = 0;
        frame = window.requestAnimationFrame(draw);
      }
    };

    buildClockwork();
    frame = window.requestAnimationFrame(draw);

    window.addEventListener("resize", buildClockwork);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", buildClockwork);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

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
            "radial-gradient(640px circle at var(--spot-x) var(--spot-y), rgba(224, 178, 108, 0.14), rgba(143, 22, 22, 0.045) 45%, transparent 72%)",
        }}
      />

      {/* Interactive Horological Clockwork Gear Trains, Compass Needles & Astrolabe Alidade */}
      <canvas ref={clockworkCanvasRef} className="absolute inset-0 hidden lg:block" />

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
