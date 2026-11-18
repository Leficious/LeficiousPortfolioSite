import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BrassCornerClasps,
  BrassPinThreads,
  BrassRule,
  CrimsonStamp,
  FolioCorners,
} from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { useLanguage } from "../lib/language";
import { localizeProject } from "../lib/localizedContent";
import { projects } from "../lib/projects";

type FolioBoardMeta = {
  roman: string;
  tabShortEn: string;
  tabShortZh: string;
  subtitleEn: string;
  subtitleZh: string;
  cinemaThumbSrc: string;
  plateSrc: string;
  plateSrcZh?: string;
  plateMode: "ink" | "daguerreotype";
  plateLabelEn: string;
  plateLabelZh: string;
  emblemGoldSrc: string;
  emblemInkSrc: string;
  telemetryEn: [string, string, string];
  telemetryZh: [string, string, string];
};

const BOARD_META: Record<string, FolioBoardMeta> = {
  "still-life": {
    roman: "I",
    tabShortEn: "I. Still Life",
    tabShortZh: "I · 静物",
    subtitleEn: "The 235 kg Counterweight Archive",
    subtitleZh: "235 kg 满额配重档案馆",
    cinemaThumbSrc: "/projects/still-life/cover.webp",
    plateSrc: "/projects/still-life/map-02-three-story-archive.webp",
    plateSrcZh: "/projects/still-life/map-02-three-story-archive-zh.webp",
    plateMode: "ink",
    plateLabelEn: "FIG. II · 1F–3F Orthographic Plan",
    plateLabelZh: "图 II · 1F–3F 正交动线图",
    emblemGoldSrc: "/emblems/still-life-gold.webp",
    emblemInkSrc: "/emblems/still-life-ink.webp",
    telemetryEn: ["235 kg · Zero-Slack", "5 Rooms · 3 Floors", "0 Dialogue · 0 HUD"],
    telemetryZh: ["235 kg · 满额配重", "5 房间 · 三层立体", "零对白 · 零 UI"],
  },
  "an-echo-has-no-shape": {
    roman: "II",
    tabShortEn: "II. Echo",
    tabShortZh: "II · 回声无形",
    subtitleEn: "Basin of Three Silences",
    subtitleZh: "三重寂静之声波盆地",
    cinemaThumbSrc: "/projects/an-echo-has-no-shape/cover.webp",
    plateSrc: "/projects/an-echo-has-no-shape/map-01-world-overview.webp",
    plateSrcZh: "/projects/an-echo-has-no-shape/map-01-world-overview-zh.webp",
    plateMode: "daguerreotype",
    plateLabelEn: "FIG. I · 550m Basin Topology",
    plateLabelZh: "图 I · 550m 盆地总图",
    emblemGoldSrc: "/emblems/echo-gold.webp",
    emblemInkSrc: "/emblems/echo-ink.webp",
    telemetryEn: ["550m · Sightless", "1 Verb · 42m Pulse", "3 Acoustic Gates"],
    telemetryZh: ["550m · 无视界盆地", "单键 · 42m 声波", "三重声波习惯门"],
  },
  "fallen-valkyrie": {
    roman: "III",
    tabShortEn: "III. Fallen Valkyrie",
    tabShortZh: "III · 堕落女武神",
    subtitleEn: "Multiphase Boss & Stance Combat",
    subtitleZh: "双武器姿态与多阶段 Boss 战",
    cinemaThumbSrc: "/projects/fallen-valkyrie/cover.avif",
    plateSrc: "/projects/fallen-valkyrie/ai-statetree-01.avif",
    plateMode: "ink",
    plateLabelEn: "FIG. VI · Boss StateTree Graph",
    plateLabelZh: "图 VI · Boss 状态树决策图",
    emblemGoldSrc: "/emblems/valkyrie-gold.webp",
    emblemInkSrc: "/emblems/valkyrie-ink.webp",
    telemetryEn: ["3-Phase StateTree", "Dual-Stance Swaps", "Directional Stagger"],
    telemetryZh: ["三阶段状态树", "双武器姿态切换", "受击方向与架势"],
  },
  starshore: {
    roman: "IV",
    tabShortEn: "IV. Starshore",
    tabShortZh: "IV · 星岸",
    subtitleEn: "Interconnected ARPG Loop",
    subtitleZh: "飞行、索敌与数据驱动循环",
    cinemaThumbSrc: "/projects/starshore/design-layout-01.avif",
    plateSrc: "/projects/starshore/targeting-01.avif",
    plateMode: "daguerreotype",
    plateLabelEn: "FIG. II · Soft-Lock Targeting",
    plateLabelZh: "图 II · 半自动索敌拆解",
    emblemGoldSrc: "/emblems/starshore-gold.webp",
    emblemInkSrc: "/emblems/starshore-ink.webp",
    telemetryEn: ["Aerial & Ground 3C", "Soft-Lock Priority", "Data-Driven Loop"],
    telemetryZh: ["陆空无缝 3C", "距离视角加权索敌", "数据驱动商店循环"],
  },
  "sacred-forest": {
    roman: "V",
    tabShortEn: "V. Sacred Forest",
    tabShortZh: "V · 圣域森林",
    subtitleEn: "Stylized Shrine & Normal Tooling",
    subtitleZh: "风格化神社与法线工具管线",
    cinemaThumbSrc: "/projects/sacred-forest/cover.avif",
    plateSrc: "/projects/sacred-forest/foliage-01.avif",
    plateMode: "daguerreotype",
    plateLabelEn: "FIG. III · Foliage & Normal Tool",
    plateLabelZh: "图 III · 植被拓扑与法线工具",
    emblemGoldSrc: "/emblems/sacred-forest-gold.webp",
    emblemInkSrc: "/emblems/sacred-forest-ink.webp",
    telemetryEn: ["UE5 Forest Shrine", "Maya Normal Tool", "Substance & Foliage"],
    telemetryZh: ["UE5 森林神社", "自研法线工具", "程序化材质与植被"],
  },
};

const ORDERED_SLUGS = [
  "still-life",
  "an-echo-has-no-shape",
  "fallen-valkyrie",
  "starshore",
  "sacred-forest",
] as const;

const ALL_BINDER_KEYS = ["reel", ...ORDERED_SLUGS] as const;

type HomePageProps = {
  activeFolioSlug: string;
  onSelectFolioSlug: (slug: string) => void;
};

export function HomePage({ activeFolioSlug, onSelectFolioSlug }: HomePageProps) {
  const { isChinese, text, localizedPath } = useLanguage();
  const [playingVideo, setPlayingVideo] = useState(false);
  const lastProjectSlugRef = useRef<string>("still-life");

  const orderedProjects = ORDERED_SLUGS.map((slug) => {
    const found = projects.find((p) => p.slug === slug) ?? projects[0];
    return localizeProject(found, isChinese);
  });

  const isReelActive = activeFolioSlug === "reel";
  if (!isReelActive && ORDERED_SLUGS.includes(activeFolioSlug as (typeof ORDERED_SLUGS)[number])) {
    lastProjectSlugRef.current = activeFolioSlug;
  }
  const currentProjectIndex = Math.max(
    0,
    orderedProjects.findIndex((p) => p.slug === (isReelActive ? lastProjectSlugRef.current : activeFolioSlug)),
  );
  const activeProject = orderedProjects[currentProjectIndex];
  const activeMeta = BOARD_META[activeProject.slug] ?? BOARD_META["still-life"];

  // Symmetrical smoked-mahogany backing folios peeking out on left & right
  const leftBgProject = orderedProjects[(currentProjectIndex + 1) % orderedProjects.length];
  const rightBgProject =
    orderedProjects[(currentProjectIndex + orderedProjects.length - 1) % orderedProjects.length];
  const leftBgMeta = BOARD_META[leftBgProject.slug];
  const rightBgMeta = BOARD_META[rightBgProject.slug];

  const selectBinder = (key: string) => {
    setPlayingVideo(false);
    onSelectFolioSlug(key);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const cur = ALL_BINDER_KEYS.indexOf(activeFolioSlug as (typeof ALL_BINDER_KEYS)[number]);
      const safeCur = cur === -1 ? 1 : cur;
      const nextIdx =
        event.key === "ArrowRight"
          ? (safeCur + 1) % ALL_BINDER_KEYS.length
          : (safeCur - 1 + ALL_BINDER_KEYS.length) % ALL_BINDER_KEYS.length;
      setPlayingVideo(false);
      onSelectFolioSlug(ALL_BINDER_KEYS[nextIdx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeFolioSlug, onSelectFolioSlug]);

  const leadYoutubeId = activeProject.media.find((m) => m.type === "youtube")?.id ?? "hphiglctUCw";
  const plateImage = isChinese && activeMeta.plateSrcZh ? activeMeta.plateSrcZh : activeMeta.plateSrc;
  const telemetry = isChinese ? activeMeta.telemetryZh : activeMeta.telemetryEn;

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col justify-between overflow-x-clip px-4 py-5 sm:px-8 lg:min-h-screen lg:px-10 lg:py-6 xl:pr-20">
      <Seo
        title={text("Leficious | Game, Level & Technical Designer", "Leficious | 游戏、关卡与技术设计师")}
        description={text(
          "Game, level, and technical design atelier of Lefi (Kevin) Shan — playable spatial puzzle worlds, multiphase combat systems, and 3D environments.",
          "单凯飞（Leficious）的游戏、关卡与技术设计作品集：空间解谜、多阶段 Boss 战与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />

      {/* ==================== 1. ALIGNED VICTORIAN ARCHIVAL HEADER RAIL ==================== */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1340px] flex-wrap items-center justify-between gap-4 border-b border-warm/28 pb-3.5">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
          <p className="font-numeral text-lg font-semibold tracking-[0.18em] text-[#ece2d0] sm:text-xl">
            {text("LEFI SHAN", "单凯飞 · LEFI SHAN")}
          </p>
          <span aria-hidden="true" className="hidden h-1.5 w-1.5 rotate-45 bg-[#7d1919] sm:inline-block" />
          <p className="font-display text-sm italic text-[#c97268] sm:text-base">
            {text(
              "Game, Level & Technical Designer · USC School of Cinematic Arts & Gnomon",
              "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => selectBinder(isReelActive ? lastProjectSlugRef.current : "reel")}
          className="brass-plaque inline-flex cursor-pointer items-center gap-2.5 px-5 py-2 font-numeral text-xs font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5 active:scale-97"
        >
          {isReelActive ? (
            <>← {text("Return to Case Folios", "返回作品卷宗")}</>
          ) : (
            <>
              <span aria-hidden="true" className="text-[10px]">▶</span>
              <span>{text("2026 Master Design Reel", "2026 年度设计集锦")}</span>
            </>
          )}
        </button>
      </header>

      {/* Mobile / Tablet Compact Binder Strip (< xl) */}
      <div
        className="relative z-20 mx-auto mt-3 flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 xl:hidden"
        role="tablist"
        aria-label={text("Select Case Folio", "切换作品卷宗")}
      >
        {ALL_BINDER_KEYS.map((key) => {
          const active = activeFolioSlug === key;
          const label =
            key === "reel"
              ? text("Reel", "集锦")
              : isChinese
                ? BOARD_META[key].tabShortZh
                : BOARD_META[key].tabShortEn;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectBinder(key)}
              className={`victorian-ticket cursor-pointer border px-3.5 py-1.5 font-display text-xs font-semibold transition-all ${
                active
                  ? "border-[#7d1919] bg-parchment text-parchment-ink"
                  : "border-warm/30 bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ==================== 2. SPATIALLY LOCKED CASE-DESK STAGE ==================== */}
      <main id="main-content" tabIndex={-1} className="relative my-auto mx-auto w-full max-w-[1340px] py-3 lg:py-4">
        {/* Symmetrical Fanning Smoked-Mahogany Backing Folios w/ Antique-Bronze Copperplate Crests */}
        <div
          className="pointer-events-none absolute inset-x-0 top-9 bottom-3 hidden lg:block"
          style={{
            transform: "translate3d(calc(var(--mx) * -9px), calc(var(--my) * -5px), 0)",
          }}
        >
          {/* Left Smoked-Mahogany Backing Folio */}
          <button
            type="button"
            onClick={() => selectBinder(leftBgProject.slug)}
            aria-label={`${text("Inspect Folio", "切换至")} ${leftBgMeta.roman}: ${leftBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -left-2 xl:-left-5 inset-y-3 flex w-[36%] -rotate-[4deg] cursor-pointer flex-col justify-between overflow-hidden border border-warm/35 p-4 text-left transition-all duration-300 hover:-translate-x-2.5 hover:-translate-y-1.5 hover:-rotate-[5.2deg] hover:border-[#c6a06a]/75 xl:p-5"
          >
            <img
              src={leftBgMeta.cinemaThumbSrc}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-14 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-28"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#120d0a]/92 via-[#19130f]/88 to-[#1c1511]/96" />

            <div className="relative z-10 max-w-[104px] xl:max-w-[132px]">
              <p className="font-numeral text-[10px] tracking-[0.2em] text-warm">
                {text("FOLIO", "卷")} {leftBgMeta.roman}
              </p>
              <p className="mt-0.5 font-display text-[13.5px] font-semibold leading-snug text-foreground/90 group-hover:text-[#f2dfc0] xl:text-[15px]">
                {leftBgProject.title}
              </p>
            </div>

            <div className="relative z-10 my-auto -ml-1 flex flex-col items-start">
              <img
                src={leftBgMeta.emblemGoldSrc}
                alt=""
                width="156"
                height="156"
                className="h-26 w-26 object-contain opacity-88 drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:scale-106 group-hover:opacity-100 xl:h-34 xl:w-34"
              />
            </div>

            <div className="relative z-10 flex max-w-[104px] items-baseline gap-2 xl:max-w-[132px]">
              <span className="font-numeral text-3xl font-semibold tracking-wider text-warm/80 transition-colors group-hover:text-[#d8b47c] xl:text-4xl">
                {leftBgMeta.roman}
              </span>
              <span className="font-numeral text-[10px] tracking-[0.16em] text-muted-foreground group-hover:text-[#d8b47c]">
                →
              </span>
            </div>
          </button>

          {/* Right Smoked-Mahogany Backing Folio */}
          <button
            type="button"
            onClick={() => selectBinder(rightBgProject.slug)}
            aria-label={`${text("Inspect Folio", "切换至")} ${rightBgMeta.roman}: ${rightBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -right-2 xl:-right-5 inset-y-3 flex w-[36%] rotate-[4deg] cursor-pointer flex-col justify-between overflow-hidden border border-warm/35 p-4 text-right transition-all duration-300 hover:translate-x-2.5 hover:-translate-y-1.5 hover:rotate-[5.2deg] hover:border-[#c6a06a]/75 xl:p-5"
          >
            <img
              src={rightBgMeta.cinemaThumbSrc}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-14 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-28"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#120d0a]/92 via-[#19130f]/88 to-[#1c1511]/96" />

            <div className="relative z-10 ml-auto max-w-[104px] xl:max-w-[132px]">
              <p className="font-numeral text-[10px] tracking-[0.2em] text-warm">
                {text("FOLIO", "卷")} {rightBgMeta.roman}
              </p>
              <p className="mt-0.5 font-display text-[13.5px] font-semibold leading-snug text-foreground/90 group-hover:text-[#f2dfc0] xl:text-[15px]">
                {rightBgProject.title}
              </p>
            </div>

            <div className="relative z-10 my-auto -mr-1 flex flex-col items-end">
              <img
                src={rightBgMeta.emblemGoldSrc}
                alt=""
                width="156"
                height="156"
                className="h-26 w-26 object-contain opacity-88 drop-shadow-[0_6px_16px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:scale-106 group-hover:opacity-100 xl:h-34 xl:w-34"
              />
            </div>

            <div className="relative z-10 ml-auto flex max-w-[104px] items-baseline justify-end gap-2 xl:max-w-[132px]">
              <span className="font-numeral text-[10px] tracking-[0.16em] text-muted-foreground group-hover:text-[#d8b47c]">
                ←
              </span>
              <span className="font-numeral text-3xl font-semibold tracking-wider text-warm/80 transition-colors group-hover:text-[#d8b47c] xl:text-4xl">
                {rightBgMeta.roman}
              </span>
            </div>
          </button>
        </div>

        {/* Top Deep-Crimson Wax Seal & Bronze Suspension Cords */}
        <BrassPinThreads animKey={activeFolioSlug} />

        {/* Foreground Architecturally Level (0deg) Grand Rag-Vellum Case-Folio */}
        <div
          className="relative z-20 mx-auto w-full max-w-[1060px] xl:max-w-[1120px]"
          style={{
            transform: "translate3d(calc(var(--mx) * 3.5px), calc(var(--my) * 2.5px), 0)",
          }}
        >
          <article
            key={activeFolioSlug}
            className="parchment-sheet animate-folio-arc relative overflow-hidden border-[5px] border-[#15100d] px-5 pt-8 pb-6 shadow-[0_32px_76px_rgba(0,0,0,0.85),6px_6px_0_-1px_#d6c8ab,7px_7px_0_0_#15100d] sm:px-9 sm:pt-9 sm:pb-7"
          >
            <FolioCorners tone="parchment" />

            {isReelActive ? (
              /* ==================== 00 · MASTER DESIGN REEL FOLIO ==================== */
              <div className="relative z-10">
                <header className="text-center">
                  <p className="font-numeral text-[11px] font-semibold tracking-[0.26em] text-parchment-muted uppercase">
                    {text("ATELIER SHOWCASE · MMXXVI", "年度实机集锦 · 2026")}
                  </p>
                  <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-parchment-ink sm:text-4xl">
                    {text("Game, Level & Technical Design Reel", "游戏、关卡与技术设计作品集锦")}
                  </h1>
                  <p className="mt-1 font-display text-base italic text-rubric sm:text-lg">
                    {text(
                      "Lefi (Kevin) Shan · USC School of Cinematic Arts & Gnomon",
                      "单凯飞 Lefi Shan · 南加州大学电影艺术学院 & Gnomon",
                    )}
                  </p>
                </header>

                <div className="relative mt-5 border-2 border-[#5c401e] bg-[#0b0806] p-2 shadow-2xl">
                  <BrassCornerClasps sizeClass="h-12 w-12 sm:h-16 sm:w-16" />
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {playingVideo ? (
                      <iframe
                        src="https://www.youtube-nocookie.com/embed/hphiglctUCw?autoplay=1"
                        title={text("Game Design Reel 2026", "2026 游戏设计作品集锦")}
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPlayingVideo(true)}
                        className="group relative block h-full w-full cursor-pointer text-left"
                        aria-label={text("Play 2026 Game Design Reel", "播放 2026 作品集锦")}
                      >
                        <img
                          src="/reels/game-design-reel-2026.webp"
                          alt={text("2026 Game Design Reel thumbnail", "2026 游戏设计作品集锦封面")}
                          width="1280"
                          height="720"
                          loading="eager"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                        />
                        <span className="absolute inset-0 bg-black/22 transition-colors group-hover:bg-black/8" />
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="brass-plaque inline-flex items-center gap-2.5 px-6 py-3 font-numeral text-xs font-bold tracking-[0.14em] uppercase transition-transform group-hover:scale-105 sm:text-sm">
                            <span aria-hidden="true">▶</span>
                            {text("Play 2026 Master Reel", "播放 2026 年度设计集锦")}
                          </span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {orderedProjects.map((proj) => (
                      <button
                        key={proj.slug}
                        type="button"
                        onClick={() => selectBinder(proj.slug)}
                        className="victorian-ticket cursor-pointer border border-[#7a582e]/65 bg-parchment-deep/75 px-3.5 py-1.5 font-display text-xs font-semibold text-parchment-ink transition-colors hover:bg-[#191310] hover:text-[#f2e8d5]"
                      >
                        {BOARD_META[proj.slug].roman} · {proj.title}
                      </button>
                    ))}
                  </div>
                  <a
                    href={
                      isChinese
                        ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
                        : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"
                    }
                    download
                    className="inline-flex items-center gap-2 bg-[#191310] px-4.5 py-2 font-numeral text-xs font-semibold tracking-[0.12em] text-[#f2e8d5] uppercase transition-colors hover:bg-[#2e231d]"
                  >
                    {text("Download Résumé (PDF)", "下载游戏设计简历")} <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            ) : (
              /* ==================== I–V · LOCKED TWO-WING VICTORIAN CASE DIPTYCH ==================== */
              <div className="relative z-10">
                {/* Subtle Sepia Copperplate Watermark on the Right Wing */}
                <img
                  src={activeMeta.emblemInkSrc}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute right-6 top-1/2 hidden h-64 w-64 -translate-y-1/2 object-contain opacity-[0.06] mix-blend-multiply select-none lg:block"
                />

                {/* Centered Victorian Case Header */}
                <header className="text-center">
                  <h1 className="font-display text-2xl font-semibold tracking-tight text-parchment-ink sm:text-[31px]">
                    <span className="font-numeral text-[0.86em] tracking-[0.08em]">
                      {text("FOLIO", "卷")} {activeMeta.roman}
                    </span>{" "}
                    — {activeProject.title}
                  </h1>
                  <p className="mt-0.5 font-display text-[15px] italic text-rubric sm:text-[17px]">
                    {isChinese ? activeMeta.subtitleZh : activeMeta.subtitleEn} · {activeProject.role} · {activeProject.year}
                  </p>
                </header>

                <BrassRule tone="parchment" className="my-4" />

                {/* Height-Matched 2-Wing Spread: Left = Bronze-Clamped Cinema + 3 Telemetry Tickets; Right = Pitch + Wax-Sealed Blueprint + CTAs */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.18fr_0.82fr] lg:items-stretch lg:gap-7">
                  {/* LEFT WING: Ornate Bronze-Clamped Gameplay Plate + 3 Chamfered Telemetry Tickets */}
                  <div className="flex flex-col justify-between gap-3.5">
                    <div className="relative border-2 border-[#5c401e] bg-[#0b0806] p-2 shadow-[0_14px_34px_rgba(0,0,0,0.42)]">
                      <BrassCornerClasps sizeClass="h-11 w-11 sm:h-14 sm:w-14" />

                      <div className="relative aspect-video w-full overflow-hidden border border-[#a88452]/40 bg-black">
                        {playingVideo ? (
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${leadYoutubeId}?autoplay=1`}
                            title={activeProject.title}
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 h-full w-full"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPlayingVideo(true)}
                            className="group relative block h-full w-full cursor-pointer text-left"
                            aria-label={`${text("Play walkthrough", "播放实机演示")}: ${activeProject.title}`}
                          >
                            <img
                              src={activeMeta.cinemaThumbSrc}
                              alt={activeProject.title}
                              width="1280"
                              height="720"
                              fetchPriority="high"
                              decoding="async"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15 transition-opacity group-hover:opacity-75" />

                            <span className="brass-plaque absolute bottom-3.5 left-3.5 inline-flex items-center gap-2 px-4 py-2 font-numeral text-[11px] font-bold tracking-[0.12em] uppercase transition-transform duration-200 group-hover:scale-104 sm:bottom-4 sm:left-4 sm:px-4.5">
                              <span aria-hidden="true">▶</span>
                              <span>{text("Play Walkthrough", "播放实机演示")}</span>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 3 Chamfered Victorian Apothecary Telemetry Tickets */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {telemetry.map((spec) => (
                        <div
                          key={spec}
                          className="victorian-ticket border border-[#7a582e]/65 bg-parchment-deep/70 px-2.5 py-2 text-center shadow-[inset_0_0_0_2px_rgba(232,220,196,0.75)]"
                        >
                          <span className="font-numeral text-[10.5px] font-bold tracking-[0.08em] text-parchment-ink uppercase">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT WING: Literary Case Summary + Wax-Sealed Architectural Blueprint + CTAs */}
                  <div className="flex flex-col justify-between gap-4 lg:border-l lg:border-[#7a582e]/35 lg:pl-7">
                    <p
                      className={`text-pretty text-[16px] leading-[1.6] text-parchment-ink/94 sm:text-[17px] ${
                        isChinese ? "zh-readable" : ""
                      }`}
                    >
                      <FormattedText>{activeProject.summary}</FormattedText>
                    </p>

                    {/* Wax-Sealed Ink-Engraved Orthographic Blueprint Plate */}
                    <Link
                      to={localizedPath(`/projects/${activeProject.slug}`)}
                      viewTransition
                      className="group relative block border border-[#7a582e]/60 bg-parchment-deep/55 p-2.5 shadow-[inset_0_0_0_2px_rgba(232,220,196,0.7)] transition-colors hover:border-rubric/75"
                    >
                      {/* Petite Red Sealing-Wax Stamp on the Blueprint Corner */}
                      <CrimsonStamp className="pointer-events-none absolute -right-2.5 -top-2.5 z-20 h-9 w-9" />

                      <div className="overflow-hidden border border-[#7a582e]/40 bg-[#dfd2b7]">
                        <img
                          src={plateImage}
                          alt={isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                          width="560"
                          height="320"
                          loading="eager"
                          fetchPriority="high"
                          className={`${
                            activeMeta.plateMode === "ink" ? "ink-engraving" : "daguerreotype-plate"
                          } aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
                        />
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
                        <span className="truncate font-display text-[13px] italic text-parchment-muted">
                          {isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                        </span>
                        <span className="shrink-0 font-numeral text-[10px] font-bold tracking-[0.14em] text-rubric uppercase transition-transform group-hover:translate-x-0.5">
                          {text("Inspect →", "拆解 →")}
                        </span>
                      </div>
                    </Link>

                    {/* Sharp Architectural CTAs */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                      <Link
                        to={localizedPath(`/projects/${activeProject.slug}`)}
                        viewTransition
                        className="victorian-ticket inline-flex flex-1 items-center justify-center gap-2 bg-[#191310] px-4.5 py-2.5 font-numeral text-xs font-semibold tracking-[0.12em] text-[#f2e8d5] uppercase transition-colors hover:bg-[#2f231d]"
                      >
                        <span>{text("Open Full Folio", "展开完整卷宗")}</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                      {activeProject.externalLink ? (
                        <a
                          href={activeProject.externalLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="victorian-ticket inline-flex items-center justify-center gap-1.5 border border-[#191310]/75 bg-transparent px-4 py-2.5 font-numeral text-xs font-semibold tracking-[0.1em] text-parchment-ink uppercase transition-colors hover:bg-[#191310] hover:text-[#f2e8d5]"
                        >
                          <span>{activeProject.externalLink.label}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <Link
                          to={localizedPath("/gallery")}
                          viewTransition
                          className="victorian-ticket inline-flex items-center justify-center gap-1.5 border border-[#191310]/75 bg-transparent px-4 py-2.5 font-numeral text-xs font-semibold tracking-[0.1em] text-parchment-ink uppercase transition-colors hover:bg-[#191310] hover:text-[#f2e8d5]"
                        >
                          <span>{text("Gallery", "画廊拆解")}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </main>

      {/* Bottom Subtle Folio Index Bar */}
      <div className="relative z-20 mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground/80">
        <span className="font-numeral text-[10.5px] tracking-[0.22em] text-warm uppercase">
          {text("CASE INDEX", "卷宗索引")} {isReelActive ? "00" : activeMeta.roman} / V
        </span>
        <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-rubric" />
        <span className="hidden font-display italic sm:inline">
          {text("Switch folios via right-edge ledger tabs, flanking folios, or ← / → keys", "可通过右侧书签、两侧底卷或方向键 ← / → 翻阅")}
        </span>
      </div>

      {/* ==================== 3. RIGHT-EDGE BOUND VELLUM LEDGER SPINE & TABS (Desktop xl+) ==================== */}
      <nav
        aria-label={text("Folio Binder Tabs", "卷宗侧边索引签")}
        className="fixed inset-y-0 right-0 z-40 hidden w-12 flex-col justify-center gap-1.5 border-l border-warm/25 bg-[#090706]/85 py-6 select-none xl:flex"
      >
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[3px] w-px bg-warm/12" />
        {ALL_BINDER_KEYS.map((key) => {
          const active = activeFolioSlug === key;
          const label =
            key === "reel"
              ? text("Reel", "集锦")
              : isChinese
                ? BOARD_META[key].tabShortZh
                : BOARD_META[key].tabShortEn;

          return (
            <button
              key={key}
              type="button"
              onClick={() => selectBinder(key)}
              aria-current={active ? "true" : undefined}
              className={`group relative ml-auto flex cursor-pointer items-center justify-center border-y border-l py-3.5 transition-all duration-250 active:scale-97 ${
                active
                  ? "w-13 -translate-x-1 border-[#7a582e] border-r-[4px] border-r-rubric bg-parchment text-rubric shadow-[-10px_6px_22px_rgba(0,0,0,0.68)]"
                  : "w-10 border-warm/30 bg-[#cbbda3] text-[#1d1611] opacity-88 shadow-[-4px_4px_12px_rgba(0,0,0,0.45)] hover:-translate-x-1 hover:w-11 hover:bg-[#e4d7be] hover:opacity-100"
              }`}
            >
              <span
                className="font-display text-[13px] font-semibold tracking-wide whitespace-nowrap"
                style={{ writingMode: "vertical-rl" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
