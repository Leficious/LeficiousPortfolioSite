import { useState } from "react";
import { useLanguage } from "../lib/language";
import { FormattedText } from "./FormattedText";

type FeaturedReelProps = {
  id: string;
  zhId?: string;
  title: string;
  description: string;
  thumbnailSrc?: string;
  autoStart?: boolean;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M8.25 5.1v13.8L19 12 8.25 5.1Z" />
    </svg>
  );
}

export function FeaturedReel({ id, zhId, title, description, thumbnailSrc, autoStart = false }: FeaturedReelProps) {
  const [active, setActive] = useState(autoStart);
  const { isChinese, text } = useLanguage();
  const activeId = isChinese && zhId ? zhId : id;

  return (
    <article className="slate-folio group overflow-hidden rounded-xs border border-warm/35 p-1.5">
      <div className="relative aspect-video overflow-hidden rounded-xs border border-warm/25 bg-black">
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
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
              onError={(event) => {
                const fallback = `https://i.ytimg.com/vi/${activeId}/hqdefault.jpg`;
                if (event.currentTarget.src !== fallback) {
                  event.currentTarget.src = fallback;
                }
              }}
            />
            <span aria-hidden="true" className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/5" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="brass-plaque inline-flex items-center gap-2.5 rounded-xs px-5 py-2.5 font-display text-sm font-bold tracking-wide transition-transform duration-200 group-hover:scale-[1.03]">
                <PlayIcon />
                <span>{text("Play Walkthrough", "播放实机演示")}</span>
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-3.5 pt-3 pb-2 sm:px-4">
        <p className={`max-w-2xl text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
          <FormattedText>{description}</FormattedText>
        </p>
        <a
          href={`https://youtu.be/${activeId}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-display text-xs font-semibold text-warm transition-colors hover:text-[#f2d6a9]"
        >
          {text("Watch on YouTube", "在 YouTube 打开")} ↗
        </a>
      </div>
    </article>
  );
}
