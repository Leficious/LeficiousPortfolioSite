import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Packs natural-height Salon cards across 1–3 columns synchronously before first paint
 * (via useLayoutEffect) so View Transitions capture the already-packed masonry layout
 * with zero post-paint card snapping.
 */
export function GalleryLayout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    let frame = 0;

    const pack = () => {
      const columns = window.innerWidth >= 1100 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      const gap = 22;
      const colWidth = (grid.clientWidth - gap * (columns - 1)) / columns;
      const bottoms = Array<number>(columns).fill(0);
      const cards = Array.from(grid.children) as HTMLElement[];
      grid.classList.add("gallery-layout--packed");

      for (let idx = 0; idx < cards.length; idx++) {
        const card = cards[idx];
        const wantsWide = card.dataset.wide === "true" && columns > 1;

        const minBottom = Math.min(...bottoms);
        let chosenSpan = 1;
        let chosenCol = 0;
        let chosenTop = Infinity;

        if (wantsWide) {
          for (let start = 0; start <= columns - 2; start++) {
            const diff = Math.abs(bottoms[start] - bottoms[start + 1]);
            const candidateTop = Math.max(bottoms[start], bottoms[start + 1]);
            if (diff <= 40 && candidateTop <= minBottom + 60 && candidateTop < chosenTop) {
              chosenSpan = 2;
              chosenCol = start;
              chosenTop = candidateTop;
            }
          }
        }

        if (chosenTop === Infinity) {
          chosenSpan = 1;
          for (let col = 0; col < columns; col++) {
            if (bottoms[col] < chosenTop) {
              chosenTop = bottoms[col];
              chosenCol = col;
            }
          }
        }

        const targetWidth = colWidth * chosenSpan + gap * (chosenSpan - 1);
        card.style.width = `${targetWidth}px`;
        card.style.left = `${chosenCol * (colWidth + gap)}px`;
        card.style.top = `${chosenTop}px`;

        const bottom = chosenTop + card.offsetHeight + gap;
        for (let c = chosenCol; c < chosenCol + chosenSpan; c++) {
          bottoms[c] = bottom;
        }
      }

      grid.style.height = `${Math.max(0, ...bottoms) - (cards.length ? gap : 0)}px`;
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pack);
    };

    pack();

    const observer = new ResizeObserver(schedule);
    observer.observe(grid);
    for (const child of grid.children) observer.observe(child);

    window.addEventListener("resize", schedule);
    grid.addEventListener("load", schedule, true);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      grid.removeEventListener("load", schedule, true);
    };
  }, [children]);

  return (
    <div ref={ref} className="gallery-layout">
      {children}
    </div>
  );
}
