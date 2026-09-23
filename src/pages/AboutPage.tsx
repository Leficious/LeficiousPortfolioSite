import { useRef, useState, type ReactNode } from "react";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";

type IconName = "email" | "linkedin" | "linktree" | "artstation";

function ContactIcon({ name }: { name: IconName }) {
  if (name === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  const brands: Record<Exclude<IconName, "email">, { viewBox: string; color: string; path: ReactNode }> = {
    linkedin: {
      viewBox: "0 0 16 16",
      color: "text-[#0A66C2]",
      path: <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708C16 15.487 15.474 16 14.825 16H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z" />,
    },
    linktree: {
      viewBox: "0 0 24 24",
      color: "text-[#43E55E]",
      path: <path d="m13.736 5.853 4.005-4.117 2.325 2.381-4.201 4.004h5.909v3.305h-5.937l4.229 4.108-2.325 2.334L12 12.099l-5.74 5.769-2.325-2.325 4.229-4.108H2.226V8.121h5.909L3.934 4.117l2.325-2.381 4.005 4.117V0h3.472v5.853Zm-3.472 10.306h3.472V24h-3.472v-7.841Z" />,
    },
    artstation: {
      viewBox: "0 0 24 24",
      color: "text-[#13AFF0]",
      path: <path d="m0 17.723 2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0Zm24 .025c0-.484-.143-.935-.388-1.314L15.728 2.728a2.424 2.424 0 0 0-2.142-1.289H9.419L21.598 22.54l1.92-3.325c.378-.637.482-.919.482-1.467Zm-11.129-3.462L7.428 4.858l-5.444 9.428h10.887Z" />,
    },
  };
  const brand = brands[name];

  return (
    <svg viewBox={brand.viewBox} aria-hidden="true" className={`h-6 w-6 fill-current ${brand.color}`}>
      {brand.path}
    </svg>
  );
}

const systems = [
  { number: "01", title: "Combat Design", description: "I care about readable intent, decisive feedback, and the pacing between anticipation, action, and recovery." },
  { number: "02", title: "Gameplay Systems", description: "I build rules and data structures that are easy to tune, extend, and understand while the design is still changing." },
  { number: "03", title: "Technical Animation", description: "I connect character motion to gameplay through state-driven logic, Control Rig, and runtime animation systems." },
  { number: "04", title: "Technical Production", description: "My 3D background helps me carry ideas through art implementation, procedural workflows, and final integration." },
];

const contactLinks: { label: string; detail: string; href: string; icon: IconName }[] = [
  { label: "LinkedIn", detail: "Connect professionally", href: "https://www.linkedin.com/in/leficious/", icon: "linkedin" },
  { label: "Linktree", detail: "Everything in one place", href: "https://linktr.ee/leficious", icon: "linktree" },
  { label: "ArtStation", detail: "More visual work", href: "https://www.artstation.com/leficious", icon: "artstation" },
];

export function AboutPage() {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLSpanElement>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("leficious@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      if (!emailRef.current) return;
      const range = document.createRange();
      range.selectNodeContents(emailRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="About & Contact — Leficious" description="About Leficious — technical game designer focused on combat design and gameplay systems, with experience across AI, animation, technical art, and 3D production." path="/about" />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="route-reveal relative isolate overflow-hidden border-b border-border/45 px-6 py-16 sm:px-10 md:py-24 lg:px-14">
          <div aria-hidden="true" className="absolute -right-28 -top-32 -z-10 h-96 w-96 rounded-full bg-warm/[0.055] blur-3xl" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <span className="h-px w-8 bg-warm" />
                Technical game designer
              </div>
              <h1 className="mt-7 max-w-3xl font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                Technical design, gameplay systems, <span className="text-accent">3D production.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                I came to technical design through making environments, characters, animation, and tools. That production background still shapes how I work: I want the logic underneath a mechanic and the experience on screen to feel like parts of the same idea.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-[350px] pb-12 pt-3">
              <figure className="relative ml-auto w-[82%] overflow-hidden shadow-[0_18px_55px_rgba(0,0,0,0.28)]">
                <img src="/projects/sacred-forest/cover.avif" alt="Sacred Forest environment" width="800" height="600" className="aspect-[4/5] w-full object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 pb-4 pt-12 text-xs text-foreground/70">Environment, lighting, and material work</figcaption>
              </figure>
              <figure className="absolute -left-1 bottom-2 w-[54%] overflow-hidden border-4 border-background shadow-2xl">
                <img src="/gallery/tools/stylize-normals-toolkit/menus.avif" alt="Stylize Normals Toolkit interface" width="600" height="420" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="bg-surface px-3 py-2 text-[11px] text-muted-foreground">Tools built around production needs</figcaption>
              </figure>
              <span aria-hidden="true" className="absolute -right-3 top-16 h-20 w-1 bg-warm/70" />
            </div>
          </div>
        </section>

        <section className="route-reveal py-16 md:py-24" aria-labelledby="systems-title">
          <div className="grid gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Areas of practice</p>
              <h2 id="systems-title" className="mt-4 font-display text-3xl font-semibold leading-tight">From design intent to <span className="text-accent">implementation.</span></h2>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">I work across several disciplines, but the goal stays consistent: make the player&apos;s experience clear, responsive, and worth mastering.</p>
            </div>
            <div className="route-reveal-list divide-y divide-border/55 border-y border-border/55 md:col-span-8">
              {systems.map((system, index) => (
                <article key={system.number} className={`group grid gap-4 py-7 transition-colors sm:grid-cols-[52px_1fr] ${index % 2 ? "sm:pl-10" : "sm:pr-10"}`}>
                  <span className="font-display text-2xl text-warm/70">{system.number}</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-accent">{system.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{system.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <blockquote className="route-reveal mb-16 max-w-4xl border-l-2 border-warm py-2 pl-6 font-display text-2xl leading-snug text-foreground/85 sm:text-3xl">
          I&apos;m most interested in the point where a system stops feeling like a collection of rules and starts feeling like part of the world.
        </blockquote>

        <section className="route-reveal grid gap-6 border-t border-border/60 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Capabilities</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">A design focus with <span className="text-accent">production range.</span></h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">Because I have built the assets, shaders, rigs, and animation around gameplay systems, I can usually speak to both the design intention and the production cost of an idea.</p>
          </div>
          <div className="route-reveal-list grid gap-4 md:col-span-8 sm:grid-cols-2">
            <article className="relative overflow-hidden rounded-lg border border-border bg-surface/55 p-6">
              <span aria-hidden="true" className="absolute -right-3 -top-7 font-display text-8xl font-bold text-foreground/[0.025]">D</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">Disciplines</p>
              <ul className="mt-6 space-y-4">
                {["Combat design & 3Cs", "Technical animation", "Gameplay systems", "AI systems", "Level & world design"].map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm"><span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span><span className="h-px w-5 bg-border" />{item}</li>
                ))}
              </ul>
            </article>
            <article className="relative overflow-hidden rounded-lg border border-border bg-surface/55 p-6 sm:translate-y-8">
              <span aria-hidden="true" className="absolute -right-3 -top-7 font-display text-8xl font-bold text-foreground/[0.025]">T</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">Toolkit</p>
              <ul className="mt-6 space-y-4">
                {["Unreal Engine · Unity", "Blueprint · C++ · C#", "Gameplay AI · Behavior Trees · StateTrees", "Animation systems · UI · Realtime cinematics", "Maya · Substance · Git / Perforce · Python · SpeedTree / Gaea"].map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm"><span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span><span className="h-px w-5 bg-border" />{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="route-reveal mb-16 grid overflow-hidden rounded-lg border border-border md:grid-cols-[0.32fr_0.68fr]" aria-labelledby="education-title">
          <div className="border-b border-border bg-surface/55 p-6 md:border-b-0 md:border-r md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Foundation</p>
            <h2 id="education-title" className="mt-3 font-display text-2xl font-semibold">Education</h2>
          </div>
          <div className="divide-y divide-border/60">
            <div className="grid gap-2 p-6 sm:grid-cols-[1fr_auto] sm:items-end md:px-8"><div><p className="font-display text-lg font-semibold">MS, Game Design and Development</p><p className="mt-1 text-sm text-muted-foreground">USC School of Cinematic Arts</p></div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Expected 2028</p></div>
            <div className="grid gap-2 p-6 sm:grid-cols-[1fr_auto] sm:items-end md:px-8"><div><p className="font-display text-lg font-semibold">BFA, Digital Production - Games</p><p className="mt-1 text-sm text-muted-foreground">Gnomon School of Visual Effects · Featured in Gnomon&apos;s student reel</p></div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">2025</p></div>
          </div>
        </section>

        <section className="route-reveal route-reveal-list mb-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2" aria-label="Languages and geographic availability">
          <article className="bg-surface/55 p-6 md:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">Languages</p>
            <h2 className="mt-4 font-display text-xl font-semibold">English + Mandarin Chinese</h2>
            <p className="mt-2 text-sm text-muted-foreground">Fluent</p>
          </article>
          <article className="bg-surface/55 p-6 md:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">Geographic availability</p>
            <h2 className="mt-4 font-display text-xl font-semibold">Open to select global regions</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">United States · Canada · Northern &amp; Western Europe · Japan · China</p>
          </article>
        </section>

        <section id="contact" className="route-reveal relative scroll-mt-24 overflow-hidden rounded-xl border border-border bg-surface/35 p-6 sm:p-10 md:p-12">
          <div aria-hidden="true" className="absolute right-0 top-0 h-40 w-40 bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1.5px)] opacity-20 [background-size:12px_12px] [mask-image:linear-gradient(135deg,black,transparent_75%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Contact / Open channel</p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">Let&apos;s make something <span className="text-accent">feel good</span> to play.</h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">If you&apos;re building expressive combat, a tricky gameplay system, or something that needs design and production to meet in the middle, I&apos;d like to hear about it.</p>
              <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />Focused on technical, combat, and gameplay design · open to adjacent opportunities</div>
              <a href="/resume/Leficious_Technical_Game_Designer_Resume.pdf" download className="mt-6 inline-flex items-center gap-3 rounded-full border border-accent/60 bg-background/55 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground">
                Download technical design résumé <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="route-reveal-list grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={copyEmail} className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-background/55 p-5 text-left transition-all hover:-translate-y-1 hover:border-accent hover:bg-background">
                <div className="flex items-start justify-between text-muted-foreground transition-colors group-hover:text-accent"><ContactIcon name="email" /><span className="font-mono text-[9px] uppercase tracking-[0.16em]">{copied ? "Copied" : "Copy"}</span></div>
                <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Email</p><span ref={emailRef} className="mt-1 block font-mono text-xs sm:text-sm">leficious@gmail.com</span></div>
              </button>
              {contactLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-background/55 p-5 transition-all hover:-translate-y-1 hover:border-accent hover:bg-background">
                  <div className="flex items-start justify-between text-muted-foreground transition-colors group-hover:text-accent"><ContactIcon name={link.icon} /><span aria-hidden="true" className="font-mono text-xs transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></div>
                  <div><p className="font-display text-lg font-semibold">{link.label}</p><p className="mt-1 text-xs text-muted-foreground">{link.detail}</p></div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
