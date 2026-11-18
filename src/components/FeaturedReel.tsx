import { useState } from "react";
import { useLanguage } from "../lib/language";
import { FormattedText } from "./FormattedText";

type FeaturedReelProps = {
  id: string;
  zhId?: string;
  title: string;
  description: string;
  thumbnailSrc?: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M8.25 5.1v13.8L19 12 8.25 5.1Z" />
    </svg>
  );
}

export function FeaturedReel({ id, zhId, title, description, thumbnailSrc }: FeaturedReelProps) {
  const [active, setActive] = useState(false);
  const { isChinese, text } = useLanguage();
  const activeId = isChinese && zhId ? zhId : id;

  return (
    <article className="group overflow-hidden rounded-xs border border-border bg-surface">
      <div className="relative aspect-video overflow-hidden bg-black">
        {active ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="absolute inset-0 w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            aria-label={`${text("Play", "播放")} ${title}`}
          >
            <img
              src={thumbnailSrc ?? `https://i.ytimg.com/vi/${activeId}/maxresdefault.jpg`}
              alt=""
              width="1280"
              height="720"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.012]"
              onError={(event) => {
                const fallback = `https://i.ytimg.com/vi/${activeId}/hqdefault.jpg`;
                if (event.currentTarget.src !== fallback) {
                  event.currentTarget.src = fallback;
                }
              }}
            />
            <span aria-hidden="true" className="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/5" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="inline-flex items-center gap-2.5 rounded-xs border border-foreground/45 bg-background/88 px-5 py-3 text-xs font-medium tracking-wide text-foreground shadow-2xl backdrop-blur-sm transition-colors duration-200 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                <PlayIcon />
                <span>{text("Play reel", "播放集锦")}</span>
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-5 py-3.5 sm:px-6">
        <p className={`max-w-2xl text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
          <FormattedText>{description}</FormattedText>
        </p>
        <a
          href={`https://youtu.be/${activeId}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {text("Watch on YouTube", "在 YouTube 打开")} ↗
        </a>
      </div>
    </article>
  );
}
