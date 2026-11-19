import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { type GalleryEntry, getYouTubeId } from "../lib/gallery";
import { useLanguage } from "../lib/language";
import { galleryTagZh } from "../lib/localizedContent";
import { BrassCornerClasps, BrassRule, CrimsonStamp, FolioCorners } from "./AtelierChrome";
import { FormattedText } from "./FormattedText";
import { SoftwareStack } from "./SoftwareStack";

type GalleryLightboxProps = {
  entry: GalleryEntry;
  plateNumber?: number;
  slide: number;
  onSlideChange: (slide: number) => void;
  onClose: () => void;
  onNextEntry?: () => void;
  nextEntryTitle?: string;
};

export function GalleryLightbox({
  entry,
  plateNumber = 1,
  slide,
  onSlideChange,
  onClose,
  onNextEntry,
  nextEntryTitle,
}: GalleryLightboxProps) {
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
      if (event.key === "ArrowLeft" && total > 1) go(-1);
      if (event.key === "ArrowRight" && total > 1) go(1);

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
  }, [go, onClose, total]);

  const media = entry.media[slide] ?? entry.media[0];
  const formattedPlate = String(plateNumber).padStart(2, "0");

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#080605]/93 p-2.5 backdrop-blur-md sm:p-5 md:p-7"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-dialog-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="parchment-sheet animate-folio-arc relative flex max-h-[95vh] w-full max-w-[1440px] flex-col overflow-hidden border-[5px] border-[#110b07] px-4 py-4 shadow-[0_36px_88px_rgba(0,0,0,0.92),6px_6px_0_-1px_#dfd0b2,8px_8px_0_0_#110b07] sm:px-7 sm:py-6"
        onClick={(event) => event.stopPropagation()}
      >
        <FolioCorners tone="parchment" inset="inset-2 sm:inset-3" />

        <header className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#7a582e]/40 pb-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-numeral text-xs font-semibold tracking-[0.2em] text-parchment-muted">
              {text("SPECIMEN PLATE", "标本图版")} {formattedPlate}
            </span>
            <span aria-hidden="true" className="text-[#7a582e]/60">·</span>
            <span className="font-numeral text-xs font-bold tracking-[0.14em] text-rubric">
              {text("PASS", "图层")} {String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="hidden text-[#7a582e]/60 sm:inline">·</span>
            <span className="hidden font-numeral text-xs text-parchment-muted sm:inline">{entry.year}</span>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="brass-plaque shrink-0 cursor-pointer px-4 py-1.5 font-numeral text-xs font-bold tracking-[0.12em] uppercase transition-transform active:scale-95"
          >
            <span aria-hidden="true" className="mr-1.5">×</span>
            {text("Return to Salon Wall", "返回画廊墙")}
          </button>
        </header>

        <div className="relative z-10 mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-6 lg:overflow-hidden">
          <div className="flex min-h-0 flex-col justify-between gap-3">
            <section
              className="relative flex min-h-[42vh] flex-1 touch-pan-y items-center justify-center overflow-hidden border-2 border-[#6e4e27] bg-[#0b0806] p-3 shadow-[inset_0_0_32px_rgba(0,0,0,0.85)] lg:min-h-0"
              aria-label={`${entry.title} media`}
              onPointerDown={(event) => {
                pointerStart.current = event.clientX;
              }}
              onPointerUp={(event) => {
                if (pointerStart.current === null || total <= 1) return;
                const distance = event.clientX - pointerStart.current;
                pointerStart.current = null;
                if (Math.abs(distance) > 55) go(distance > 0 ? -1 : 1);
              }}
            >
              <BrassCornerClasps sizeClass="h-10 w-10 sm:h-13 sm:w-13" />

              {media.type === "image" ? (
                <img
                  key={`${entry.id}-img-${slide}`}
                  src={media.src}
                  alt={media.alt}
                  className="animate-pass-settle max-h-[54vh] w-full max-w-full object-contain lg:h-full lg:max-h-full"
                  decoding="async"
                />
              ) : (
                <div
                  key={`${entry.id}-vid-${slide}`}
                  className="animate-pass-settle aspect-video max-h-[52vh] w-full max-w-[min(100%,calc(52vh*16/9))] overflow-hidden border border-warm/35 bg-black lg:h-full lg:max-h-full lg:w-auto lg:max-w-full"
                >
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
                    aria-label={text("Previous pass", "上一张分解图")}
                    className="absolute left-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer border border-[#c6a06a]/55 bg-[#120d0a]/92 px-3 py-2 font-numeral text-sm text-[#f2e5cb] shadow-lg backdrop-blur-xs transition-colors hover:border-[#c6a06a] hover:bg-[#b8925d] hover:text-[#150e08]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={text("Next pass", "下一张分解图")}
                    className="absolute right-3 top-1/2 z-20 -translate-y-1/2 cursor-pointer border border-[#c6a06a]/55 bg-[#120d0a]/92 px-3 py-2 font-numeral text-sm text-[#f2e5cb] shadow-lg backdrop-blur-xs transition-colors hover:border-[#c6a06a] hover:bg-[#b8925d] hover:text-[#150e08]"
                  >
                    ›
                  </button>
                </>
              )}
            </section>

            {total > 1 && (
              <div className="shrink-0 border border-[#7a582e]/45 bg-parchment-deep/65 px-3 py-2">
                <div
                  className="flex items-center gap-2 overflow-x-auto pb-0.5"
                  aria-label={text("Choose breakdown pass", "切换制作图层")}
                >
                  {entry.media.map((item, index) => {
                    const active = index === slide;
                    return (
                      <button
                        key={`${item.type}-${index}`}
                        type="button"
                        onClick={() => onSlideChange(index)}
                        aria-label={`${text("Pass", "图层")} ${index + 1}`}
                        aria-current={active ? "true" : undefined}
                        className={`group relative h-14 w-22 shrink-0 cursor-pointer overflow-hidden border-2 bg-[#0d0a08] transition-colors ${
                          active
                            ? "border-rubric shadow-[0_3px_10px_rgba(125,25,25,0.45)]"
                            : "border-[#6e4e27]/45 opacity-75 hover:border-[#6e4e27] hover:opacity-100"
                        }`}
                      >
                        {item.type === "image" ? (
                          <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <span className="flex h-full items-center justify-center font-numeral text-[10px] tracking-widest text-[#d8b47c]">
                            ▶ REEL
                          </span>
                        )}
                        <span
                          className={`absolute left-1 top-1 px-1 py-0.2 font-numeral text-[9.5px] font-bold leading-tight ${
                            active ? "bg-rubric text-[#faf3e6]" : "bg-[#120d0a]/88 text-[#ece2d0]"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <aside
            className="mt-4 flex shrink-0 flex-col justify-between border-t border-[#7a582e]/40 pt-4 lg:mt-0 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pl-6 lg:pr-1 lg:pt-0"
            aria-label={text("Specimen notes", "标本技术说明")}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    id="gallery-dialog-title"
                    className="font-display text-2xl font-semibold leading-tight tracking-tight text-parchment-ink"
                  >
                    {entry.title}
                  </h2>
                  <p className="mt-1 font-display text-sm italic text-rubric">
                    {entry.tags.map((tag) => (isChinese ? galleryTagZh[tag] : tag)).join(" · ")}
                  </p>
                </div>
                <CrimsonStamp className="h-12 w-12" />
              </div>

              <p className={`mt-4 text-[16px] leading-[1.62] text-parchment-ink/94 ${isChinese ? "zh-readable" : ""}`}>
                <FormattedText>{entry.description}</FormattedText>
              </p>

              <div className="victorian-ticket embossed-ticket mt-4 border border-[#61411d]/75 bg-parchment-deep/80 px-3.5 py-2.5 [--ticket-border:rgba(97,65,29,0.75)]">
                <p className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Craft & Contribution", "负责模块")}
                </p>
                <p className="mt-1 text-[14.5px] leading-snug text-parchment-ink/94">{entry.contribution}</p>
              </div>

              <BrassRule ornate tone="parchment" className="my-4" />

              <SoftwareStack software={entry.software} showLabels tone="parchment" />
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-[#7a582e]/35 pt-4">
              {entry.projectUrl && (
                <Link
                  to={localizedPath(entry.projectUrl)}
                  viewTransition
                  className="victorian-ticket inline-flex items-center justify-between bg-[#191310] px-4 py-2.5 font-numeral text-xs font-semibold tracking-[0.1em] text-[#f2e8d5] uppercase transition-colors hover:bg-[#2e231d]"
                >
                  <span>{isChinese ? "展开关联项目卷宗" : entry.projectLabel ?? "Open Related Case Folio"}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              )}

              {onNextEntry && (
                <button
                  type="button"
                  onClick={onNextEntry}
                  className="victorian-ticket inline-flex cursor-pointer items-center justify-between border border-[#191310]/70 bg-transparent px-4 py-2 font-display text-sm font-semibold text-parchment-ink transition-colors [--ticket-border:rgba(25,19,16,0.7)] hover:bg-[#191310]/8"
                >
                  <span className="truncate pr-2">
                    {text("Next Specimen Plate", "下一件标本")}
                    {nextEntryTitle ? ` · ${nextEntryTitle}` : ""}
                  </span>
                  <span aria-hidden="true" className="shrink-0">→</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body,
  );
}
