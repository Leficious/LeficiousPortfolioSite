import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useSearchParams } from "react-router-dom";

export type NavEncounterMode = "tabs" | "flags" | "crossbar";

export function useNavEncounterMode(): { mode: NavEncounterMode; navQuery: string } {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get("nav");
  const mode: NavEncounterMode = raw === "flags" || raw === "crossbar" ? raw : "tabs";
  const navQuery = raw === "flags" || raw === "crossbar" ? `?nav=${raw}` : "";
  return { mode, navQuery };
}

/**
 * Global 60fps lerped cursor parallax & desk lamplight sheen driver.
 * Updates CSS custom properties on <html> without triggering React re-renders.
 */
export function useDeskParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    if (reduced.matches || !finePointer.matches) return;

    const root = document.documentElement;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let spotX = window.innerWidth * 0.52;
    let spotY = window.innerHeight * 0.44;
    let curSpotX = spotX;
    let curSpotY = spotY;
    let rafId = 0;
    let running = false;

    const tick = () => {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      curSpotX += (spotX - curSpotX) * 0.12;
      curSpotY += (spotY - curSpotY) * 0.12;

      root.style.setProperty("--mx", currentX.toFixed(4));
      root.style.setProperty("--my", currentY.toFixed(4));
      root.style.setProperty("--spot-x", `${curSpotX.toFixed(1)}px`);
      root.style.setProperty("--spot-y", `${curSpotY.toFixed(1)}px`);

      if (
        Math.abs(targetX - currentX) > 0.0008 ||
        Math.abs(targetY - currentY) > 0.0008 ||
        Math.abs(spotX - curSpotX) > 0.4 ||
        Math.abs(spotY - curSpotY) > 0.4
      ) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const onPointerMove = (event: globalThis.PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      targetX = (event.clientX / w - 0.5) * 2;
      targetY = (event.clientY / h - 0.5) * 2;
      spotX = event.clientX;
      spotY = event.clientY;
      if (!running) {
        running = true;
        rafId = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);
}

/**
 * Fires once when an element enters the viewport so GDD bars and chapters deal in crisply.
 * Defaults to visible during SSR and reduced-motion so content is never locked hidden.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(rootMargin = "0px 0px -8% 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    return false;
  });

  useEffect(() => {
    if (inView) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

/**
 * Pointer-tracked subtle 3D tilt & metallic brass foil glint handler for tactile cards.
 */
export function handleTactileCardMove(event: PointerEvent<HTMLElement>, maxDeg = 3.5) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (event.clientX - rect.left) / Math.max(rect.width, 1);
  const py = (event.clientY - rect.top) / Math.max(rect.height, 1);
  const rx = (0.5 - py) * maxDeg * 2;
  const ry = (px - 0.5) * maxDeg * 2;
  el.style.setProperty("--card-rx", `${rx.toFixed(2)}deg`);
  el.style.setProperty("--card-ry", `${ry.toFixed(2)}deg`);
  el.style.setProperty("--glint-x", `${(px * 100).toFixed(1)}%`);
  el.style.setProperty("--glint-y", `${(py * 100).toFixed(1)}%`);
}

export function resetTactileCard(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  el.style.setProperty("--card-rx", "0deg");
  el.style.setProperty("--card-ry", "0deg");
}
