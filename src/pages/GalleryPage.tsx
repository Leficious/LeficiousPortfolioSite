import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FeaturedReel } from "../components/FeaturedReel";
import { FormattedText } from "../components/FormattedText";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { SoftwareSummary } from "../components/SoftwareStack";
import { galleryEntries, galleryTags, type GalleryEntry, type GalleryTag } from "../lib/gallery";
import { useLanguage } from "../lib/language";
import { galleryTagZh, localizeGalleryEntry } from "../lib/localizedContent";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

function getCardLayout(index: number) {
  const wide = index === 0 || index % 6 === 5;

  return {
    wide,
    card: wide
      ? "sm:col-span-2 lg:col-span-8 lg:grid lg:grid-cols-[minmax(0,1.45fr)_minmax(220px,0.55fr)]"
      : "lg:col-span-4",
    media: wide
      ? "aspect-[16/10] sm:aspect-[16/8] lg:aspect-auto lg:min-h-[320px]"
      : aspectClasses.landscape,
  };
}

export function GalleryPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const [activeTag, setActiveTag] = useState<GalleryTag | "All">("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [slide, setSlide] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const selectedSource = galleryEntries.find((entry) => entry.id === searchParams.get("entry")) ?? null;
  const selected = selectedSource ? localizeGalleryEntry(selectedSource, isChinese) : null;

  const visibleEntries = useMemo(
    () => {
      const filtered = activeTag === "All" ? galleryEntries : galleryEntries.filter((entry) => entry.tags.includes(activeTag));
      return [...filtered].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned))).map((entry) => localizeGalleryEntry(entry, isChinese));
    },
    [activeTag, isChinese],
  );

  const openEntry = useCallback((entry: GalleryEntry) => {
    triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSlide(0);
    setSearchParams({ entry: entry.id }, { replace: true });
  }, [setSearchParams]);

  const closeEntry = useCallback(() => {
    setSearchParams({}, { replace: true });
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, [setSearchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={text("Gallery — Leficious", "作品画廊 — Leficious")} description={text("A gallery of technical design, 3D, 2D, environment, character, animation, and technical art work by Leficious.", "Leficious 的技术设计、3D、2D、环境、角色、动画与技术美术作品画廊。")} path={localizedPath("/gallery")} image="/gallery/thumbnails/water-blossoms.webp" imageWidth={1000} imageHeight={563} />
      <div aria-hidden={selected ? "true" : undefined} inert={selected ? true : undefined}>
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6">
          <section className="route-reveal grid gap-10 border-b border-border/60 py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{text("Gallery", "画廊")}</p>
            </div>
            <div className="md:col-span-9">
              <h1 className="font-display text-4xl font-semibold leading-[1.05] text-balance md:text-6xl">
                {text("Process, studies, and ", "过程、练习与")}<span className="text-accent">{text("finished frames.", "最终画面。")}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
                {text("A visual archive featuring realtime work, characters, game-ready environments, tools, and other experiments.", "收录实时项目、角色、游戏级环境、工具和其他实验的视觉档案。")}
              </p>
            </div>
          </section>

          <section className="route-reveal border-b border-border/60 py-10 md:py-14" aria-labelledby="environment-reel-title">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Featured reel", "精选作品集锦")}</p>
                <h2 id="environment-reel-title" className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{text("Environments and props.", "环境与道具。")}</h2>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">3D · {text("Environment", "环境")} · {text("Realtime", "实时")} · {text("Props", "道具")}</span>
            </div>
            <FeaturedReel
              id="t5MchABcd3c"
              thumbnailSrc="/reels/environment-props-reel-2026.jpg"
              title={text("Environment & Props Reel 2026", "2026 环境与道具作品集锦")}
              description={text("Environment art, props, material work, foliage, and realtime scene assembly across game-focused projects.", "展示游戏项目中的环境美术、道具、材质、植被与实时场景搭建。")}
              eyebrow={text("Environment + props · 2026", "环境 + 道具 · 2026")}
            />
          </section>

          <section className="route-reveal py-10 md:py-14" aria-labelledby="gallery-filter-title">
            <div className="mb-10 border-b border-border/60 pb-8">
              <div className="flex items-center justify-between gap-4">
                <h2 id="gallery-filter-title" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{text("Filter work", "筛选作品")}</h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground" aria-live="polite">{visibleEntries.length} {text(visibleEntries.length === 1 ? "entry" : "entries", "项作品")}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {["All", ...galleryTags].map((tag) => {
                  const active = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveTag(tag as GalleryTag | "All")}
                      className={`rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${active ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface/40 text-muted-foreground hover:border-accent hover:text-foreground"}`}
                    >
                      {tag === "All" ? text("All", "全部") : isChinese ? galleryTagZh[tag as GalleryTag] : tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="route-reveal-list grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-12">
              {visibleEntries.map((entry, index) => {
                const layout = getCardLayout(index);
                const mediaAspect = layout.wide ? layout.media : aspectClasses[entry.aspect];

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => openEntry(entry)}
                    className={`gallery-card group w-full overflow-hidden rounded-lg border border-border bg-surface text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-[0_18px_60px_rgba(0,0,0,0.2)] ${layout.card}`}
                    aria-label={`${text("Open", "打开")} ${entry.title}，${entry.media.length} ${text(entry.media.length === 1 ? "item" : "items", "项内容")}`}
                  >
                    <div className={`relative overflow-hidden bg-muted ${mediaAspect}`}>
                      <img src={entry.cover} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl" />
                      <div aria-hidden="true" className="absolute inset-0 bg-background/35" />
                      <img src={entry.cover} alt={entry.coverAlt} width="1200" height="900" loading={index < 3 ? "eager" : "lazy"} decoding="async" className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]" />
                      {entry.pinned && <span title={text("Pinned work", "置顶作品")} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-warm/65 bg-background/80 text-sm text-warm shadow-lg backdrop-blur"><span className="sr-only">{text("Pinned work", "置顶作品")}</span><span aria-hidden="true">✦</span></span>}
                    </div>
                    <div className={`flex flex-col p-4 ${layout.wide ? "lg:justify-between lg:p-6" : ""}`}>
                      <div>
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className={`font-display font-semibold transition-colors group-hover:text-accent ${layout.wide ? "text-xl lg:text-2xl" : "text-lg"}`}>{entry.title}</h3>
                          <span className="font-mono text-[10px] text-muted-foreground">{entry.year}</span>
                        </div>
                        {layout.wide && <p className="mt-4 text-sm leading-relaxed text-muted-foreground"><FormattedText>{entry.description}</FormattedText></p>}
                      </div>
                      <div>
                        <p className="mt-4 overflow-hidden border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"><span className="font-mono text-[8px] uppercase tracking-[0.16em] text-accent">{text("Contribution", "个人贡献")} · </span>{entry.contribution}</p>
                        <div className="mt-3"><SoftwareSummary software={entry.software} /></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {!visibleEntries.length && <p className="py-20 text-center text-muted-foreground">{text("No entries use this tag yet.", "暂时没有使用该标签的作品。")}</p>}
          </section>
        </main>
        <SiteFooter />
      </div>

      {selected && <GalleryLightbox entry={selected} slide={slide} onSlideChange={setSlide} onClose={closeEntry} />}
    </div>
  );
}
