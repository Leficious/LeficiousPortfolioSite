import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { Media } from "../components/Media";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { galleryEntries } from "../lib/gallery";
import { getProject, projects } from "../lib/projects";
import { NotFoundPage } from "./NotFoundPage";
import { useLanguage } from "../lib/language";
import { localizeGalleryEntry, localizeProject } from "../lib/localizedContent";

export function ProjectPage() {
  const { isChinese, text } = useLanguage();
  const { slug = "" } = useParams();
  const sourceProject = getProject(slug);
  if (!sourceProject) return <NotFoundPage message={text("Project not found", "未找到项目")} />;
  const project = localizeProject(sourceProject, isChinese);

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = localizeProject(projects[(index + 1) % projects.length], isChinese);
  const relatedGallery = galleryEntries.filter((entry) => project.relatedGalleryIds?.includes(entry.id)).map((entry) => localizeGalleryEntry(entry, isChinese));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={`${project.title} — Leficious`} description={project.summary} path={`/projects/${project.slug}`} image={project.cover} imageWidth={project.coverWidth} imageHeight={project.coverHeight} />
      <article id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link to="/" viewTransition className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent">← {text("All projects", "全部项目")}</Link>
        <header className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8"><h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">{project.title}</h1><p className="mt-4 text-pretty text-lg text-muted-foreground">{project.summary}</p></div>
          <dl className="space-y-4 md:col-span-4 md:border-l md:border-border md:pl-6">
            <div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{text("Role", "职责")}</dt><dd className="text-sm">{project.role}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{text("Year", "年份")}</dt><dd className="text-sm">{project.year}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{text("Stack", "技术栈")}</dt><dd className="flex flex-wrap gap-1.5">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>)}</dd></div>
          </dl>
        </header>
        <div className="mt-12 aspect-video overflow-hidden rounded-lg border border-border bg-surface"><img src={project.cover} alt={`${project.title}${text(" cover", "封面")}`} width="1600" height="900" decoding="async" fetchPriority="high" className="h-full w-full object-cover" /></div>
        <section className="mt-10 overflow-hidden rounded-lg border border-border bg-surface/45" aria-labelledby="project-brief-title">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
            <h2 id="project-brief-title" className="font-mono text-[10px] uppercase tracking-[0.22em] text-warm">{text("Project brief", "项目概览")}</h2>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{text("Recruiter summary", "招聘方摘要")}</span>
          </div>
          <dl className="grid md:grid-cols-3">
            {[
              [text("Design goal", "设计目标"), project.designGoal],
              [text("What I owned", "个人职责"), project.ownership],
              [text("Scope", "项目范围"), project.scope],
            ].map(([label, value], briefIndex) => (
              <div key={label} className="border-b border-border/60 p-5 last:border-b-0 md:border-b-0 md:border-r md:p-6 md:last:border-r-0">
                <dt className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground"><span className="text-accent">0{briefIndex + 1}</span>{label}</dt>
                <dd className="mt-4 text-sm leading-relaxed text-foreground/90">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-border/60 px-5 py-5 sm:px-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{text("Delivered", "交付成果")}</p>
            <ul className="mt-3 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
              {project.outcomes.map((outcome) => <li key={outcome} className="flex gap-3"><span className="mt-2 h-1 w-3 shrink-0 bg-accent" /><span>{outcome}</span></li>)}
            </ul>
          </div>
        </section>
        <section className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{text("Overview", "项目说明")}</h2></div>
          <div className="space-y-4 text-pretty leading-relaxed md:col-span-9">
            <p>{project.overview}</p>
            <ul className="mt-4 space-y-2 text-muted-foreground">{project.responsibilities.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 inline-block h-1 w-3 shrink-0 bg-accent" /><span>{item}</span></li>)}</ul>
            {project.authorNote && (
              <aside className="mt-8 border-l-2 border-warm/70 bg-surface/45 px-5 py-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-warm">{text("Why I made this", "我为什么做这个项目")}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">{project.authorNote}</p>
              </aside>
            )}
          </div>
        </section>
        {project.media.length > 0 && <section className="mt-16 grid gap-10 md:grid-cols-12"><div className="md:col-span-3"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{text("Media", "媒体")}</h2></div><div className="space-y-8 md:col-span-9">{project.media.map((item, mediaIndex) => <Media key={mediaIndex} item={item} />)}</div></section>}
        {project.sections?.map((section, sectionIndex) => (
          <section key={section.title} className="relative mt-20 border-t border-border/60 pt-10 md:mt-28 md:pt-14">
            <span aria-hidden="true" className="absolute right-0 top-4 font-display text-7xl font-semibold text-foreground/[0.025] md:text-9xl">{String(sectionIndex + 1).padStart(2, "0")}</span>
            <div className="relative grid gap-8 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{section.eyebrow}</p>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">{section.title}</h2>
              </div>
              <div className="space-y-4 text-pretty leading-relaxed text-muted-foreground md:col-span-9">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
            {section.media && section.media.length > 0 && (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 md:mt-10">
                {section.media.map((item, mediaIndex) => <Media key={mediaIndex} item={item} />)}
              </div>
            )}
          </section>
        ))}
        {project.snippets.length > 0 && <section className="mt-16 grid gap-10 md:grid-cols-12"><div className="md:col-span-3"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{text("Code", "代码")}</h2></div><div className="space-y-6 md:col-span-9">{project.snippets.map((snippet, snippetIndex) => <CodeBlock key={snippetIndex} {...snippet} />)}</div></section>}
        {relatedGallery.length > 0 && (
          <section className="mt-20 border-t border-border/60 pt-10 md:mt-28 md:pt-14" aria-labelledby="related-gallery-title">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{text("Related gallery work", "相关画廊作品")}</p><h2 id="related-gallery-title" className="mt-3 font-display text-2xl font-semibold">{text("Visuals and production studies.", "视觉作品与制作练习。")}</h2></div>
              <Link to="/gallery" viewTransition className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-accent">{text("View gallery", "查看画廊")} →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedGallery.map((entry) => (
                <Link key={entry.id} to={`/gallery?entry=${entry.id}`} viewTransition className="group overflow-hidden rounded-lg border border-border bg-surface/45 transition-colors hover:border-accent/70">
                  <div className="aspect-video overflow-hidden bg-muted"><img src={entry.cover} alt={entry.coverAlt} width="720" height="405" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" /></div>
                  <div className="p-4"><p className="font-display font-semibold transition-colors group-hover:text-accent">{entry.title}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{text("Open gallery set", "打开画廊组图")} →</p></div>
                </Link>
              ))}
            </div>
          </section>
        )}
        <nav className="mt-24 flex items-center justify-between border-t border-border/60 pt-8"><Link to="/" viewTransition className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent">← {text("All projects", "全部项目")}</Link><Link to={`/projects/${next.slug}`} viewTransition className="group text-right"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{text("Next", "下一个")}</p><p className="font-display text-lg font-semibold transition-colors group-hover:text-accent">{next.title} →</p></Link></nav>
      </article>
      <SiteFooter />
    </div>
  );
}
