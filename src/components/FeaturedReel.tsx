import { useState } from "react";
import { useLanguage } from "../lib/language";

type FeaturedReelProps = {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
  thumbnailSrc?: string;
};

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M8.25 5.1v13.8L19 12 8.25 5.1Z" />
    </svg>
  );
}

export function FeaturedReel({ id, title, description, eyebrow, thumbnailSrc }: FeaturedReelProps) {
  const [active, setActive] = useState(false);
  const { text } = useLanguage();

  return (
    <article className="group grid overflow-hidden rounded-xl border border-border bg-surface/45 shadow-[0_24px_80px_rgba(0,0,0,0.14)] lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,0.45fr)]">
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
              loading="lazy"
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
            <span className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/80">{text("Play reel", "播放作品集锦")}</span>
          </button>
        )}
      </div>

      <div className="relative flex flex-col justify-between border-t border-border/60 p-6 sm:p-8 lg:border-l lg:border-t-0">
        <span aria-hidden="true" className="absolute right-5 top-1 font-display text-7xl font-semibold text-foreground/[0.035]">▶</span>
        <div className="relative">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
          <h3 className="mt-5 font-display text-2xl font-semibold leading-tight">{title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        <a
          href={`https://youtu.be/${id}`}
          target="_blank"
          rel="noreferrer"
          className="relative mt-10 border-t border-border/60 pt-5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-accent"
        >
          {text("Open on YouTube", "在 YouTube 打开")} ↗
        </a>
      </div>
    </article>
  );
}
