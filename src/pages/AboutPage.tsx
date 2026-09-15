import { useRef, useState, type ReactNode } from "react";
import { Seo } from "../components/Seo";
import { SiteFooter, SiteNav } from "../components/SiteNav";

type IconName = "email" | "linkedin" | "linktree" | "artstation";

function ContactIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    linkedin: (
      <>
        <path d="M6.5 9v9M6.5 6.3v.2" />
        <path d="M10.5 18v-5.1c0-2.2 1.3-4 3.7-4 2.8 0 3.8 1.8 3.8 4.5V18M10.5 9v9" />
      </>
    ),
    linktree: (
      <>
        <path d="M12 3v18M7.5 21h9" />
        <path d="m12 3-4 5h2.5L6 13h4.2L7 17h10l-3.2-4H18l-4.5-5H16z" />
      </>
    ),
    artstation: (
      <>
        <path d="M4 17.5 10.8 5h2.4L20 17.5" />
        <path d="M6.5 14h10.9M5 19h14" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

const details = [
  { number: "01", label: "Focus", value: "Combat systems" },
  { number: "02", label: "Engine", value: "Unreal Engine 5" },
  { number: "03", label: "Languages", value: "C++ / Python" },
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
      <Seo title="About & Contact — Leficious" description="About Leficious — technical and combat designer focused on combat systems, AI, and tooling. Contact and portfolio links." path="/about" />
      <SiteNav />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="relative isolate overflow-hidden border-x border-b border-border/60 px-6 py-16 sm:px-10 md:py-24 lg:px-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div aria-hidden="true" className="absolute -right-28 -top-32 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-px w-8 bg-accent" />
                Profile / Systems designer
              </div>
              <h1 className="mt-7 max-w-3xl font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                I make systems that <span className="text-accent">fight back.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Technical and combat designer working where gameplay, animation, and tools overlap. I build combat that reads clearly, hits hard, and stays easy to tune.
              </p>
            </div>

            <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[310px]">
              <div className="absolute inset-0 rounded-full border border-border/70 motion-safe:animate-[spin_28s_linear_infinite]">
                <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_20px_var(--color-accent)]" />
                <span className="absolute bottom-[12%] left-[9%] h-1.5 w-1.5 rounded-full bg-foreground/60" />
              </div>
              <div className="absolute inset-[14%] rounded-full border border-dashed border-accent/55 motion-safe:animate-[spin_20s_linear_infinite_reverse]" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-border/70" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-border/70" />
              <div className="absolute inset-[31%] grid place-items-center rotate-45 border border-accent/60 bg-background/80 shadow-[0_0_60px_rgba(91,154,172,0.14)]">
                <span className="-rotate-45 font-mono text-[9px] uppercase leading-loose tracking-[0.2em] text-muted-foreground">Design<br />Build<br />Tune</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid border-x border-b border-border/60 sm:grid-cols-3">
          {details.map((detail) => (
            <div key={detail.number} className="group relative min-h-32 overflow-hidden border-b border-border/60 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
              <span className="absolute right-4 top-2 font-display text-5xl font-semibold text-foreground/[0.035] transition-colors group-hover:text-accent/10">{detail.number}</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{detail.label}</p>
              <p className="mt-5 font-display text-lg font-medium">{detail.value}</p>
            </div>
          ))}
        </div>

        <section className="grid gap-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">How I work</p>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">Half designer.<br /><span className="text-accent">Half builder.</span></h2>
          </div>
          <div className="grid gap-4 md:col-span-8 sm:grid-cols-2">
            <article className="relative overflow-hidden rounded-lg border border-border bg-surface/55 p-6">
              <span aria-hidden="true" className="absolute -right-3 -top-7 font-display text-8xl font-bold text-foreground/[0.025]">D</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">Disciplines</p>
              <ul className="mt-6 space-y-4">
                {["Combat & encounter design", "Enemy AI", "Tools & pipeline", "Gameplay programming"].map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm"><span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span><span className="h-px w-5 bg-border" />{item}</li>
                ))}
              </ul>
            </article>
            <article className="relative overflow-hidden rounded-lg border border-border bg-surface/55 p-6 sm:translate-y-8">
              <span aria-hidden="true" className="absolute -right-3 -top-7 font-display text-8xl font-bold text-foreground/[0.025]">T</span>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">Toolkit</p>
              <ul className="mt-6 space-y-4">
                {["UE5 · C++ / Blueprint", "Python · Pandas · NumPy", "Behavior Trees · Utility AI", "Houdini / Maya"].map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-sm"><span className="font-mono text-[9px] text-muted-foreground">0{index + 1}</span><span className="h-px w-5 bg-border" />{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden rounded-xl border border-border bg-surface/35 p-6 sm:p-10 md:p-12">
          <div aria-hidden="true" className="absolute right-0 top-0 h-40 w-40 bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1.5px)] opacity-20 [background-size:12px_12px] [mask-image:linear-gradient(135deg,black,transparent_75%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Contact / Open channel</p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">Let&apos;s make something <span className="text-accent">feel good</span> to play.</h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">For collaborations, opportunities, or just to compare notes on combat systems and technical art.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
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
