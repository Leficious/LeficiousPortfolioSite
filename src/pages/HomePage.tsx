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
    cinemaThumbSrc: "/projects/still-life/cover.webp",
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
    cinemaThumbSrc: "/projects/an-echo-has-no-shape/cover.webp",
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
    cinemaThumbSrc: "/projects/starshore/design-layout-01.avif",
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

  const leftBgProject = orderedProjects[(currentProjectIndex + 1) % orderedProjects.length];
  const leftBgMeta = BOARD_META[leftBgProject.slug];
  const rightBgProject = orderedProjects[(currentProjectIndex + orderedProjects.length - 1) % orderedProjects.length];
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
          "Game, level, and technical design atelier of Leficious — playable spatial puzzle worlds, multiphase combat systems, and 3D environments.",
          "Leficious 的游戏、关卡与技术设计作品集：空间解谜、多阶段 Boss 战与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />

      {/* ==================== 1. ALIGNED VICTORIAN ARCHIVAL HEADER RAIL ==================== */}
      <AtelierHeaderRail
        eyebrow="LEFICIOUS"
        subtitle={text(
          "Game, Level & Technical Designer · USC School of Cinematic Arts & Gnomon",
          "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
        )}
        rightSlot={
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
              className={`victorian-ticket cursor-pointer border px-3.5 py-1.5 font-display text-xs font-semibold transition-all ${
                active
                  ? "border-[#8f1616] bg-parchment text-parchment-ink"
                  : "border-warm/40 bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ==================== 2. SPATIALLY LOCKED CASE-DESK STAGE ==================== */}
      <main id="main-content" tabIndex={-1} className="relative my-auto mx-auto w-full max-w-[1380px] py-3 lg:py-4">
        {/* Top Deep-Crimson Wax Seal & Bronze Suspension Cords */}
        <BrassPinThreads animKey={activeFolioSlug} />

        {/* Stage Wrapper — aligns backing case-folders strictly within the vellum sheet's vertical span (zero top slivers or corner tangencies) */}
        <div className="relative">
          {/* Asymmetrically Staggered Victorian Bookbinding Backing Folios w/ Stepped Vellum Page-Edges & Airy Gilt Sigils */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{
              transform: "translate3d(calc(var(--mx) * -9px), calc(var(--my) * -5px), 0)",
            }}
          >
            {/* Left Backing Case-Folder — Burnished Saddle-Cognac Morocco Leather + Cream Vellum Fore-Edge */}
            <button
              type="button"
              onClick={() => selectBinder(leftBgProject.slug)}
              aria-label={`${text("Inspect Folio", "切换至")} ${leftBgMeta.roman}: ${leftBgProject.title}`}
              className="pointer-events-auto group absolute left-0 top-8 bottom-9 flex w-[255px] -rotate-[4.8deg] cursor-pointer flex-col justify-between border-[1.5px] border-[#ebc88d]/85 bg-gradient-to-br from-[#5d3a24] via-[#432818] to-[#2b180e] px-3.5 py-4 text-left shadow-[-3px_2px_0_0_#eadbc0,-4px_3px_0_0_#140d09,-6px_5px_0_0_#cbb58c,-22px_28px_54px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,236,198,0.4)] transition-all duration-300 hover:-translate-x-2.5 hover:-translate-y-1.5 hover:-rotate-[5.8deg] hover:border-[#fff0c8] xl:left-0.5 xl:w-[275px] xl:px-4 xl:py-4.5 2xl:left-1 2xl:w-[308px] 2xl:px-4.5 2xl:py-5"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  src={leftBgMeta.cinemaThumbSrc}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-14 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-26"
                />
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-[#e5c287]/38" />

              {/* Dedicated Exposed Outer-Wing Column — guarantees zero tangency with foreground vellum border */}
              <div className="relative z-10 flex h-full w-[100px] flex-col justify-between xl:w-[108px] 2xl:w-[126px]">
                <div>
                  <p className="font-numeral text-[10px] font-bold tracking-[0.22em] text-[#f0d29c]">
                    {text("FOLIO", "卷")} {leftBgMeta.roman}
                  </p>
                  <p className="mt-1 font-display text-[13px] font-semibold leading-snug text-[#fbf4e6] group-hover:text-white 2xl:text-[14.5px]">
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
                  <span className="font-numeral text-2xl font-semibold tracking-wider text-[#f0d29c] transition-colors group-hover:text-[#fff6df] xl:text-3xl">
                    {leftBgMeta.roman}
                  </span>
                  <span className="font-numeral text-[10px] tracking-[0.16em] text-[#dec292]/80 group-hover:text-[#fff6df]">
                    →
                  </span>
                </div>
              </div>
            </button>

            {/* Right Backing Case-Folder — Venetian Cordovan-Oxblood Bookcloth + Cream Vellum Fore-Edge */}
            <button
              type="button"
              onClick={() => selectBinder(rightBgProject.slug)}
              aria-label={`${text("Inspect Folio", "切换至")} ${rightBgMeta.roman}: ${rightBgProject.title}`}
              className="pointer-events-auto group absolute right-0 top-12 bottom-6 flex w-[255px] rotate-[3.6deg] cursor-pointer flex-col justify-between border-[1.5px] border-[#ebc88d]/85 bg-gradient-to-bl from-[#64221f] via-[#481715] to-[#2c0d0c] px-3.5 py-4 text-right shadow-[3px_2px_0_0_#eadbc0,4px_3px_0_0_#140d09,6px_5px_0_0_#cbb58c,22px_28px_54px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,232,196,0.36)] transition-all duration-300 hover:translate-x-2.5 hover:-translate-y-1.5 hover:rotate-[4.6deg] hover:border-[#fff0c8] xl:right-0.5 xl:w-[275px] xl:px-4 xl:py-4.5 2xl:right-1 2xl:w-[308px] 2xl:px-4.5 2xl:py-5"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <img
                  src={rightBgMeta.cinemaThumbSrc}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover opacity-14 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-26"
                />
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 border border-[#e5c287]/38" />

              {/* Dedicated Exposed Outer-Wing Column — guarantees zero tangency with foreground vellum border */}
              <div className="relative z-10 ml-auto flex h-full w-[100px] flex-col justify-between xl:w-[108px] 2xl:w-[126px]">
                <div>
                  <p className="font-numeral text-[10px] font-bold tracking-[0.22em] text-[#f0d29c]">
                    {text("FOLIO", "卷")} {rightBgMeta.roman}
                  </p>
                  <p className="mt-1 font-display text-[13px] font-semibold leading-snug text-[#fbf4e6] group-hover:text-white 2xl:text-[14.5px]">
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
                  <span className="font-numeral text-[10px] tracking-[0.16em] text-[#dec292]/80 group-hover:text-[#fff6df]">
                    ←
                  </span>
                  <span className="font-numeral text-2xl font-semibold tracking-wider text-[#f0d29c] transition-colors group-hover:text-[#fff6df] xl:text-3xl">
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
          <article
            key={activeFolioSlug}
            className="parchment-sheet animate-folio-arc relative overflow-hidden border-[5px] border-[#110b07] px-5 pt-8 pb-6 shadow-[0_36px_88px_rgba(0,0,0,0.92),6px_6px_0_-1px_#dfd0b2,8px_8px_0_0_#110b07] sm:px-9 sm:pt-8.5 sm:pb-7"
          >
            <FolioCorners tone="parchment" />

            {isReelActive ? (
              /* ==================== 00 · MASTER DESIGN REEL FOLIO ==================== */
              <div className="relative z-10">
                <header className="text-center">
                  <p className="font-numeral text-[11px] font-bold tracking-[0.26em] text-parchment-muted uppercase">
                    {text("ATELIER SHOWCASE · MMXXVI", "年度实机集锦 · 2026")}
                  </p>
                  <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-parchment-ink sm:text-4xl">
                    {text("Game, Level & Technical Design Reel", "游戏、关卡与技术设计作品集锦")}
                  </h1>
                  <p className="mt-1 font-display text-base italic text-rubric sm:text-lg">
                    {text(
                      "Leficious · USC School of Cinematic Arts & Gnomon",
                      "Leficious · 南加州大学电影艺术学院 & Gnomon",
                    )}
                  </p>
                </header>

                <BrassRule ornate tone="parchment" className="my-3.5" />

                <div className="relative border-2 border-[#4d3417] bg-[#0a0705] p-2 shadow-2xl">
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
                        className="victorian-ticket embossed-ticket cursor-pointer border border-[#684720]/80 bg-parchment-deep/85 px-3.5 py-1.5 font-display text-xs font-semibold text-parchment-ink transition-colors hover:bg-[#140d09] hover:text-[#f6eedc]"
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
                    className="victorian-ticket inline-flex items-center gap-2 bg-[#140d09] px-4.5 py-2 font-numeral text-xs font-semibold tracking-[0.12em] text-[#f6eedc] uppercase transition-colors hover:bg-[#2a1d15]"
                  >
                    {text("Download Résumé (PDF)", "下载游戏设计简历")} <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            ) : (
              /* ==================== I–V · LOCKED TWO-WING VICTORIAN CASE DIPTYCH ==================== */
              <div className="relative z-10">
                {/* Centered Victorian Case Header (clean breathing margin above filigree divider) */}
                <header className="text-center">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-parchment-ink sm:text-[31px]">
                    <span className="font-numeral text-[0.86em] tracking-[0.08em]">
                      {text("FOLIO", "卷")} {activeMeta.roman}
                    </span>{" "}
                    — {activeProject.title}
                  </h1>
                  <p className="mt-0.5 font-display text-[15px] font-medium italic text-rubric sm:text-[17px]">
                    {isChinese ? activeMeta.subtitleZh : activeMeta.subtitleEn} · {activeProject.role} · {activeProject.year}
                  </p>
                </header>

                {/* Sculpted Chased-Bronze & Venetian Garnet Filigree Divider */}
                <BrassRule ornate tone="parchment" className="my-3.5" />

                {/* Height-Matched 2-Wing Spread */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.14fr_0.86fr] lg:items-stretch lg:gap-6 xl:gap-7">
                  {/* LEFT WING: Ornate Bronze-Clamped Gameplay Plate + 3 Embossed Telemetry Tickets */}
                  <div className="flex flex-col justify-between gap-3.5">
                    <div className="relative border-2 border-[#4d3417] bg-[#090604] p-2 shadow-[0_16px_38px_rgba(0,0,0,0.52)]">
                      <BrassCornerClasps sizeClass="h-11 w-11 sm:h-13 sm:w-13" />

                      <div className="relative aspect-video w-full overflow-hidden border border-[#c89d62]/48 bg-black">
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

                            <span className="brass-plaque absolute bottom-4 left-10 inline-flex items-center gap-2 px-4 py-2 font-numeral text-[11px] font-bold tracking-[0.12em] uppercase transition-transform duration-200 group-hover:scale-104 sm:bottom-4.5 sm:left-11 sm:px-4.5">
                              <span aria-hidden="true">▶</span>
                              <span>{text("Play Walkthrough", "播放实机演示")}</span>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 3 High-Contrast Embossed Victorian Apothecary Telemetry Tickets */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {telemetry.map((spec) => (
                        <div
                          key={spec}
                          className="victorian-ticket embossed-ticket flex items-center justify-center gap-1.5 border border-[#61411d]/85 bg-parchment-deep/90 px-2 py-2 text-center"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rotate-45 bg-rubric" />
                          <span className="whitespace-nowrap font-numeral text-[9.5px] font-bold tracking-[0.07em] text-parchment-ink uppercase xl:text-[10px]">
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
                        className="victorian-ticket inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap border-2 border-[#140d09] bg-[#140d09] px-3 py-2 font-numeral text-[10.5px] font-bold tracking-[0.08em] text-[#f6eedc] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-colors hover:border-[#2c1e15] hover:bg-[#2c1e15] 2xl:gap-2 2xl:px-4 2xl:py-2.5 2xl:text-xs"
                      >
                        <span>{text("Open Full Folio", "展开完整卷宗")}</span>
                        <span aria-hidden="true">→</span>
                      </Link>

                      {activeProject.externalLink ? (
                        <a
                          href={activeProject.externalLink.url}
                          target="_blank"
                          rel="noreferrer"
                          className="victorian-ticket embossed-ticket inline-flex items-center justify-center gap-1.5 whitespace-nowrap border-2 border-[#140d09] bg-parchment-deep/65 px-3 py-2 font-numeral text-[10.5px] font-bold tracking-[0.08em] text-parchment-ink uppercase transition-colors hover:bg-[#140d09] hover:text-[#f6eedc] 2xl:px-4 2xl:py-2.5 2xl:text-xs"
                        >
                          <span>{activeProject.externalLink.label}</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        <Link
                          to={localizedPath("/gallery")}
                          viewTransition
                          className="victorian-ticket embossed-ticket inline-flex items-center justify-center gap-1.5 whitespace-nowrap border-2 border-[#140d09] bg-parchment-deep/65 px-3 py-2 font-numeral text-[10.5px] font-bold tracking-[0.08em] text-parchment-ink uppercase transition-colors hover:bg-[#140d09] hover:text-[#f6eedc] 2xl:px-4 2xl:py-2.5 2xl:text-xs"
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
