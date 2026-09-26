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
      <Seo title={text("Leficious — Technical & Combat Design Portfolio", "Leficious — 技术与战斗设计作品集")} description={text("Selected work by Leficious across combat design, gameplay systems, technical animation, AI, and 3D production for games.", "Leficious 的精选作品，涵盖战斗设计、玩法系统、技术动画、AI 与游戏 3D 制作。")} path={localizedPath("/")} />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="route-reveal relative isolate overflow-hidden border-x border-b border-border/60 px-6 py-16 sm:px-10 md:py-24 lg:px-14">
          <div aria-hidden="true" className="work-grid-enter absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
          <div aria-hidden="true" className="absolute -left-32 top-12 -z-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

          <div className="grid items-center gap-14 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="work-copy-enter">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-px w-8 bg-warm" />
                {text("Portfolio", "作品集")} · {new Date().getFullYear()}
              </div>
              <h1 className="mt-7 max-w-4xl font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                {text("Combat, movement, and the systems that make them ", "战斗、移动，以及让它们真正")}<span className="signal-headline-accent text-accent">{text("click.", "好玩的系统。")}</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {text("I'm happiest when I can get an idea out of my head and into a playable build. I usually start with combat or movement, then work outward into animation, AI, UI, and whatever else the mechanic needs. I playtest early because I would rather find out what actually feels good than get attached to how something sounded on paper.", "我最喜欢的过程，是把脑中的想法尽快做成真正能玩的版本。我通常从战斗或移动开始，再根据需要做到动画、AI、界面，以及这个机制缺少的其他部分。我会很早开始试玩，因为比起一直相信纸面上的设想，我更想尽快知道什么东西玩起来真的好。")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#selected-work" className="inline-flex items-center rounded-full border border-accent bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-foreground transition-colors hover:bg-accent/85">
                  {text("View case studies", "查看项目拆解")} ↓
                </a>
                <a href={isChinese ? "/resume/Kevin_Shan_CN_Game_Resume.pdf" : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"} download className="inline-flex items-center rounded-full border border-border bg-background/55 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent">
                  {text("Download résumé", "下载简历")}
                </a>
              </div>
            </div>

            <div id="hero-system-diagram" aria-hidden="true" className="work-diagram-enter relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-background/65 shadow-[0_0_80px_rgba(91,154,172,0.08)]">
              <div className="absolute inset-5 border border-border/70" />
              <div className="absolute inset-10 border border-dashed border-accent/40" />
              <div className="absolute left-1/2 top-5 h-[calc(100%-2.5rem)] w-px bg-border/60" />
              <div className="absolute left-5 top-1/2 h-px w-[calc(100%-2.5rem)] bg-border/60" />
              <div className="signal-diagram-core absolute inset-[29%] grid place-items-center rounded-full border border-accent/70 bg-surface/90 shadow-[0_0_35px_rgba(91,154,172,0.15)]">
                <span className="text-center font-mono text-[9px] uppercase leading-loose tracking-[0.2em] text-foreground">{isChinese ? <>设计<br />构建<br />测试</> : <>Design<br />Build<br />Test</>}</span>
              </div>
              <span className="absolute left-7 top-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">{text("Input", "输入")}</span>
              <span className="absolute right-7 top-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">{text("Rules", "规则")}</span>
              <span className="absolute bottom-7 left-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">{text("Response", "响应")}</span>
              <span className="absolute bottom-7 right-7 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">{text("Feedback", "反馈")}</span>
              <span className="absolute left-[18%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_var(--color-accent)] motion-safe:animate-pulse" />
              <span className="absolute right-[18%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-foreground/60" />
            </div>
          </div>
        </section>

        <div className="route-reveal work-meta-enter grid border-x border-b border-border/60 sm:grid-cols-3">
          {[
            ["01", text("Primary discipline", "主要方向"), text("Combat · gameplay design", "战斗 · 玩法设计")],
            ["02", text("Systems", "系统"), text("Player mechanics · enemy behavior · technical animation", "玩家机制 · 敌人行为 · 技术动画")],
            ["03", text("Process", "流程"), text("Prototype · playtest · refine", "原型 · 测试 · 迭代")],
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
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Featured reel", "精选作品集锦")}</p>
              <h2 id="technical-reel-title" className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{text("Technical game design.", "技术游戏设计。")}</h2>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{text("Selected work", "精选作品")} · 2026</span>
          </div>
          <FeaturedReel
            id="rVIavxdutJE"
            title={text("Technical Game Design Reel 2026", "2026 技术游戏设计作品集锦")}
            description={text("A quick look at the combat systems, gameplay prototypes, enemies, and technical problem-solving behind my recent work.", "快速展示近期项目中的战斗系统、玩法原型、敌人设计与技术问题解决过程。")}
            eyebrow={text("Primary reel · 2026", "主要作品集锦 · 2026")}
          />
        </section>

        <section id="selected-work" className="route-reveal scroll-mt-20 py-16 md:py-24">
          <div className="mb-12 grid gap-6 border-b border-border/60 pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Selected work", "精选项目")}</p>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{text("Systems and designs built for ", "为")}<span className="text-accent">{text("iteration.", "迭代而构建的系统与设计。")}</span></h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{text("A closer look at how I approached combat, gameplay AI, modular systems, and the production work needed to make them real.", "深入了解我如何处理战斗、玩法 AI、模块化系统，以及让这些设计真正落地所需的制作工作。")}</p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{String(localizedProjects.length).padStart(2, "0")} {text("case studies", "个项目拆解")}</p>
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
