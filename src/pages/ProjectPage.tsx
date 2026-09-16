import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { Media } from "../components/Media";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { getProject, projects } from "../lib/projects";
import { NotFoundPage } from "./NotFoundPage";

export function ProjectPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  if (!project) return <NotFoundPage message="Project not found" />;

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={`${project.title} — Leficious`} description={project.summary} path={`/projects/${project.slug}`} image={project.cover} />
      <article id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link to="/" viewTransition className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent">← All projects</Link>
        <header className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8"><h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">{project.title}</h1><p className="mt-4 text-pretty text-lg text-muted-foreground">{project.summary}</p></div>
          <dl className="space-y-4 md:col-span-4 md:border-l md:border-border md:pl-6">
            <div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Role</dt><dd className="text-sm">{project.role}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Year</dt><dd className="text-sm">{project.year}</dd></div>
            <div><dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Stack</dt><dd className="flex flex-wrap gap-1.5">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>)}</dd></div>
          </dl>
        </header>
        <div className="mt-12 aspect-video overflow-hidden rounded-lg border border-border bg-surface"><img src={project.cover} alt={`${project.title} cover`} width="1600" height="900" decoding="async" fetchPriority="high" className="h-full w-full object-cover" /></div>
        <section className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Overview</h2></div>
          <div className="space-y-4 text-pretty leading-relaxed md:col-span-9"><p>{project.overview}</p><ul className="mt-4 space-y-2 text-muted-foreground">{project.responsibilities.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 inline-block h-1 w-3 shrink-0 bg-accent" /><span>{item}</span></li>)}</ul></div>
        </section>
        {project.media.length > 0 && <section className="mt-16 grid gap-10 md:grid-cols-12"><div className="md:col-span-3"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Media</h2></div><div className="space-y-8 md:col-span-9">{project.media.map((item, mediaIndex) => <Media key={mediaIndex} item={item} />)}</div></section>}
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
        {project.snippets.length > 0 && <section className="mt-16 grid gap-10 md:grid-cols-12"><div className="md:col-span-3"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Code</h2></div><div className="space-y-6 md:col-span-9">{project.snippets.map((snippet, snippetIndex) => <CodeBlock key={snippetIndex} {...snippet} />)}</div></section>}
        <nav className="mt-24 flex items-center justify-between border-t border-border/60 pt-8"><Link to="/" viewTransition className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent">← All projects</Link><Link to={`/projects/${next.slug}`} viewTransition className="group text-right"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Next</p><p className="font-display text-lg font-semibold transition-colors group-hover:text-accent">{next.title} →</p></Link></nav>
      </article>
      <SiteFooter />
    </div>
  );
}
