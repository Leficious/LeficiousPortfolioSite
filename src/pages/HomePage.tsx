import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { SiteFooter, SiteNav } from "../components/SiteNav";
import { WelcomeIntro } from "../components/WelcomeIntro";
import { projects } from "../lib/projects";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="Leficious — Technical & Combat Design Portfolio" description="Selected work by Leficious — combat systems, AI, weapon frameworks, and design tooling for games." />
      <WelcomeIntro />
      <SiteNav />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6">
        <section className="grid gap-10 border-b border-border/60 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Portfolio · {new Date().getFullYear()}</p></div>
          <div className="md:col-span-9">
            <h1 className="font-display text-4xl font-semibold leading-[1.05] text-balance md:text-6xl">
              Combat systems, gameplay tools, and implementation in <span className="text-accent">Unreal Engine.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
              I focus on technical and combat design: prototyping mechanics, AI behavior, and designer-facing tools, then refining them through playtesting and iteration. My background in 3D production helps me work across gameplay, animation, and asset pipelines.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mb-10 grid gap-4 md:grid-cols-12">
            <div className="md:col-span-3"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Selected Work</p></div>
            <div className="md:col-span-9"><h2 className="font-display text-2xl font-semibold md:text-3xl">Projects</h2></div>
          </div>
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link to={`/projects/${project.slug}`} className="group grid gap-6 py-8 transition-colors hover:bg-surface/40 md:grid-cols-12 md:items-center md:gap-8 md:px-4 md:py-10">
                  <div className="font-mono text-xs text-muted-foreground md:col-span-1">{String(index + 1).padStart(2, "0")}</div>
                  <div className="md:col-span-5">
                    <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-accent md:text-2xl">{project.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">{project.summary}</p>
                  </div>
                  <div className="hidden md:col-span-3 md:block"><p className="text-sm text-muted-foreground">{project.role}</p><p className="font-mono text-xs text-muted-foreground/70">{project.year}</p></div>
                  <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
                    {project.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>)}
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
