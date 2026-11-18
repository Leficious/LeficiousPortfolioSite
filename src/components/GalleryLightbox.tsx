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

  const go = useCallback(
    (direction: number) => {
      onSlideChange((slide + direction + total) % total);
    },
    [onSlideChange, slide, total],
  );

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
      className="fixed inset-0 z-[300] flex bg-background/96 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-dialog-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-col overflow-hidden px-4 py-4 md:px-8 md:py-6"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 id="gallery-dialog-title" className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              {entry.title}
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-xs border border-border bg-surface px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            {text("Close", "关闭")} <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:gap-6 lg:overflow-hidden">
          <section
            className="relative flex min-h-[48vh] shrink-0 touch-pan-y items-center justify-center overflow-hidden py-4 md:py-6 lg:min-h-0 lg:shrink"
            aria-label={`${entry.title} media`}
            onPointerDown={(event) => {
              pointerStart.current = event.clientX;
            }}
            onPointerUp={(event) => {
              if (pointerStart.current === null) return;
              const distance = event.clientX - pointerStart.current;
              pointerStart.current = null;
              if (Math.abs(distance) > 55) go(distance > 0 ? -1 : 1);
            }}
          >
            {media.type === "image" ? (
              <img
                src={media.src}
                alt={media.alt}
                className="max-h-[64vh] w-full max-w-full rounded-xs object-contain lg:h-full lg:max-h-full"
                decoding="async"
              />
            ) : (
              <div className="aspect-video w-full max-w-[1100px] overflow-hidden rounded-xs border border-border bg-black">
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
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={text("Previous image", "上一张图片")}
                  className="absolute left-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-xs border border-border bg-background/90 px-3 py-2 text-base text-muted-foreground transition-colors hover:border-foreground hover:text-foreground md:left-2"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={text("Next image", "下一张图片")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-xs border border-border bg-background/90 px-3 py-2 text-base text-muted-foreground transition-colors hover:border-foreground hover:text-foreground md:right-2"
                >
                  →
                </button>
              </>
            )}
          </section>

          <aside
            className="shrink-0 border-t border-border py-6 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:py-6 lg:pl-6 lg:pr-2"
            aria-label={text("Work details", "作品详情")}
          >
            <div className="flex items-center gap-2.5 font-mono text-xs text-muted-foreground">
              <span>{entry.year}</span>
              <span aria-hidden="true">·</span>
              <span>
                {total} {text(total === 1 ? "frame" : "frames", "项内容")}
              </span>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
              <FormattedText>{entry.description}</FormattedText>
            </p>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs font-medium text-foreground/75">{text("What I built", "负责内容")}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{entry.contribution}</p>
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <SoftwareStack software={entry.software} showLabels />
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-xs border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {isChinese ? galleryTagZh[tag] : tag}
                  </span>
                ))}
              </div>
            </div>

            {entry.projectUrl && (
              <Link
                to={localizedPath(entry.projectUrl)}
                viewTransition
                className="mt-6 inline-flex items-center gap-2 rounded-xs border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              >
                {isChinese ? "查看完整项目拆解" : entry.projectLabel ?? "Read full case study"} <span aria-hidden="true">→</span>
              </Link>
            )}

            {total > 1 && (
              <div className="mt-6 border-t border-border pt-4">
                <div className="grid grid-cols-4 gap-2" aria-label={text("Choose frame", "选择画面")}>
                  {entry.media.map((item, index) => (
                    <button
                      key={`${item.type}-${index}`}
                      type="button"
                      onClick={() => onSlideChange(index)}
                      aria-label={`${text("View item", "查看第")} ${index + 1}`}
                      aria-current={index === slide ? "true" : undefined}
                      className={`aspect-[4/3] cursor-pointer overflow-hidden rounded-xs border bg-muted transition-opacity ${
                        index === slide ? "border-foreground opacity-100" : "border-border opacity-55 hover:opacity-100"
                      }`}
                    >
                      {item.type === "image" ? (
                        <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="flex h-full items-center justify-center font-mono text-[10px]">VIDEO</span>
                      )}
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
