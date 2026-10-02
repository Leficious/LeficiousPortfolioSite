import { useEffect, useRef, type ReactNode } from "react";

/** Packs natural-height cards; no card is stretched to fill a neighbouring row. */
export function GalleryLayout({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = ref.current;
    if (!grid) return;
    let frame = 0;
    const pack = () => {
      const columns = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
      const gap = 24;
      const width = (grid.clientWidth - gap * (columns - 1)) / columns;
      const bottoms = Array<number>(columns).fill(0);
      const cards = Array.from(grid.children) as HTMLElement[];
      grid.classList.add("gallery-layout--packed");
      for (const card of cards) {
        const span = card.dataset.wide === "true" ? Math.min(2, columns) : 1;
        card.style.width = `${width * span + gap * (span - 1)}px`;
        let column = 0;
        let top = Infinity;
        for (let start = 0; start <= columns - span; start++) {
          const candidate = Math.max(...bottoms.slice(start, start + span));
          if (candidate < top) { top = candidate; column = start; }
        }
        card.style.left = `${column * (width + gap)}px`;
        card.style.top = `${top}px`;
        const bottom = top + card.offsetHeight + gap;
        for (let i = column; i < column + span; i++) bottoms[i] = bottom;
      }
      grid.style.height = `${Math.max(0, ...bottoms) - (cards.length ? gap : 0)}px`;
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(pack); };
    const observer = new ResizeObserver(schedule);
    observer.observe(grid);
    for (const child of grid.children) observer.observe(child);
    window.addEventListener("resize", schedule);
    pack();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener("resize", schedule); };
  }, [children]);
  return <div ref={ref} className="gallery-layout">{children}</div>;
}
