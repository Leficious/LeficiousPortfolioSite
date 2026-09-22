import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MediaItem } from "../lib/projects";

function ExpandIcon({ close = false }: { close?: boolean }) {
  if (close) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.5]">
        <path d="m6 6 12 12M18 6 6 18" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.5]">
      <path d="M9 4H4v5M15 4h5v5M20 15v5h-5M4 15v5h5" />
    </svg>
  );
}

function ExpandableImage({ item }: { item: Extract<MediaItem, { type: "image" }> }) {
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
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button, a[href], [tabindex]:not([tabindex='-1'])"));
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
        className="group relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
        aria-label={`Expand image: ${item.alt}`}
      >
        <img
          src={item.src}
          alt={item.alt}
          width={item.width ?? 1600}
          height={item.height ?? 900}
          loading="lazy"
          decoding="async"
          className="aspect-video h-auto w-full bg-black/20 object-contain transition-[filter,transform] duration-300 group-hover:scale-[1.01] group-hover:brightness-110"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-sm border border-foreground/20 bg-background/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground opacity-0 shadow-lg backdrop-blur transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ExpandIcon />
          View full size
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-accent/0 transition-colors duration-200 group-hover:border-accent/35 group-focus-visible:border-accent/35" />
      </button>

      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-background/95 p-4 backdrop-blur-xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={`Expanded image: ${item.alt}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setExpanded(false);
            }}
          >
            <div ref={dialogRef} className="relative flex max-h-full w-full max-w-[min(96vw,1600px)] cursor-default flex-col items-center gap-3">
              <div className="absolute -top-1 left-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:-top-2">
                Image inspection
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setExpanded(false)}
                className="absolute -top-2 right-0 z-10 grid h-10 w-10 place-items-center rounded-full border border-foreground/20 bg-background/90 text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:-top-3"
                aria-label="Close expanded image"
              >
                <ExpandIcon close />
              </button>
              <img
                src={item.src}
                alt={item.alt}
                className="mt-10 max-h-[calc(100vh-8rem)] max-w-full rounded-sm border border-border bg-black/20 object-contain shadow-2xl"
              />
              {item.caption && <p className="max-w-4xl text-center text-sm text-muted-foreground">{item.caption}</p>}
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">Click outside or press Esc to close</p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);
  const [thumbnail, setThumbnail] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);

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
      className="group absolute inset-0 flex items-center justify-center bg-background"
      aria-label={`Play ${title}`}
    >
      <img
        src={thumbnail}
        alt=""
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
        onError={() => setThumbnail(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
        className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-90"
      />
      <span className="absolute rounded-full border border-foreground/30 bg-background/85 px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] text-foreground backdrop-blur">
        Play video
      </span>
    </button>
  );
}

export function Media({ item }: { item: MediaItem }) {
  return (
    <figure className="space-y-2">
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        {item.type === "image" && <ExpandableImage item={item} />}
        {item.type === "video" && <video src={item.src} poster={item.poster} controls playsInline preload="metadata" className="h-auto w-full" />}
        {item.type === "youtube" && (
          <div className="relative aspect-video w-full">
            <YouTubeEmbed id={item.id} title={item.caption ?? "Project video"} />
          </div>
        )}
      </div>
      {item.caption && <figcaption className="text-sm text-muted-foreground">{item.caption}</figcaption>}
    </figure>
  );
}
