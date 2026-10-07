import { Link } from "react-router-dom";
import { FeaturedReel } from "../components/FeaturedReel";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { projects } from "../lib/projects";
import { useLanguage } from "../lib/language";
import { localizeProject } from "../lib/localizedContent";

export function HomePage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const localizedProjects = projects.map((project) => localizeProject(project, isChinese));
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo title={text("Leficious — Technical & Combat Design Portfolio", "Leficious — 技术设计与战斗设计作品集")} description={text("Selected work by Leficious across combat design, gameplay systems, technical animation, AI, and 3D production for games.", "Leficious 的个人作品集，涵盖战斗设计、玩法系统、技术动画、游戏 AI 与 3D 制作。")} path={localizedPath("/")} />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="route-reveal border-b border-border/60 py-8 md:py-12" aria-labelledby="technical-reel-title">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 id="technical-reel-title" className="font-display text-2xl font-semibold sm:text-3xl">{text("Technical Game Design Reel", "游戏技术设计作品集")}</h1>
            </div>
            <span className="text-xs text-muted-foreground">2026</span>
          </div>
          <FeaturedReel
            id="rVIavxdutJE"
            thumbnailSrc="/reels/technical-design-reel-2026.jpg"
            title={text("Technical Game Design Reel 2026", "2026 游戏技术设计作品集")}
            description={text("A quick look at the combat systems, gameplay prototypes, enemies, and technical problem-solving behind my recent work.", "快速展示近期项目中的战斗系统、玩法原型、敌人设计与技术实现。")}
            eyebrow={text("Primary reel · 2026", "技术设计 · 2026")}
          />
          {!isChinese && (
            <div className="mt-5 flex justify-end">
              <a href="/resume/Leficious_Technical_Game_Designer_Resume.pdf" download className="inline-flex items-center gap-3 rounded-full border border-accent/60 bg-surface/55 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Download technical game design résumé <span aria-hidden="true">↓</span>
              </a>
            </div>
          )}
        </section>

        <section id="selected-work" className="route-reveal scroll-mt-20 py-16 md:py-24">
          <div className="mb-12 grid gap-6 border-b border-border/60 pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{text("Selected projects", "精选项目")}</h2>
              <p className="zh-readable mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{text("A closer look at how I approached combat, gameplay AI, modular systems, and the production work needed to make them real.", "这些项目记录了战斗、玩法 AI 和模块化系统从原型到实机的制作过程。")}</p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{String(localizedProjects.length).padStart(2, "0")} {text("case studies", "个完整项目")}</p>
            </div>
          </div>
          <ul className="route-reveal-list space-y-5">
            {localizedProjects.map((project, index) => (
              <li key={project.slug}>
                <Link to={localizedPath(`/projects/${project.slug}`)} viewTransition className="group grid overflow-hidden rounded-lg border border-border bg-surface/45 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-surface md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-56 overflow-hidden bg-muted md:min-h-72">
                    <img src={project.cover} alt="" width="800" height="500" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-75 grayscale-[25%] transition duration-500 group-hover:scale-[1.025] group-hover:opacity-90 group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/45" />
                    <span className="absolute left-4 top-4 rounded-full border border-foreground/20 bg-background/70 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] backdrop-blur-sm">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex min-h-64 flex-col justify-between p-6 sm:p-8 md:min-h-72">
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-warm">{text("Case study", "项目拆解")} {String(index + 1).padStart(2, "0")}</p>
                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{project.year}</span>
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">{project.title}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"><FormattedText>{project.summary}</FormattedText></p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-border/60 pt-5">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground/70">{text("Role", "职责")}</p>
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
