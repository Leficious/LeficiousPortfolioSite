import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { type GalleryEntry, getYouTubeId } from "../lib/gallery";
import { useLanguage } from "../lib/language";
import { galleryTagZh } from "../lib/localizedContent";
import { BrassRule, CrimsonStamp, FolioCorners } from "./AtelierChrome";
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
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#06080d]/92 p-2.5 backdrop-blur-md sm:p-5 md:p-7"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-dialog-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="parchment-sheet animate-folio-arc relative flex max-h-[95vh] w-full max-w-[1440px] flex-col overflow-hidden rounded-xs border-[5px] border-[#141720] px-4 py-4 sm:px-7 sm:py-6"
        onClick={(event) => event.stopPropagation()}
      >
        <FolioCorners tone="parchment" inset="inset-2 sm:inset-3" />

        {/* Top Archival Specimen Clasp Bar */}
        <header className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#8c683a]/40 pb-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-numeral text-xs font-semibold tracking-[0.2em] text-parchment-muted">
              {text("SPECIMEN PLATE", "标本图版")} {formattedPlate}
            </span>
            <span aria-hidden="true" className="text-[#8c683a]/60">·</span>
            <span className="font-mono text-xs font-medium text-rubric">
              {text("PASS", "图层")} {String(slide + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span aria-hidden="true" className="hidden text-[#8c683a]/60 sm:inline">·</span>
            <span className="hidden font-mono text-xs text-parchment-muted sm:inline">{entry.year}</span>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="brass-plaque shrink-0 cursor-pointer rounded-xs px-3.5 py-1.5 font-display text-xs font-bold tracking-wide transition-transform active:scale-95"
          >
            <span aria-hidden="true" className="mr-1.5">×</span>
            {text("Return to Salon Wall", "返回画廊墙")}
          </button>
        </header>

        {/* Main 2-Column Specimen Spread */}
        <div className="relative z-10 mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_350px] lg:gap-6 lg:overflow-hidden">
          {/* Left: Dark Velvet Inspection Stage + Contact-Sheet Pass Strip */}
          <div className="flex min-h-0 flex-col justify-between gap-3">
            <section
              className="relative flex min-h-[42vh] flex-1 touch-pan-y items-center justify-center overflow-hidden rounded-xs border-2 border-[#735329]/65 bg-[#0b0d13] p-2.5 shadow-[inset_0_0_32px_rgba(0,0,0,0.8)] lg:min-h-0"
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
              {media.type === "image" ? (
                <img
                  key={`${entry.id}-img-${slide}`}
                  src={media.src}
                  alt={media.alt}
                  className="animate-pass-settle max-h-[54vh] w-full max-w-full rounded-xs object-contain lg:h-full lg:max-h-full"
                  decoding="async"
                />
              ) : (
                <div
                  key={`${entry.id}-vid-${slide}`}
                  className="animate-pass-settle aspect-video max-h-[52vh] w-full max-w-[min(100%,calc(52vh*16/9))] overflow-hidden rounded-xs border border-warm/30 bg-black lg:h-full lg:max-h-full lg:w-auto lg:max-w-full"
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
                    className="absolute left-2.5 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-xs border border-[#dfc092]/50 bg-[#0e1017]/90 px-3 py-2 font-numeral text-sm text-[#f3e6ce] shadow-lg backdrop-blur-xs transition-colors hover:border-[#dfc092] hover:bg-[#dfc092] hover:text-[#15120e]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={text("Next pass", "下一张分解图")}
                    className="absolute right-2.5 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-xs border border-[#dfc092]/50 bg-[#0e1017]/90 px-3 py-2 font-numeral text-sm text-[#f3e6ce] shadow-lg backdrop-blur-xs transition-colors hover:border-[#dfc092] hover:bg-[#dfc092] hover:text-[#15120e]"
                  >
                    ›
                  </button>
                </>
              )}
            </section>

            {/* Bottom Photographic Contact-Sheet Pass Strip */}
            {total > 1 && (
              <div className="shrink-0 rounded-xs border border-[#8c683a]/45 bg-parchment-deep/65 px-3 py-2">
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
                        className={`group relative h-14 w-22 shrink-0 cursor-pointer overflow-hidden rounded-xs border-2 bg-[#0c0e14] transition-all ${
                          active
                            ? "-translate-y-0.5 border-rubric shadow-[0_3px_10px_rgba(139,38,36,0.35)]"
                            : "border-[#735329]/40 opacity-72 hover:border-[#735329] hover:opacity-100"
                        }`}
                      >
                        {item.type === "image" ? (
                          <img src={item.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <span className="flex h-full items-center justify-center font-numeral text-[10px] tracking-widest text-[#dfc092]">
                            ▶ REEL
                          </span>
                        )}
                        <span
                          className={`absolute left-1 top-1 rounded-xs px-1 py-0.2 font-mono text-[9.5px] font-semibold leading-tight ${
                            active ? "bg-rubric text-[#faf4e8]" : "bg-[#0e1017]/85 text-[#ece4d4]"
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

          {/* Right: Parchment Curatorial Ledger & Letterpress Tool Stamps */}
          <aside
            className="mt-4 flex shrink-0 flex-col justify-between border-t border-[#8c683a]/40 pt-4 lg:mt-0 lg:min-h-0 lg:overflow-y-auto lg:border-l lg:border-t-0 lg:pl-6 lg:pr-1 lg:pt-0"
            aria-label={text("Specimen notes", "标本技术说明")}
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2
                    id="gallery-dialog-title"
                    className="font-display text-2xl font-bold leading-tight tracking-tight text-parchment-ink"
                  >
                    {entry.title}
                  </h2>
                  <p className="mt-1 font-display text-sm italic text-rubric">
                    {entry.tags.map((tag) => (isChinese ? galleryTagZh[tag] : tag)).join(" · ")}
                  </p>
                </div>
                <CrimsonStamp label="SPECIMEN" className="h-11 w-11 opacity-85" />
              </div>

              <p className={`mt-4 text-[15px] leading-relaxed text-parchment-ink/92 ${isChinese ? "zh-readable" : ""}`}>
                <FormattedText>{entry.description}</FormattedText>
              </p>

              <div className="mt-4 rounded-xs border border-[#8c683a]/35 bg-parchment-deep/45 px-3.5 py-2.5">
                <p className="font-numeral text-[10px] tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Craft & Contribution", "负责模块")}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-parchment-ink/90">{entry.contribution}</p>
              </div>

              <BrassRule tone="parchment" className="my-4" />

              <SoftwareStack software={entry.software} showLabels tone="parchment" />
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-[#8c683a]/35 pt-4">
              {entry.projectUrl && (
                <Link
                  to={localizedPath(entry.projectUrl)}
                  viewTransition
                  className="inline-flex items-center justify-between rounded-xs bg-[#181513] px-4 py-2.5 font-display text-sm font-semibold text-[#f4ecdc] transition-colors hover:bg-[#2c2520]"
                >
                  <span>{isChinese ? "展开关联项目卷宗" : entry.projectLabel ?? "Open Related Case Folio"}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              )}

              {onNextEntry && (
                <button
                  type="button"
                  onClick={onNextEntry}
                  className="inline-flex cursor-pointer items-center justify-between rounded-xs border border-[#181513]/65 bg-transparent px-4 py-2 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513]/8"
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
