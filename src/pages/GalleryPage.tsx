import { useCallback, useMemo, useState } from "react";
import { FeaturedReel } from "../components/FeaturedReel";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { galleryEntries, galleryTags, type GalleryEntry, type GalleryTag } from "../lib/gallery";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[16/10]",
  square: "aspect-square",
};

export function GalleryPage() {
  const [activeTag, setActiveTag] = useState<GalleryTag | "All">("All");
  const [selected, setSelected] = useState<GalleryEntry | null>(null);
  const [slide, setSlide] = useState(0);

  const visibleEntries = useMemo(
    () => activeTag === "All" ? galleryEntries : galleryEntries.filter((entry) => entry.tags.includes(activeTag)),
    [activeTag],
  );

  const openEntry = useCallback((entry: GalleryEntry) => {
    setSelected(entry);
    setSlide(0);
  }, []);

  const closeEntry = useCallback(() => setSelected(null), []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="Gallery — Leficious" description="A gallery of 3D, 2D, environment, character, animation, and technical art work by Leficious." path="/gallery" />
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

            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
              {visibleEntries.map((entry, index) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => openEntry(entry)}
                  className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-lg border border-border bg-surface text-left transition-colors hover:border-accent/70"
                  aria-label={`Open ${entry.title}, ${entry.media.length} ${entry.media.length === 1 ? "item" : "items"}`}
                >
                  <div className={`relative overflow-hidden bg-muted ${aspectClasses[entry.aspect]}`}>
                    <img src={entry.cover} alt={entry.coverAlt} width="1200" height="900" loading={index < 3 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-background/90 to-transparent p-4 pt-14">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">View set</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{String(entry.media.length).padStart(2, "0")}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent">{entry.title}</h3>
                      <span className="font-mono text-[10px] text-muted-foreground">{entry.year}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                      {entry.tags.map((tag) => <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/75">{tag}</span>)}
                    </div>
                  </div>
                </button>
              ))}
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
