import { useState } from "react";
import { Seo } from "../components/Seo";
import { SiteFooter, SiteNav } from "../components/SiteNav";

export function AboutPage() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("leficious@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.getSelection()?.selectAllChildren(document.querySelector("[data-contact-email]")!);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="About & Contact — Leficious" description="About Leficious — technical and combat designer focused on combat systems, AI, and tooling. Contact and portfolio links." path="/about" />
      <SiteNav />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">About</p>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">I design systems that fight back.</h1>
          </div>
          <div className="space-y-6 text-pretty leading-relaxed md:col-span-8">
            <p>I&apos;m a technical and combat designer working at the intersection of gameplay, animation, and tools. My focus is on combat systems that are <em>readable</em> for players and <em>tunable</em> for designers.</p>
            <p>I write C++ in engine (mostly UE5) and Python for tooling, simulation, and data analysis. I&apos;m happiest when a designer can author a new enemy archetype or weapon class without filing an engineering ticket.</p>
            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <div><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Disciplines</h2><ul className="mt-2 space-y-1 text-sm"><li>Combat &amp; encounter design</li><li>Enemy AI</li><li>Tools &amp; pipeline</li><li>Gameplay programming</li></ul></div>
              <div><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Stack</h2><ul className="mt-2 space-y-1 text-sm"><li>Unreal Engine 5 · C++ / Blueprint</li><li>Python · Pandas · NumPy</li><li>Behavior Trees · Utility AI</li><li>Houdini / Maya (light)</li></ul></div>
            </div>
            <section id="contact" className="border-t border-border/60 pt-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact</p>
              <h2 className="mt-3 font-display text-2xl font-semibold">Let&apos;s make something that feels good to play.</h2>
              <div className="mt-7 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-surface/50 px-4 py-3">
                  <span data-contact-email className="font-mono text-sm text-foreground">leficious@gmail.com</span>
                  <button type="button" onClick={copyEmail} className="rounded-full border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:border-accent hover:text-foreground" aria-live="polite">
                    {copied ? "Copied" : "Copy email"}
                  </button>
                </div>
                {[
                  ["LinkedIn", "https://www.linkedin.com/in/leficious/"],
                  ["Linktree", "https://linktr.ee/leficious"],
                  ["ArtStation", "https://www.artstation.com/leficious"],
                ].map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="group flex items-center justify-between border-b border-border/60 px-1 py-3 text-sm transition-colors hover:text-accent">
                    <span>{label}</span><span aria-hidden="true" className="font-mono text-xs text-muted-foreground transition-transform group-hover:translate-x-1">↗</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
