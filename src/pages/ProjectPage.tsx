import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { EchoGddWidget } from "../components/EchoGddComponents";
import { FormattedText } from "../components/FormattedText";
import { Media } from "../components/Media";
import { FeaturedReel } from "../components/FeaturedReel";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { galleryEntries } from "../lib/gallery";
import { getProject, projects } from "../lib/projects";
import { NotFoundPage } from "./NotFoundPage";
import { useLanguage } from "../lib/language";
import { localizeGalleryEntry, localizeProject } from "../lib/localizedContent";

export function ProjectPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const { slug = "" } = useParams();
  const sourceProject = getProject(slug);
  if (!sourceProject) return <NotFoundPage message={text("Project not found", "未找到项目")} />;

  const project = localizeProject(sourceProject, isChinese);
  const leadVideo = project.slug !== "sacred-forest" && project.media[0]?.type === "youtube" ? project.media[0] : null;
  const heroVisual = project.heroImage ?? project.cover;

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = localizeProject(projects[(index + 1) % projects.length], isChinese);
  const relatedGallery = galleryEntries
    .filter((entry) => project.relatedGalleryIds?.includes(entry.id))
    .map((entry) => localizeGalleryEntry(entry, isChinese));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={`${project.title} | Leficious`}
        description={project.summary}
        path={localizedPath(`/projects/${project.slug}`)}
        image={project.cover}
        imageWidth={project.coverWidth}
        imageHeight={project.coverHeight}
      />
      <article id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <Link
          to={localizedPath("/")}
          viewTransition
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span> {text("All work", "返回全部项目")}
        </Link>

        <header className="mt-7 grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {project.title}
            </h1>
            <p className={`mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg ${isChinese ? "zh-readable" : ""}`}>
              <FormattedText>{project.summary}</FormattedText>
            </p>
          </div>

          <dl className="space-y-3.5 text-sm md:col-span-4 md:border-l md:border-border md:pl-6">
            <div className="flex justify-between gap-4 md:block">
              <dt className="text-xs text-muted-foreground">{text("Role", "职责")}</dt>
              <dd className="text-sm text-foreground md:mt-0.5">{project.role}</dd>
            </div>
            <div className="flex justify-between gap-4 md:block">
              <dt className="text-xs text-muted-foreground">{text("Year", "年份")}</dt>
              <dd className="font-mono text-xs text-foreground md:mt-0.5">{project.year}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{text("Tools & Focus", "技术栈")}</dt>
              <dd className="mt-1 text-xs leading-relaxed text-foreground/90">{project.tags.join(" · ")}</dd>
            </div>
            {project.references && project.references.length > 0 && (
              <div>
                <dt className="text-xs text-muted-foreground">{text("Design framework", "理论参考")}</dt>
                <dd className="mt-1 space-y-1 text-xs">
                  {project.references.map((ref) => (
                    <a
                      key={ref.url}
                      href={ref.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-baseline gap-1 text-foreground/90 underline decoration-warm/70 underline-offset-4 transition-colors hover:text-warm"
                    >
                      <span>{ref.label}</span>
                      <span aria-hidden="true" className="shrink-0 font-mono text-[10px]">↗</span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
            {(project.externalLink || (project.downloads && project.downloads.length > 0)) && (
              <div className="flex flex-wrap gap-2 pt-1.5">
                {project.externalLink && (
                  <a
                    href={project.externalLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xs border border-foreground/40 bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    {project.externalLink.label} <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.downloads?.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    download
                    className="inline-flex items-center gap-1.5 rounded-xs border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    {item.label} <span aria-hidden="true">↓</span>
                  </a>
                ))}
              </div>
            )}
          </dl>
        </header>

        <div className="mt-8">
          {leadVideo ? (
            <FeaturedReel
              id={leadVideo.id}
              title={project.title}
              description={leadVideo.caption ?? text("Gameplay walkthrough", "实机演示")}
              thumbnailSrc={leadVideo.thumbnailSrc ?? heroVisual}
            />
          ) : (
            <div className="aspect-video overflow-hidden rounded-xs border border-border bg-surface">
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
          )}
        </div>

        {project.sections && (
          <nav
            aria-label={text("Jump to section", "跳转章节")}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-3 text-xs text-muted-foreground"
          >
            {project.sections.map((section, sectionIndex) => (
              <Link
                key={section.title}
                to={`#section-${sectionIndex + 1}`}
                className="inline-flex items-baseline gap-1.5 transition-colors hover:text-foreground"
              >
                <span className="font-mono text-[11px] text-warm">{String(sectionIndex + 1).padStart(2, "0")}</span>
                <span>{section.title}</span>
              </Link>
            ))}
          </nav>
        )}

        <section className="mt-12 grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
              {text("Overview", "项目背景")}
            </h2>
            <p className={`mt-2 text-xs leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
              <FormattedText>{project.scope}</FormattedText>
            </p>
          </div>
          <div className={`space-y-4 text-pretty leading-relaxed md:col-span-9 ${isChinese ? "zh-readable" : ""}`}>
            <p className="text-foreground/90">
              <FormattedText>{project.overview}</FormattedText>
            </p>
            <ul className="space-y-2 pt-1 text-sm text-muted-foreground">
              {project.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-warm" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
            {project.authorNote && (
              <aside className="mt-6 border-l-2 border-warm bg-surface px-5 py-4">
                <p className="text-xs font-medium text-foreground/80">{text("Why I built this", "制作初衷")}</p>
                <p className={`mt-2 text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                  <FormattedText>{project.authorNote}</FormattedText>
                </p>
              </aside>
            )}
          </div>
        </section>

        {project.media.length > (leadVideo ? 1 : 0) && (
          <section className="mt-16 grid gap-8 border-t border-border pt-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                {text("Walkthrough", "完整实机")}
              </h2>
            </div>
            <div className="space-y-8 md:col-span-9">
              {project.media.slice(leadVideo ? 1 : 0).map((item, mediaIndex) => (
                <Media key={mediaIndex} item={item} />
              ))}
            </div>
          </section>
        )}

        {project.sections?.map((section, sectionIndex) => (
          <section
            id={`section-${sectionIndex + 1}`}
            key={section.title}
            className="mt-16 scroll-mt-24 border-t border-border pt-12 md:mt-20 md:pt-14"
          >
            <div className="grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="min-w-0 md:col-span-3">
                <span className="font-mono text-xs text-warm">{String(sectionIndex + 1).padStart(2, "0")}</span>
                <h2 className="mt-1.5 break-words font-display text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
                  {section.title}
                </h2>
              </div>
              <div className={`min-w-0 space-y-4 text-pretty leading-relaxed text-muted-foreground md:col-span-9 ${isChinese ? "zh-readable" : ""}`}>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>
                    <FormattedText>{paragraph}</FormattedText>
                  </p>
                ))}
              </div>
            </div>

            {section.widget && <EchoGddWidget id={section.widget} />}

            {section.media && section.media.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10">
                {section.media.map((item, mediaIndex) => (
                  <div
                    key={mediaIndex}
                    className={(item.type === "image" && item.fullWidth) || item.type === "youtube" ? "sm:col-span-2" : undefined}
                  >
                    <Media item={item} />
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {project.snippets.length > 0 && (
          <section className="mt-16 grid gap-8 border-t border-border pt-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <h2 className="font-display text-lg font-semibold tracking-tight">{text("Code", "核心代码")}</h2>
            </div>
            <div className="space-y-6 md:col-span-9">
              {project.snippets.map((snippet, snippetIndex) => (
                <CodeBlock key={snippetIndex} {...snippet} />
              ))}
            </div>
          </section>
        )}

        {relatedGallery.length > 0 && (
          <section className="mt-16 border-t border-border pt-12 md:mt-20 md:pt-14" aria-labelledby="related-gallery-title">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <h2 id="related-gallery-title" className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                {text("Related Breakdowns in Gallery", "作品集中的更多拆解")}
              </h2>
              <Link
                to={localizedPath("/gallery")}
                viewTransition
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {text("Open full gallery", "查看全部作品集")} →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedGallery.map((entry) => (
                <Link
                  key={entry.id}
                  to={localizedPath(`/gallery?entry=${entry.id}`)}
                  viewTransition
                  className="group overflow-hidden rounded-xs border border-border bg-surface transition-colors hover:border-foreground/45"
                >
                  <div className="aspect-video overflow-hidden bg-muted">
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
                  <div className="p-4">
                    <p className="font-display text-sm font-semibold transition-colors group-hover:text-warm sm:text-base">
                      {entry.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{text("Inspect breakdowns", "查看制作组图")} →</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-20 flex items-center justify-between border-t border-border pt-8">
          <Link
            to={localizedPath("/")}
            viewTransition
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← {text("All work", "返回全部项目")}
          </Link>
          <Link to={localizedPath(`/projects/${next.slug}`)} viewTransition className="group text-right">
            <p className="text-xs text-muted-foreground">{text("Next project", "下一个项目")}</p>
            <p className="mt-0.5 font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-warm">
              {next.title} →
            </p>
          </Link>
        </nav>
      </article>
      <SiteFooter />
    </div>
  );
}
