import { useLocation } from "react-router-dom";

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
  return base + stepIndex * 24;
}

/**
 * Persistent nocturnal celestial drafting mat (`#0E1017`).
 * 100% mathematical vector `<svg>` — rotates its outer and inner astrolabe dials
 * smoothly (`520ms` GPU transform) whenever the route or active binder tab changes.
 */
export function AmbientBackdrop({ dialStep = 0 }: { dialStep?: number }) {
  const { pathname } = useLocation();
  const bearing = routeBearing(pathname, dialStep);
  const innerBearing = -Math.round(bearing * 0.65);

  return (
    <div
      aria-hidden="true"
      className="celestial-mat pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0e1017]"
    >
      {/* Subtle radial studio desk falloff */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_54%_46%,rgba(34,42,64,0.36)_0%,rgba(14,16,23,0.92)_72%,#090b10_100%)]" />

      {/* Outer drafting mat frame hairlines on desktop */}
      <div className="absolute inset-y-4 left-[92px] right-5 hidden border border-[#c59a68]/16 lg:block">
        <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-[#c59a68]/45" />
        <span className="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-[#c59a68]/45" />
        <span className="absolute -bottom-1 -left-1 h-2 w-2 border-b border-l border-[#c59a68]/45" />
        <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b border-r border-[#c59a68]/45" />
      </div>

      {/* Mathematical Celestial Astrolabe Etching */}
      <svg
        viewBox="0 0 1000 1000"
        className="absolute left-1/2 top-1/2 h-[min(126vh,1180px)] w-[min(126vh,1180px)] -translate-x-[47%] -translate-y-1/2 opacity-90"
        fill="none"
      >
        {/* Fixed cardinal & diagonal surveyor axes */}
        <line x1="40" y1="500" x2="960" y2="500" stroke="#ece4d4" strokeWidth="0.55" opacity="0.07" />
        <line x1="500" y1="40" x2="500" y2="960" stroke="#ece4d4" strokeWidth="0.55" opacity="0.07" />
        <line x1="150" y1="150" x2="850" y2="850" stroke="#c59a68" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.08" />
        <line x1="850" y1="150" x2="150" y2="850" stroke="#c59a68" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.08" />

        {/* Outer rotating degree astrolabe */}
        <g
          style={{
            transform: `rotate(${bearing}deg)`,
            transformOrigin: "500px 500px",
            transition: "transform 560ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <circle cx="500" cy="500" r="424" stroke="#c59a68" strokeWidth="0.85" opacity="0.18" />
          <circle cx="500" cy="500" r="404" stroke="#ece4d4" strokeWidth="0.55" opacity="0.09" />
          <circle cx="500" cy="500" r="356" stroke="#ece4d4" strokeWidth="0.5" strokeDasharray="2 5" opacity="0.09" />

          {OUTER_TICKS.map((t, idx) => (
            <g key={idx}>
              <line
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke={t.major ? "#c59a68" : "#ece4d4"}
                strokeWidth={t.major ? "0.9" : "0.5"}
                opacity={t.major ? "0.26" : "0.11"}
              />
              {t.major && (
                <text
                  x={t.lx}
                  y={t.ly}
                  fill="#c59a68"
                  opacity="0.22"
                  fontSize="7.5"
                  fontFamily="IBM Plex Mono, monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {String(t.deg).padStart(3, "0")}°
                </text>
              )}
            </g>
          ))}

          {/* Inscribed hexagram / sextant chords */}
          <polygon
            points="500,96 850,702 150,702"
            stroke="#c59a68"
            strokeWidth="0.55"
            opacity="0.09"
          />
          <polygon
            points="500,904 850,298 150,298"
            stroke="#ece4d4"
            strokeWidth="0.5"
            opacity="0.065"
          />
        </g>

        {/* Inner counter-rotating ecliptic vernier ring */}
        <g
          style={{
            transform: `rotate(${innerBearing}deg)`,
            transformOrigin: "500px 500px",
            transition: "transform 560ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <circle cx="500" cy="500" r="280" stroke="#c59a68" strokeWidth="0.75" opacity="0.16" />
          <circle cx="500" cy="438" r="218" stroke="#ece4d4" strokeWidth="0.6" opacity="0.085" />
          <circle cx="500" cy="562" r="218" stroke="#c59a68" strokeWidth="0.55" opacity="0.085" />
          {INNER_TICKS.map((t, idx) => (
            <line
              key={idx}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="#c59a68"
              strokeWidth={t.major ? "0.85" : "0.5"}
              opacity={t.major ? "0.22" : "0.1"}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
