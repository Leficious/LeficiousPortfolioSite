import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BrassCornerClasps,
  BrassPinThreads,
  CrimsonStamp,
  FolioCorners,
} from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
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
    plateLabelEn: "FIG. 02 · 1F–3F Orthographic Plan",
    plateLabelZh: "图 02 · 1F–3F 正交动线图",
    emblemGoldSrc: "/emblems/still-life-gold.webp",
    emblemInkSrc: "/emblems/still-life-ink.webp",
    telemetryEn: [
      "235 kg · Zero-Slack Pool",
      "5 Rooms · 3-Floor Archive",
      "0 Dialogue / 0 HUD",
    ],
    telemetryZh: [
      "235 kg · 零冗余配重池",
      "5 房间 · 三层立体档案馆",
      "零对白 · 零 UI 路标",
    ],
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
    plateLabelEn: "FIG. 01 · 550m Basin Topology",
    plateLabelZh: "图 01 · 550m 盆地总图",
    emblemGoldSrc: "/emblems/echo-gold.webp",
    emblemInkSrc: "/emblems/echo-ink.webp",
    telemetryEn: [
      "550m × 550m · Sightless Basin",
      "1 Fixed Verb · 42m Echo Pulse",
      "3 Regional Acoustic Gates",
    ],
    telemetryZh: [
      "550m × 550m · 无视界盆地",
      "单一按键 · 42m 声波脉冲",
      "三重区域声波习惯反转",
    ],
  },
  "fallen-valkyrie": {
    roman: "III",
    tabShortEn: "III. Fallen Valkyrie",
    tabShortZh: "III · 堕落女武神",
    subtitleEn: "Multiphase Boss & Stance Combat",
    subtitleZh: "双武器姿态与多阶段 Boss 战",
    cinemaThumbSrc: "/projects/fallen-valkyrie/cover.avif",
    plateSrc: "/projects/fallen-valkyrie/ai-statetree-01.avif",
    plateLabelEn: "FIG. 06 · Boss StateTree Graph",
    plateLabelZh: "图 06 · Boss 状态树决策图",
    emblemGoldSrc: "/emblems/valkyrie-gold.webp",
    emblemInkSrc: "/emblems/valkyrie-ink.webp",
    telemetryEn: [
      "UE5 · 3-Phase Boss StateTree",
      "Dual-Weapon Stance Swaps",
      "Directional Hit & Stagger",
    ],
    telemetryZh: [
      "UE5 · 三阶段 Boss 状态树",
      "双武器姿态实时切换",
      "受击方向判定与架势槽",
    ],
  },
  starshore: {
    roman: "IV",
    tabShortEn: "IV. Starshore",
    tabShortZh: "IV · 星岸",
    subtitleEn: "Interconnected ARPG Loop",
    subtitleZh: "飞行、索敌与数据驱动循环",
    cinemaThumbSrc: "/projects/starshore/design-layout-01.avif",
    plateSrc: "/projects/starshore/targeting-01.avif",
    plateLabelEn: "FIG. 02 · Soft-Lock Targeting",
    plateLabelZh: "图 02 · 半自动索敌拆解",
    emblemGoldSrc: "/emblems/starshore-gold.webp",
    emblemInkSrc: "/emblems/starshore-ink.webp",
    telemetryEn: [
      "UE5 · Aerial & Ground 3C",
      "Soft-Lock Targeting Priority",
      "Data-Driven Item & Shop Loop",
    ],
    telemetryZh: [
      "UE5 · 陆空无缝 3C 机动",
      "距离与视角加权索敌",
      "数据驱动拾取与商店循环",
    ],
  },
  "sacred-forest": {
    roman: "V",
    tabShortEn: "V. Sacred Forest",
    tabShortZh: "V · 圣域森林",
    subtitleEn: "Stylized Shrine & Normal Tooling",
    subtitleZh: "风格化神社与法线工具管线",
    cinemaThumbSrc: "/projects/sacred-forest/cover.avif",
    plateSrc: "/projects/sacred-forest/foliage-01.avif",
    plateLabelEn: "FIG. 03 · Foliage & Normal Tool",
    plateLabelZh: "图 03 · 植被拓扑与法线工具",
    emblemGoldSrc: "/emblems/sacred-forest-gold.webp",
    emblemInkSrc: "/emblems/sacred-forest-ink.webp",
    telemetryEn: [
      "UE5 · Stylized Forest Shrine",
      "Custom Maya Normal Toolkit",
      "Substance & SpeedTree Pipeline",
    ],
    telemetryZh: [
      "UE5 · 风格化森林神社",
      "自研 Maya 顶点法线工具",
      "Substance 与 SpeedTree 管线",
    ],
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

  // Neighboring dark-slate folios peeking behind on left & right
  const leftBgProject = isReelActive
    ? orderedProjects[1]
    : orderedProjects[(currentProjectIndex + 1) % orderedProjects.length];
  const rightBgProject = isReelActive
    ? orderedProjects[4]
    : orderedProjects[(currentProjectIndex + orderedProjects.length - 1) % orderedProjects.length];
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
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col justify-between overflow-x-clip px-4 py-5 sm:px-7 lg:min-h-screen lg:px-10 lg:py-5 xl:pr-16">
      <Seo
        title={text("Leficious | Game, Level & Technical Designer", "Leficious | 游戏、关卡与技术设计师")}
        description={text(
          "Game, level, and technical design atelier of Lefi (Kevin) Shan — playable spatial puzzle worlds, multiphase combat systems, and 3D environments.",
          "单凯飞（Leficious）的游戏、关卡与技术设计作品集：空间解谜、多阶段 Boss 战与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />

      {/* ==================== 1. TOP ATELIER NAMEPLATE & MASTER REEL BAR ==================== */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1520px] flex-wrap items-center justify-between gap-3">
        {/* Parchment & Double-Brass Engraved Nameplate Plaque */}
        <div className="parchment-sheet relative inline-flex items-center gap-3 rounded-xs border-2 border-[#b58952] px-4 py-2 shadow-[0_10px_28px_rgba(0,0,0,0.55)] sm:px-6 sm:py-2.5">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#5a3f1e]" />
          <p className="relative z-10 font-numeral text-xs font-bold tracking-[0.16em] text-parchment-ink sm:text-[13.5px] md:text-[15px]">
            {text(
              "LEFI SHAN — GAME, LEVEL & TECHNICAL DESIGN",
              "单凯飞 LEFI SHAN — 游戏、关卡与技术设计",
            )}
          </p>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#5a3f1e]" />
        </div>

        {/* Right Brushed-Brass 2026 Master Design Reel Trigger */}
        <button
          type="button"
          onClick={() => selectBinder(isReelActive ? lastProjectSlugRef.current : "reel")}
          className="brass-plaque inline-flex cursor-pointer items-center gap-2.5 rounded-xs px-4 py-2 font-display text-xs font-bold tracking-wide transition-all hover:-translate-y-0.5 active:scale-97 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          {isReelActive ? (
            <>← {text("Return to Case Board (I–V)", "返回调查案板 (I–V)")}</>
          ) : (
            <>
              <span aria-hidden="true" className="text-[11px]">▶</span>
              <span>{text("2026 Master Design Reel", "2026 年度设计集锦")}</span>
            </>
          )}
        </button>
      </header>

      {/* Mobile / Tablet Compact Binder Strip (< xl) */}
      <div
        className="relative z-20 mx-auto mt-3 flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 xl:hidden"
        role="tablist"
        aria-label={text("Select Atelier Folio", "切换作品卷宗")}
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
              className={`cursor-pointer rounded-xs border px-3 py-1 font-display text-xs font-semibold transition-all ${
                active
                  ? "border-[#8b2624] bg-parchment text-parchment-ink shadow-md"
                  : "border-warm/30 bg-surface/90 text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ==================== 2. PANORAMIC MULTI-ARTIFACT DETECTIVE CASE-BOARD ==================== */}
      <main id="main-content" tabIndex={-1} className="relative my-auto mx-auto w-full max-w-[1520px] py-4 lg:py-3">
        {/* Peek-Behind Neighboring Dark-Slate Folios w/ Bespoke Copperplate Gold-Foil Emblems */}
        <div
          className="pointer-events-none absolute inset-x-0 inset-y-2 hidden lg:block"
          style={{
            transform: "translate3d(calc(var(--mx) * -10px), calc(var(--my) * -6px), 0)",
          }}
        >
          {/* Left Peeking Folio */}
          <button
            type="button"
            onClick={() => selectBinder(leftBgProject.slug)}
            aria-label={`${text("Inspect Folio", "切换至")} ${leftBgMeta.roman}: ${leftBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -left-4 bottom-3 top-7 flex w-[34%] -rotate-[5deg] cursor-pointer flex-col justify-between overflow-hidden rounded-xs border border-warm/38 p-5 text-left transition-all duration-300 hover:-translate-x-3 hover:-translate-y-1.5 hover:-rotate-[6.5deg] hover:border-[#dfc092]/75 xl:-left-7"
          >
            {/* Dark-tinted photographic atmosphere */}
            <img
              src={leftBgMeta.cinemaThumbSrc}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-35"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d1019]/90 via-[#121622]/85 to-[#141824]/95" />

            <div className="relative z-10 max-w-[165px]">
              <p className="font-numeral text-[10.5px] tracking-[0.18em] text-warm/95">
                {text("FOLIO", "卷")} {leftBgMeta.roman}
              </p>
              <p className="mt-0.5 truncate font-display text-[15px] font-bold text-foreground/90 group-hover:text-[#f5e3be]">
                {leftBgProject.title}
              </p>
            </div>

            {/* Bespoke Copperplate Gold-Foil Emblem in Exposed Left Wing */}
            <div className="relative z-10 my-auto -ml-1 flex flex-col items-start">
              <img
                src={leftBgMeta.emblemGoldSrc}
                alt=""
                width="168"
                height="168"
                className="h-30 w-30 object-contain opacity-88 drop-shadow-[0_4px_16px_rgba(0,0,0,0.82)] transition-all duration-300 group-hover:scale-108 group-hover:opacity-100 xl:h-36 xl:w-36"
              />
            </div>

            <div className="relative z-10 flex items-baseline gap-2.5">
              <span className="font-numeral text-3xl font-semibold tracking-wider text-warm/80 transition-colors group-hover:text-[#ebd09e] xl:text-4xl">
                {leftBgMeta.roman}
              </span>
              <span className="font-numeral text-[9.5px] tracking-[0.2em] text-muted-foreground group-hover:text-[#ebd09e]">
                {text("PULL →", "调阅 →")}
              </span>
            </div>
          </button>

          {/* Right Peeking Folio */}
          <button
            type="button"
            onClick={() => selectBinder(rightBgProject.slug)}
            aria-label={`${text("Inspect Folio", "切换至")} ${rightBgMeta.roman}: ${rightBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -right-4 bottom-3 top-7 flex w-[34%] rotate-[4.4deg] cursor-pointer flex-col justify-between overflow-hidden rounded-xs border border-warm/38 p-5 text-right transition-all duration-300 hover:translate-x-3 hover:-translate-y-1.5 hover:rotate-[5.8deg] hover:border-[#dfc092]/75 xl:-right-7"
          >
            <img
              src={rightBgMeta.cinemaThumbSrc}
              alt=""
              loading="lazy"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-luminosity transition-opacity duration-500 group-hover:opacity-35"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#0d1019]/90 via-[#121622]/85 to-[#141824]/95" />

            <div className="relative z-10 ml-auto max-w-[165px]">
              <p className="font-numeral text-[10.5px] tracking-[0.18em] text-warm/95">
                {text("FOLIO", "卷")} {rightBgMeta.roman}
              </p>
              <p className="mt-0.5 truncate font-display text-[15px] font-bold text-foreground/90 group-hover:text-[#f5e3be]">
                {rightBgProject.title}
              </p>
            </div>

            {/* Bespoke Copperplate Gold-Foil Emblem in Exposed Right Wing */}
            <div className="relative z-10 my-auto -mr-1 flex flex-col items-end">
              <img
                src={rightBgMeta.emblemGoldSrc}
                alt=""
                width="168"
                height="168"
                className="h-30 w-30 object-contain opacity-88 drop-shadow-[0_4px_16px_rgba(0,0,0,0.82)] transition-all duration-300 group-hover:scale-108 group-hover:opacity-100 xl:h-36 xl:w-36"
              />
            </div>

            <div className="relative z-10 flex items-baseline justify-end gap-2.5">
              <span className="font-numeral text-[9.5px] tracking-[0.2em] text-muted-foreground group-hover:text-[#ebd09e]">
                {text("← PULL", "← 调阅")}
              </span>
              <span className="font-numeral text-3xl font-semibold tracking-wider text-warm/80 transition-colors group-hover:text-[#ebd09e] xl:text-4xl">
                {rightBgMeta.roman}
              </span>
            </div>
          </button>
        </div>

        {isReelActive ? (
          /* ==================== 00 · MASTER DESIGN REEL SPREAD ==================== */
          <article className="parchment-sheet animate-folio-arc relative z-20 mx-auto w-full max-w-[1160px] rounded-xs border-[5px] border-[#151821] px-5 py-6 sm:px-9 sm:py-8">
            <FolioCorners tone="parchment" />
            <div className="relative z-10">
              <header className="text-center">
                <p className="font-numeral text-[11px] font-bold tracking-[0.24em] text-parchment-muted uppercase">
                  {text("ATELIER MASTER REEL · 2026", "年度实机集锦 · 2026")}
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-parchment-ink sm:text-4xl">
                  {text("Game, Level & Technical Design Reel", "游戏、关卡与技术设计作品集锦")}
                </h1>
                <p className="mt-0.5 font-display text-base italic text-rubric sm:text-lg">
                  {text(
                    "Lefi (Kevin) Shan · USC School of Cinematic Arts & Gnomon",
                    "单凯飞 Lefi Shan · 南加州大学电影艺术学院 & Gnomon",
                  )}
                </p>
              </header>

              <div className="relative mt-5 rounded-xs border-2 border-[#6e5029] bg-[#0b0d13] p-2 shadow-2xl">
                <BrassCornerClasps />
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
                      <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/5" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="brass-plaque inline-flex items-center gap-2.5 rounded-xs px-6 py-3 font-display text-base font-bold tracking-wide transition-transform group-hover:scale-105">
                          <span aria-hidden="true">▶</span>
                          {text("Play 2026 Master Reel", "播放 2026 年度设计集锦")}
                        </span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {orderedProjects.map((proj) => (
                    <button
                      key={proj.slug}
                      type="button"
                      onClick={() => selectBinder(proj.slug)}
                      className="cursor-pointer rounded-xs border border-[#8c683a]/55 bg-parchment-deep/60 px-3 py-1.5 font-display text-xs font-bold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f4ecdc]"
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
                  className="inline-flex items-center gap-2 rounded-xs bg-[#181513] px-4 py-2 font-display text-sm font-semibold text-[#f4ecdc] transition-colors hover:bg-[#2c2622]"
                >
                  {text("Download Résumé (PDF)", "下载游戏设计简历")} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          </article>
        ) : (
          /* ==================== I–V · OPTION B 3-ARTIFACT DETECTIVE SPREAD ==================== */
          <div className="relative z-20 mx-auto w-full max-w-[1400px] px-1 lg:px-14 xl:px-20">
            {/* Taut Detective Investigation Threads (z-15: runs cleanly behind the Parchment Dossier into the pins!) */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[15] hidden h-full w-full overflow-visible lg:block"
            >
              {/* Crimson investigation thread from Dossier Top Pin -> Blueprint Brass Tack */}
              <line
                x1="77.5"
                y1="2.2"
                x2="47"
                y2="65.5"
                stroke="#a62c29"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                opacity="0.82"
              />
              {/* Secondary taut brass surveyor thread from Dossier Top Pin -> Cinema Top-Left Clasp */}
              <line
                x1="77.5"
                y1="2.2"
                x2="5.5"
                y2="11"
                stroke="#c59a68"
                strokeWidth="1"
                strokeDasharray="5 5"
                vectorEffect="non-scaling-stroke"
                opacity="0.45"
              />
              {/* Crimson thread from Cinema Bottom-Left Clasp -> Blueprint Brass Tack */}
              <line
                x1="6"
                y1="86"
                x2="47"
                y2="65.5"
                stroke="#a62c29"
                strokeWidth="1.2"
                vectorEffect="non-scaling-stroke"
                opacity="0.65"
              />
            </svg>

            <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-0">
              {/* ---------- ARTIFACT 1 (LEFT ~60%): BRASS-CLAMPED VELVET CINEMA PLATE ---------- */}
              <div
                key={`cinema-${activeProject.slug}`}
                className="animate-folio-arc relative z-10 lg:col-span-7 lg:-mr-10 xl:-mr-14"
                style={{
                  transform: "translate3d(calc(var(--mx) * 3px), calc(var(--my) * 2px), 0)",
                }}
              >
                <div className="relative rounded-xs border-2 border-[#b58952]/75 bg-[#0b0e16] p-2.5 shadow-[0_28px_70px_rgba(0,0,0,0.82)] transition-transform duration-300 lg:-rotate-[1.35deg] lg:p-3.5 lg:hover:-rotate-[0.6deg]">
                  <BrassCornerClasps />

                  {/* Inner gilded bevel */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-[1px] border border-[#dfc092]/45 bg-black">
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
                          width="1440"
                          height="810"
                          fetchPriority="high"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.022]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-black/14 transition-opacity group-hover:opacity-75" />

                        {/* Bottom-Left Brushed Brass Play Walkthrough Plaque (matching Option B!) */}
                        <span className="brass-plaque absolute bottom-3.5 left-3.5 inline-flex items-center gap-2 rounded-xs px-4 py-2 font-display text-xs font-bold tracking-wide shadow-xl transition-transform duration-200 group-hover:scale-105 sm:bottom-5 sm:left-5 sm:px-5 sm:py-2.5 sm:text-sm">
                          <span aria-hidden="true">▶</span>
                          <span>{text("Play Walkthrough", "播放实机演示")}</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ---------- ARTIFACT 2 (RIGHT ~44%): RAG-PARCHMENT CASE DOSSIER SHEAF ---------- */}
              <div
                className="relative z-20 lg:col-span-5 lg:pl-2"
                style={{
                  transform: "translate3d(calc(var(--mx) * 6px), calc(var(--my) * 4px), 0)",
                }}
              >
                <BrassPinThreads animKey={activeProject.slug} />

                <article
                  key={`dossier-${activeProject.slug}`}
                  onPointerMove={(e) => handleTactileCardMove(e, 1.6)}
                  onPointerLeave={resetTactileCard}
                  className="parchment-sheet animate-folio-arc relative overflow-hidden rounded-xs border-[3px] border-[#151821] px-6 py-6 shadow-[0_28px_68px_rgba(0,0,0,0.78),7px_7px_0_-1px_#dfd2b5,8px_8px_0_0_#151821] sm:px-8 sm:py-7 lg:rotate-[1.2deg]"
                >
                  <FolioCorners tone="parchment" inset="inset-2.5" />

                  {/* Subtle 7% Copperplate Sepia Ink Watermark behind Dossier Copy */}
                  <img
                    src={activeMeta.emblemInkSrc}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.065] mix-blend-multiply select-none"
                  />

                  <div className="relative z-10">
                    <header className="text-center">
                      <h1 className="font-display text-xl font-bold tracking-tight text-parchment-ink sm:text-[23px] xl:text-[25px]">
                        <span className="font-numeral text-[0.86em] tracking-wider">
                          {text("FOLIO", "卷")} {activeMeta.roman}
                        </span>{" "}
                        — {activeProject.title.toUpperCase()}
                      </h1>
                      <p className="mt-0.5 font-display text-sm italic text-rubric sm:text-[15.5px]">
                        {isChinese ? activeMeta.subtitleZh : activeMeta.subtitleEn} · {activeProject.year}
                      </p>

                      {/* Centered Crimson Seal Flanking Hairline Rule (Option B signature!) */}
                      <div className="my-3 flex items-center justify-center gap-3">
                        <span aria-hidden="true" className="h-px flex-1 bg-[#8c683a]/40" />
                        <CrimsonStamp label={`FOLIO ${activeMeta.roman}`} className="h-12 w-12 opacity-90" />
                        <span aria-hidden="true" className="h-px flex-1 bg-[#8c683a]/40" />
                      </div>
                    </header>

                    <p
                      className={`text-pretty text-[15px] leading-[1.64] text-parchment-ink/92 sm:text-[15.5px] ${
                        isChinese ? "zh-readable" : ""
                      }`}
                    >
                      <FormattedText>{activeProject.summary}</FormattedText>
                    </p>

                    {/* 3 Engraved Double-Hairline Telemetry Callout Plaques */}
                    <div className="mt-4 space-y-2 lg:pl-10">
                      {telemetry.map((spec) => (
                        <div
                          key={spec}
                          className="relative rounded-xs border border-[#7d5d33]/65 bg-parchment-deep/55 px-3.5 py-1.5 text-center shadow-[inset_0_0_0_2px_rgba(237,228,208,0.75)]"
                        >
                          <span className="font-display text-[13.5px] font-bold tracking-wide text-parchment-ink sm:text-[14px]">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer CTA Buttons */}
                    <div className="mt-5 flex flex-wrap items-center justify-end gap-2.5 pt-1">
                      <Link
                        to={localizedPath(`/projects/${activeProject.slug}`)}
                        viewTransition
                        className="inline-flex items-center gap-2 rounded-xs bg-[#161311] px-5 py-2.5 font-display text-sm font-semibold tracking-wide text-[#f5edde] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2b2420]"
                      >
                        <span>{text("Open Full Folio", "展开完整卷宗")}</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                      {activeProject.externalLink ? (
                        <a
                          href={activeProject.externalLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xs border border-[#181513]/70 bg-parchment/80 px-4 py-2.5 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f5edde]"
                        >
                          <span>{activeProject.externalLink.label}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <Link
                          to={localizedPath("/gallery")}
                          viewTransition
                          className="inline-flex items-center gap-1.5 rounded-xs border border-[#181513]/70 bg-parchment/80 px-4 py-2.5 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f5edde]"
                        >
                          <span>{text("Inspect in Gallery", "查看画廊拆解")}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            </div>

            {/* ---------- ARTIFACT 3 (BOTTOM-CENTER SEAM): PINNED BLUEPRINT SLIP ---------- */}
            <Link
              key={`blueprint-${activeProject.slug}`}
              to={localizedPath(`/projects/${activeProject.slug}`)}
              viewTransition
              aria-label={`${text("Inspect architectural breakdown", "检视关卡拆解图")}: ${activeMeta.plateLabelEn}`}
              className="group relative z-30 mx-auto mt-5 block w-full max-w-[320px] rounded-xs border-2 border-[#7b5b31]/70 bg-[#efe6d2] p-2.5 shadow-[0_22px_48px_rgba(0,0,0,0.78)] transition-all duration-300 hover:-translate-y-2 hover:rotate-0 hover:scale-[1.04] lg:absolute lg:-bottom-6 lg:left-[47%] lg:mt-0 lg:w-[265px] lg:-translate-x-1/2 lg:-rotate-[4.2deg] xl:w-[295px]"
            >
              {/* 3D Machined Brass Tack Head */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2.5 left-1/2 z-20 grid h-5 w-5 -translate-x-1/2 place-items-center rounded-full border border-[#f8e7c5]/85 bg-gradient-to-b from-[#ecd09c] to-[#996d37] shadow-[0_4px_9px_rgba(0,0,0,0.65)]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#3d2811]" />
              </span>

              <div className="overflow-hidden rounded-[1px] border border-[#8c683a]/45 bg-[#e3d6bc]">
                <img
                  src={plateImage}
                  alt={isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                  width="560"
                  height="360"
                  loading="eager"
                  decoding="async"
                  className="ink-engraving aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <span className="truncate font-display text-xs font-bold text-parchment-ink group-hover:text-rubric sm:text-[13px]">
                  {isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                </span>
                <span aria-hidden="true" className="shrink-0 font-mono text-[10.5px] font-bold text-rubric">
                  →
                </span>
              </div>
            </Link>
          </div>
        )}
      </main>

      {/* Subtle Bottom Investigation Ledger Hint */}
      <div className="relative z-20 mt-6 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/75 lg:mt-8">
        <span className="font-numeral tracking-[0.2em] uppercase">
          {text("CASE INDEX", "卷宗索引")} {isReelActive ? "00" : activeMeta.roman} / V
        </span>
        <span aria-hidden="true" className="text-warm/40">·</span>
        <span className="hidden font-display italic sm:inline">
          {text("Use ← / → keys, peeking folios, or right-edge tabs to switch case files", "可使用方向键 ← / →、两侧底卷或右侧索引签切换卷宗")}
        </span>
      </div>

      {/* ==================== 3. RIGHT-EDGE PHYSICAL STEPPED BINDER TABS (Desktop xl+) ==================== */}
      <nav
        aria-label={text("Folio Binder Tabs", "卷宗侧边索引签")}
        className="fixed inset-y-6 right-0 z-40 hidden flex-col justify-center gap-1.5 select-none xl:flex"
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
              onClick={() => selectBinder(key)}
              aria-current={active ? "true" : undefined}
              className={`group relative flex cursor-pointer items-center justify-center rounded-l-sm border-y border-l py-3.5 transition-all duration-250 active:scale-95 ${
                active
                  ? "w-11.5 -translate-x-0 border-[#8c683a]/70 border-r-[3.5px] border-r-rubric bg-parchment text-rubric shadow-[-10px_6px_22px_rgba(0,0,0,0.55)]"
                  : "w-9 translate-x-0.5 border-warm/30 bg-[#cbbda3] text-[#241f19] opacity-88 shadow-[-4px_4px_12px_rgba(0,0,0,0.35)] hover:-translate-x-1 hover:w-10.5 hover:bg-[#e5d9c2] hover:opacity-100"
              }`}
            >
              <span
                className="font-display text-[13px] font-bold tracking-wide whitespace-nowrap"
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
