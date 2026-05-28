import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/SiteNav";
import { projects } from "@/lib/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "leficious — Technical & Combat Design Portfolio" },
      {
        name: "description",
        content:
          "Selected work by leficious — combat systems, AI, weapon frameworks, and design tooling for games.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="grid gap-10 border-b border-border/60 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Portfolio · 2025
            </p>
          </div>
          <div className="md:col-span-9">
            <h1 className="font-display text-4xl font-semibold leading-[1.05] text-balance md:text-6xl">
              Technical & combat design that ships{" "}
              <span className="text-accent">readable, tunable, brutal</span> systems.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              I'm leficious. I prototype combat mechanics, AI behavior, and the
              tools that let design teams iterate on them. C++ in engine, Python
              for tooling, playtests as ground truth.
            </p>
          </div>
        </section>

        {/* Projects — columned list */}
        <section className="py-16 md:py-24">
          <div className="mb-10 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Selected Work
              </p>
            </div>
            <div className="md:col-span-9">
              <h2 className="font-display text-2xl font-semibold md:text-3xl">
                Projects
              </h2>
            </div>
          </div>

          <ul className="divide-y divide-border/60 border-y border-border/60">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug }}
                  className="group grid gap-6 py-8 transition-colors hover:bg-surface/40 md:grid-cols-12 md:items-center md:gap-8 md:py-10 md:px-4"
                >
                  <div className="font-mono text-xs text-muted-foreground md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">
                      {p.summary}
                    </p>
                  </div>

                  <div className="hidden md:col-span-3 md:block">
                    <p className="text-sm text-muted-foreground">{p.role}</p>
                    <p className="font-mono text-xs text-muted-foreground/70">
                      {p.year}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                    {p.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
