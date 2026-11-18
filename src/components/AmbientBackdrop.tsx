import { useLocation } from "react-router-dom";
import { LamplightDustCanvas } from "./AtelierMotion";

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
    lx: (500 + Math.cos(rad) * 392).toFixed(1),
    ly: (500 + Math.sin(rad) * 392).toFixed(1),
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

/**
 * Persistent nocturnal Victorian mahogany & soot celestial drafting desk (`#0D0A09` — zero blue!).
 * Combines continuous slow clockwork astrolabe drift, 60fps cursor parallax,
 * warm candlelit umber falloff, and rising ember/parchment dust motes.
 */
export function AmbientBackdrop({ dialStep = 0 }: { dialStep?: number }) {
  const { pathname } = useLocation();
  const bearing = routeBearing(pathname, dialStep);
  const innerBearing = -Math.round(bearing * 0.68);

  return (
    <div
      aria-hidden="true"
      className="celestial-mat pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0d0a09]"
    >
      {/* Warm candlelit mahogany & soot study falloff (ZERO blue channel!) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_54%_46%,rgba(52,33,20,0.44)_0%,rgba(16,12,10,0.94)_72%,#070504_100%)]" />
      <div
        className="absolute -inset-24 opacity-90"
        style={{
          background:
            "radial-gradient(620px circle at var(--spot-x) var(--spot-y), rgba(168, 132, 82, 0.085), rgba(125, 25, 25, 0.025) 46%, transparent 72%)",
        }}
      />

      {/* Outer Victorian drafting mat double-bronze frame hairlines on desktop */}
      <div className="absolute inset-y-3.5 left-[90px] right-4 hidden border border-[#a88452]/22 lg:block">
        <div className="absolute inset-[3px] border border-[#a88452]/10" />
        <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-[#a88452]/65" />
        <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-[#a88452]/65" />
        <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-[#a88452]/65" />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-[#a88452]/65" />
      </div>

      {/* Mathematical Celestial Astrolabe Etching in Tarnished Bronze & Chalk */}
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
          <line x1="40" y1="500" x2="960" y2="500" stroke="#e8dcc4" strokeWidth="0.55" opacity="0.065" />
          <line x1="500" y1="40" x2="500" y2="960" stroke="#e8dcc4" strokeWidth="0.55" opacity="0.065" />
          <line x1="150" y1="150" x2="850" y2="850" stroke="#a88452" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.09" />
          <line x1="850" y1="150" x2="150" y2="850" stroke="#a88452" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.09" />

          <g
            style={{
              transform: `rotate(${bearing}deg)`,
              transformOrigin: "500px 500px",
              transition: "transform 620ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <g className="animate-astrolabe-cw">
              <circle cx="500" cy="500" r="424" stroke="#a88452" strokeWidth="0.95" opacity="0.22" />
              <circle cx="500" cy="500" r="404" stroke="#e8dcc4" strokeWidth="0.55" opacity="0.09" />
              <circle cx="500" cy="500" r="356" stroke="#a88452" strokeWidth="0.5" strokeDasharray="2 5" opacity="0.11" />

              {OUTER_TICKS.map((t, idx) => (
                <g key={idx}>
                  <line
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={t.major ? "#a88452" : "#e8dcc4"}
                    strokeWidth={t.major ? "0.95" : "0.5"}
                    opacity={t.major ? "0.3" : "0.11"}
                  />
                  {t.major && (
                    <text
                      x={t.lx}
                      y={t.ly}
                      fill="#a88452"
                      opacity="0.26"
                      fontSize="8"
                      fontFamily="Cinzel Variable, serif"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {String(t.deg).padStart(3, "0")}°
                    </text>
                  )}
                </g>
              ))}

              <polygon points="500,96 850,702 150,702" stroke="#a88452" strokeWidth="0.55" opacity="0.1" />
              <polygon points="500,904 850,298 150,298" stroke="#7d1919" strokeWidth="0.55" opacity="0.12" />
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
              <circle cx="500" cy="500" r="280" stroke="#a88452" strokeWidth="0.8" opacity="0.18" />
              <circle cx="500" cy="438" r="218" stroke="#e8dcc4" strokeWidth="0.6" opacity="0.08" />
              <circle cx="500" cy="562" r="218" stroke="#a88452" strokeWidth="0.55" opacity="0.09" />
              {INNER_TICKS.map((t, idx) => (
                <line
                  key={idx}
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#a88452"
                  strokeWidth={t.major ? "0.9" : "0.5"}
                  opacity={t.major ? "0.24" : "0.1"}
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
