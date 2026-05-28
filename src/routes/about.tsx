import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — leficious" },
      {
        name: "description",
        content:
          "About leficious — technical and combat designer focused on combat systems, AI, and tooling.",
      },
      { property: "og:title", content: "About — leficious" },
      {
        property: "og:description",
        content:
          "About leficious — technical and combat designer focused on combat systems, AI, and tooling.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <main className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              About
            </p>
            <h1 className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
              I design systems that fight back.
            </h1>
          </div>

          <div className="md:col-span-8 space-y-6 text-pretty leading-relaxed">
            <p>
              I'm a technical and combat designer working at the intersection of
              gameplay, animation, and tools. My focus is on combat systems that
              are <em>readable</em> for players and <em>tunable</em> for
              designers.
            </p>
            <p>
              I write C++ in engine (mostly UE5) and Python for tooling,
              simulation, and data analysis. I'm happiest when a designer can
              author a new enemy archetype or weapon class without filing an
              engineering ticket.
            </p>

            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Disciplines
                </h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Combat & encounter design</li>
                  <li>Enemy AI</li>
                  <li>Tools & pipeline</li>
                  <li>Gameplay programming</li>
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Stack
                </h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Unreal Engine 5 · C++ / Blueprint</li>
                  <li>Python · Pandas · NumPy</li>
                  <li>Behavior Trees · Utility AI</li>
                  <li>Houdini / Maya (light)</li>
                </ul>
              </div>
            </div>

            <div className="pt-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Get in touch
              </h3>
              <a
                href="mailto:hello@leficious.com"
                className="mt-2 inline-block font-display text-xl text-accent hover:underline"
              >
                hello@leficious.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
