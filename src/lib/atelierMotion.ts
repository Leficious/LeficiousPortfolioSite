import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let clientHydratedForPortals = false;
export function markClientHydratedForPortals() {
  clientHydratedForPortals = true;
}
export function isClientHydratedForPortals(): boolean {
  return clientHydratedForPortals;
}

/**
 * Global frame-rate-independent lerped cursor parallax & desk lamplight sheen driver.
 * Updates CSS custom properties on <html> without triggering React re-renders,
 * converging smoothly to exact target across 60Hz, 144Hz, and 240Hz displays.
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
    let lastTime = 0;
    let rafId = 0;
    let running = false;

    const tick = (now: number) => {
      const dt = lastTime ? Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000)) : 1 / 60;
      lastTime = now;

      const alphaParallax = 1 - Math.exp(-8.5 * dt);
      const alphaSpot = 1 - Math.exp(-11.5 * dt);

      currentX += (targetX - currentX) * alphaParallax;
      currentY += (targetY - currentY) * alphaParallax;
      curSpotX += (spotX - curSpotX) * alphaSpot;
      curSpotY += (spotY - curSpotY) * alphaSpot;

      const settling =
        Math.abs(targetX - currentX) > 0.00025 ||
        Math.abs(targetY - currentY) > 0.00025 ||
        Math.abs(spotX - curSpotX) > 0.12 ||
        Math.abs(spotY - curSpotY) > 0.12;

      if (!settling) {
        currentX = targetX;
        currentY = targetY;
        curSpotX = spotX;
        curSpotY = spotY;
      }

      root.style.setProperty("--mx", currentX.toFixed(4));
      root.style.setProperty("--my", currentY.toFixed(4));
      root.style.setProperty("--spot-x", `${curSpotX.toFixed(1)}px`);
      root.style.setProperty("--spot-y", `${curSpotY.toFixed(1)}px`);

      if (settling) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        running = false;
        lastTime = 0;
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
        lastTime = 0;
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
 * Fires once when a below-the-fold element enters the viewport.
 * Initializes `true` on both SSR and client so above-the-fold elements never
 * hydration-mismatch or flash invisible, only arming below-the-fold nodes before paint.
 */
export function useInViewOnce<T extends HTMLElement = HTMLDivElement>(rootMargin = "120px 0px 80px 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState<boolean>(true);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.94) {
      return;
    }

    setInView(false);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

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
