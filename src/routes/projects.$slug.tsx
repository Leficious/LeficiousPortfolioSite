import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/SiteNav";
import { CodeBlock } from "@/components/CodeBlock";
import { Media } from "@/components/Media";
import { getProject, projects, type MediaItem, type CodeSnippet } from "@/lib/projects";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — leficious` },
          { name: "description", content: loaderData.project.summary },
          { property: "og:title", content: `${loaderData.project.title} — leficious` },
          { property: "og:description", content: loaderData.project.summary },
          { property: "og:image", content: loaderData.project.cover },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Project not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          ← Back to work
        </Link>
      </div>
    </div>
  ),
  component: ProjectPage,
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const idx = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        <Link
          to="/"
          className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
        >
          ← All projects
        </Link>

        <header className="mt-8 grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {project.summary}
            </p>
          </div>
          <dl className="space-y-4 md:col-span-4 md:border-l md:border-border md:pl-6">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Role
              </dt>
              <dd className="text-sm">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Year
              </dt>
              <dd className="text-sm">{project.year}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Stack
              </dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.tags.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </header>

        <div className="mt-12 overflow-hidden rounded-lg border border-border">
          <img
            src={project.cover}
            alt={`${project.title} cover`}
            className="h-auto w-full"
          />
        </div>

        <section className="mt-16 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Overview
            </h2>
          </div>
          <div className="md:col-span-9 space-y-4 text-pretty leading-relaxed">
            <p>{project.overview}</p>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              {project.responsibilities.map((r: string) => (
                <li key={r} className="flex gap-3">
                  <span className="mt-2 inline-block h-1 w-3 shrink-0 bg-accent" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {project.media.length > 0 && (
          <section className="mt-16 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Media
              </h2>
            </div>
            <div className="md:col-span-9 space-y-8">
              {project.media.map((m: MediaItem, i: number) => (
                <Media key={i} item={m} />
              ))}
            </div>
          </section>
        )}

        {project.snippets.length > 0 && (
          <section className="mt-16 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Code
              </h2>
            </div>
            <div className="md:col-span-9 space-y-6">
              {project.snippets.map((s: CodeSnippet, i: number) => (
                <CodeBlock key={i} {...s} />
              ))}
            </div>
          </section>
        )}

        <nav className="mt-24 flex items-center justify-between border-t border-border/60 pt-8">
          <Link
            to="/"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
          >
            ← All projects
          </Link>
          <Link
            to="/projects/$slug"
            params={{ slug: next.slug }}
            className="group text-right"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Next
            </p>
            <p className="font-display text-lg font-semibold transition-colors group-hover:text-accent">
              {next.title} →
            </p>
          </Link>
        </nav>
      </article>

      <SiteFooter />
    </div>
  );
}
