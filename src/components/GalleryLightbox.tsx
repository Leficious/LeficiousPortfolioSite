import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { type GalleryEntry, getYouTubeId } from "../lib/gallery";
import { useLanguage } from "../lib/language";
import { galleryTagZh } from "../lib/localizedContent";
import { FormattedText } from "./FormattedText";
import { SoftwareStack } from "./SoftwareStack";

type GalleryLightboxProps = {
  entry: GalleryEntry;
  slide: number;
  onSlideChange: (slide: number) => void;
  onClose: () => void;
};

export function GalleryLightbox({ entry, slide, onSlideChange, onClose }: GalleryLightboxProps) {
  const { isChinese, text, localizedPath } = useLanguage();
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

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex bg-background/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-dialog-title"
      onClick={onClose}
    >
      <div ref={dialogRef} className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6" onClick={(event) => event.stopPropagation()}>
        <header className="relative z-10 flex shrink-0 items-start justify-between gap-4 border-b border-border/60 bg-background/95 pb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
            <h2 id="gallery-dialog-title" className="mt-1 font-display text-xl font-semibold md:text-2xl">{entry.title}</h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="shrink-0 rounded-full border border-accent/70 bg-surface/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground shadow-lg backdrop-blur transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground sm:px-5">
            <span aria-hidden="true">←</span> {text("Back to gallery", "返回画廊")} <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:gap-6 lg:overflow-hidden">
          <section
            className="relative flex min-h-[48vh] shrink-0 touch-pan-y items-center justify-center overflow-hidden py-4 md:py-6 lg:min-h-0 lg:shrink"
            aria-label={`${entry.title} media`}
            onPointerDown={(event) => { pointerStart.current = event.clientX; }}
            onPointerUp={(event) => {
              if (pointerStart.current === null) return;
              const distance = event.clientX - pointerStart.current;
              pointerStart.current = null;
              if (Math.abs(distance) > 55) go(distance > 0 ? -1 : 1);
            }}
          >
            {media.type === "image" ? (
              <img src={media.src} alt={media.alt} className="max-h-[64vh] w-full max-w-full rounded-lg object-contain shadow-2xl lg:h-full lg:max-h-full" decoding="async" />
            ) : (
              <div className="aspect-video w-full max-w-[1100px] overflow-hidden rounded-lg border border-border bg-black shadow-2xl">
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
                <button type="button" onClick={() => go(-1)} aria-label={text("Previous image", "上一张图片")} className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-3 text-xl text-muted-foreground backdrop-blur transition-colors hover:border-accent hover:text-foreground md:left-2">←</button>
                <button type="button" onClick={() => go(1)} aria-label={text("Next image", "下一张图片")} className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/80 p-3 text-xl text-muted-foreground backdrop-blur transition-colors hover:border-accent hover:text-foreground md:right-2">→</button>
              </>
            )}
          </section>

          <aside className="shrink-0 border-t border-border/60 py-6 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:py-6 lg:pl-6 lg:pr-2" aria-label={text("Project details", "项目详情")}>
            <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.17em] text-muted-foreground">
              <span>{entry.year}</span>
              <span aria-hidden="true">·</span>
              <span>{total} {text(total === 1 ? "item" : "items", "项内容")}</span>
              {entry.pinned && <><span aria-hidden="true">·</span><span className="text-accent">✦ {text("Pinned", "置顶")}</span></>}
            </div>

            <p className="mt-5 text-[15px] leading-7 text-foreground/85"><FormattedText>{entry.description}</FormattedText></p>

            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent">{text("Contribution", "个人贡献")}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.contribution}</p>
            </div>

            <div className="mt-6 border-t border-border/60 pt-5">
              <SoftwareStack software={entry.software} showLabels />
            </div>

            <div className="mt-6 border-t border-border/60 pt-5">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">{text("Disciplines", "方向")}</p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => <span key={tag} className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.13em] text-muted-foreground">{isChinese ? galleryTagZh[tag] : tag}</span>)}
              </div>
            </div>

            {entry.projectUrl && (
              <Link
                to={localizedPath(entry.projectUrl)}
                viewTransition
                onClick={onClose}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground"
              >
                {isChinese ? "查看完整项目" : entry.projectLabel ?? "View project"} <span aria-hidden="true">→</span>
              </Link>
            )}

            {total > 1 && (
              <div className="mt-7 border-t border-border/60 pt-5">
                <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-accent">{text("Sequence", "内容列表")}</p>
                <div className="grid grid-cols-4 gap-2" aria-label={text("Choose gallery item", "选择画廊内容")}>
                  {entry.media.map((item, index) => (
                    <button key={`${item.type}-${index}`} type="button" onClick={() => onSlideChange(index)} aria-label={`${text("View item", "查看第")} ${index + 1}`} aria-current={index === slide ? "true" : undefined} className={`aspect-[4/3] overflow-hidden rounded border bg-muted transition-all ${index === slide ? "border-accent opacity-100" : "border-border opacity-50 hover:border-accent/60 hover:opacity-100"}`}>
                      {item.type === "image" ? <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" /> : <span className="flex h-full items-center justify-center font-mono text-[8px] tracking-[0.12em]">VIDEO</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
