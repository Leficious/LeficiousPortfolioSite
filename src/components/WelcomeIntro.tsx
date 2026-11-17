import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useLanguage } from "../lib/language";
import { HeroBootLockup, type HeroBootLockupHandle } from "./BrandMark";

const CURTAIN_SESSION_KEY = "leficious-boot-curtain-v1";
const emptySubscribe = () => () => {};
const getClientHydrated = () => true;
const getServerHydrated = () => false;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Symmetric mechanical hydraulic curve (matches cubic-bezier(0.76, 0, 0.24, 1)). */
function easeInOutQuart(x: number) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeOutExpo(x: number) {
  return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

type WelcomeIntroProps = {
  onActiveChange?: (active: boolean) => void;
};

/**
 * Fast (~1.5s) GPU-composited Tactical Boot Curtain.
 * Zero <canvas>, zero SVG <mask>, zero blur filters: two GPU translate3d
 * blast shutters + driven P03-E2 vector lockup, auto-parting straight into
 * the homepage with zero click wall.
 */
export function WelcomeIntro({ onActiveChange }: WelcomeIntroProps) {
  const { text } = useLanguage();
  const hydrated = useSyncExternalStore(emptySubscribe, getClientHydrated, getServerHydrated);
  const [done, setDone] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const topShutterRef = useRef<HTMLDivElement>(null);
  const botShutterRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const lockupRef = useRef<HeroBootLockupHandle>(null);
  const t0Ref = useRef<number>(0);
  const skipAtRef = useRef<number | null>(null);

  const shouldRun = useMemo(() => {
    if (!hydrated) return false;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("intro") === "1") return true;

      const cleanPath = window.location.pathname.replace(/\/$/, "") || "/";
      if (cleanPath !== "/" && cleanPath !== "/zh") return false;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return false;
      }

      return sessionStorage.getItem(CURTAIN_SESSION_KEY) !== "1";
    } catch {
      return false;
    }
  }, [hydrated]);

  const active = shouldRun && !done;

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useEffect(() => {
    if (!active) return;

    try {
      sessionStorage.setItem(CURTAIN_SESSION_KEY, "1");
    } catch {
      // Session storage can be blocked in strict privacy modes.
    }

    let raf = 0;
    const t0 = performance.now();
    t0Ref.current = t0;
    skipAtRef.current = null;
    let lastPct = -1;
    let pointerReleased = false;

    const triggerSkip = () => {
      if (skipAtRef.current !== null) return;
      skipAtRef.current = (performance.now() - t0) / 1000;
      if (rootRef.current && !pointerReleased) {
        pointerReleased = true;
        rootRef.current.style.pointerEvents = "none";
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        triggerSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const skipT = skipAtRef.current;

      // Drive P03-E2 + LEFICIOUS vector lockup up until shutter split completes
      lockupRef.current?.step(t);

      // Update top-right calibration telemetry (only touch textContent when integer changes)
      const syncRatio = clamp01(t / 1.22);
      const pct = Math.round(easeOutExpo(syncRatio) * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (pctRef.current) {
          pctRef.current.textContent = `${String(pct).padStart(3, "0")}%`;
        }
      }
      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${easeOutExpo(syncRatio).toFixed(3)})`;
      }

      // Compute shutter split progress (normal auto-split starts at 1.30s over 0.48s; skip splits immediately over 0.36s)
      const splitStart = skipT !== null ? Math.min(skipT, 1.3) : 1.3;
      const splitDur = skipT !== null ? 0.36 : 0.48;
      const rawSplit = clamp01((t - splitStart) / splitDur);
      const split = easeInOutQuart(rawSplit);

      // Release pointer events as soon as shutters begin parting so there is zero click wall
      if (t >= splitStart - 0.04 && !pointerReleased && rootRef.current) {
        pointerReleased = true;
        rootRef.current.style.pointerEvents = "none";
      }

      // Horizontal seam beam ignition right before shutter release
      if (seamRef.current) {
        if (skipT !== null) {
          const seamFade = 1 - clamp01((t - skipT) / 0.18);
          seamRef.current.style.transform = "scaleX(1)";
          seamRef.current.style.opacity = (seamFade * 0.7).toFixed(2);
        } else if (t >= 1.12 && t <= 1.52) {
          const seamGrow = easeOutExpo(clamp01((t - 1.12) / 0.2));
          const seamFade = t < 1.32 ? 1 : 1 - clamp01((t - 1.32) / 0.2);
          seamRef.current.style.transform = `scaleX(${seamGrow.toFixed(3)})`;
          seamRef.current.style.opacity = (seamFade * 0.9).toFixed(2);
        } else {
          seamRef.current.style.opacity = "0";
        }
      }

      // Center lockup clean disengage as blast doors unlatch
      if (stageRef.current) {
        const fadeOut = clamp01((t - (splitStart - 0.03)) / 0.17);
        const op = 1 - fadeOut;
        const sc = 1 - fadeOut * 0.03;
        stageRef.current.style.opacity = op.toFixed(3);
        stageRef.current.style.transform = `translate3d(0, 0, 0) scale(${sc.toFixed(4)})`;
      }

      // GPU-composited upper & lower architectural shutters
      if (topShutterRef.current && botShutterRef.current) {
        const pctShift = split * 102;
        topShutterRef.current.style.transform = `translate3d(0, -${pctShift.toFixed(2)}%, 0)`;
        botShutterRef.current.style.transform = `translate3d(0, ${pctShift.toFixed(2)}%, 0)`;
      }

      if (rawSplit < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      onClick={() => {
        if (skipAtRef.current === null) {
          skipAtRef.current = (performance.now() - t0Ref.current) / 1000;
          if (rootRef.current) rootRef.current.style.pointerEvents = "none";
        }
      }}
      aria-hidden="true"
      className="fixed inset-0 z-[100] overflow-hidden select-none"
    >
      {/* Upper architectural blast shutter */}
      <div
        ref={topShutterRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0d1218] [background-image:linear-gradient(to_right,rgba(130,165,195,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(130,165,195,0.035)_1px,transparent_1px)] [background-size:48px_48px] will-change-transform"
      >
        <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-8 sm:top-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 border-l border-t border-warm/75" />
            <span className="font-mono text-[10px] tracking-[0.26em] text-muted-foreground/80 uppercase">
              P03-E2 // LEFICIOUS.COM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[2px] w-14 overflow-hidden bg-border/60 sm:w-20">
              <div
                ref={barFillRef}
                className="h-full w-full origin-left scale-x-0 bg-warm will-change-transform"
              />
            </div>
            <span
              ref={pctRef}
              className="w-9 text-right font-mono text-[10px] tracking-[0.18em] text-warm/90"
            >
              000%
            </span>
            <span className="h-2.5 w-2.5 border-r border-t border-warm/75" />
          </div>
        </div>

        {/* Machined seam lip & registration ticks along upper door */}
        <div className="pointer-events-none absolute right-[calc(50%+235px)] bottom-0 left-8 hidden h-px bg-border/75 sm:block" />
        <div className="pointer-events-none absolute right-8 bottom-0 left-[calc(50%+235px)] hidden h-px bg-border/75 sm:block" />
        <div className="pointer-events-none absolute bottom-0 left-8 hidden h-4 w-px bg-border/70 sm:block" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 hidden h-2 w-px bg-warm/45 md:block" />
        <div className="pointer-events-none absolute right-1/4 bottom-0 hidden h-2 w-px bg-warm/45 md:block" />
        <div className="pointer-events-none absolute right-8 bottom-0 hidden h-4 w-px bg-border/70 sm:block" />
      </div>

      {/* Lower architectural blast shutter */}
      <div
        ref={botShutterRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0d1218] [background-image:linear-gradient(to_right,rgba(130,165,195,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(130,165,195,0.035)_1px,transparent_1px)] [background-size:48px_48px] will-change-transform"
      >
        <div className="pointer-events-none absolute top-0 right-[calc(50%+235px)] left-8 hidden h-px bg-border/75 sm:block" />
        <div className="pointer-events-none absolute top-0 right-8 left-[calc(50%+235px)] hidden h-px bg-border/75 sm:block" />
        <div className="pointer-events-none absolute top-0 left-8 hidden h-4 w-px bg-border/70 sm:block" />
        <div className="pointer-events-none absolute top-0 left-1/4 hidden h-2 w-px bg-warm/45 md:block" />
        <div className="pointer-events-none absolute top-0 right-1/4 hidden h-2 w-px bg-warm/45 md:block" />
        <div className="pointer-events-none absolute top-0 right-8 hidden h-4 w-px bg-border/70 sm:block" />

        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between sm:inset-x-8 sm:bottom-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 border-b border-l border-warm/75" />
            <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground/80 uppercase">
              {text(
                "Lefi (Kevin) Shan · Game, Level & Technical Design",
                "单凯飞 Lefi Shan · 游戏、关卡与技术设计",
              )}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden font-mono text-[9px] tracking-[0.22em] text-muted-foreground/50 uppercase sm:inline">
              {text("Click / Esc", "点击 / Esc")}
            </span>
            <span className="h-2.5 w-2.5 border-r border-b border-warm/75" />
          </div>
        </div>
      </div>

      {/* Horizontal center seam ignition line */}
      <div
        ref={seamRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 scale-x-0 bg-gradient-to-r from-transparent via-warm to-transparent opacity-0 will-change-transform"
      />

      {/* Center lockup stage */}
      <div
        ref={stageRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 will-change-transform"
      >
        <HeroBootLockup ref={lockupRef} />
      </div>
    </div>
  );
}
