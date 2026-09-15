import { useCallback, useEffect, useRef } from "react";
import { type GalleryEntry, getYouTubeId } from "../lib/gallery";

type GalleryLightboxProps = {
  entry: GalleryEntry;
  slide: number;
  onSlideChange: (slide: number) => void;
  onClose: () => void;
};

export function GalleryLightbox({ entry, slide, onSlideChange, onClose }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pointerStart = useRef<number | null>(null);
  const total = entry.media.length;

  const go = useCallback((direction: number) => {
    onSlideChange((slide + direction + total) % total);
  }, [onSlideChange, slide, total]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], iframe, [tabindex]:not([tabindex='-1'])"),
        ).filter((element) => !element.hasAttribute("disabled"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [go, onClose]);

  const media = entry.media[slide];

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-background/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-dialog-title"
      onClick={onClose}
    >
      <div ref={dialogRef} className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-col px-4 py-4 md:px-8 md:py-6" onClick={(event) => event.stopPropagation()}>
        <header className="flex items-start justify-between gap-6 border-b border-border/60 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
            <h2 id="gallery-dialog-title" className="mt-1 font-display text-xl font-semibold md:text-2xl">{entry.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent hover:text-foreground">
            Close <span aria-hidden="true">×</span>
          </button>
        </header>

        <div
          className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center py-4 md:py-6"
          onPointerDown={(event) => { pointerStart.current = event.clientX; }}
          onPointerUp={(event) => {
            if (pointerStart.current === null) return;
            const distance = event.clientX - pointerStart.current;
            pointerStart.current = null;
            if (Math.abs(distance) > 55) go(distance > 0 ? -1 : 1);
          }}
        >
          {media.type === "image" ? (
            <img src={media.src} alt={media.alt} className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl" decoding="async" />
          ) : (
            <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-lg border border-border bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(media.url)}`}
                title={media.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}

          {total > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-3 text-xl text-muted-foreground backdrop-blur transition-colors hover:border-accent hover:text-foreground md:left-2">←</button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-3 text-xl text-muted-foreground backdrop-blur transition-colors hover:border-accent hover:text-foreground md:right-2">→</button>
            </>
          )}
        </div>

        <footer className="flex items-end justify-between gap-6 border-t border-border/60 pt-4">
          <div className="max-w-xl">
            <p className="text-sm text-muted-foreground">{entry.description}</p>
            <div className="mt-2 flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground/70">{tag}</span>)}</div>
          </div>
          {total > 1 && (
            <div className="hidden gap-2 sm:flex" aria-label="Choose gallery image">
              {entry.media.map((item, index) => (
                <button key={`${item.type}-${index}`} type="button" onClick={() => onSlideChange(index)} aria-label={`View item ${index + 1}`} aria-current={index === slide ? "true" : undefined} className={`h-12 w-16 overflow-hidden rounded border transition-colors ${index === slide ? "border-accent" : "border-border opacity-55 hover:opacity-100"}`}>
                  {item.type === "image" ? <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span className="flex h-full items-center justify-center font-mono text-[9px]">VIDEO</span>}
                </button>
              ))}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
