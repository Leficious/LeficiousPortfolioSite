import { Link } from "react-router-dom";
import { FeaturedReel } from "../components/FeaturedReel";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { projects } from "../lib/projects";

export function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="Leficious — Technical & Combat Design Portfolio" description="Selected work by Leficious — combat design, gameplay systems, AI, and interdisciplinary 3D production for games." />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="route-reveal relative isolate overflow-hidden border-x border-b border-border/60 px-6 py-16 sm:px-10 md:py-24 lg:px-14">
          <div aria-hidden="true" className="work-grid-enter absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
          <div aria-hidden="true" className="absolute -left-32 top-12 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="work-copy-enter">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-px w-8 bg-accent" />
                Portfolio · {new Date().getFullYear()}
              </div>
              <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                Combat design and gameplay systems, from <span className="signal-headline-accent text-accent">prototype to playtest.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                I design and implement combat mechanics, player abilities, and enemy behavior, then refine them through prototyping, playtesting, and iteration. My systems are created with focus on cohesiveness of their formal and dramatic elements.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#selected-work" className="inline-flex items-center rounded-full border border-accent bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/85">
                  View case studies ↓
                </a>
                <a href="/resume/Leficious_Technical_Game_Designer_Resume.pdf" download className="inline-flex items-center rounded-full border border-border bg-background/55 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent">
                  Download résumé
                </a>
              </div>
            </div>

            <div id="hero-system-diagram" aria-hidden="true" className="work-diagram-enter relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-background/65 shadow-[0_0_80px_rgba(91,154,172,0.08)]">
              <div className="absolute inset-5 border border-border/70" />
              <div className="absolute inset-10 border border-dashed border-accent/40" />
              <div className="absolute left-1/2 top-5 h-[calc(100%-2.5rem)] w-px bg-border/60" />
              <div className="absolute left-5 top-1/2 h-px w-[calc(100%-2.5rem)] bg-border/60" />
              <div className="signal-diagram-core absolute inset-[29%] grid place-items-center rounded-full border border-accent/70 bg-surface/90 shadow-[0_0_35px_rgba(91,154,172,0.15)]">
                <span className="text-center font-mono text-[9px] uppercase leading-loose tracking-[0.2em] text-foreground">Design<br />Build<br />Test</span>
              </div>
              <span className="absolute left-7 top-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Input</span>
              <span className="absolute right-7 top-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Rules</span>
              <span className="absolute bottom-7 left-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Response</span>
              <span className="absolute bottom-7 right-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">Feedback</span>
              <span className="absolute left-[18%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_var(--color-accent)] motion-safe:animate-pulse" />
              <span className="absolute right-[18%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/60" />
            </div>
          </div>
        </section>

        <div className="route-reveal work-meta-enter grid border-x border-b border-border/60 sm:grid-cols-3">
          {[
            ["01", "Primary discipline", "Combat · gameplay design"],
            ["02", "Systems", "Player mechanics · enemy behavior · technical animation"],
            ["03", "Process", "Prototype · playtest · refine"],
          ].map(([number, label, value]) => (
            <div key={number} className="group relative min-h-32 overflow-hidden border-b border-border/60 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <span className="absolute right-4 top-2 font-display text-5xl font-semibold text-foreground/[0.035] transition-colors group-hover:text-accent/10">{number}</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
              <p className="mt-5 font-display text-lg font-medium">{value}</p>
            </div>
          ))}
        </div>

        <section className="route-reveal border-x border-b border-border/60 px-6 py-12 sm:px-10 md:py-16 lg:px-14" aria-labelledby="technical-reel-title">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Featured reel</p>
              <h2 id="technical-reel-title" className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Technical game design.</h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Selected work · 2026</span>
          </div>
          <FeaturedReel
            id="rVIavxdutJE"
            title="Technical Game Design Reel 2026"
            description="Combat systems, gameplay prototypes, enemy behavior, and design-focused implementation across recent projects."
            eyebrow="Primary reel · 2026"
          />
        </section>

        <section id="selected-work" className="route-reveal scroll-mt-20 py-16 md:py-24">
          <div className="mb-12 grid gap-6 border-b border-border/60 pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Selected work</p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">Systems and designs built for <span className="text-accent">iteration.</span></h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Case studies covering combat, gameplay AI, modular systems, and 3D production.</p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{String(projects.length).padStart(2, "0")} case studies</p>
            </div>
          </div>
          <ul className="route-reveal-list space-y-5">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link to={`/projects/${project.slug}`} viewTransition className="group grid overflow-hidden rounded-lg border border-border bg-surface/45 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-surface md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-56 overflow-hidden bg-muted md:min-h-72">
                    <img src={project.cover} alt="" width="800" height="500" loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover opacity-75 grayscale-[25%] transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/45" />
                    <span className="absolute left-4 top-4 rounded-full border border-foreground/20 bg-background/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex min-h-64 flex-col justify-between p-6 sm:p-8 md:min-h-72">
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">Case study {String(index + 1).padStart(2, "0")}</p>
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{project.year}</span>
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">{project.title}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{project.summary}</p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-border/60 pt-5">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground/70">Role</p>
                        <p className="mt-1 text-xs text-muted-foreground">{project.role}</p>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                          {project.tags.slice(0, 3).map((tag) => <span key={tag} className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground/75">{tag}</span>)}
                        </div>
                        <span aria-hidden="true" className="font-mono text-sm text-accent transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
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
