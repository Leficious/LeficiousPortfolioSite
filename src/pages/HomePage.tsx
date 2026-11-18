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
        title={text("Leficious | Game, Level & Technical Designer", "Leficious | 游戏、关卡与技术设计师")}
        description={text(
          "Game, level, and technical design portfolio of Lefi (Kevin) Shan — playable prototypes, spatial puzzle architecture, combat systems, and 3D environments.",
          "单凯飞（Leficious）的个人作品集：多层空间解谜、动作战斗系统、数据驱动玩法循环与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="border-b border-border py-10 md:py-14" aria-labelledby="technical-reel-title">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {text("Lefi (Kevin) Shan — Game, Level & Technical Designer", "单凯飞 Lefi Shan — 游戏、关卡与技术设计师")}
              </p>
              <h1 id="technical-reel-title" className="mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {text("Game Design Reel", "游戏设计作品集锦")}
              </h1>
            </div>
            <span className="font-mono text-xs text-muted-foreground">2026</span>
          </div>

          <FeaturedReel
            id="hphiglctUCw"
            thumbnailSrc="/reels/game-design-reel-2026.webp"
            title={text("Game Design Reel 2026", "2026 游戏设计作品集锦")}
            description={text(
              "Playable work in Unity 6 and Unreal Engine 5: multi-floor puzzle architecture, sightless acoustic navigation, multiphase boss combat, and stylized 3D scenes.",
              "Unity 6 与 Unreal Engine 5 近期实机作品：多层空间解谜、无 UI 声波寻路、多阶段 Boss 战与风格化 3D 场景。",
            )}
          />

          <div className="mt-5 flex justify-end">
            <a
              href={isChinese ? "/resume/Kevin_Shan_CN_Game_Resume.pdf" : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"}
              download
              className="inline-flex items-center gap-2.5 rounded-xs border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
            >
              {text("Download game design résumé (PDF)", "下载中文游戏开发简历 (PDF)")} <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section id="selected-work" className="scroll-mt-20 pt-16 md:pt-24" aria-labelledby="selected-work-title">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="selected-work-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {text("Selected Work", "精选项目")}
              </h2>
              <p className="zh-readable mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {text(
                  "Design and production breakdowns — from orthographic floorplans and puzzle math to StateTree boss AI and custom Maya tools.",
                  "从正交关卡平面图、配重推进逻辑到 StateTree Boss 行为与 Maya 工具管线的完整拆解。",
                )}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-border border-y border-border">
            {localizedProjects.map((project, index) => (
              <li key={project.slug}>
                <Link
                  to={localizedPath(`/projects/${project.slug}`)}
                  viewTransition
                  className="group grid gap-6 py-8 transition-colors md:grid-cols-[0.54fr_0.46fr] md:gap-10 md:py-10"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-xs border border-border bg-muted">
                    <img
                      src={project.cover}
                      alt=""
                      width="960"
                      height="600"
                      loading={index < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className={`h-full w-full object-cover ${
                        project.slug === "still-life" ? "object-left" : "object-center"
                      } transition-transform duration-500 group-hover:scale-[1.02]`}
                    />
                  </div>

                  <div className="flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
                        <span>
                          <span className="text-warm">{String(index + 1).padStart(2, "0")}</span>
                          <span className="mx-2 text-border">/</span>
                          <span className="font-sans text-xs text-muted-foreground">{project.role}</span>
                        </span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-warm sm:text-3xl">
                        {project.title}
                      </h3>

                      <p className={`mt-3.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px] ${isChinese ? "zh-readable" : ""}`}>
                        <FormattedText>{project.summary}</FormattedText>
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-4">
                      <p className="text-xs text-muted-foreground/85">
                        {project.tags.slice(0, 4).join(" · ")}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors group-hover:text-warm">
                        {text("Read breakdown", "查看拆解")}
                        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </span>
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
