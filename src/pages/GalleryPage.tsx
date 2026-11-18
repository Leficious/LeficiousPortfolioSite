import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FolioCorners } from "../components/AtelierChrome";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { FeaturedReel } from "../components/FeaturedReel";
import { GalleryLayout } from "../components/GalleryLayout";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { galleryEntries, galleryTags, type GalleryEntry, type GalleryTag } from "../lib/gallery";
import { galleryCaptions, wideGalleryEntries } from "../lib/galleryPresentation";
import { useLanguage } from "../lib/language";
import { galleryTagZh, localizeGalleryEntry } from "../lib/localizedContent";

export function GalleryPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [reelExpanded, setReelExpanded] = useState(false);

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
  const selectedId = searchParams.get("entry");
  const selectedSource = galleryEntries.find((entry) => entry.id === selectedId) ?? null;
  const selected = selectedSource ? localizeGalleryEntry(selectedSource, isChinese) : null;

  useEffect(() => {
    if (!selectedSource) triggerRef.current?.focus({ preventScroll: true });
  }, [selectedSource]);

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { All: galleryEntries.length };
    for (const tag of galleryTags) {
      counts[tag] = galleryEntries.filter((e) => e.tags.includes(tag)).length;
    }
    return counts;
  }, []);

  const visibleEntries = useMemo(() => {
    const filtered = activeTag === "All" ? galleryEntries : galleryEntries.filter((entry) => entry.tags.includes(activeTag));
    return [...filtered]
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
      .map((entry) => localizeGalleryEntry(entry, isChinese));
  }, [activeTag, isChinese]);

  const selectedIndexInVisible = useMemo(() => {
    if (!selected) return -1;
    return visibleEntries.findIndex((e) => e.id === selected.id);
  }, [selected, visibleEntries]);

  const nextVisibleEntry =
    visibleEntries.length > 1 && selectedIndexInVisible !== -1
      ? visibleEntries[(selectedIndexInVisible + 1) % visibleEntries.length]
      : null;

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

  const stepToNextEntry = useCallback(() => {
    if (!nextVisibleEntry) return;
    setSlide(0);
    const next = new URLSearchParams(searchParams);
    next.set("entry", nextVisibleEntry.id);
    setSearchParams(next, { replace: true, state: location.state });
  }, [location.state, nextVisibleEntry, searchParams, setSearchParams]);

  const closeEntry = useCallback(() => {
    if (location.state?.galleryEntryOpened) navigate(-1);
    else {
      const next = new URLSearchParams(searchParams);
      next.delete("entry");
      setSearchParams(next, { replace: true });
    }
  }, [location.state, navigate, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen text-foreground">
      <Seo
        title={text("Atelier Gallery | Leficious", "视觉与技术画廊 | Leficious")}
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
        <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1260px] px-5 pt-8 sm:px-8 lg:pt-10">
          {/* Compact Atelier Salon Header + Expandable Environment Reel */}
          <header className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-numeral text-[11px] tracking-[0.24em] text-warm/90">
                {text("SALON SPECIMEN WALL · ARCHIVE", "工作室视觉与技术标本馆")}
              </p>
              <h1 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {text("Atelier Archive & Visual Studies", "视觉美术与技术拆解画廊")}
              </h1>
              <p className="mt-1 font-display text-base italic text-[#d8897f] sm:text-lg">
                {text(
                  "Realtime 3D Environments, Character Rigging, Shaders & Maya Pipeline Tooling",
                  "实时 3D 场景、角色绑定毛发、程序化材质与 Maya 工具管线",
                )}
              </p>
            </div>

            {/* Compact Live-Looping Environment Reel Card + 3D Art CV Plaque */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setReelExpanded((prev) => !prev)}
                aria-expanded={reelExpanded}
                className="slate-folio group flex cursor-pointer items-center gap-3.5 rounded-xs border border-warm/45 p-2 pr-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#dfc092]"
              >
                <span className="relative block h-12 w-21 shrink-0 overflow-hidden rounded-xs border border-warm/35 bg-black">
                  <video
                    src="/loops/env-reel.mp4"
                    poster="/reels/environment-props-reel-2026.jpg"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/25 text-xs text-[#f6e6c5] transition-colors group-hover:bg-black/10">
                    {reelExpanded ? "−" : "▶"}
                  </span>
                </span>
                <span>
                  <span className="block font-display text-sm font-bold text-foreground transition-colors group-hover:text-[#dfc092]">
                    {text("Environment & Props Reel 2026", "2026 环境与道具作品集锦")}
                  </span>
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    {reelExpanded
                      ? text("Hide stage ↑", "收起播放器 ↑")
                      : text("Expand 16:9 reel w/ audio ↓", "展开带音效高清集锦 ↓")}
                  </span>
                </span>
              </button>

              {!isChinese && (
                <a
                  href="/resume/Leficious_3D_Environment_Artist_Resume.pdf"
                  download
                  className="brass-plaque inline-flex items-center gap-2 rounded-xs px-4 py-3 font-display text-xs font-bold tracking-wide transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  <span>3D Art Résumé</span>
                  <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </header>

          {/* Expandable Full-Width Theater Stage for Environment Reel */}
          {reelExpanded && (
            <section className="animate-folio-unfold mt-6 rounded-xs border border-warm/40 bg-[#0d1018] p-3 sm:p-4">
              <FeaturedReel
                id="t5MchABcd3c"
                autoStart
                thumbnailSrc="/reels/environment-props-reel-2026.jpg"
                title={text("Environment & Props Reel 2026", "2026 环境与道具作品集锦")}
                description={text(
                  "Realtime 3D environments, hero props, Substance material graphs, stylized foliage, and scene lighting.",
                  "实时 3D 场景、核心道具、Substance 程序化材质、风格化植被与灯光作品。",
                )}
              />
            </section>
          )}

          {/* Recessed Atelier Discipline Index Tray (4-Sided Riveted Slips — Zero Wrapping Cutoff) */}
          <section className="mt-7 pb-12 md:mt-9" aria-label={text("Archive", "全部作品")}>
            <div className="mb-8 rounded-xs border border-warm/35 bg-[#0a0d15]/88 p-3 shadow-[inset_0_2px_14px_rgba(0,0,0,0.55)] sm:px-4 sm:py-3.5">
              <div className="mb-2.5 flex items-center justify-between gap-4 border-b border-warm/20 pb-2">
                <span className="font-numeral text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  {text("Discipline Index", "按专业类别筛选")}
                </span>
                <span className="font-numeral text-[10.5px] font-semibold tracking-[0.2em] text-warm" aria-live="polite">
                  {visibleEntries.length} {text(visibleEntries.length === 1 ? "SPECIMEN" : "SPECIMENS", "件标本")}
                </span>
              </div>

              <div
                className="flex flex-wrap items-center gap-1.5 sm:gap-2"
                role="group"
                aria-label={text("Filter by discipline", "按类别筛选")}
              >
                {(["All", ...galleryTags] as const).map((tag) => {
                  const active = activeTag === tag;
                  const label = tag === "All" ? text("All Plates", "全部图版") : isChinese ? galleryTagZh[tag] : tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveTag(tag)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xs border px-3 py-1.5 font-display text-xs font-bold tracking-wide transition-all duration-200 active:scale-97 sm:px-3.5 sm:text-[13.5px] ${
                        active
                          ? "parchment-sheet -translate-y-0.5 border-[#8c683a] border-l-[3px] border-l-rubric text-parchment-ink shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
                          : "border-warm/28 bg-[#151924] text-muted-foreground hover:-translate-y-0.5 hover:border-[#dfc092]/60 hover:bg-[#1c2231] hover:text-foreground"
                      }`}
                    >
                      {active && <span aria-hidden="true" className="relative z-10 h-1.5 w-1.5 rounded-full bg-rubric" />}
                      <span className="relative z-10">{label}</span>
                      <span
                        className={`relative z-10 font-mono text-[10.5px] font-normal ${
                          active ? "text-rubric" : "text-muted-foreground/70"
                        }`}
                      >
                        {tagCounts[tag] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mixed-Stock Salon Specimen Wall (Parchment Pinned Plates + Dark-Slate Specimen Cards) */}
            <GalleryLayout>
              {visibleEntries.map((entry, index) => {
                const isPinned = Boolean(entry.pinned);
                const multiPass = entry.media.length > 1;
                const plateLabel = `PLATE ${String(index + 1).padStart(2, "0")}`;
                const caption = galleryCaptions[entry.id]?.[isChinese ? 1 : 0] ?? entry.contribution;

                return (
                  <button
                    key={entry.id}
                    data-wide={wideGalleryEntries.has(entry.id)}
                    type="button"
                    onClick={() => openEntry(entry)}
                    onPointerMove={(e) => handleTactileCardMove(e, 1.8)}
                    onPointerLeave={resetTactileCard}
                    aria-label={`${text("Inspect", "检视图版")} ${entry.title}, ${entry.media.length} ${text(
                      entry.media.length === 1 ? "pass" : "passes",
                      "张分解图",
                    )}`}
                    className={`gallery-card tactile-tilt group flex w-full cursor-pointer flex-col overflow-hidden rounded-xs p-3 text-left sm:p-3.5 ${
                      isPinned
                        ? `parchment-sheet border-[3px] border-[#151821] ${multiPass ? "specimen-stack-parchment" : ""}`
                        : `slate-folio ${
                            multiPass
                              ? "specimen-stack-slate"
                              : "hover:shadow-[0_22px_54px_rgba(3,5,10,0.72),inset_0_0_0_1px_rgba(223,192,146,0.52)]"
                          }`
                    }`}
                  >
                    <FolioCorners tone={isPinned ? "parchment" : "slate"} inset="inset-1.5" />

                    {/* Top Plate Index Header */}
                    <div className="relative z-10 mb-2 flex w-full items-center justify-between px-1">
                      <span
                        className={`font-numeral text-[10.5px] font-semibold tracking-[0.18em] ${
                          isPinned ? "text-parchment-muted" : "text-warm/85"
                        }`}
                      >
                        {plateLabel} · {entry.year}
                      </span>
                      <span
                        className={`font-mono text-[10.5px] transition-transform duration-200 group-hover:translate-x-0.5 ${
                          isPinned ? "font-medium text-rubric" : "text-muted-foreground group-hover:text-[#dfc092]"
                        }`}
                      >
                        {entry.media.length} {text(entry.media.length === 1 ? "PASS" : "PASSES", "图层")} →
                      </span>
                    </div>

                    {/* Framed Artwork Bevel */}
                    <div
                      className={`relative z-10 w-full shrink-0 overflow-hidden rounded-xs border bg-[#0b0d13] ${
                        isPinned ? "border-[#735329]/55" : "border-warm/28"
                      }`}
                    >
                      <img
                        src={entry.cover}
                        alt={entry.coverAlt}
                        width="1200"
                        height="675"
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.022]"
                      />
                      {entry.id === "tenebria-character-rig" && (
                        <img
                          src="/gallery/artstation/tenebria/braids-back-render.avif"
                          alt={text("Tenebria braid detail", "Tenebria 编发细节")}
                          width="2160"
                          height="3840"
                          loading="lazy"
                          className="block max-h-[340px] w-full border-t border-[#735329]/45 object-cover object-top"
                        />
                      )}
                    </div>

                    {/* Curatorial Plate Caption */}
                    <div className="relative z-10 flex w-full flex-col px-1 pt-3 pb-0.5">
                      <h2
                        className={`font-display text-lg font-bold leading-snug tracking-tight transition-colors sm:text-[19.5px] ${
                          isPinned
                            ? "text-parchment-ink group-hover:text-rubric"
                            : "text-foreground group-hover:text-[#dfc092]"
                        }`}
                      >
                        {entry.title}
                      </h2>
                      <p
                        className={`mt-1 text-[13.5px] leading-relaxed sm:text-[14px] ${
                          isPinned ? "text-parchment-muted" : "text-muted-foreground"
                        }`}
                      >
                        {caption}
                      </p>
                    </div>
                  </button>
                );
              })}
            </GalleryLayout>

            {!visibleEntries.length && (
              <p className="py-20 text-center text-muted-foreground">
                {text("No specimen plates match this discipline.", "暂时没有属于该类别的作品。")}
              </p>
            )}
          </section>
        </main>
        <SiteFooter />
      </div>

      {selected && (
        <GalleryLightbox
          entry={selected}
          plateNumber={selectedIndexInVisible >= 0 ? selectedIndexInVisible + 1 : 1}
          slide={slide}
          onSlideChange={setSlide}
          onClose={closeEntry}
          onNextEntry={nextVisibleEntry ? stepToNextEntry : undefined}
          nextEntryTitle={nextVisibleEntry?.title}
        />
      )}
    </div>
  );
}
