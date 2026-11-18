import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FeaturedReel } from "../components/FeaturedReel";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { GalleryLayout } from "../components/GalleryLayout";
import { galleryCaptions, wideGalleryEntries } from "../lib/galleryPresentation";
import { galleryEntries, galleryTags, type GalleryEntry, type GalleryTag } from "../lib/gallery";
import { useLanguage } from "../lib/language";
import { galleryTagZh, localizeGalleryEntry } from "../lib/localizedContent";

export function GalleryPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedTag = searchParams.get("tag");
  const activeTag = galleryTags.includes(requestedTag as GalleryTag) ? (requestedTag as GalleryTag) : "All";

  const setActiveTag = (tag: GalleryTag | "All") => {
    const next = new URLSearchParams(searchParams);
    if (tag === "All") next.delete("tag");
    else next.set("tag", tag);
    setSearchParams(next, { replace: true });
  };

  const [slide, setSlide] = useState(0);
  const triggerRef = useRef<HTMLElement | null>(null);
  const selectedSource = galleryEntries.find((entry) => entry.id === searchParams.get("entry")) ?? null;
  const selected = selectedSource ? localizeGalleryEntry(selectedSource, isChinese) : null;

  useEffect(() => {
    if (!selectedSource) triggerRef.current?.focus({ preventScroll: true });
  }, [selectedSource]);

  const visibleEntries = useMemo(() => {
    const filtered = activeTag === "All" ? galleryEntries : galleryEntries.filter((entry) => entry.tags.includes(activeTag));
    return [...filtered]
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
      .map((entry) => localizeGalleryEntry(entry, isChinese));
  }, [activeTag, isChinese]);

  const openEntry = useCallback(
    (entry: GalleryEntry) => {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setSlide(0);
      const next = new URLSearchParams(searchParams);
      next.set("entry", entry.id);
      setSearchParams(next, { state: { galleryEntryOpened: true } });
    },
    [searchParams, setSearchParams],
  );

  const closeEntry = useCallback(() => {
    if (location.state?.galleryEntryOpened) navigate(-1);
    else {
      const next = new URLSearchParams(searchParams);
      next.delete("entry");
      setSearchParams(next, { replace: true });
    }
  }, [location.state, navigate, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={text("Gallery | Leficious", "作品集 | Leficious")}
        description={text(
          "3D environment art, character rigging, realtime VFX, technical prototypes, and Maya tooling by Lefi (Kevin) Shan.",
          "单凯飞（Leficious）的 3D 环境美术、角色绑定、实时特效、技术原型与 Maya 工具作品集。",
        )}
        path={localizedPath("/gallery")}
        image="/gallery/thumbnails/water-blossoms.webp"
        imageWidth={1000}
        imageHeight={563}
      />
      <div aria-hidden={selected ? "true" : undefined} inert={selected ? true : undefined}>
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6">
          <section className="border-b border-border py-10 md:py-14" aria-labelledby="environment-reel-title">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <h1 id="environment-reel-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {text("Environment & Props Reel", "环境与道具作品集锦")}
              </h1>
              <span className="font-mono text-xs text-muted-foreground">2026</span>
            </div>

            <FeaturedReel
              id="t5MchABcd3c"
              thumbnailSrc="/reels/environment-props-reel-2026.jpg"
              title={text("Environment & Props Reel 2026", "2026 环境与道具作品集锦")}
              description={text(
                "Realtime 3D environments, hero props, Substance material graphs, stylized foliage, and scene lighting.",
                "实时 3D 场景、核心道具、Substance 程序化材质、风格化植被与灯光作品。",
              )}
            />

            {!isChinese && (
              <div className="mt-5 flex justify-end">
                <a
                  href="/resume/Leficious_3D_Environment_Artist_Resume.pdf"
                  download
                  className="inline-flex items-center gap-2.5 rounded-xs border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  Download 3D environment art résumé (PDF) <span aria-hidden="true">↓</span>
                </a>
              </div>
            )}
          </section>

          <section className="py-10 md:py-14" aria-label={text("Archive", "全部作品")}>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={text("Filter by discipline", "按类别筛选")}>
                {["All", ...galleryTags].map((tag) => {
                  const active = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveTag(tag as GalleryTag | "All")}
                      className={`cursor-pointer rounded-xs border px-3 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-surface text-muted-foreground hover:border-foreground/45 hover:text-foreground"
                      }`}
                    >
                      {tag === "All" ? text("All", "全部") : isChinese ? galleryTagZh[tag as GalleryTag] : tag}
                    </button>
                  );
                })}
              </div>

              <p className="font-mono text-xs text-muted-foreground" aria-live="polite">
                {visibleEntries.length} {text(visibleEntries.length === 1 ? "work" : "works", "项作品")}
              </p>
            </div>

            <GalleryLayout>
              {visibleEntries.map((entry, index) => (
                <button
                  key={entry.id}
                  data-wide={wideGalleryEntries.has(entry.id)}
                  type="button"
                  onClick={() => openEntry(entry)}
                  className="gallery-card group flex w-full cursor-pointer flex-col overflow-hidden rounded-xs border border-border bg-surface text-left transition-colors duration-200 hover:border-foreground/45"
                  aria-label={`${text("Open", "打开")} ${entry.title}, ${entry.media.length} ${text(entry.media.length === 1 ? "item" : "items", "项内容")}`}
                >
                  <div className="relative w-full shrink-0 overflow-hidden bg-muted">
                    <img
                      src={entry.cover}
                      alt={entry.coverAlt}
                      width="1200"
                      height="675"
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                    {entry.id === "tenebria-character-rig" && (
                      <img
                        src="/gallery/artstation/tenebria/braids-back-render.avif"
                        alt={text("Tenebria braid detail", "Tenebria 编发细节")}
                        width="2160"
                        height="3840"
                        loading="lazy"
                        className="block max-h-[360px] w-full border-t border-border object-cover object-top"
                      />
                    )}
                  </div>
                  <div className="flex w-full flex-col p-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-base font-semibold tracking-tight transition-colors group-hover:text-warm sm:text-lg">
                        {entry.title}
                      </h2>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {entry.year}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {galleryCaptions[entry.id]?.[isChinese ? 1 : 0] ?? entry.contribution}
                    </p>
                  </div>
                </button>
              ))}
            </GalleryLayout>

            {!visibleEntries.length && (
              <p className="py-20 text-center text-muted-foreground">
                {text("No entries use this tag yet.", "暂时没有使用该标签的作品。")}
              </p>
            )}
          </section>
        </main>
        <SiteFooter />
      </div>

      {selected && <GalleryLightbox entry={selected} slide={slide} onSlideChange={setSlide} onClose={closeEntry} />}
    </div>
  );
}
