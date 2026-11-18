import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { useLanguage } from "../lib/language";
import { localizeProject } from "../lib/localizedContent";
import { projects } from "../lib/projects";

type FolioStageMeta = {
  roman: string;
  cardLabelEn: string;
  cardLabelZh: string;
  stageSrc: string;
  stagePos: string;
  handThumbSrc: string;
  handThumbPos: string;
  plateSrc: string;
  plateSrcZh?: string;
  plateShortEn: string;
  plateShortZh: string;
  videoLabelEn: string;
  videoLabelZh: string;
};

const STAGE_META: Record<string, FolioStageMeta> = {
  "still-life": {
    roman: "I",
    cardLabelEn: "I. Still Life",
    cardLabelZh: "I · 静物",
    stageSrc: "/projects/still-life/card-cover.webp",
    stagePos: "object-[78%_center]",
    handThumbSrc: "/projects/still-life/cover.webp",
    handThumbPos: "object-center",
    plateSrc: "/projects/still-life/map-02-three-story-archive.webp",
    plateSrcZh: "/projects/still-life/map-02-three-story-archive-zh.webp",
    plateShortEn: "FIG. 02 · 1F–3F Archive",
    plateShortZh: "图 02 · 三层动线图",
    videoLabelEn: "Play Gameplay Video",
    videoLabelZh: "播放实机演示",
  },
  "an-echo-has-no-shape": {
    roman: "II",
    cardLabelEn: "II. Echo",
    cardLabelZh: "II · 回声无形",
    stageSrc: "/projects/an-echo-has-no-shape/cover.webp",
    stagePos: "object-[76%_center]",
    handThumbSrc: "/projects/an-echo-has-no-shape/cover.webp",
    handThumbPos: "object-right",
    plateSrc: "/projects/an-echo-has-no-shape/map-01-world-overview.webp",
    plateSrcZh: "/projects/an-echo-has-no-shape/map-01-world-overview-zh.webp",
    plateShortEn: "FIG. 01 · 550m Basin Map",
    plateShortZh: "图 01 · 550m 盆地总图",
    videoLabelEn: "Play Gameplay Video",
    videoLabelZh: "播放实机演示",
  },
  "fallen-valkyrie": {
    roman: "III",
    cardLabelEn: "III. Fallen Valkyrie",
    cardLabelZh: "III · 堕落女武神",
    stageSrc: "/projects/fallen-valkyrie/cover.avif",
    stagePos: "object-[62%_center]",
    handThumbSrc: "/projects/fallen-valkyrie/cover.avif",
    handThumbPos: "object-center",
    plateSrc: "/projects/fallen-valkyrie/ai-statetree-01.avif",
    plateShortEn: "FIG. 06 · Boss StateTree",
    plateShortZh: "图 06 · Boss 状态树",
    videoLabelEn: "Play Gameplay Video",
    videoLabelZh: "播放实机演示",
  },
  starshore: {
    roman: "IV",
    cardLabelEn: "IV. Starshore",
    cardLabelZh: "IV · 星岸",
    stageSrc: "/projects/starshore/design-layout-01.avif",
    stagePos: "object-[68%_center]",
    handThumbSrc: "/projects/starshore/design-layout-01.avif",
    handThumbPos: "object-center",
    plateSrc: "/projects/starshore/targeting-01.avif",
    plateShortEn: "FIG. 02 · Targeting Graph",
    plateShortZh: "图 02 · 索敌系统拆解",
    videoLabelEn: "Play Gameplay Video",
    videoLabelZh: "播放实机演示",
  },
  "sacred-forest": {
    roman: "V",
    cardLabelEn: "V. Sacred Forest",
    cardLabelZh: "V · 圣域森林",
    stageSrc: "/projects/sacred-forest/cover.avif",
    stagePos: "object-[65%_center]",
    handThumbSrc: "/projects/sacred-forest/cover.avif",
    handThumbPos: "object-center",
    plateSrc: "/projects/sacred-forest/foliage-01.avif",
    plateShortEn: "FIG. 03 · Foliage & Normals",
    plateShortZh: "图 03 · 植被与法线工具",
    videoLabelEn: "Play Breakdown Video",
    videoLabelZh: "播放技术分解",
  },
};

const ORDERED_SLUGS = [
  "still-life",
  "an-echo-has-no-shape",
  "fallen-valkyrie",
  "starshore",
  "sacred-forest",
] as const;

const FAN_TRANSFORMS = [
  "lg:-rotate-[8deg] lg:translate-y-3",
  "lg:-rotate-[4deg] lg:translate-y-1",
  "lg:rotate-[0deg] lg:translate-y-0",
  "lg:rotate-[4deg] lg:translate-y-1",
  "lg:rotate-[8deg] lg:translate-y-3",
] as const;

const SKY_ASTROLABE_TICKS = Array.from({ length: 72 }, (_, idx) => {
  const deg = idx * 5;
  const rad = (deg * Math.PI) / 180;
  const major = deg % 15 === 0;
  const r1 = major ? 268 : 276;
  const r2 = 284;
  return {
    x1: (320 + Math.cos(rad) * r1).toFixed(1),
    y1: (320 + Math.sin(rad) * r1).toFixed(1),
    x2: (320 + Math.cos(rad) * r2).toFixed(1),
    y2: (320 + Math.sin(rad) * r2).toFixed(1),
    lx: (320 + Math.cos(rad) * 255).toFixed(1),
    ly: (320 + Math.sin(rad) * 255).toFixed(1),
    major,
    deg,
  };
});

/** Translucent golden astrolabe arcs overlaid in the upper-right sky of the World Stage */
function SkyAstrolabeOverlay({ stepIndex }: { stepIndex: number }) {
  const rot = stepIndex * 36;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-36 -top-36 z-10 hidden h-[560px] w-[560px] select-none md:block xl:-right-40 xl:-top-40 xl:h-[680px] xl:w-[680px]"
      style={{
        transform: "translate3d(calc(var(--mx) * -8px), calc(var(--my) * -6px), 0)",
      }}
    >
      <svg viewBox="0 0 640 640" className="h-full w-full overflow-visible" fill="none">
        <g
          style={{
            transform: `rotate(${rot}deg)`,
            transformOrigin: "320px 320px",
            transition: "transform 680ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <g className="animate-astrolabe-cw" style={{ transformOrigin: "320px 320px" }}>
            <circle cx="320" cy="320" r="284" stroke="#dfc092" strokeWidth="1.1" opacity="0.45" />
            <circle cx="320" cy="320" r="268" stroke="#dfc092" strokeWidth="0.7" opacity="0.3" />
            <circle cx="320" cy="320" r="218" stroke="#ece4d4" strokeWidth="0.65" strokeDasharray="3 5" opacity="0.24" />
            <circle cx="320" cy="320" r="168" stroke="#dfc092" strokeWidth="0.8" opacity="0.28" />
            <line x1="20" y1="320" x2="620" y2="320" stroke="#dfc092" strokeWidth="0.6" opacity="0.22" />
            <line x1="320" y1="20" x2="320" y2="620" stroke="#dfc092" strokeWidth="0.6" opacity="0.22" />
            <line x1="110" y1="110" x2="530" y2="530" stroke="#dfc092" strokeWidth="0.55" opacity="0.18" />
            <line x1="530" y1="110" x2="110" y2="530" stroke="#dfc092" strokeWidth="0.55" opacity="0.18" />

            {SKY_ASTROLABE_TICKS.map((t, idx) => (
              <g key={idx}>
                <line
                  x1={t.x1}
                  y1={t.y1}
                  x2={t.x2}
                  y2={t.y2}
                  stroke="#dfc092"
                  strokeWidth={t.major ? "1.1" : "0.6"}
                  opacity={t.major ? "0.52" : "0.24"}
                />
                {t.major && (
                  <text
                    x={t.lx}
                    y={t.ly}
                    fill="#ebd1a3"
                    opacity="0.42"
                    fontSize="8.5"
                    fontFamily="IBM Plex Mono, monospace"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {String(t.deg).padStart(3, "0")}°
                  </text>
                )}
              </g>
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

type TheaterModalState = {
  youtubeId: string;
  title: string;
  subtitle: string;
  posterSrc: string;
} | null;

type HomePageProps = {
  activeFolioSlug: string;
  onSelectFolioSlug: (slug: string) => void;
};

export function HomePage({ activeFolioSlug, onSelectFolioSlug }: HomePageProps) {
  const { isChinese, text, localizedPath } = useLanguage();
  const [theaterModal, setTheaterModal] = useState<TheaterModalState>(null);
  const [theaterPlaying, setTheaterPlaying] = useState(false);

  const orderedProjects = ORDERED_SLUGS.map((slug) => {
    const found = projects.find((p) => p.slug === slug) ?? projects[0];
    return localizeProject(found, isChinese);
  });

  const safeSlug = ORDERED_SLUGS.includes(activeFolioSlug as (typeof ORDERED_SLUGS)[number])
    ? activeFolioSlug
    : "still-life";
  const currentIndex = Math.max(
    0,
    orderedProjects.findIndex((p) => p.slug === safeSlug),
  );
  const activeProject = orderedProjects[currentIndex];
  const activeMeta = STAGE_META[activeProject.slug] ?? STAGE_META["still-life"];

  // Keyboard arrow navigation across the 5-card specimen hand (and Esc to close theater modal)
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && theaterModal) {
        setTheaterModal(null);
        setTheaterPlaying(false);
        return;
      }
      if (theaterModal) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const nextIdx =
        event.key === "ArrowRight"
          ? (currentIndex + 1) % ORDERED_SLUGS.length
          : (currentIndex - 1 + ORDERED_SLUGS.length) % ORDERED_SLUGS.length;
      onSelectFolioSlug(ORDERED_SLUGS[nextIdx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, onSelectFolioSlug, theaterModal]);

  const leadYoutubeId = activeProject.media.find((m) => m.type === "youtube")?.id ?? "hphiglctUCw";
  const plateImage = isChinese && activeMeta.plateSrcZh ? activeMeta.plateSrcZh : activeMeta.plateSrc;

  const openMasterReel = () => {
    setTheaterPlaying(false);
    setTheaterModal({
      youtubeId: "hphiglctUCw",
      title: text("2026 Game, Level & Technical Design Reel", "2026 游戏、关卡与技术设计作品集锦"),
      subtitle: text("Lefi (Kevin) Shan · USC SCA & Gnomon", "单凯飞 Lefi Shan · 南加州大学电影艺术学院 & Gnomon"),
      posterSrc: "/reels/game-design-reel-2026.webp",
    });
  };

  const openProjectVideo = () => {
    setTheaterPlaying(false);
    setTheaterModal({
      youtubeId: leadYoutubeId,
      title: `${text("FOLIO", "卷")} ${activeMeta.roman} — ${activeProject.title}`,
      subtitle: `${activeProject.role} · ${activeProject.year}`,
      posterSrc: activeProject.heroImage ?? activeProject.cover,
    });
  };

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] w-full flex-col justify-between overflow-hidden bg-[#090b10] lg:h-screen lg:min-h-[700px]">
      <Seo
        title={text("Leficious | Game, Level & Technical Designer", "Leficious | 游戏、关卡与技术设计师")}
        description={text(
          "Game, level, and technical design atelier of Lefi (Kevin) Shan — playable spatial puzzle worlds, multiphase combat systems, and 3D environments.",
          "单凯飞（Leficious）的游戏、关卡与技术设计作品集：空间解谜、多阶段 Boss 战与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />

      {/* ==================== 1. FULL-BLEED CHIAROSCURO WORLD CANVAS ==================== */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute -inset-4"
          style={{
            transform: "translate3d(calc(var(--mx) * -11px), calc(var(--my) * -7px), 0)",
          }}
        >
          <img
            key={activeMeta.stageSrc}
            src={activeMeta.stageSrc}
            alt=""
            width="1920"
            height="1080"
            fetchPriority="high"
            decoding="async"
            className={`animate-world-stage h-full w-full object-cover ${activeMeta.stagePos}`}
          />
        </div>

        {/* Left Chiaroscuro Vignette (dissolves left poster text & anchors LEFI SHAN masthead + Dossier) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #080a0f 0%, #090c13 24%, rgba(10, 13, 20, 0.92) 35%, rgba(10, 13, 20, 0.38) 51%, rgba(10, 13, 20, 0.08) 72%, rgba(8, 10, 15, 0.45) 100%)",
          }}
        />
        {/* Bottom & Top Studio Edge Falloff */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8, 10, 15, 0.72) 0%, rgba(8, 10, 15, 0) 20%, rgba(8, 10, 15, 0.14) 68%, rgba(8, 10, 15, 0.86) 100%)",
          }}
        />
      </div>

      {/* Upper-Right Rotating Translucent Golden Astrolabe Sky Arcs */}
      <SkyAstrolabeOverlay stepIndex={currentIndex} />

      {/* Right-Stage Floating Brass Video Medallion (Desktop) */}
      <div className="absolute right-7 top-[44%] z-20 hidden -translate-y-1/2 lg:block xl:right-11">
        <button
          type="button"
          onClick={openProjectVideo}
          className="brass-plaque group inline-flex cursor-pointer items-center gap-2.5 rounded-full px-5 py-2.5 font-display text-sm font-bold tracking-wide shadow-[0_12px_34px_rgba(0,0,0,0.72)] transition-all duration-250 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-97 xl:px-6 xl:py-3 xl:text-[15px]"
        >
          <span aria-hidden="true" className="text-xs transition-transform group-hover:scale-115">▶</span>
          <span>{isChinese ? activeMeta.videoLabelZh : activeMeta.videoLabelEn}</span>
        </button>
      </div>

      {/* ==================== 2. TOP-LEFT MONUMENTAL EDITORIAL MASTHEAD ==================== */}
      <header className="relative z-20 px-5 pt-6 sm:px-9 sm:pt-8 xl:px-12 xl:pt-10">
        <h1 className="font-display text-4xl font-semibold tracking-[0.03em] text-[#f4ecdc] drop-shadow-[0_4px_24px_rgba(0,0,0,0.75)] sm:text-5xl xl:text-[64px] xl:leading-[0.98]">
          {text("LEFI SHAN", "单凯飞 · LEFI SHAN")}
        </h1>
        <p className="mt-1.5 font-display text-base italic text-[#dc7d73] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-lg xl:text-[21px]">
          {text(
            "Game, Level & Technical Designer · USC SCA & Gnomon",
            "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
          )}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openMasterReel}
            className="brass-plaque inline-flex cursor-pointer items-center gap-2.5 rounded-full px-5 py-2 font-display text-xs font-bold tracking-wide shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all hover:-translate-y-0.5 hover:scale-[1.02] sm:text-sm"
          >
            <span aria-hidden="true" className="text-[11px]">▶</span>
            <span>{text("Watch 2026 Master Reel", "观看 2026 年度设计集锦")}</span>
          </button>

          {/* Mobile Gameplay Video Pill (< lg, since floating right-stage pill is desktop-only) */}
          <button
            type="button"
            onClick={openProjectVideo}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dfc092]/55 bg-[#0e1017]/88 px-4 py-2 font-display text-xs font-semibold text-[#f3e6ce] backdrop-blur-sm lg:hidden"
          >
            <span aria-hidden="true" className="text-warm">▶</span>
            <span>{isChinese ? activeMeta.videoLabelZh : activeMeta.videoLabelEn}</span>
          </button>
        </div>
      </header>

      {/* ==================== 3. FOREGROUND BOTTOM STAGE: OVERLAPPING DOSSIER + 5-CARD PHOTO HAND ==================== */}
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-20 mt-8 flex flex-col justify-between gap-7 px-5 pb-6 sm:px-9 lg:mt-auto lg:flex-row lg:items-end lg:gap-6 lg:pb-7 xl:px-12 xl:pb-9"
      >
        {/* Bottom-Left Overlapping Rag-Parchment Case Dossier + Protruding Pinned Blueprint Slip */}
        <div
          className="relative w-full max-w-[560px] sm:pr-24 xl:max-w-[615px] xl:pr-28"
          style={{
            transform: "translate3d(calc(var(--mx) * 4px), calc(var(--my) * 3px), 0)",
          }}
        >
          <article
            key={activeProject.slug}
            className="parchment-sheet animate-folio-arc relative rounded-xs border-[3px] border-[#151821] px-5 py-5 sm:px-7 sm:py-6 xl:px-8 xl:py-7"
          >
            <FolioCorners tone="parchment" inset="inset-2 sm:inset-2.5" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-bold leading-tight tracking-tight text-parchment-ink sm:text-[23px] xl:text-[25px]">
                  <span className="font-numeral text-[0.86em] tracking-wider">
                    {text("FOLIO", "卷")} {activeMeta.roman}
                  </span>{" "}
                  — {activeProject.title.toUpperCase()}
                </h2>
                <CrimsonStamp
                  label={`FOLIO ${activeMeta.roman}`}
                  className="-mt-1 h-11 w-11 shrink-0 opacity-88"
                />
              </div>

              <p
                className={`mt-2.5 text-[14.5px] leading-[1.62] text-parchment-ink/92 sm:pr-20 sm:text-[15px] xl:pr-24 xl:text-[15.5px] ${
                  isChinese ? "zh-readable" : ""
                }`}
              >
                <FormattedText>{activeProject.summary}</FormattedText>
              </p>

              <p className="mt-3 font-display text-sm italic text-rubric sm:pr-20 xl:text-[15px]">
                {activeProject.tags.slice(0, 3).join(" · ")} · {activeProject.year}
              </p>

              {/* Stacked Action Buttons (matching Option A layout so right side stays clear for the pinned blueprint!) */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:flex-col sm:items-start">
                <Link
                  to={localizedPath(`/projects/${activeProject.slug}`)}
                  viewTransition
                  className="inline-flex min-w-[178px] items-center justify-center gap-2 rounded-xs bg-[#161311] px-4.5 py-2.5 font-display text-sm font-semibold tracking-wide text-[#f5edde] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2b2420]"
                >
                  <span>{text("Open Full Folio", "展开完整卷宗")}</span>
                  <span aria-hidden="true">→</span>
                </Link>

                {activeProject.externalLink ? (
                  <a
                    href={activeProject.externalLink.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-w-[178px] items-center justify-center gap-1.5 rounded-xs border border-[#181513]/70 bg-parchment/70 px-4 py-2 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f5edde]"
                  >
                    <span>{activeProject.externalLink.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link
                    to={localizedPath("/gallery")}
                    viewTransition
                    className="inline-flex min-w-[178px] items-center justify-center gap-1.5 rounded-xs border border-[#181513]/70 bg-parchment/70 px-4 py-2 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f5edde]"
                  >
                    <span>{text("Inspect in Gallery", "查看画廊拆解")}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* Protruding Pinned Architectural Blueprint Slip (Breaks Past Right Edge of Dossier!) */}
          <Link
            key={`pin-${activeProject.slug}`}
            to={localizedPath(`/projects/${activeProject.slug}`)}
            viewTransition
            aria-label={`${text("Inspect blueprint", "检视拆解图")}: ${activeMeta.plateShortEn}`}
            className="animate-blueprint-pin group relative mt-3 block rounded-xs border-2 border-[#7b5b31]/75 bg-[#e6dac1] p-2 shadow-[0_18px_38px_rgba(0,0,0,0.62)] transition-all duration-300 hover:z-30 hover:-translate-y-1.5 hover:rotate-[2.5deg] hover:scale-[1.04] sm:absolute sm:right-0 sm:bottom-4 sm:z-30 sm:mt-0 sm:w-[205px] xl:bottom-5 xl:w-[228px]"
          >
            {/* 3D Machined Brass Push-Pin Head */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-2.5 left-1/2 z-20 grid h-4.5 w-4.5 -translate-x-1/2 place-items-center rounded-full border border-[#f8e7c5]/80 bg-gradient-to-b from-[#ecd09c] to-[#996d37] shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#3d2811]" />
            </span>

            <div className="overflow-hidden rounded-xs border border-[#8c683a]/45 bg-[#dfd1b4]">
              <img
                src={plateImage}
                alt={isChinese ? activeMeta.plateShortZh : activeMeta.plateShortEn}
                width="480"
                height="320"
                loading="eager"
                decoding="async"
                className="ink-engraving aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>

            <div className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
              <span className="truncate font-display text-[12px] font-bold text-parchment-ink group-hover:text-rubric">
                {isChinese ? activeMeta.plateShortZh : activeMeta.plateShortEn}
              </span>
              <span aria-hidden="true" className="shrink-0 font-mono text-[10px] font-bold text-rubric">
                →
              </span>
            </div>
          </Link>
        </div>

        {/* ==================== 4. BOTTOM-RIGHT 5-CARD FANNED PHOTOGRAPHIC SPECIMEN HAND ==================== */}
        <nav
          aria-label={text("Select Case Folio", "选择作品卷宗")}
          className="flex items-end justify-start gap-2 overflow-x-auto pt-4 pb-1 select-none sm:justify-center lg:ml-auto lg:gap-0 lg:overflow-visible lg:pt-8 lg:pr-2"
        >
          {orderedProjects.map((proj, idx) => {
            const meta = STAGE_META[proj.slug];
            const active = proj.slug === activeProject.slug;
            const fanClass = FAN_TRANSFORMS[idx] ?? "";

            return (
              <button
                key={proj.slug}
                type="button"
                onClick={() => onSelectFolioSlug(proj.slug)}
                onPointerMove={(e) => handleTactileCardMove(e, 3)}
                onPointerLeave={resetTactileCard}
                aria-current={active ? "true" : undefined}
                className={`group relative flex w-[112px] shrink-0 cursor-pointer flex-col rounded-xs border p-1.5 text-left transition-all duration-300 sm:w-[122px] lg:-ml-3 first:lg:ml-0 xl:w-[134px] ${
                  active
                    ? "parchment-sheet z-30 -translate-y-4 scale-[1.06] border-[#dfc092] shadow-[0_20px_44px_rgba(0,0,0,0.82),0_0_22px_rgba(223,192,146,0.35)] lg:rotate-0"
                    : `z-10 border-[#cbbda2]/65 bg-[#e5dac4] text-parchment-ink opacity-92 shadow-[0_12px_28px_rgba(0,0,0,0.68)] hover:z-20 hover:-translate-y-3 hover:scale-[1.04] hover:bg-[#f1e7d3] hover:opacity-100 ${fanClass}`
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1px] border border-[#6e522d]/45 bg-[#0b0d13]">
                  <img
                    src={meta.handThumbSrc}
                    alt={proj.title}
                    width="320"
                    height="240"
                    loading="eager"
                    decoding="async"
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-108 ${meta.handThumbPos}`}
                  />
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute right-1 top-1 h-2 w-2 rounded-full border border-[#faf3e3] bg-rubric shadow-xs"
                    />
                  )}
                </div>
                <span
                  className={`relative z-10 mt-1.5 block truncate px-0.5 text-center font-display text-[11.5px] font-bold tracking-tight xl:text-[12.5px] ${
                    active ? "text-rubric" : "text-[#1b1714] group-hover:text-rubric"
                  }`}
                >
                  {isChinese ? meta.cardLabelZh : meta.cardLabelEn}
                </span>
              </button>
            );
          })}
        </nav>
      </main>

      {/* ==================== 5. VELVET THEATER MODAL FOR REEL & GAMEPLAY VIDEOS ==================== */}
      {theaterModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[320] flex items-center justify-center bg-[#05070c]/92 p-4 backdrop-blur-md sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={theaterModal.title}
            onClick={() => {
              setTheaterModal(null);
              setTheaterPlaying(false);
            }}
          >
            <div
              className="slate-folio animate-folio-arc relative w-full max-w-[1120px] rounded-xs border-2 border-warm/50 p-4 shadow-2xl sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <FolioCorners tone="slate" inset="inset-2" />
              <header className="relative z-10 mb-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-warm/25 pb-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-[#f4ecdc] sm:text-2xl">{theaterModal.title}</h2>
                  <p className="font-display text-sm italic text-[#d8897f]">{theaterModal.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTheaterModal(null);
                    setTheaterPlaying(false);
                  }}
                  className="brass-plaque cursor-pointer rounded-xs px-3.5 py-1.5 font-display text-xs font-bold tracking-wide"
                >
                  × {text("Return to Stage", "返回舞台")}
                </button>
              </header>

              <div className="relative z-10 aspect-video w-full overflow-hidden rounded-xs border border-warm/35 bg-black">
                {theaterPlaying ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${theaterModal.youtubeId}?autoplay=1`}
                    title={theaterModal.title}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setTheaterPlaying(true)}
                    className="group relative block h-full w-full cursor-pointer text-left"
                    aria-label={`${text("Start video", "开始播放")}: ${theaterModal.title}`}
                  >
                    <img
                      src={theaterModal.posterSrc}
                      alt=""
                      width="1280"
                      height="720"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                    <span className="absolute inset-0 bg-black/22 transition-colors group-hover:bg-black/8" />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="brass-plaque inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-display text-base font-bold tracking-wide shadow-2xl transition-transform group-hover:scale-105">
                        ▶ {text("Start Playback", "点击开始播放")}
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
