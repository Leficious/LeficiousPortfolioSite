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
      <Seo
        title={text(
          "Leficious | Game, Level & Technical Designer",
          "Leficious | 游戏、关卡与技术设计师",
        )}
        description={text(
          "Selected work by Lefi (Kevin) Shan across level design, narrative play, combat systems, gameplay AI, and 3D production.",
          "单凯文（Leficious）的个人作品集，涵盖关卡设计、叙事交互、战斗系统、玩法 AI 与 3D 制作。",
        )}
        path={localizedPath("/")}
      />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section
          className="route-reveal border-b border-border/60 py-10 md:py-14"
          aria-labelledby="technical-reel-title"
        >
          <div className="mb-8 grid gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-accent">
                {text("Lefi (Kevin) Shan · USC Games", "单凯文 Lefi Shan · 南加州大学游戏设计")}
              </p>
              <h1
                id="technical-reel-title"
                className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                {text("Game, Level & Technical Designer", "游戏、关卡与技术设计师")}
              </h1>
              <p className="zh-readable mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {text(
                  "Building authored spaces, experimental narrative mechanics, and responsive combat and gameplay systems in Unreal Engine 5 and Unity 6.",
                  "致力于在 Unreal Engine 5 与 Unity 6 中构建富有表现力的空间关卡、通过机制推进叙事的实验性玩法，以及高响应的动作战斗与模块化系统。",
                )}
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 md:col-span-4 md:justify-end">
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
                {text("Design Reel · 2026", "设计作品集锦 · 2026")}
              </span>
            </div>
          </div>

          <FeaturedReel
            id="cyespsOlRJc"
            thumbnailSrc="/reels/technical-design-reel-2026.jpg"
            title={text("Game & Technical Design Reel 2026", "2026 游戏与技术设计集锦")}
            description={text(
              "A look at the combat systems, gameplay prototypes, enemy AI, and technical implementation across my recent work.",
              "展示近期项目中的战斗系统、玩法原型、敌人 AI 与技术实现。",
            )}
            eyebrow={text("Primary reel · 2026", "设计集锦 · 2026")}
          />
          <div className="mt-5 flex justify-end">
            <a
              href={
                isChinese
                  ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
                  : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"
              }
              download
              className="inline-flex items-center gap-3 rounded-full border border-accent/60 bg-surface/55 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {text("Download résumé (PDF)", "下载中文游戏开发简历 (PDF)")}{" "}
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="selected-work" className="route-reveal scroll-mt-20 py-16 md:py-24">
          <div className="mb-12 grid gap-6 border-b border-border/60 pb-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                {text("Selected works", "精选项目")}
              </h2>
              <p className="zh-readable mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {text(
                  "Case studies spanning surrealist and acoustic level design, action-combat prototypes, modular gameplay systems, and stylized 3D environments.",
                  "涵盖超现实与声学空间关卡设计、动作战斗原型、模块化玩法系统及风格化 3D 环境的完整项目拆解。",
                )}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {String(localizedProjects.length).padStart(2, "0")}{" "}
                {text("case studies", "个完整项目")}
              </p>
            </div>
          </div>
          <ul className="route-reveal-list space-y-6">
            {localizedProjects.map((project, index) => (
              <li key={project.slug}>
                <Link
                  to={localizedPath(`/projects/${project.slug}`)}
                  viewTransition
                  className="group grid overflow-hidden rounded-lg border border-border bg-surface/45 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-surface md:grid-cols-[0.43fr_0.57fr]"
                >
                  <div className="relative min-h-56 overflow-hidden bg-muted md:min-h-72">
                    <img
                      src={project.cover}
                      alt=""
                      width="800"
                      height="500"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-92 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/35" />
                    <span className="absolute left-4 top-4 rounded-full border border-foreground/20 bg-background/75 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] backdrop-blur-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex min-h-64 flex-col justify-between p-6 sm:p-8 md:min-h-72">
                    <div>
                      <div className="flex items-center justify-between gap-5">
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-warm">
                          {text("Case study", "项目拆解")} {String(index + 1).padStart(2, "0")}
                        </p>
                        <span className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
                          {project.year}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        <FormattedText>{project.summary}</FormattedText>
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-border/60 pt-5">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                          {text("Role", "职责")}
                        </p>
                        <p className="mt-1 text-xs font-medium text-foreground/90">{project.role}</p>
                      </div>
                      <div className="flex items-center gap-5">
                        <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] tracking-[0.06em] text-muted-foreground/85"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span
                          aria-hidden="true"
                          className="font-mono text-sm text-accent transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
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
