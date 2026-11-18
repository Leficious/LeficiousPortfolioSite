import { useState } from "react";
import { useLanguage } from "../lib/language";
import { BrassCornerClasps } from "./AtelierChrome";
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
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
      <path d="M8.25 5.1v13.8L19 12 8.25 5.1Z" />
    </svg>
  );
}

export function FeaturedReel({ id, zhId, title, description, thumbnailSrc, autoStart = false }: FeaturedReelProps) {
  const [active, setActive] = useState(autoStart);
  const { isChinese, text } = useLanguage();
  const activeId = isChinese && zhId ? zhId : id;

  return (
    <article className="slate-folio group relative overflow-hidden border border-warm/40 p-2">
      <div className="relative aspect-video overflow-hidden border border-warm/30 bg-black">
        <BrassCornerClasps sizeClass="h-10 w-10 sm:h-13 sm:w-13" />
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
            <span aria-hidden="true" className="absolute inset-0 bg-black/22 transition-colors duration-300 group-hover:bg-black/8" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="brass-plaque inline-flex items-center gap-2.5 px-5 py-2.5 font-numeral text-xs font-bold tracking-[0.14em] uppercase transition-transform duration-200 group-hover:scale-[1.03]">
                <PlayIcon />
                <span>{text("Play Walkthrough", "播放实机演示")}</span>
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 px-3.5 pt-3 pb-2 sm:px-4">
        <p className={`max-w-2xl text-[15.5px] leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
          <FormattedText>{description}</FormattedText>
        </p>
        <a
          href={`https://youtu.be/${activeId}`}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-numeral text-[11px] font-semibold tracking-[0.14em] text-warm uppercase transition-colors hover:text-[#e2c088]"
        >
          {text("Watch on YouTube", "在 YouTube 打开")} ↗
        </a>
      </div>
    </article>
  );
}
