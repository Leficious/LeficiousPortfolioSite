import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MediaItem } from "../lib/projects";
import { useLanguage } from "../lib/language";
import { BrassCornerClasps } from "./AtelierChrome";
import { FormattedText } from "./FormattedText";

function ExpandIcon({ close = false }: { close?: boolean }) {
  if (close) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.5]">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-none stroke-current stroke-[1.5]">
      <path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5" />
    </svg>
  );
}

function ExpandableImage({ item }: { item: Extract<MediaItem, { type: "image" }> }) {
  const { text } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!expanded) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"),
      );
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
    };

    window.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleDialogKeys);
      trigger?.focus();
    };
  }, [expanded]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setExpanded(true)}
        className="group relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`${text("Expand plate", "放大图版")}: ${item.alt}`}
      >
        <img
          src={item.src}
          alt={item.alt}
          width={item.width ?? 1600}
          height={item.height ?? 900}
          loading="lazy"
          decoding="async"
          className={`${item.naturalAspect ? "" : "aspect-video "}h-auto w-full bg-[#0b0806] object-contain transition-transform duration-300 group-hover:scale-[1.008]`}
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 border border-warm/45 bg-[#120d0a]/92 px-2.5 py-1.5 font-numeral text-[12.5px] font-semibold tracking-wider text-[#f2e5cb] uppercase opacity-0 backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ExpandIcon />
          {text("Inspect Plate", "放大检视")}
        </span>
      </button>

      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[220] flex cursor-zoom-out items-center justify-center bg-[#080605]/94 p-4 backdrop-blur-md sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`${text("Expanded plate", "放大图版")}: ${item.alt}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setExpanded(false);
            }}
          >
            <div
              ref={dialogRef}
              className="relative flex max-h-full w-full max-w-[min(96vw,1600px)] cursor-default flex-col items-center gap-3"
            >
              <button
                ref={closeRef}
                type="button"
                onClick={() => setExpanded(false)}
                className="brass-plaque self-end inline-flex cursor-pointer items-center gap-2 px-3.5 py-1.5 font-display text-[13.5px] font-bold tracking-[0.1em] uppercase"
                aria-label={text("Close expanded image", "关闭大图")}
              >
                {text("Close Plate", "关闭图版")} <ExpandIcon close />
              </button>
              <img
                src={item.src}
                alt={item.alt}
                className="max-h-[calc(100vh-8rem)] max-w-full border-2 border-warm/45 bg-[#090706] object-contain shadow-2xl"
              />
              {item.caption && (
                <p className="max-w-4xl text-center font-display text-[16px] italic text-[#ddd0ba]">
                  <FormattedText>{item.caption}</FormattedText>
                </p>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function YouTubeEmbed({ id, title, thumbnailSrc }: { id: string; title: string; thumbnailSrc?: string }) {
  const { text } = useLanguage();
  const [active, setActive] = useState(false);
  const [thumbnail, setThumbnail] = useState(thumbnailSrc ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

  if (active) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black"
      aria-label={`${text("Play", "播放")} ${title}`}
    >
      <img
        src={thumbnail}
        alt=""
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
        onError={() => setThumbnail(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
      />
      <span aria-hidden="true" className="absolute inset-0 bg-black/22 transition-colors group-hover:bg-black/8" />
      <span className="brass-plaque relative px-4.5 py-2 font-display text-[13.5px] font-bold tracking-[0.1em] uppercase transition-transform group-hover:scale-[1.03]">
        ▶ {text("Play Clip", "播放片段")}
      </span>
    </button>
  );
}

export function Media({ item }: { item: MediaItem }) {
  return (
    <figure className="space-y-2.5">
      <div className="slate-folio relative overflow-hidden border border-[#d4ae73]/45 p-2 shadow-[0_18px_42px_rgba(0,0,0,0.72)]">
        <BrassCornerClasps sizeClass="h-8 w-8 sm:h-10 sm:w-10" />
        <div className="overflow-hidden border border-warm/30 bg-[#090706]">
          {item.type === "image" && <ExpandableImage item={item} />}
          {item.type === "video" && (
            <video src={item.src} poster={item.poster} controls playsInline preload="metadata" className="h-auto w-full" />
          )}
          {item.type === "youtube" && (
            <div className="relative aspect-video w-full">
              <YouTubeEmbed id={item.id} title={item.caption ?? "Project video"} thumbnailSrc={item.thumbnailSrc} />
            </div>
          )}
        </div>
      </div>
      {item.caption && (
        <figcaption className="px-0.5 text-[16px] leading-snug text-muted-foreground">
          <FormattedText>{item.caption}</FormattedText>
        </figcaption>
      )}
    </figure>
  );
}
