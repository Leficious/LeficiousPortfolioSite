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
        <section className="route-reveal relative isolate overflow-hidden border-b border-border/45 px-6 py-16 sm:px-10 md:py-24 lg:px-14">
          <div aria-hidden="true" className="absolute -left-32 top-12 -z-10 h-80 w-80 rounded-full bg-accent/[0.065] blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-0 left-0 -z-10 h-px w-2/3 bg-gradient-to-r from-warm/50 via-border/50 to-transparent" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="work-copy-enter">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-px w-8 bg-warm" />
                Selected work · {new Date().getFullYear()}
              </div>
              <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                Combat design and gameplay systems, from <span className="signal-headline-accent text-accent">prototype to playtest.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                I like building systems where rules, animation, and feedback all point toward the same player experience. I prototype combat mechanics, player abilities, and enemy behavior, then keep testing until the interaction feels as coherent as it is functional.
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

            <div id="hero-system-diagram" className="work-diagram-enter relative mx-auto w-full max-w-[350px] pb-8">
              <figure className="relative overflow-hidden bg-muted shadow-[0_22px_70px_rgba(0,0,0,0.3)]">
                <img src="/projects/fallen-valkyrie/cover.avif" alt="Fallen Valkyrie combat encounter" width="800" height="800" className="aspect-[4/5] h-full w-full object-cover object-center" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-background/75 via-transparent to-background/20" />
                <figcaption className="absolute inset-x-0 top-0 p-5">
                  <p className="text-sm font-semibold text-foreground">Fallen Valkyrie</p>
                  <p className="mt-1 text-xs text-foreground/65">Combat encounter · enemy AI · animation systems</p>
                </figcaption>
              </figure>
              <div className="absolute -bottom-1 -left-5 max-w-[235px] border-l-2 border-warm bg-background/95 px-4 py-3 shadow-xl">
                <p className="text-sm italic leading-relaxed text-foreground/80">“The player should understand an attack before they have to survive it.”</p>
              </div>
            </div>
          </div>
        </section>

        <div className="route-reveal work-meta-enter grid border-b border-border/45 sm:grid-cols-3">
          {[
            ["01", "Primary discipline", "Combat · gameplay design"],
            ["02", "Systems", "Player mechanics · enemy behavior · technical animation"],
            ["03", "Process", "Prototype · playtest · refine"],
          ].map(([number, label, value]) => (
            <div key={number} className="group relative min-h-32 overflow-hidden border-b border-border/45 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <span className="absolute right-4 top-2 font-display text-5xl font-semibold text-foreground/[0.025] transition-colors group-hover:text-warm/10">{number}</span>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
              <p className="mt-5 font-display text-lg font-medium">{value}</p>
            </div>
          ))}
        </div>

        <section className="route-reveal border-b border-border/45 px-6 py-12 sm:px-10 md:py-16 lg:px-14" aria-labelledby="technical-reel-title">
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
          <ul className="route-reveal-list space-y-10 md:space-y-14">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link to={`/projects/${project.slug}`} viewTransition className={`group grid overflow-hidden border-y border-border/50 bg-surface/20 transition-colors hover:border-accent/60 hover:bg-surface/45 ${index % 2 ? "md:grid-cols-[0.44fr_0.56fr]" : "md:grid-cols-[0.58fr_0.42fr]"}`}>
                  <div className={`relative min-h-56 overflow-hidden bg-muted md:min-h-80 ${index % 2 ? "md:order-2" : ""}`}>
                    <img src={project.cover} alt="" width="800" height="500" loading={index < 2 ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${index % 2 ? "from-background/35 via-transparent to-transparent" : "from-transparent via-transparent to-background/35"}`} />
                    <span className="absolute left-4 top-4 rounded-full border border-foreground/20 bg-background/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex min-h-64 flex-col justify-between p-6 sm:p-8 md:min-h-80 md:p-10">
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-warm">Case study {String(index + 1).padStart(2, "0")}</p>
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
