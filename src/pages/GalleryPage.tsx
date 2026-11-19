import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArchivalPaperSheaf,
  AtelierHeaderRail,
  BrassCornerClasps,
  BrassRule,
  FolioCorners,
} from "../components/AtelierChrome";
import { FeaturedReel } from "../components/FeaturedReel";
import { GalleryLayout } from "../components/GalleryLayout";
import { GalleryLightbox } from "../components/GalleryLightbox";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { galleryEntries, galleryTags, type GalleryEntry, type GalleryTag } from "../lib/gallery";
import { galleryCaptions, wideGalleryEntries } from "../lib/galleryPresentation";
import { useLanguage } from "../lib/language";
import { galleryTagZh, localizeGalleryEntry } from "../lib/localizedContent";

const SHEAF_DISCIPLINES: { tag: GalleryTag | "All"; en: string; zh: string }[] = [
  { tag: "All", en: "I. All Plates", zh: "I · 全部图版" },
  { tag: "3D", en: "II. 3D Works", zh: "II · 3D 作品" },
  { tag: "Environment", en: "III. Environments", zh: "III · 环境场景" },
  { tag: "Realtime", en: "IV. Realtime", zh: "IV · 实时引擎" },
  { tag: "Technical Design", en: "V. Tech Design", zh: "V · 技术设计" },
  { tag: "Tools", en: "VI. Tooling", zh: "VI · 工具管线" },
];

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

  const localizedEntries = useMemo(
    () => galleryEntries.map((entry) => localizeGalleryEntry(entry, isChinese)),
    [isChinese],
  );

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { All: localizedEntries.length };
    for (const tag of galleryTags) {
      counts[tag] = localizedEntries.filter((entry) => entry.tags.includes(tag)).length;
    }
    return counts;
  }, [localizedEntries]);

  const visibleEntries = useMemo(
    () =>
      activeTag === "All"
        ? localizedEntries
        : localizedEntries.filter((entry) => entry.tags.includes(activeTag)),
    [activeTag, localizedEntries],
  );

  const entryId = searchParams.get("entry");
  const selected = useMemo(
    () => (entryId ? localizedEntries.find((entry) => entry.id === entryId) ?? null : null),
    [entryId, localizedEntries],
  );

  const [slide, setSlide] = useState(0);
  const lastEntryId = useRef<string | null>(null);
  useEffect(() => {
    if (entryId !== lastEntryId.current) {
      lastEntryId.current = entryId;
      setSlide(0);
    }
  }, [entryId]);

  const selectedIndexInVisible = useMemo(
    () => (selected ? visibleEntries.findIndex((item) => item.id === selected.id) : -1),
    [selected, visibleEntries],
  );

  const nextVisibleEntry =
    selectedIndexInVisible >= 0 && visibleEntries.length > 1
      ? visibleEntries[(selectedIndexInVisible + 1) % visibleEntries.length]
      : null;

  const openEntry = (entry: GalleryEntry) => {
    const next = new URLSearchParams(searchParams);
    next.set("entry", entry.id);
    navigate({ search: next.toString() }, { state: { galleryEntryOpened: true } });
  };

  const stepToNextEntry = useCallback(() => {
    if (!nextVisibleEntry) return;
    const next = new URLSearchParams(searchParams);
    next.set("entry", nextVisibleEntry.id);
    setSearchParams(next, { replace: true });
  }, [nextVisibleEntry, searchParams, setSearchParams]);

  const closeEntry = useCallback(() => {
    if (location.state?.galleryEntryOpened) navigate(-1);
    else {
      const next = new URLSearchParams(searchParams);
      next.delete("entry");
      setSearchParams(next, { replace: true });
    }
  }, [location.state, navigate, searchParams, setSearchParams]);

  return (
    <div className="min-h-screen px-4 py-5 text-foreground sm:px-8 lg:px-10 lg:py-6 xl:pl-11 xl:pr-28">
      <Seo
        title={text("Atelier Gallery | Leficious", "视觉与技术画廊 | Leficious")}
        description={text(
          "3D environment art, character rigging, realtime VFX, technical prototypes, and Maya tooling by Leficious.",
          "Leficious 的 3D 环境美术、角色绑定、实时特效、技术原型与 Maya 工具作品集。",
        )}
        path={localizedPath("/gallery")}
        image="/gallery/thumbnails/water-blossoms.webp"
        imageWidth={1000}
        imageHeight={563}
      />

      <div aria-hidden={selected ? "true" : undefined} inert={selected ? true : undefined}>
        {/* ==================== 1. UNIFIED VICTORIAN ARCHIVAL HEADER RAIL ==================== */}
        <AtelierHeaderRail
          eyebrow="LEFICIOUS"
          subtitle={text(
            "Salon Specimen Wall · 3D, Shaders, Rigging & Tooling",
            "视觉与技术标本馆 · 3D 场景、材质、绑定与工具",
          )}
          maxWidthClass="max-w-[1380px]"
          rightSlot={
            <a
              href={
                isChinese
                  ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
                  : "/resume/Leficious_3D_Environment_Artist_Resume.pdf"
              }
              download
              className="brass-plaque inline-flex items-center gap-1.5 px-3.5 py-1.5 font-display text-[12px] font-bold tracking-[0.12em] whitespace-nowrap uppercase transition-transform hover:-translate-y-0.5 active:scale-95 2xl:px-4.5 2xl:text-[12.5px]"
            >
              <span>{text("3D Art Résumé", "下载简历")}</span>
              <span aria-hidden="true">↓</span>
            </a>
          }
        />

        <main id="main-content" tabIndex={-1} className="mx-auto mt-6 max-w-[1260px]">
          {/* Salon Title + Bronze-Clamped Environment Reel Stage Trigger */}
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="font-numeral text-[10.5px] font-bold tracking-[0.24em] text-warm uppercase">
                {text("ARCHIVE CATALOGUE · XXIX PLATES", "馆藏技术与美术标本目录")}
              </p>
              <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {text("Atelier Archive & Visual Studies", "视觉美术与技术拆解画廊")}
              </h1>
            </div>

            <button
              type="button"
              onClick={() => setReelExpanded((prev) => !prev)}
              aria-expanded={reelExpanded}
              className="group relative flex cursor-pointer items-center gap-3.5 border-[1.5px] border-[#ebc88d]/80 bg-gradient-to-bl from-[#5e201d] via-[#421513] to-[#290c0b] p-2.5 pr-5 text-left shadow-[3px_3px_0_0_#eadbc0,4px_4px_0_0_#140d09,0_18px_40px_rgba(0,0,0,0.85)] transition-all hover:-translate-y-0.5 hover:border-[#fff0c8]"
            >
              <BrassCornerClasps sizeClass="h-7 w-7" />
              <span className="relative block h-12 w-21 shrink-0 overflow-hidden border border-warm/40 bg-[#090706]">
                <img
                  src="/reels/environment-props-reel-2026.jpg"
                  alt=""
                  width="320"
                  height="180"
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 grid place-items-center bg-black/30 text-xs text-[#f2dfc0] transition-colors group-hover:bg-black/10">
                  {reelExpanded ? "−" : "▶"}
                </span>
              </span>
              <span>
                <span className="block font-display text-sm font-semibold text-foreground transition-colors group-hover:text-[#ebd09e]">
                  {text("Environment & Props Reel 2026", "2026 环境与道具作品集锦")}
                </span>
                <span className="block font-display text-xs italic text-muted-foreground">
                  {reelExpanded
                    ? text("Close theater stage ↑", "收起播放器 ↑")
                    : text("Open 16:9 reel stage ↓", "展开高清集锦舞台 ↓")}
                </span>
              </span>
            </button>
          </div>

          {reelExpanded && (
            <section className="animate-folio-unfold mt-6 border border-[#d4ae73]/48 bg-[#120d0a] p-3 shadow-2xl sm:p-4">
              <FeaturedReel
                id="t5MchABcd3c"
                thumbnailSrc="/reels/environment-props-reel-2026.jpg"
                title={text("Environment & Props Reel 2026", "2026 环境与道具作品集锦")}
                description={text(
                  "Realtime 3D environments, hero props, Substance material graphs, stylized foliage, and scene lighting.",
                  "实时 3D 场景、核心道具、Substance 程序化材质、风格化植被与灯光作品。",
                )}
              />
            </section>
          )}

          <BrassRule ornate tone="slate" className="mt-6" />

          {/* Recessed Smoked-Mahogany Discipline Index Tray w/ Bronze Corner Clasps & Embossed Tickets */}
          <section className="mt-6 pb-12 md:mt-7" aria-label={text("Archive", "全部作品")}>
            <div className="relative mb-8 border-[1.5px] border-[#d4ae73]/68 bg-gradient-to-b from-[#2b1b12]/96 to-[#180f0a]/96 p-3.5 shadow-[0_18px_42px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(246,214,158,0.28)] sm:px-5 sm:py-4">
              <BrassCornerClasps sizeClass="h-8 w-8 sm:h-9 sm:w-9" />
              <div className="mb-2.5 flex items-center justify-between gap-4 border-b border-warm/32 pb-2">
                <span className="inline-flex items-center gap-2 font-numeral text-[10.5px] font-bold tracking-[0.22em] text-[#e8d5b5] uppercase">
                  <span aria-hidden="true" className="h-2 w-2 rotate-45 border border-[#ebc88d] bg-[#2d8f62]" />
                  {text("Discipline Index", "按专业类别筛选")}
                </span>
                <span className="font-numeral text-[10.5px] font-bold tracking-[0.2em] text-[#f0d29c]" aria-live="polite">
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
                      style={{
                        clipPath:
                          "polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)",
                      }}
                      className={`group relative inline-flex cursor-pointer p-[1.5px] transition-colors duration-200 ${
                        active
                          ? "bg-gradient-to-b from-[#fff2d4] to-[#cfa363] shadow-[0_6px_16px_rgba(0,0,0,0.68)]"
                          : "bg-gradient-to-b from-[#dfb97c]/78 to-[#8f6836]/62 shadow-[0_3px_10px_rgba(0,0,0,0.55)] hover:from-[#f6deb0] hover:to-[#b58749]"
                      }`}
                    >
                      <span
                        style={{
                          clipPath:
                            "polygon(6.12px 0, calc(100% - 6.12px) 0, 100% 6.12px, 100% calc(100% - 6.12px), calc(100% - 6.12px) 100%, 6.12px 100%, 0 calc(100% - 6.12px), 0 6.12px)",
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-display text-xs font-semibold tracking-wide transition-colors sm:px-3.5 sm:text-[14px] ${
                          active
                            ? "bg-gradient-to-b from-[#fbf3e2] to-[#e6d6b8] text-parchment-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
                            : "bg-gradient-to-b from-[#2e1f15] to-[#1c120d] text-[#e2d4be] group-hover:from-[#3a271b] group-hover:to-[#241811] group-hover:text-[#fbf3e4]"
                        }`}
                      >
                        <span>{label}</span>
                        <span
                          className={`font-numeral text-[11px] font-semibold tabular-nums ${
                            active ? "text-rubric" : "text-[#c0ad92] group-hover:text-[#ebd09e]"
                          }`}
                        >
                          ({tagCounts[tag] ?? 0})
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mixed-Stock Victorian Salon Wall */}
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
                    className={`gallery-card tactile-tilt group flex w-full cursor-pointer flex-col overflow-hidden p-3 text-left sm:p-3.5 ${
                      isPinned
                        ? `parchment-sheet border-[3px] border-[#110b07] ${
                            multiPass
                              ? "specimen-stack-parchment"
                              : "shadow-[0_24px_60px_rgba(4,2,1,0.78),5px_5px_0_-1px_#dfd0b2,7px_7px_0_0_#110b07]"
                          }`
                        : `slate-folio ${
                            multiPass
                              ? "specimen-stack-slate"
                              : "hover:shadow-[0_22px_54px_rgba(4,2,1,0.86),inset_0_0_0_1px_rgba(212,174,115,0.62)]"
                          }`
                    }`}
                  >
                    <FolioCorners tone={isPinned ? "parchment" : "slate"} inset="inset-1.5" sizeClass="h-5 w-5" />

                    <div className="relative z-10 mb-2 flex w-full items-center justify-between px-2.5">
                      <span
                        className={`font-numeral text-[10.5px] font-bold tracking-[0.18em] ${
                          isPinned ? "text-parchment-muted" : "text-[#e2be84]"
                        }`}
                      >
                        {plateLabel} · {entry.year}
                      </span>
                      <span
                        className={`font-numeral text-[10px] tracking-[0.12em] uppercase transition-transform duration-200 group-hover:translate-x-0.5 ${
                          isPinned ? "font-bold text-rubric" : "text-muted-foreground group-hover:text-[#ebd09e]"
                        }`}
                      >
                        {entry.media.length} {text(entry.media.length === 1 ? "PASS" : "PASSES", "图层")} →
                      </span>
                    </div>

                    <div
                      className={`relative z-10 w-full shrink-0 overflow-hidden border bg-[#0b0806] ${
                        isPinned ? "border-[#684720]/70" : "border-warm/35"
                      }`}
                    >
                      {index === 0 && <BrassCornerClasps sizeClass="h-10 w-10 sm:h-12 sm:w-12" />}
                      <img
                        src={entry.cover}
                        alt={entry.coverAlt}
                        width={entry.aspect === "portrait" ? 900 : entry.aspect === "square" ? 1000 : 1200}
                        height={entry.aspect === "portrait" ? 1200 : entry.aspect === "square" ? 1000 : 675}
                        loading={index < 6 ? "eager" : "lazy"}
                        decoding="async"
                        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      {entry.id === "tenebria-character-rig" && (
                        <img
                          src="/gallery/artstation/tenebria/braids-back-render.avif"
                          alt={text("Tenebria braid detail", "Tenebria 编发细节")}
                          width="2160"
                          height="3840"
                          loading="lazy"
                          className="block max-h-[340px] w-full border-t border-[#684720]/45 object-cover object-top"
                        />
                      )}
                    </div>

                    <div className="relative z-10 flex w-full flex-col px-2.5 pt-3 pb-1">
                      <h2
                        className={`font-display text-lg font-bold leading-snug tracking-tight transition-colors sm:text-[19px] ${
                          isPinned
                            ? "text-parchment-ink group-hover:text-rubric"
                            : "text-foreground group-hover:text-[#ebd09e]"
                        }`}
                      >
                        {entry.title}
                      </h2>
                      <p
                        className={`mt-1 text-[15px] leading-snug ${
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

        {/* Right-Edge 4-Ply Archival Paper Sheaf & Discipline Separator Dividers */}
        <ArchivalPaperSheaf
          ariaLabel={text("Gallery Discipline Dividers", "画廊类别纸质分隔签")}
          topFlag={{
            label: text("Reel", "集锦"),
            active: reelExpanded,
            onClick: () => {
              setReelExpanded((prev) => !prev);
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
          }}
          tabs={SHEAF_DISCIPLINES.map((d) => ({
            id: d.tag,
            label: isChinese ? d.zh : d.en,
            active: activeTag === d.tag,
            onClick: () => setActiveTag(d.tag),
          }))}
        />

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
