import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArchivalPaperSheaf,
  AtelierHeaderRail,
  BrassCornerClasps,
  BrassPinThreads,
  BrassRule,
  CrimsonStamp,
  FolioCorners,
} from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { ProjectSigil } from "../components/ProjectSigils";
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
    cinemaThumbSrc: "/projects/still-life/hero-poster.webp",
    plateSrc: "/projects/still-life/map-02-three-story-archive.webp",
    plateSrcZh: "/projects/still-life/map-02-three-story-archive-zh.webp",
    plateMode: "ink",
    plateLabelEn: "FIG. II · 1F–3F Orthographic Plan",
    plateLabelZh: "图 II · 1F–3F 正交动线图",
    telemetryEn: ["235 kg · Zero-Slack", "5 Rooms · 3 Floors", "0 Dialogue · 0 HUD"],
    telemetryZh: ["235 kg · 满额配重", "5 房间 · 三层立体", "零对白 · 零 UI"],
  },
  "an-echo-has-no-shape": {
    roman: "II",
    tabShortEn: "II. Echo",
    tabShortZh: "II · 回声无形",
    subtitleEn: "Basin of Three Silences",
    subtitleZh: "三重寂静之声波盆地",
    cinemaThumbSrc: "/projects/an-echo-has-no-shape/hero-poster.webp",
    plateSrc: "/projects/an-echo-has-no-shape/map-01-world-overview.webp",
    plateSrcZh: "/projects/an-echo-has-no-shape/map-01-world-overview-zh.webp",
    plateMode: "daguerreotype",
    plateLabelEn: "FIG. I · 550m Basin Topology",
    plateLabelZh: "图 I · 550m 盆地总图",
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
    telemetryEn: ["3-Phase StateTree", "Dual-Stance Swaps", "Directional Stagger"],
    telemetryZh: ["三阶段状态树", "双武器姿态切换", "受击方向与架势"],
  },
  starshore: {
    roman: "IV",
    tabShortEn: "IV. Starshore",
    tabShortZh: "IV · 星岸",
    subtitleEn: "Interconnected ARPG Loop",
    subtitleZh: "飞行、索敌与数据驱动循环",
    cinemaThumbSrc: "/projects/starshore/hero-poster.jpg",
    plateSrc: "/projects/starshore/targeting-01.avif",
    plateMode: "daguerreotype",
    plateLabelEn: "FIG. II · Soft-Lock Targeting",
    plateLabelZh: "图 II · 半自动索敌拆解",
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
const LOUPE_RADIUS = 62;
const LOUPE_ZOOM = 2.35;

type HomePageProps = {
  activeFolioSlug: string;
  onSelectFolioSlug: (slug: string) => void;
};

export function HomePage({ activeFolioSlug, onSelectFolioSlug }: HomePageProps) {
  const { isChinese, text, localizedPath } = useLanguage();
  const [playingVideo, setPlayingVideo] = useState(false);
  const [activeReelKind, setActiveReelKind] = useState<"design" | "environment">("design");
  const lastProjectSlugRef = useRef<string>("still-life");
  const blueprintBoxRef = useRef<HTMLDivElement>(null);
  const loupeRef = useRef<HTMLDivElement>(null);
  const loupeImgRef = useRef<HTMLImageElement>(null);

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

  // On the landing Reel spread, flank the showcase with Flagship Folios I (Still Life) and II (Echo)
  const leftBgProject = isReelActive
    ? orderedProjects[0]
    : orderedProjects[(currentProjectIndex + 1) % orderedProjects.length];
  const leftBgMeta = BOARD_META[leftBgProject.slug];
  const rightBgProject = isReelActive
    ? orderedProjects[1]
    : orderedProjects[(currentProjectIndex + orderedProjects.length - 1) % orderedProjects.length];
  const rightBgMeta = BOARD_META[rightBgProject.slug];

  const selectBinder = (key: string) => {
    if (key === activeFolioSlug) return;
    setPlayingVideo(false);
    onSelectFolioSlug(key);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const idx = ALL_BINDER_KEYS.indexOf(activeFolioSlug as (typeof ALL_BINDER_KEYS)[number]);
      if (idx === -1) return;
      const nextIdx =
        e.key === "ArrowRight"
          ? (idx + 1) % ALL_BINDER_KEYS.length
          : (idx - 1 + ALL_BINDER_KEYS.length) % ALL_BINDER_KEYS.length;
      setPlayingVideo(false);
      onSelectFolioSlug(ALL_BINDER_KEYS[nextIdx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeFolioSlug, onSelectFolioSlug]);

  const handleBlueprintPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const box = blueprintBoxRef.current;
    const loupe = loupeRef.current;
    const loupeImg = loupeImgRef.current;
    if (!box || !loupe || !loupeImg) return;

    const rect = box.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    loupe.style.opacity = "1";
    loupe.style.transform = `translate3d(${(x - LOUPE_RADIUS).toFixed(1)}px, ${(y - LOUPE_RADIUS).toFixed(1)}px, 0)`;
    loupeImg.style.width = `${(rect.width * LOUPE_ZOOM).toFixed(1)}px`;
    loupeImg.style.height = `${(rect.height * LOUPE_ZOOM).toFixed(1)}px`;
    loupeImg.style.transform = `translate3d(${(LOUPE_RADIUS - x * LOUPE_ZOOM).toFixed(1)}px, ${(LOUPE_RADIUS - y * LOUPE_ZOOM).toFixed(1)}px, 0)`;
  };

  const handleBlueprintPointerLeave = () => {
    if (!loupeRef.current) return;
    loupeRef.current.style.opacity = "0";
  };

  const leadYoutubeId = activeProject.media.find((m) => m.type === "youtube")?.id ?? "hphiglctUCw";
  const plateImage = isChinese && activeMeta.plateSrcZh ? activeMeta.plateSrcZh : activeMeta.plateSrc;
  const telemetry = isChinese ? activeMeta.telemetryZh : activeMeta.telemetryEn;

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col justify-between overflow-x-clip px-4 py-5 sm:px-8 lg:min-h-screen lg:px-10 lg:py-6 xl:pl-11 xl:pr-28">
      <Seo
        title={text("Leficious | Game, Level & Technical Designer", "Leficious | 游戏、关卡与技术设计师")}
        description={text(
          "Game and level design portfolio of Leficious: playable puzzle games, action combat prototypes, and 3D environments.",
          "Leficious 的游戏、关卡与技术设计作品集：空间解谜、动作战斗原型与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />

      {/* ==================== 1. ALIGNED VICTORIAN ARCHIVAL HEADER RAIL ==================== */}
      <AtelierHeaderRail
        eyebrow="LEFICIOUS"
        subtitle={text(
          "Game, Level & Technical Designer · USC SCA & Gnomon",
          "游戏、关卡与技术设计师 · 南加大电影学院 & Gnomon",
        )}
        maxWidthClass="max-w-[1380px]"
        rightSlot={
          isReelActive ? (
            <a
              href={
                isChinese
                  ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
                  : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"
              }
              download
              className="brass-plaque inline-flex h-[34px] cursor-pointer items-center gap-1.5 px-4 font-display text-[12px] font-bold tracking-[0.11em] whitespace-nowrap uppercase transition-colors 2xl:px-4.5 2xl:text-[12.5px]"
            >
              <span>{text("Résumé (PDF)", "下载简历")}</span>
              <span aria-hidden="true">↓</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => selectBinder("reel")}
              className="brass-plaque inline-flex h-[34px] cursor-pointer items-center gap-1.5 px-4 font-display text-[12px] font-bold tracking-[0.11em] whitespace-nowrap uppercase transition-colors 2xl:px-4.5 2xl:text-[12.5px]"
            >
              <span aria-hidden="true" className="text-[10px]">▶</span>
              <span>{text("Master Reel", "年度集锦")}</span>
            </button>
          )
        }
      />

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
              style={{
                clipPath:
                  "polygon(7px 0, calc(100% - 7px) 0, 100% 7px, 100% calc(100% - 7px), calc(100% - 7px) 100%, 7px 100%, 0 calc(100% - 7px), 0 7px)",
              }}
              className={`group inline-flex cursor-pointer p-[1.5px] transition-colors ${
                active
                  ? "bg-gradient-to-b from-[#fff2d4] to-[#cfa363]"
                  : "bg-gradient-to-b from-[#dfb97c]/75 to-[#8f6836]/58 hover:from-[#f6deb0] hover:to-[#b58749]"
              }`}
            >
              <span
                style={{
                  clipPath:
                    "polygon(6.12px 0, calc(100% - 6.12px) 0, 100% 6.12px, 100% calc(100% - 6.12px), calc(100% - 6.12px) 100%, 6.12px 100%, 0 calc(100% - 6.12px), 0 6.12px)",
                }}
                className={`inline-flex items-center px-3.5 py-1.5 font-display text-xs font-semibold transition-colors ${
                  active
                    ? "bg-gradient-to-b from-[#fbf3e2] to-[#e6d6b8] text-parchment-ink"
                    : "bg-gradient-to-b from-[#2e1f15] to-[#1c120d] text-[#e2d4be] group-hover:text-[#fbf3e4]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ==================== 2. SPATIALLY LOCKED CASE-DESK STAGE ==================== */}
      <main id="main-content" tabIndex={-1} className="relative my-auto mx-auto w-full max-w-[1380px] py-3 lg:py-4">
        {/* Stage Wrapper — aligns backing case-folders strictly within the vellum sheet's vertical span (zero top slivers or corner tangencies) */}
        <div className="relative">
          {/* Asymmetrically Staggered Victorian Bookbinding Backing Folios w/ Stepped Vellum Page-Edges & Airy Gilt Sigils */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              transform: "translate3d(calc(var(--mx) * -9px), calc(var(--my) * -5px), 0)",
            }}
          >
            {/* Left Backing Case-Folder — Dark Havana Morocco Leather + Cream Vellum Fore-Edge */}
            <button
              type="button"
              onClick={() => selectBinder(leftBgProject.slug)}
              aria-label={`${text("Inspect Folio", "切换至")} ${leftBgMeta.roman}: ${leftBgProject.title}`}
              className="pointer-events-auto group absolute left-0 top-15 bottom-9 flex w-[255px] -rotate-[4.8deg] cursor-pointer flex-col justify-between border border-[#d8b47c]/70 bg-gradient-to-br from-[#342116] via-[#23150d] to-[#140c08] px-3.5 py-4 text-left shadow-[-3px_2px_0_0_#eadcc2,-4px_3px_0_0_#0e0906,-6px_5px_0_0_#c8b28b,-22px_28px_54px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,236,198,0.28)] transition-all duration-300 hover:-translate-x-2.5 hover:-translate-y-1.5 hover:-rotate-[5.8deg] hover:border-[#f5dfb2] xl:left-0.5 xl:w-[275px] xl:px-4 xl:py-4.5 2xl:left-1 2xl:w-[308px] 2xl:px-4.5 2xl:py-5"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  src={leftBgMeta.cinemaThumbSrc}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-12 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-22"
                />
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-[#d8b47c]/28" />

              {/* Dedicated Exposed Outer-Wing Column — guarantees zero tangency with foreground vellum border */}
              <div className="relative z-10 flex h-full w-[100px] flex-col justify-between xl:w-[108px] 2xl:w-[126px]">
                <div>
                  <p className="font-numeral text-[10px] font-bold tracking-[0.22em] text-[#e8c78c]">
                    {text("FOLIO", "卷")} {leftBgMeta.roman}
                  </p>
                  <p className="mt-1 font-display text-[13px] font-semibold leading-snug text-[#f7f0e2] group-hover:text-white 2xl:text-[14.5px]">
                    {leftBgProject.title}
                  </p>
                </div>

                <div className="my-auto flex items-center justify-center py-2">
                  <ProjectSigil
                    slug={leftBgProject.slug}
                    variant="gilt"
                    className="h-[82px] w-[82px] transition-transform duration-300 group-hover:scale-106 xl:h-[90px] xl:w-[90px] 2xl:h-[104px] 2xl:w-[104px]"
                  />
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-numeral text-2xl font-semibold tracking-wider text-[#e8c78c] transition-colors group-hover:text-[#fff6df] xl:text-3xl">
                    {leftBgMeta.roman}
                  </span>
                  <span className="font-numeral text-[10px] tracking-[0.16em] text-[#d6c29f]/80 group-hover:text-[#fff6df]">
                    →
                  </span>
                </div>
              </div>
            </button>

            {/* Right Backing Case-Folder — Deep Venetian Cordovan Morocco + Cream Vellum Fore-Edge */}
            <button
              type="button"
              onClick={() => selectBinder(rightBgProject.slug)}
              aria-label={`${text("Inspect Folio", "切换至")} ${rightBgMeta.roman}: ${rightBgProject.title}`}
              className="pointer-events-auto group absolute right-0 top-19 bottom-6 flex w-[255px] rotate-[3.6deg] cursor-pointer flex-col justify-between border border-[#d8b47c]/70 bg-gradient-to-bl from-[#421515] via-[#2c0d0e] to-[#190708] px-3.5 py-4 text-right shadow-[3px_2px_0_0_#eadcc2,4px_3px_0_0_#0e0906,6px_5px_0_0_#c8b28b,22px_28px_54px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,232,196,0.26)] transition-all duration-300 hover:translate-x-2.5 hover:-translate-y-1.5 hover:rotate-[4.6deg] hover:border-[#f5dfb2] xl:right-0.5 xl:w-[275px] xl:px-4 xl:py-4.5 2xl:right-1 2xl:w-[308px] 2xl:px-4.5 2xl:py-5"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  src={rightBgMeta.cinemaThumbSrc}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-12 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-22"
                />
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-[#d8b47c]/28" />

              {/* Dedicated Exposed Outer-Wing Column — guarantees zero tangency with foreground vellum border */}
              <div className="relative z-10 ml-auto flex h-full w-[100px] flex-col justify-between xl:w-[108px] 2xl:w-[126px]">
                <div>
                  <p className="font-numeral text-[10px] font-bold tracking-[0.22em] text-[#e8c78c]">
                    {text("FOLIO", "卷")} {rightBgMeta.roman}
                  </p>
                  <p className="mt-1 font-display text-[13px] font-semibold leading-snug text-[#f7f0e2] group-hover:text-white 2xl:text-[14.5px]">
                    {rightBgProject.title}
                  </p>
                </div>

                <div className="my-auto flex items-center justify-center py-2">
                  <ProjectSigil
                    slug={rightBgProject.slug}
                    variant="gilt"
                    className="h-[82px] w-[82px] transition-transform duration-300 group-hover:scale-106 xl:h-[90px] xl:w-[90px] 2xl:h-[104px] 2xl:w-[104px]"
                  />
                </div>

                <div className="flex items-baseline justify-end gap-2">
                  <span className="font-numeral text-[10px] tracking-[0.16em] text-[#d6c29f]/80 group-hover:text-[#fff6df]">
                    ←
                  </span>
                  <span className="font-numeral text-2xl font-semibold tracking-wider text-[#e8c78c] transition-colors group-hover:text-[#fff6df] xl:text-3xl">
                    {rightBgMeta.roman}
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Foreground Architecturally Level (0deg) Grand Rag-Vellum Case-Folio */}
          <div
            className="relative z-20 mx-auto w-full lg:max-w-[936px] xl:max-w-[1002px] 2xl:max-w-[1068px]"
            style={{
              transform: "translate3d(calc(var(--mx) * 3.5px), calc(var(--my) * 2.5px), 0)",
            }}
          >
            <div key={activeFolioSlug} className="animate-folio-arc relative">
              <BrassPinThreads animKey={activeFolioSlug} />
              <article className="parchment-sheet relative overflow-hidden border-[5px] border-[#110b07] px-5 pt-8 pb-6 shadow-[0_36px_88px_rgba(0,0,0,0.92),6px_6px_0_-1px_#dfd0b2,8px_8px_0_0_#110b07] sm:px-9 sm:pt-8.5 sm:pb-7">
            <FolioCorners tone="parchment" />

            {isReelActive ? (
              /* ==================== 00 · LANDING TWO-WING MASTER REEL & ATELIER DIRECTORY ==================== */
              (() => {
                const isDesignReel = activeReelKind === "design";
                const primaryReelId = isDesignReel ? "hphiglctUCw" : "t5MchABcd3c";
                const primaryReelThumb = isDesignReel
                  ? "/reels/game-design-reel-2026.webp"
                  : "/reels/environment-props-reel-2026.jpg";
                const primaryReelTitle = isDesignReel
                  ? text("Game, Level & Technical Design Reel", "游戏、关卡与技术设计作品集锦")
                  : text("3D Environment & Props Reel", "3D 环境与道具作品集锦");
                const primaryReelSub = isDesignReel
                  ? text(
                      "Playable puzzle games, action combat prototypes & level design · 2026",
                      "空间解谜、动作战斗原型与关卡设计 · 2026",
                    )
                  : text(
                      "Realtime 3D environments, shaders, stylized foliage & Maya tools · 2026",
                      "实时 3D 场景、材质表现、风格化植被与 Maya 工具 · 2026",
                    );

                const companionThumb = isDesignReel
                  ? "/reels/environment-props-reel-2026.jpg"
                  : "/reels/game-design-reel-2026.webp";
                const companionLabel = isDesignReel
                  ? text("2026 3D Environment & Props Reel", "2026 环境与道具集锦")
                  : text("2026 Game & Level Design Reel", "2026 游戏与关卡设计集锦");

                return (
                  <div className="relative z-10">
                    <header className="text-center">
                      <p className="font-display text-[11.5px] font-bold tracking-[0.26em] text-parchment-muted uppercase">
                        {text("ATELIER SHOWCASE · MMXXVI", "年度实机集锦 · 2026")}
                      </p>
                      <h1 className="mt-0.5 font-display text-3xl font-bold tracking-tight text-parchment-ink sm:text-[36px] sm:leading-[1.08]">
                        {primaryReelTitle}
                      </h1>
                      <p className="mt-0.5 font-display text-[16px] font-medium italic text-rubric sm:text-[17.5px]">
                        {primaryReelSub}
                      </p>
                    </header>

                    <BrassRule ornate tone="parchment" className="my-3.5" />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.16fr_0.84fr] lg:items-stretch lg:gap-6 xl:gap-7">
                      {/* LEFT WING: Primary 2026 Reel Stage + 5 Case-Folio Quick-Open Tickets */}
                      <div className="flex flex-col justify-between gap-3.5">
                        <div className="relative border border-[#5c3f1e] bg-[#0a0806] p-2 shadow-[0_16px_38px_rgba(0,0,0,0.52)]">
                          <BrassCornerClasps sizeClass="h-7 w-7 sm:h-8 sm:w-8" />
                          <div className="relative aspect-video w-full overflow-hidden border border-[#d4ad73]/40 bg-black">
                            {playingVideo ? (
                              <iframe
                                src={`https://www.youtube-nocookie.com/embed/${primaryReelId}?autoplay=1`}
                                title={primaryReelTitle}
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 h-full w-full"
                              />
                            ) : (
                              <button
                                type="button"
                                onClick={() => setPlayingVideo(true)}
                                className="group relative block h-full w-full cursor-pointer text-left"
                                aria-label={`${text("Play", "播放")}: ${primaryReelTitle}`}
                              >
                                <img
                                  src={primaryReelThumb}
                                  alt={primaryReelTitle}
                                  width="1280"
                                  height="720"
                                  loading="eager"
                                  fetchPriority="high"
                                  decoding="async"
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.018]"
                                />
                                <span className="absolute inset-0 bg-gradient-to-t from-black/52 via-transparent to-black/14 transition-opacity group-hover:opacity-72" />
                                <span className="brass-plaque absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 font-display text-xs font-bold tracking-[0.14em] uppercase transition-transform duration-200 group-hover:scale-103 sm:px-5">
                                  <span aria-hidden="true">▶</span>
                                  <span>
                                    {isDesignReel
                                      ? text("Play 2026 Design Reel", "播放 2026 游戏设计集锦")
                                      : text("Play 3D Environment Reel", "播放 3D 环境集锦")}
                                  </span>
                                </span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 5 Single-Row Embossed Case-Folio Index Tickets */}
                        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                          {orderedProjects.map((proj) => {
                            const shortLabel = isChinese
                              ? BOARD_META[proj.slug].tabShortZh
                              : BOARD_META[proj.slug].tabShortEn;
                            return (
                              <button
                                key={proj.slug}
                                type="button"
                                onClick={() => selectBinder(proj.slug)}
                                className="victorian-ticket victorian-ticket-vellum victorian-ticket-vellum-interactive embossed-ticket cursor-pointer bg-[#fcf7eb] px-2 py-2 text-center font-display text-[11.5px] font-bold tracking-[0.03em] whitespace-nowrap text-parchment-ink transition-colors hover:bg-[#15100c] hover:text-[#f7f0e2]"
                              >
                                {shortLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* RIGHT WING: Companion Reel Switcher + Cohesive Ebony-Morocco Doors into Salon Gallery & Dossier */}
                      <div className="flex flex-col justify-between gap-3.5 lg:border-l lg:border-[#6e4c24]/40 lg:pl-6 xl:pl-7">
                        {/* Companion Reel Plate (displays the other 2026 Reel's proper YouTube thumbnail) */}
                        <button
                          type="button"
                          onClick={() => {
                            setPlayingVideo(false);
                            setActiveReelKind(isDesignReel ? "environment" : "design");
                          }}
                          className="embossed-ticket group relative block w-full cursor-pointer border border-[#6e4c24]/70 bg-[#fcf7eb]/85 p-2 text-left transition-colors hover:border-rubric"
                        >
                          <CrimsonStamp className="pointer-events-none absolute right-3.5 -top-3 z-30 h-8.5 w-8.5" />
                          <div className="relative aspect-[16/8.2] w-full overflow-hidden border border-[#6e4c24]/48 bg-[#090705]">
                            <img
                              src={companionThumb}
                              alt={companionLabel}
                              width="640"
                              height="360"
                              loading="eager"
                              decoding="async"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-black/68 via-transparent to-transparent" />
                            <span className="absolute bottom-2 left-2.5 inline-flex items-center gap-1.5 border border-[#e5c489]/70 bg-[#140f0b]/92 px-2.5 py-0.5 font-display text-[11px] font-bold tracking-[0.12em] text-[#f7f0e2] uppercase">
                              <span aria-hidden="true" className="text-[#e8c78c]">⇄</span>
                              {text("Companion Reel", "副卷集锦")}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-baseline justify-between gap-2 px-0.5">
                            <span className="truncate font-display text-[14px] font-bold text-parchment-ink group-hover:text-rubric">
                              {companionLabel}
                            </span>
                            <span className="shrink-0 font-display text-[11px] font-bold tracking-[0.14em] text-rubric uppercase">
                              {text("Load Stage →", "切换播放 →")}
                            </span>
                          </div>
                        </button>

                        {/* Cohesive Museum Ebony-Morocco Doorways into Salon Gallery (29 Plates) & About / Dossier */}
                        <div className="flex flex-col gap-2.5">
                          <Link
                            to={localizedPath("/gallery")}
                            viewTransition
                            className="slate-folio group relative flex items-center justify-between gap-3 border border-[#d8b47c]/62 px-4 py-3 text-left shadow-[3px_3px_0_0_#14100c,0_10px_22px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:border-[#f5dfb2]"
                          >
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-display text-[14px] font-bold tracking-[0.1em] whitespace-nowrap text-[#f7f0e2] uppercase group-hover:text-white">
                                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#e8c78c]" />
                                {text("Gallery · 29 Plates", "作品画廊 · 29 件")}
                              </p>
                              <p className="mt-0.5 truncate font-display text-[13.5px] italic text-[#d6c8b2]">
                                {text(
                                  "3D environments, shaders, character rigs & Maya tools",
                                  "实时 3D 场景、程序化材质、绑定与 Maya 工具",
                                )}
                              </p>
                            </div>
                            <span className="shrink-0 font-display text-base font-bold text-[#e8c78c] transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </Link>

                          <Link
                            to={localizedPath("/about")}
                            viewTransition
                            className="slate-folio group relative flex items-center justify-between gap-3 border border-[#d8b47c]/62 px-4 py-3 text-left shadow-[3px_3px_0_0_#14100c,0_10px_22px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:border-[#f5dfb2]"
                          >
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-display text-[14px] font-bold tracking-[0.1em] whitespace-nowrap text-[#f7f0e2] uppercase group-hover:text-white">
                                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-[#e8c78c]" />
                                {text("About, Dossier & Dispatch", "个人档案、履历与联络信函")}
                              </p>
                              <p className="mt-0.5 truncate font-display text-[13.5px] italic text-[#d6c8b2]">
                                {text(
                                  "USC SCA & Gnomon credentials, direct email & CV",
                                  "南加大与 Gnomon 学术背景、直达信箱与简历",
                                )}
                              </p>
                            </div>
                            <span className="shrink-0 font-display text-base font-bold text-[#e8c78c] transition-transform group-hover:translate-x-1">
                              →
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* ==================== I–V · LOCKED TWO-WING VICTORIAN CASE DIPTYCH ==================== */
              <div className="relative z-10">
                {/* Unified Garamond Case Header — zero inline font collision */}
                <header className="text-center">
                  <p className="font-display text-[11.5px] font-bold tracking-[0.26em] text-parchment-muted uppercase">
                    {text("CASE FOLIO", "作品拆解卷")} {activeMeta.roman} · {activeProject.year}
                  </p>
                  <h1 className="mt-0.5 font-display text-3xl font-bold tracking-tight text-parchment-ink sm:text-[36px] sm:leading-[1.08]">
                    {activeProject.title}
                  </h1>
                  <p className="mt-0.5 font-display text-[16px] font-medium italic text-rubric sm:text-[17.5px]">
                    {isChinese ? activeMeta.subtitleZh : activeMeta.subtitleEn} · {activeProject.role}
                  </p>
                </header>

                {/* Sculpted Chased-Bronze & Venetian Garnet Filigree Divider */}
                <BrassRule ornate tone="parchment" className="my-3.5" />

                {/* Height-Matched 2-Wing Spread */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.14fr_0.86fr] lg:items-stretch lg:gap-6 xl:gap-7">
                  {/* LEFT WING: Brass-Mounted Gameplay Plate + 3-Column Typographic Specification Ledger */}
                  <div className="flex flex-col justify-between gap-3.5">
                    <div className="relative border border-[#5c3f1e] bg-[#0a0806] p-2 shadow-[0_16px_38px_rgba(0,0,0,0.52)]">
                      <BrassCornerClasps sizeClass="h-7 w-7 sm:h-8 sm:w-8" />

                      <div className="relative aspect-video w-full overflow-hidden border border-[#d4ad73]/40 bg-black">
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
                            <span className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-black/18 transition-opacity group-hover:opacity-78" />

                            <span className="brass-plaque absolute bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 font-numeral text-[11px] font-bold tracking-[0.12em] uppercase transition-transform duration-200 group-hover:scale-103 sm:px-4.5">
                              <span aria-hidden="true">▶</span>
                              <span>{text("Play Walkthrough", "播放实机演示")}</span>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 3-Column Typographic Ledger Strip (distinct from clickable buttons) */}
                    <div className="grid grid-cols-1 divide-y divide-[#6e4c24]/28 border-y border-[#6e4c24]/42 bg-[#efe5ce]/55 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                      {telemetry.map((spec) => (
                        <div
                          key={spec}
                          className="flex items-center justify-center gap-1.5 px-2 py-1 text-center sm:py-0.5"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-rubric" />
                          <span className="whitespace-nowrap font-numeral text-[10.5px] font-bold tracking-[0.07em] text-parchment-ink uppercase">
                            {spec}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT WING: Literary Case Summary + Loupe-Inspectable Blueprint + CTAs */}
                  <div className="flex flex-col justify-between gap-4 lg:border-l lg:border-[#684720]/48 lg:pl-6 xl:pl-7">
                    <p
                      className={`text-pretty text-[16.5px] leading-[1.6] text-parchment-ink sm:text-[17.5px] ${
                        isChinese ? "zh-readable" : ""
                      }`}
                    >
                      <FormattedText>{activeProject.summary}</FormattedText>
                    </p>

                    {/* Wax-Sealed Blueprint Plate w/ Interactive 2.35x Brass Optical Magnifying Loupe */}
                    <Link
                      to={localizedPath(`/projects/${activeProject.slug}`)}
                      viewTransition
                      className="embossed-ticket relative block border border-[#684720]/80 bg-parchment-deep/75 p-2.5 transition-colors hover:border-rubric"
                    >
                      <CrimsonStamp className="pointer-events-none absolute right-4 -top-3.5 z-30 h-9 w-9" />

                      <div
                        ref={blueprintBoxRef}
                        onPointerMove={handleBlueprintPointerMove}
                        onPointerLeave={handleBlueprintPointerLeave}
                        className="relative cursor-crosshair overflow-hidden border border-[#684720]/55 bg-[#e4d6b8]"
                      >
                        <img
                          src={plateImage}
                          alt={isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                          width="560"
                          height="320"
                          loading="eager"
                          fetchPriority="high"
                          className={`${
                            activeMeta.plateMode === "ink" ? "ink-engraving" : "daguerreotype-plate"
                          } aspect-[16/9] w-full object-cover`}
                        />

                        {/* Interactive 2.35x Chased-Bronze & Sunlit-Crystal Sepia Optical Loupe */}
                        <div
                          ref={loupeRef}
                          aria-hidden="true"
                          style={{
                            width: `${LOUPE_RADIUS * 2}px`,
                            height: `${LOUPE_RADIUS * 2}px`,
                            borderRadius: "50%",
                            opacity: 0,
                            transform: "translate3d(0px, 0px, 0)",
                            transition: "opacity 150ms ease",
                            boxShadow:
                              "0 14px 30px rgba(18,10,4,0.68), 0 0 0 3px #d4ae73, 0 0 0 5px #22150c, inset 0 0 14px rgba(84,54,22,0.32), inset 0 2px 5px rgba(255,252,242,0.85)",
                          }}
                          className="pointer-events-none absolute left-0 top-0 z-20 hidden overflow-hidden bg-[#f8efdc] lg:block"
                        >
                          <img
                            ref={loupeImgRef}
                            src={plateImage}
                            alt=""
                            className={`max-w-none select-none object-cover ${
                              activeMeta.plateMode === "ink" ? "ink-engraving" : "daguerreotype-plate"
                            }`}
                          />
                          {/* Brass surveyor crosshair & inner bevel ring inside the crystal lens */}
                          <span className="absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-[#8f1616]/28" />
                          <span className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-[#8f1616]/28" />
                          <span
                            style={{ borderRadius: "50%" }}
                            className="absolute inset-1.5 border border-[#b3874c]/55"
                          />
                        </div>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
                        <span className="truncate font-display text-[13px] font-medium italic text-parchment-muted">
                          {isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                        </span>
                        <span className="shrink-0 font-numeral text-[10px] font-bold tracking-[0.14em] text-rubric uppercase">
                          {text("Loupe / Inspect →", "放大镜 / 拆解 →")}
                        </span>
                      </div>
                    </Link>

                    {/* Sharp High-Contrast Architectural CTAs (exact-height single-row pair) */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 sm:flex-nowrap xl:gap-2.5">
                      <Link
                        to={localizedPath(`/projects/${activeProject.slug}`)}
                        viewTransition
                        className="victorian-ticket victorian-ticket-ink inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap bg-[#140d09] px-3.5 py-2.5 font-numeral text-[10.5px] font-bold tracking-[0.08em] text-[#f6eedc] uppercase transition-colors hover:bg-[#2c1e15] 2xl:gap-2 2xl:px-4 2xl:text-xs"
                      >
                        <span>{text("Open Full Folio", "展开完整卷宗")}</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                      {activeProject.externalLink ? (
                        <a
                          href={activeProject.externalLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="victorian-ticket victorian-ticket-heavy embossed-ticket inline-flex items-center justify-center gap-1.5 whitespace-nowrap bg-parchment-deep/65 px-3.5 py-2.5 font-numeral text-[10.5px] font-bold tracking-[0.08em] text-parchment-ink uppercase transition-colors hover:bg-[#140d09] hover:text-[#f6eedc] 2xl:px-4 2xl:text-xs"
                        >
                          <span>{activeProject.externalLink.label}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <Link
                          to={localizedPath("/gallery")}
                          viewTransition
                          className="victorian-ticket victorian-ticket-heavy embossed-ticket inline-flex items-center justify-center gap-1.5 whitespace-nowrap bg-parchment-deep/65 px-3.5 py-2.5 font-numeral text-[10.5px] font-bold tracking-[0.08em] text-parchment-ink uppercase transition-colors hover:bg-[#140d09] hover:text-[#f6eedc] 2xl:px-4 2xl:text-xs"
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
          </div>
        </div>
      </main>

      {/* Bottom Folio & Cartography Hint Bar */}
      <div className="relative z-20 mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <span className="font-numeral text-[10.5px] font-semibold tracking-[0.22em] text-warm uppercase">
          {text("CASE INDEX", "卷宗索引")} {isReelActive ? "00" : activeMeta.roman} / V
        </span>
        <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-rubric" />
        <span className="hidden font-display italic sm:inline">
          {text(
            "Hover blueprint for 2.35× optical loupe · Switch folios via ledger tabs, flanking folios, or ← / →",
            "悬停蓝图启用 2.35× 光学放大镜 · 通过右侧书签、底卷或 ← / → 切换卷宗",
          )}
        </span>
      </div>

      {/* ==================== 3. RIGHT-EDGE ARCHIVAL PAPER SHEAF & DIE-CUT SEPARATOR TABS (Desktop xl+) ==================== */}
      <ArchivalPaperSheaf
        ariaLabel={text("Folio Separator Dividers", "卷宗纸质分隔索引签")}
        topFlag={{
          label: text("Reel", "集锦"),
          active: isReelActive,
          onClick: () => selectBinder("reel"),
        }}
        tabs={ORDERED_SLUGS.map((slug) => ({
          id: slug,
          label: isChinese ? BOARD_META[slug].tabShortZh : BOARD_META[slug].tabShortEn,
          active: activeFolioSlug === slug,
          onClick: () => selectBinder(slug),
        }))}
      />
    </div>
  );
}
