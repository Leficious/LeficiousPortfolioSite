import { Seo } from "../components/Seo";
import { SiteFooter, SiteNav } from "../components/SiteNav";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title="About — Leficious" description="About Leficious — technical and combat designer focused on combat systems, AI, and tooling." path="/about" />
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
            <div className="pt-6"><h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Get in touch</h2><a href="mailto:hello@leficious.com" className="mt-2 inline-block font-display text-xl text-accent hover:underline">hello@leficious.com</a></div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
