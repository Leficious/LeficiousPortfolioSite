import { useState } from "react";
import { useLanguage } from "../lib/language";
import { FormattedText } from "./FormattedText";

type FeaturedReelProps = {
  id: string;
  title: string;
  description: string;
  eyebrow?: string;
  thumbnailSrc?: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M8.25 5.1v13.8L19 12 8.25 5.1Z" />
    </svg>
  );
}

export function FeaturedReel({ id, title, description, thumbnailSrc }: FeaturedReelProps) {
  const [active, setActive] = useState(false);
  const { isChinese, text } = useLanguage();

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-surface/45">
      <div className="relative aspect-video overflow-hidden bg-black">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
            aria-label={`${text("Play", "播放")} ${title}`}
          >
            <img
              src={thumbnailSrc ?? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
              alt=""
              width="1280"
              height="720"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover opacity-75 grayscale-[15%] transition duration-500 group-hover:scale-[1.015] group-hover:opacity-90 group-hover:grayscale-0"
              onError={(event) => {
                const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

                if (event.currentTarget.src !== fallback) {
                  event.currentTarget.src = fallback;
                }
              }}
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-background/15" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full border border-foreground/35 bg-background/75 pl-1 text-foreground shadow-2xl backdrop-blur transition-all duration-300 group-hover:scale-105 group-hover:border-accent group-hover:text-accent">
                <PlayIcon />
              </span>
            </span>
            <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/80">{text("Play reel", "播放视频")}</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 p-4 sm:px-6">
          <p className={`max-w-2xl text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}><FormattedText>{description}</FormattedText></p>
        <a
          href={`https://youtu.be/${id}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 py-2 text-xs text-muted-foreground transition-colors hover:text-accent"
        >
          {text("Open on YouTube", "在 YouTube 打开")} ↗
        </a>
      </div>
    </article>
  );
}
