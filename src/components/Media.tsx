import { useState } from "react";
import type { MediaItem } from "../lib/projects";

function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);

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
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        width="480"
        height="360"
        loading="lazy"
        decoding="async"
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
        {item.type === "image" && <img src={item.src} alt={item.alt} width="1600" height="900" loading="lazy" decoding="async" className="aspect-video h-auto w-full object-cover" />}
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
