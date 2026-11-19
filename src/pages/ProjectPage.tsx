import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArchivalPaperSheaf,
  AtelierHeaderRail,
  BrassCornerClasps,
  BrassPinThreads,
  BrassRule,
  CrimsonStamp,
  FolioCorners,
} from "../components/AtelierChrome";
import { ScrollReveal } from "../components/AtelierMotion";
import { CodeBlock } from "../components/CodeBlock";
import { EchoGddWidget } from "../components/EchoGddComponents";
import { FeaturedReel } from "../components/FeaturedReel";
import { FormattedText } from "../components/FormattedText";
import { Media } from "../components/Media";
import { ProjectSigil } from "../components/ProjectSigils";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { galleryEntries } from "../lib/gallery";
import { useLanguage } from "../lib/language";
import { localizeGalleryEntry, localizeProject } from "../lib/localizedContent";
import { getProject, projects } from "../lib/projects";
import { NotFoundPage } from "./NotFoundPage";

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"] as const;
const ORDERED_FOLIO_SLUGS = [
  "still-life",
  "an-echo-has-no-shape",
  "fallen-valkyrie",
  "starshore",
  "sacred-forest",
] as const;

const SHEAF_FOLIO_LABELS: Record<string, { en: string; zh: string }> = {
  "still-life": { en: "I. Still Life", zh: "I · 静物" },
  "an-echo-has-no-shape": { en: "II. Echo", zh: "II · 回声无形" },
  "fallen-valkyrie": { en: "III. Fallen Valkyrie", zh: "III · 堕落女武神" },
  starshore: { en: "IV. Starshore", zh: "IV · 星岸" },
  "sacred-forest": { en: "V. Sacred Forest", zh: "V · 圣域森林" },
};

function toRoman(n: number): string {
  return ROMAN_NUMERALS[n - 1] ?? String(n);
}

export function ProjectPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const { slug = "" } = useParams();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);

  const sourceProject = getProject(slug);
  const sectionCount = sourceProject?.sections?.length ?? 0;

  useEffect(() => {
    setScrollProgress(0);
    setActiveChapter(0);
    if (typeof window === "undefined") return;

    const updateOnScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
      setScrollProgress(pct);

      let current = 0;
      for (let i = 0; i < sectionCount; i++) {
        const el = document.getElementById(`section-${i + 1}`);
        if (el && el.getBoundingClientRect().top <= 190) {
          current = i + 1;
        }
      }
      setActiveChapter(current);
    };

    updateOnScroll();
    window.addEventListener("scroll", updateOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateOnScroll);
  }, [slug, sectionCount]);

  if (!sourceProject) return <NotFoundPage message={text("Project folio not found", "未找到该项目卷宗")} />;

  const project = localizeProject(sourceProject, isChinese);
  const leadVideo = project.slug !== "sacred-forest" && project.media[0]?.type === "youtube" ? project.media[0] : null;
  const heroVisual = project.heroImage ?? project.cover;

  const orderedProjects = ORDERED_FOLIO_SLUGS.map((s) => projects.find((p) => p.slug === s) ?? projects[0]);
  const index = Math.max(0, orderedProjects.findIndex((item) => item.slug === project.slug));
  const folioRoman = toRoman(index + 1);
  const nextIdx = (index + 1) % orderedProjects.length;
  const next = localizeProject(orderedProjects[nextIdx], isChinese);
  const nextRoman = toRoman(nextIdx + 1);

  const relatedGallery = galleryEntries
    .filter((entry) => project.relatedGalleryIds?.includes(entry.id))
    .map((entry) => localizeGalleryEntry(entry, isChinese));

  return (
    <div className="min-h-screen px-4 py-5 text-foreground sm:px-8 lg:px-10 lg:py-6 xl:pr-24">
      <Seo
        title={`${project.title} | Leficious`}
        description={project.summary}
        path={localizedPath(`/projects/${project.slug}`)}
        image={project.cover}
        imageWidth={project.coverWidth}
        imageHeight={project.coverHeight}
      />

      {/* ==================== 1. UNIFIED VICTORIAN ARCHIVAL HEADER RAIL ==================== */}
      <AtelierHeaderRail
        eyebrow="LEFICIOUS"
        subtitle={`${text("Case Folio", "项目深度拆解卷宗")} ${folioRoman} / V · ${project.role} · ${project.year}`}
        maxWidthClass="max-w-[1080px]"
        rightSlot={
          <Link
            to={localizedPath("/")}
            viewTransition
            className="brass-plaque inline-flex items-center gap-2 px-4.5 py-2 font-numeral text-xs font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5 active:scale-97"
          >
            <span aria-hidden="true">←</span>
            <span>{text("Return to Atelier Desk", "返回案台卷宗")}</span>
          </Link>
        }
      />

      <article id="main-content" tabIndex={-1} className="mx-auto mt-6 max-w-[1080px] pb-16">
        {/* ==================== 2. SUSPENDED RAG-VELLUM CASE HEADER ==================== */}
        <BrassPinThreads animKey={project.slug} />

        <header className="parchment-sheet animate-folio-arc relative overflow-hidden border-[5px] border-[#110b07] px-6 pt-9 pb-8 shadow-[0_36px_88px_rgba(0,0,0,0.92),6px_6px_0_-1px_#dfd0b2,8px_8px_0_0_#110b07] sm:px-10 sm:pt-10 sm:pb-9">
          <FolioCorners tone="parchment" />

          <ProjectSigil
            slug={project.slug}
            variant="intaglio"
            className="pointer-events-none absolute right-8 bottom-7 hidden h-44 w-44 opacity-[0.08] md:block"
          />

          <div className="relative z-10 grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-8">
              <div className="flex items-center gap-4">
                <ProjectSigil
                  slug={project.slug}
                  variant="intaglio"
                  className="hidden h-12 w-12 shrink-0 opacity-90 sm:block"
                />
                <div>
                  <p className="font-numeral text-[11px] font-bold tracking-[0.24em] text-parchment-muted uppercase">
                    {text("CASE FOLIO", "项目深度拆解卷宗")} · {folioRoman}
                  </p>
                  <h1 className="mt-0.5 font-display text-3xl font-bold tracking-tight text-parchment-ink sm:text-4xl md:text-5xl">
                    {project.title}
                  </h1>
                </div>
              </div>

              <p className="mt-2 font-display text-base font-medium italic text-rubric sm:text-lg">
                {project.role} · {project.year}
              </p>

              <p
                className={`mt-4 text-pretty text-[17px] leading-[1.64] text-parchment-ink sm:text-[18px] ${
                  isChinese ? "zh-readable" : ""
                }`}
              >
                <FormattedText>{project.summary}</FormattedText>
              </p>

              {(project.externalLink || (project.downloads && project.downloads.length > 0)) && (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {project.externalLink && (
                    <a
                      href={project.externalLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="victorian-ticket inline-flex items-center gap-1.5 bg-[#140d09] px-4.5 py-2.5 font-numeral text-xs font-bold tracking-[0.12em] text-[#f6eedc] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-[#2c1e15]"
                    >
                      {project.externalLink.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.downloads?.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      download
                      className="victorian-ticket embossed-ticket inline-flex items-center gap-1.5 border-2 border-[#140d09] bg-parchment-deep/75 px-4 py-2.5 font-numeral text-xs font-bold tracking-[0.1em] text-parchment-ink uppercase transition-colors hover:bg-[#140d09] hover:text-[#f6eedc]"
                    >
                      {item.label} <span aria-hidden="true">↓</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <dl className="space-y-3.5 text-[15.5px] md:col-span-4 md:border-l md:border-[#684720]/45 md:pl-6">
              <div>
                <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Discipline & Role", "职责与定位")}
                </dt>
                <dd className="mt-0.5 font-semibold text-parchment-ink">{project.role}</dd>
              </div>
              <div>
                <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Chronology", "制作年份")}
                </dt>
                <dd className="mt-0.5 font-numeral text-xs font-semibold text-parchment-ink">{project.year}</dd>
              </div>
              <div>
                <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Engine & Craft", "引擎与技术栈")}
                </dt>
                <dd className="mt-1 text-[14.5px] leading-snug text-parchment-ink/92">{project.tags.join(" · ")}</dd>
              </div>
              {project.references && project.references.length > 0 && (
                <div>
                  <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                    {text("Theoretical Framework", "理论参考")}
                  </dt>
                  <dd className="mt-1 space-y-1 text-[14.5px]">
                    {project.references.map((ref) => (
                      <a
                        key={ref.url}
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-baseline gap-1 font-semibold text-rubric underline decoration-rubric/50 underline-offset-4 transition-colors hover:text-parchment-ink"
                      >
                        <span>{ref.label}</span>
                        <span aria-hidden="true" className="shrink-0 text-xs">↗</span>
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <BrassRule ornate tone="parchment" className="relative z-10 mt-7" />
        </header>

        {/* ==================== 3. LEAD GAMEPLAY PLATE ==================== */}
        <div className="mt-8">
          {leadVideo ? (
            <FeaturedReel
              id={leadVideo.id}
              title={project.title}
              description={leadVideo.caption ?? text("Gameplay walkthrough", "实机演示")}
              thumbnailSrc={leadVideo.thumbnailSrc ?? heroVisual}
            />
          ) : (
            <div className="slate-folio relative overflow-hidden border border-[#d4ae73]/52 p-2 shadow-[0_24px_56px_rgba(0,0,0,0.82)]">
              <BrassCornerClasps sizeClass="h-11 w-11 sm:h-14 sm:w-14" />
              <div className="aspect-video overflow-hidden border border-warm/30 bg-[#090706]">
                <img
                  src={heroVisual}
                  alt={`${project.title}${text(" cover", "封面")}`}
                  width="1600"
                  height="900"
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sticky Smoked-Mahogany Chapter Index Bar + Live Reading Progress */}
        {project.sections && (
          <nav
            aria-label={text("Jump to chapter", "跳转章节")}
            className="sticky top-[52px] z-30 mt-6 overflow-hidden border border-[#d4ae73]/48 bg-[#120d0a]/95 px-4 py-2.5 text-xs text-muted-foreground shadow-[0_12px_32px_rgba(0,0,0,0.78)] backdrop-blur-md lg:top-3"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {project.sections.map((section, sectionIndex) => {
                const isCurrent = activeChapter === sectionIndex + 1;
                return (
                  <Link
                    key={section.title}
                    to={`#section-${sectionIndex + 1}`}
                    className={`inline-flex items-baseline gap-1.5 transition-colors ${
                      isCurrent ? "text-[#f7eedc]" : "hover:text-[#ebd09e]"
                    }`}
                  >
                    <span
                      className={`font-numeral text-[11px] font-bold ${
                        isCurrent ? "text-[#e2be84]" : "text-warm/80"
                      }`}
                    >
                      {toRoman(sectionIndex + 1)}
                    </span>
                    <span className={`font-display text-sm ${isCurrent ? "font-bold" : "font-normal"}`}>
                      {section.title}
                    </span>
                  </Link>
                );
              })}
            </div>
            <span
              aria-hidden="true"
              style={{ width: `${scrollProgress.toFixed(1)}%` }}
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#8f1616] via-[#c89d62] to-[#ebd09e] transition-[width] duration-150"
            />
          </nav>
        )}

        {/* ==================== 4. FRAMED SMOKED-MAHOGANY PROLOGUE & RAG-VELLUM DESIGNER'S NOTE ==================== */}
        <ScrollReveal className="slate-folio relative mt-10 border border-[#d4ae73]/48 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.82)] sm:p-9">
          <BrassCornerClasps sizeClass="h-9 w-9 sm:h-11 sm:w-11" />
          <FolioCorners tone="slate" inset="inset-2.5" sizeClass="h-7 w-7" />

          <div className="relative z-10 grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <p className="font-numeral text-[10.5px] font-bold tracking-[0.22em] text-[#e2be84] uppercase">
                {text("PROLOGUE", "序章")}
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
                {text("Overview & Scope", "项目背景与规模")}
              </h2>
              <p className={`mt-2 text-[15px] leading-snug text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                <FormattedText>{project.scope}</FormattedText>
              </p>
            </div>

            <div className={`space-y-4 text-pretty leading-[1.66] md:col-span-9 ${isChinese ? "zh-readable" : ""}`}>
              <p className="text-[18px] text-foreground/96">
                <FormattedText>{project.overview}</FormattedText>
              </p>
              <ul className="space-y-2.5 pt-1 text-[16.5px] text-muted-foreground">
                {project.outcomes.map((outcome) => (
                  <li key={outcome} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 border border-warm bg-rubric" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>

              {project.authorNote && (
                <aside className="parchment-sheet relative mt-6 border-[3px] border-[#110b07] px-5 py-4 shadow-[0_14px_32px_rgba(0,0,0,0.65),4px_4px_0_-1px_#dfd0b2,6px_6px_0_0_#110b07] sm:px-6">
                  <CrimsonStamp className="pointer-events-none absolute right-5 -top-3.5 h-9.5 w-9.5" />
                  <p className="relative z-10 font-numeral text-[10.5px] font-bold tracking-[0.2em] text-rubric uppercase">
                    {text("Designer's Note — Why I Built This", "设计师手记 — 制作初衷")}
                  </p>
                  <p className={`relative z-10 mt-1.5 text-[16px] leading-relaxed text-parchment-ink ${isChinese ? "zh-readable" : ""}`}>
                    <FormattedText>{project.authorNote}</FormattedText>
                  </p>
                </aside>
              )}
            </div>
          </div>
        </ScrollReveal>

        {project.media.length > (leadVideo ? 1 : 0) && (
          <section className="mt-14">
            <BrassRule ornate tone="slate" className="mb-10" />
            <div className="grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <p className="font-numeral text-[10.5px] font-bold tracking-[0.2em] text-[#e2be84] uppercase">
                  {text("PLATES", "实机记录")}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
                  {text("Walkthroughs", "实机与分解演示")}
                </h2>
              </div>
              <div className="space-y-8 md:col-span-9">
                {project.media.slice(leadVideo ? 1 : 0).map((item, mediaIndex) => (
                  <Media key={mediaIndex} item={item} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== 5. FRAMED CASE CHAPTERS ==================== */}
        {project.sections?.map((section, sectionIndex) => (
          <section
            id={`section-${sectionIndex + 1}`}
            key={section.title}
            className="mt-14 scroll-mt-24 md:mt-16"
          >
            <BrassRule ornate tone="slate" className="mb-9" />

            <ScrollReveal className="slate-folio relative border border-warm/40 p-6 shadow-[0_20px_48px_rgba(0,0,0,0.75)] sm:p-8">
              <FolioCorners tone="slate" inset="inset-2" sizeClass="h-6 w-6" />

              <div className="relative z-10 grid gap-6 md:grid-cols-12 md:gap-10">
                <div className="min-w-0 md:col-span-3">
                  <span className="font-numeral text-xs font-bold tracking-[0.2em] text-[#e2be84]">
                    {text("CHAPTER", "章节")} {toRoman(sectionIndex + 1)}
                  </span>
                  <h2 className="mt-1.5 break-words font-display text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[26px]">
                    {section.title}
                  </h2>
                </div>
                <div
                  className={`min-w-0 space-y-4 text-pretty text-[17.5px] leading-[1.68] text-foreground/90 md:col-span-9 ${
                    isChinese ? "zh-readable" : ""
                  }`}
                >
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>
                      <FormattedText>{paragraph}</FormattedText>
                    </p>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {section.widget && <EchoGddWidget id={section.widget} />}

            {section.media && section.media.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10">
                {section.media.map((item, mediaIndex) => (
                  <div
                    key={mediaIndex}
                    className={
                      (item.type === "image" && item.fullWidth) || item.type === "youtube" ? "sm:col-span-2" : undefined
                    }
                  >
                    <Media item={item} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {project.snippets.length > 0 && (
          <section className="mt-14 md:mt-16">
            <BrassRule ornate tone="slate" className="mb-9" />
            <div className="grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <span className="font-numeral text-[10.5px] font-bold tracking-[0.2em] text-[#e2be84] uppercase">
                  {text("IMPLEMENTATION", "代码实现")}
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">{text("Core Source", "核心代码")}</h2>
              </div>
              <div className="space-y-6 md:col-span-9">
                {project.snippets.map((snippet, snippetIndex) => (
                  <CodeBlock key={snippetIndex} {...snippet} />
                ))}
              </div>
            </div>
          </section>
        )}

        {relatedGallery.length > 0 && (
          <section className="mt-14 md:mt-16" aria-labelledby="related-gallery-title">
            <BrassRule ornate tone="slate" className="mb-9" />
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="related-gallery-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {text("Related Specimen Plates in Gallery", "画廊中的关联拆解图版")}
              </h2>
              <Link
                to={localizedPath("/gallery")}
                viewTransition
                className="font-numeral text-xs font-bold tracking-[0.14em] text-[#e2be84] uppercase transition-colors hover:text-[#fbf3e4]"
              >
                {text("Open Salon Gallery", "进入完整画廊")} →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedGallery.map((entry) => (
                <Link
                  key={entry.id}
                  to={localizedPath(`/gallery?entry=${entry.id}`)}
                  viewTransition
                  onPointerMove={(e) => handleTactileCardMove(e, 2.5)}
                  onPointerLeave={resetTactileCard}
                  className="slate-folio tactile-tilt group relative overflow-hidden border border-warm/45 p-2.5 hover:border-[#ebd09e]"
                >
                  <FolioCorners tone="slate" inset="inset-1.5" sizeClass="h-5 w-5" />
                  <div className="relative z-10 aspect-video overflow-hidden border border-warm/30 bg-[#090706]">
                    <img
                      src={entry.cover}
                      alt={entry.coverAlt}
                      width="720"
                      height="405"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="relative z-10 px-1.5 pt-3 pb-1">
                    <p className="font-display text-base font-bold transition-colors group-hover:text-[#ebd09e]">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 font-numeral text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                      {text("Inspect passes", "检视制作图层")} →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ==================== 6. STACKED RAG-VELLUM & EMBOSSED CREST NEXT-FOLIO HANDOFF ==================== */}
        <nav className="mt-16 flex flex-col justify-between gap-6 border-t border-warm/38 pt-9 sm:flex-row sm:items-center">
          <Link
            to={localizedPath("/")}
            viewTransition
            className="brass-plaque inline-flex w-fit items-center gap-2 px-5 py-2.5 font-numeral text-xs font-bold tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5"
          >
            ← {text("Return to Atelier Desk", "返回案台卷宗")}
          </Link>

          <Link
            to={localizedPath(`/projects/${next.slug}`)}
            viewTransition
            className="parchment-sheet group relative inline-flex items-center gap-5 border-[4px] border-[#110b07] px-6 py-4 text-right shadow-[0_24px_54px_rgba(0,0,0,0.85),5px_5px_0_-1px_#dfd0b2,7px_7px_0_0_#110b07] transition-transform hover:-translate-y-1"
          >
            <FolioCorners tone="parchment" inset="inset-1.5" sizeClass="h-5 w-5" />
            <ProjectSigil
              slug={next.slug}
              variant="intaglio"
              className="relative z-10 h-12 w-12 shrink-0 opacity-90 transition-transform duration-300 group-hover:scale-108"
            />
            <div className="relative z-10">
              <span className="block font-numeral text-[10px] font-bold tracking-[0.2em] text-rubric uppercase">
                {text("NEXT CASE FOLIO", "下一卷宗")} · {nextRoman}
              </span>
              <span className="mt-0.5 block font-display text-xl font-bold tracking-tight text-parchment-ink transition-colors group-hover:text-rubric sm:text-2xl">
                {next.title} →
              </span>
            </div>
          </Link>
        </nav>
      </article>

      {/* Right-Edge 4-Ply Archival Paper Sheaf & Case Folio Dividers + Live Reading Ribbon */}
      <ArchivalPaperSheaf
        ariaLabel={text("Case Folio Dividers", "项目卷宗纸质分隔签")}
        progressPct={scrollProgress}
        topFlag={{
          label: text("← Desk", "← 案台"),
          to: localizedPath("/"),
        }}
        tabs={ORDERED_FOLIO_SLUGS.map((s) => ({
          id: s,
          label: isChinese ? SHEAF_FOLIO_LABELS[s].zh : SHEAF_FOLIO_LABELS[s].en,
          active: s === project.slug,
          to: localizedPath(`/projects/${s}`),
        }))}
      />

      <SiteFooter />
    </div>
  );
}
