import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BrassRule, CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { ScrollReveal } from "../components/AtelierMotion";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { CodeBlock } from "../components/CodeBlock";
import { EchoGddWidget } from "../components/EchoGddComponents";
import { FeaturedReel } from "../components/FeaturedReel";
import { FormattedText } from "../components/FormattedText";
import { Media } from "../components/Media";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
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
    if (typeof window === "undefined" || !sectionCount) return;

    const updateOnScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
      setScrollProgress(pct);

      let current = 0;
      for (let i = 0; i < sectionCount; i++) {
        const el = document.getElementById(`section-${i + 1}`);
        if (el && el.getBoundingClientRect().top <= 180) {
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
    <div className="min-h-screen text-foreground">
      <Seo
        title={`${project.title} | Leficious`}
        description={project.summary}
        path={localizedPath(`/projects/${project.slug}`)}
        image={project.cover}
        imageWidth={project.coverWidth}
        imageHeight={project.coverHeight}
      />

      <article id="main-content" tabIndex={-1} className="mx-auto max-w-[1060px] px-5 pt-8 pb-16 sm:px-8 lg:pt-10">
        {/* Top Return Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <Link
            to={localizedPath("/")}
            viewTransition
            className="inline-flex items-center gap-2 font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-[#dfc092]"
          >
            <span aria-hidden="true">←</span> {text("Return to Atelier Desk", "返回案台卷宗")}
          </Link>
          <span className="font-numeral text-[11px] tracking-[0.22em] text-warm/85">
            {text("FOLIO", "卷")} {folioRoman} / V
          </span>
        </div>

        {/* ==================== UNFOLDED RAG-PARCHMENT CASE HEADER ==================== */}
        <header className="parchment-sheet animate-folio-unfold relative mt-5 rounded-xs border-[5px] border-[#151821] px-6 py-7 sm:px-10 sm:py-9">
          <FolioCorners tone="parchment" />

          <div className="relative z-10 grid gap-8 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-numeral text-[11px] font-bold tracking-[0.24em] text-parchment-muted uppercase">
                    {text("CASE FOLIO", "项目深度拆解卷宗")} · {folioRoman}
                  </p>
                  <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-parchment-ink sm:text-4xl md:text-5xl">
                    {project.title}
                  </h1>
                  <p className="mt-1 font-display text-base italic text-rubric sm:text-lg">
                    {project.role} · {project.year}
                  </p>
                </div>
                <CrimsonStamp label={`FOLIO ${folioRoman}`} className="hidden h-13 w-13 opacity-80 sm:block" />
              </div>

              <p
                className={`mt-4 text-pretty text-base leading-[1.68] text-parchment-ink/92 sm:text-[17px] ${
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
                      className="inline-flex items-center gap-1.5 rounded-xs bg-[#181513] px-4 py-2 font-display text-sm font-semibold text-[#f4ecdc] transition-all hover:-translate-y-0.5 hover:bg-[#2c2520]"
                    >
                      {project.externalLink.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {project.downloads?.map((item) => (
                    <a
                      key={item.url}
                      href={item.url}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xs border border-[#181513]/65 bg-parchment-deep/55 px-3.5 py-2 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f4ecdc]"
                    >
                      {item.label} <span aria-hidden="true">↓</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right Archival Ledger Column */}
            <dl className="space-y-3.5 text-sm md:col-span-4 md:border-l md:border-[#8c683a]/40 md:pl-6">
              <div>
                <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Discipline & Role", "职责与定位")}
                </dt>
                <dd className="mt-0.5 text-[15px] font-medium text-parchment-ink">{project.role}</dd>
              </div>
              <div>
                <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Chronology", "制作年份")}
                </dt>
                <dd className="mt-0.5 font-mono text-xs text-parchment-ink">{project.year}</dd>
              </div>
              <div>
                <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                  {text("Engine & Craft", "引擎与技术栈")}
                </dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-parchment-ink/90">{project.tags.join(" · ")}</dd>
              </div>
              {project.references && project.references.length > 0 && (
                <div>
                  <dt className="font-numeral text-[10px] font-bold tracking-[0.2em] text-parchment-muted uppercase">
                    {text("Theoretical Framework", "理论参考")}
                  </dt>
                  <dd className="mt-1 space-y-1 text-[13.5px]">
                    {project.references.map((ref) => (
                      <a
                        key={ref.url}
                        href={ref.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-baseline gap-1 font-medium text-rubric underline decoration-rubric/50 underline-offset-4 transition-colors hover:text-parchment-ink"
                      >
                        <span>{ref.label}</span>
                        <span aria-hidden="true" className="shrink-0 font-mono text-[10px]">↗</span>
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        {/* Lead Gameplay Plate */}
        <div className="mt-7">
          {leadVideo ? (
            <FeaturedReel
              id={leadVideo.id}
              title={project.title}
              description={leadVideo.caption ?? text("Gameplay walkthrough", "实机演示")}
              thumbnailSrc={leadVideo.thumbnailSrc ?? heroVisual}
            />
          ) : (
            <div className="slate-folio overflow-hidden rounded-xs border border-warm/35 p-1.5">
              <div className="aspect-video overflow-hidden rounded-xs border border-warm/25 bg-[#090b10]">
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

        {/* Sticky Roman-Numeral Chapter Compass + Live Reading Progress Hairline */}
        {project.sections && (
          <nav
            aria-label={text("Jump to chapter", "跳转章节")}
            className="sticky top-[52px] z-30 mt-6 overflow-hidden rounded-xs border border-warm/35 bg-[#0d1018]/92 px-4 py-2.5 text-xs text-muted-foreground shadow-[0_10px_28px_rgba(0,0,0,0.48)] backdrop-blur-md lg:top-3"
          >
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              {project.sections.map((section, sectionIndex) => {
                const isCurrent = activeChapter === sectionIndex + 1;
                return (
                  <Link
                    key={section.title}
                    to={`#section-${sectionIndex + 1}`}
                    className={`inline-flex items-baseline gap-1.5 transition-colors ${
                      isCurrent ? "text-[#f5e3be]" : "hover:text-[#f2dfb9]"
                    }`}
                  >
                    <span
                      className={`font-numeral text-[11px] font-bold ${
                        isCurrent ? "text-[#f0c987]" : "text-warm/80"
                      }`}
                    >
                      {toRoman(sectionIndex + 1)}
                    </span>
                    <span className={`font-display text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>
                      {section.title}
                    </span>
                  </Link>
                );
              })}
            </div>
            {/* Live reading progress brass hairline */}
            <span
              aria-hidden="true"
              style={{ width: `${scrollProgress.toFixed(1)}%` }}
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#8b2624] via-[#c59a68] to-[#ebd2a4] transition-[width] duration-150"
            />
          </nav>
        )}

        {/* Overview & Key Outcomes */}
        <ScrollReveal className="mt-12 grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <p className="font-numeral text-[10.5px] tracking-[0.2em] text-warm/85 uppercase">
              {text("PROLOGUE", "序章")}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground">
              {text("Overview & Scope", "项目背景与规模")}
            </h2>
            <p className={`mt-2 text-[13.5px] leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
              <FormattedText>{project.scope}</FormattedText>
            </p>
          </div>
          <div className={`space-y-4 text-pretty leading-[1.7] md:col-span-9 ${isChinese ? "zh-readable" : ""}`}>
            <p className="text-[16.5px] text-foreground/94">
              <FormattedText>{project.overview}</FormattedText>
            </p>
            <ul className="space-y-2.5 pt-1 text-[15px] text-muted-foreground">
              {project.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 border border-warm bg-warm/60" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
            {project.authorNote && (
              <aside className="slate-folio mt-6 border-l-2 border-l-warm px-5 py-4">
                <p className="font-numeral text-[10.5px] font-semibold tracking-[0.2em] text-[#dfc092] uppercase">
                  {text("Designer's Note — Why I Built This", "设计师手记 — 制作初衷")}
                </p>
                <p className={`mt-2 text-[15px] leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                  <FormattedText>{project.authorNote}</FormattedText>
                </p>
              </aside>
            )}
          </div>
        </ScrollReveal>

        {/* Additional Walkthrough Media */}
        {project.media.length > (leadVideo ? 1 : 0) && (
          <section className="mt-16 grid gap-8 pt-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-12">
              <BrassRule tone="slate" className="mb-10" />
            </div>
            <div className="md:col-span-3">
              <p className="font-numeral text-[10.5px] tracking-[0.2em] text-warm/85 uppercase">
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
          </section>
        )}

        {/* Numbered Chapters */}
        {project.sections?.map((section, sectionIndex) => (
          <section
            id={`section-${sectionIndex + 1}`}
            key={section.title}
            className="mt-16 scroll-mt-24 md:mt-20"
          >
            <BrassRule tone="slate" className="mb-12" />

            <ScrollReveal className="grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="min-w-0 md:col-span-3">
                <span className="font-numeral text-xs font-bold tracking-[0.2em] text-warm">
                  {text("CHAPTER", "章节")} {toRoman(sectionIndex + 1)}
                </span>
                <h2 className="mt-1.5 break-words font-display text-2xl font-bold leading-snug tracking-tight text-foreground sm:text-[26px]">
                  {section.title}
                </h2>
              </div>
              <div
                className={`min-w-0 space-y-4 text-pretty text-[16px] leading-[1.72] text-muted-foreground md:col-span-9 ${
                  isChinese ? "zh-readable" : ""
                }`}
              >
                {section.body.map((paragraph) => (
                  <p key={paragraph}>
                    <FormattedText>{paragraph}</FormattedText>
                  </p>
                ))}
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

        {/* Source Code Plates */}
        {project.snippets.length > 0 && (
          <section className="mt-16 md:mt-20">
            <BrassRule tone="slate" className="mb-12" />
            <div className="grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <span className="font-numeral text-[10.5px] tracking-[0.2em] text-warm/85 uppercase">
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

        {/* Related Specimen Plates in Salon Gallery */}
        {relatedGallery.length > 0 && (
          <section className="mt-16 md:mt-20" aria-labelledby="related-gallery-title">
            <BrassRule tone="slate" className="mb-12" />
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="related-gallery-title" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                {text("Related Specimen Plates in Gallery", "画廊中的关联拆解图版")}
              </h2>
              <Link
                to={localizedPath("/gallery")}
                viewTransition
                className="font-display text-sm font-semibold text-warm transition-colors hover:text-[#f3dfb8]"
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
                  className="slate-folio tactile-tilt group relative overflow-hidden rounded-xs border border-warm/30 p-2.5 hover:border-[#dfc092]"
                >
                  <div className="aspect-video overflow-hidden rounded-xs border border-warm/20 bg-[#0a0c12]">
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
                  <div className="px-1 pt-3 pb-1">
                    <p className="font-display text-base font-bold transition-colors group-hover:text-[#dfc092]">
                      {entry.title}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {text("Inspect passes", "检视制作图层")} →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Next Folio Calling Card */}
        <nav className="mt-20 flex flex-col justify-between gap-4 border-t border-warm/30 pt-8 sm:flex-row sm:items-center">
          <Link
            to={localizedPath("/")}
            viewTransition
            className="font-display text-sm font-semibold text-muted-foreground transition-colors hover:text-[#dfc092]"
          >
            ← {text("Return to Atelier Desk", "返回案台卷宗")}
          </Link>
          <Link
            to={localizedPath(`/projects/${next.slug}`)}
            viewTransition
            className="parchment-sheet group inline-flex flex-col rounded-xs border-2 border-[#151821] px-5 py-3 text-right transition-transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 font-numeral text-[10px] font-bold tracking-[0.2em] text-rubric uppercase">
              {text("NEXT CASE FOLIO", "下一卷宗")} · {nextRoman}
            </span>
            <span className="relative z-10 mt-0.5 font-display text-xl font-bold tracking-tight text-parchment-ink transition-colors group-hover:text-rubric">
              {next.title} →
            </span>
          </Link>
        </nav>
      </article>

      <SiteFooter />
    </div>
  );
}
