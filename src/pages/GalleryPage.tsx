import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FeaturedReel } from "../components/FeaturedReel";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { SoftwareSummary } from "../components/SoftwareStack";
import { galleryEntries, galleryTags, type GalleryEntry, type GalleryTag } from "../lib/gallery";

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
  const [activeTag, setActiveTag] = useState<GalleryTag | "All">("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const [slide, setSlide] = useState(0);
  const selected = galleryEntries.find((entry) => entry.id === searchParams.get("entry")) ?? null;

  const visibleEntries = useMemo(
    () => {
      const filtered = activeTag === "All" ? galleryEntries : galleryEntries.filter((entry) => entry.tags.includes(activeTag));
      return [...filtered].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
    },
    [activeTag],
  );

  const openEntry = useCallback((entry: GalleryEntry) => {
    setSlide(0);
    setSearchParams({ entry: entry.id }, { replace: true });
  }, [setSearchParams]);

  const closeEntry = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="Gallery — Leficious" description="A gallery of 3D, 2D, environment, character, animation, and technical art work by Leficious." path="/gallery" image="/gallery/thumbnails/water-blossoms.webp" />
      <div aria-hidden={selected ? "true" : undefined}>
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6">
          <section className="grid gap-10 border-b border-border/60 py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Gallery</p>
            </div>
            <div className="md:col-span-9">
              <h1 className="font-display text-4xl font-semibold leading-[1.05] text-balance md:text-6xl">
                Process, studies, and <span className="text-accent">finished frames.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
                A visual archive featuring realtime work, characters, game-ready environments, tools, and other experiments.
              </p>
            </div>
          </section>

          <section className="border-b border-border/60 py-10 md:py-14" aria-labelledby="environment-reel-title">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Featured reel</p>
                <h2 id="environment-reel-title" className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Environments and props.</h2>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">3D · Environment · Realtime · Props</span>
            </div>
            <FeaturedReel
              id="t5MchABcd3c"
              title="Environment & Props Reel 2026"
              description="Environment art, props, material work, foliage, and realtime scene assembly across game-focused projects."
              eyebrow="Environment + props · 2026"
            />
          </section>

          <section className="py-10 md:py-14" aria-labelledby="gallery-filter-title">
            <div className="mb-10 border-b border-border/60 pb-8">
              <div className="flex items-center justify-between gap-4">
                <h2 id="gallery-filter-title" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Filter work</h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground" aria-live="polite">{visibleEntries.length} {visibleEntries.length === 1 ? "entry" : "entries"}</p>
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
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-flow-row-dense lg:grid-cols-12">
              {visibleEntries.map((entry, index) => {
                const layout = getCardLayout(index);
                const mediaAspect = layout.wide ? layout.media : aspectClasses[entry.aspect];

                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => openEntry(entry)}
                    className={`group w-full overflow-hidden rounded-lg border border-border bg-surface text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-[0_18px_60px_rgba(0,0,0,0.2)] ${layout.card}`}
                    aria-label={`Open ${entry.title}, ${entry.media.length} ${entry.media.length === 1 ? "item" : "items"}`}
                  >
                    <div className={`relative overflow-hidden bg-muted ${mediaAspect}`}>
                      <img src={entry.cover} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl" />
                      <div aria-hidden="true" className="absolute inset-0 bg-background/35" />
                      <img src={entry.cover} alt={entry.coverAlt} width="1200" height="900" loading={index < 3 ? "eager" : "lazy"} decoding="async" className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]" />
                      {entry.pinned && <span title="Pinned work" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-accent/60 bg-background/80 text-sm text-accent shadow-lg backdrop-blur"><span className="sr-only">Pinned work</span><span aria-hidden="true">✦</span></span>}
                    </div>
                    <div className={`flex flex-col p-4 ${layout.wide ? "lg:justify-between lg:p-6" : ""}`}>
                      <div>
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className={`font-display font-semibold transition-colors group-hover:text-accent ${layout.wide ? "text-xl lg:text-2xl" : "text-lg"}`}>{entry.title}</h3>
                          <span className="font-mono text-[10px] text-muted-foreground">{entry.year}</span>
                        </div>
                        {layout.wide && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>}
                      </div>
                      <div>
                        <p className="mt-4 overflow-hidden border-t border-border/60 pt-3 text-xs leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"><span className="font-mono text-[8px] uppercase tracking-[0.16em] text-accent">Contribution · </span>{entry.contribution}</p>
                        <div className="mt-3"><SoftwareSummary software={entry.software} /></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {!visibleEntries.length && <p className="py-20 text-center text-muted-foreground">No entries use this tag yet.</p>}
          </section>
        </main>
        <SiteFooter />
      </div>

      {selected && <GalleryLightbox entry={selected} slide={slide} onSlideChange={setSlide} onClose={closeEntry} />}
    </div>
  );
}
