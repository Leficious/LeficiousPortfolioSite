import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrassPinThreads, BrassRule, CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { projects } from "../lib/projects";
import { useLanguage } from "../lib/language";
import { localizeProject } from "../lib/localizedContent";

type FolioMeta = {
  roman: string;
  tabShortEn: string;
  tabShortZh: string;
  subtitleEn: string;
  subtitleZh: string;
  loopSrc: string;
  plateSrc: string;
  plateSrcZh?: string;
  plateLabelEn: string;
  plateLabelZh: string;
  emblem: "scales" | "wave" | "valkyrie" | "compass" | "shrine";
};

const FOLIO_META: Record<string, FolioMeta> = {
  "still-life": {
    roman: "I",
    tabShortEn: "I. Still Life",
    tabShortZh: "I · 静物",
    subtitleEn: "The 235 kg Counterweight Archive",
    subtitleZh: "235 kg 满额配重档案馆",
    loopSrc: "/loops/still-life.mp4",
    plateSrc: "/projects/still-life/map-02-three-story-archive.webp",
    plateSrcZh: "/projects/still-life/map-02-three-story-archive-zh.webp",
    plateLabelEn: "FIG. 02 · Three-Story Archive Orthographic Plan (1F–3F)",
    plateLabelZh: "图 02 · 三层立体档案馆正交动线图 (1F–3F)",
    emblem: "scales",
  },
  "an-echo-has-no-shape": {
    roman: "II",
    tabShortEn: "II. Echo",
    tabShortZh: "II · 回声无形",
    subtitleEn: "Basin of Three Silences",
    subtitleZh: "三重寂静之声波盆地",
    loopSrc: "/loops/echo.mp4",
    plateSrc: "/projects/an-echo-has-no-shape/map-01-world-overview.webp",
    plateSrcZh: "/projects/an-echo-has-no-shape/map-01-world-overview-zh.webp",
    plateLabelEn: "FIG. 01 · 550m Sightless Hub-and-Spoke Basin Topology",
    plateLabelZh: "图 01 · 550m 无 UI 中枢辐射盆地总图",
    emblem: "wave",
  },
  "fallen-valkyrie": {
    roman: "III",
    tabShortEn: "III. Fallen Valkyrie",
    tabShortZh: "III · 堕落女武神",
    subtitleEn: "Multiphase Boss & Stance Combat",
    subtitleZh: "双武器姿态与多阶段 Boss 战",
    loopSrc: "/loops/fallen-valkyrie.mp4",
    plateSrc: "/projects/fallen-valkyrie/ai-statetree-01.avif",
    plateLabelEn: "FIG. 06 · Modular Boss StateTree & Distance Priority Graph",
    plateLabelZh: "图 06 · 模块化 Boss StateTree 决策状态树",
    emblem: "valkyrie",
  },
  starshore: {
    roman: "IV",
    tabShortEn: "IV. Starshore",
    tabShortZh: "IV · 星岸",
    subtitleEn: "Interconnected ARPG Loop",
    subtitleZh: "飞行、索敌与数据驱动玩法循环",
    loopSrc: "/loops/starshore.mp4",
    plateSrc: "/projects/starshore/design-layout-01.avif",
    plateLabelEn: "FIG. 01 · Traversal Space, Soft-Lock Targeting & Vendor Loop",
    plateLabelZh: "图 01 · 核心探索动线与共享数据循环",
    emblem: "compass",
  },
  "sacred-forest": {
    roman: "V",
    tabShortEn: "V. Sacred Forest",
    tabShortZh: "V · 圣域森林",
    subtitleEn: "Stylized Shrine & Normal Tooling",
    subtitleZh: "风格化森林神社与法线工具管线",
    loopSrc: "/loops/sacred-forest.mp4",
    plateSrc: "/projects/sacred-forest/foliage-01.avif",
    plateLabelEn: "FIG. 03 · Foliage Wireframe & Custom Vertex-Normal Tooling",
    plateLabelZh: "图 03 · 植被拓扑卡片与自定义法线工具",
    emblem: "shrine",
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

/** Crisp mathematical vector emblems etched on background dark-slate folios */
function SlateFolioEmblem({ kind }: { kind: FolioMeta["emblem"] }) {
  if (kind === "wave") {
    return (
      <svg viewBox="0 0 200 120" aria-hidden="true" className="h-28 w-44 stroke-[#c59a68]/45" fill="none">
        {Array.from({ length: 29 }, (_, i) => {
          const x = 16 + i * 6;
          const amp = Math.sin((i / 28) * Math.PI) * (i % 2 === 0 ? 44 : 24);
          return <line key={i} x1={x} y1={60 - amp} x2={x} y2={60 + amp} strokeWidth="1" />;
        })}
        <line x1="8" y1="60" x2="192" y2="60" strokeWidth="0.7" opacity="0.6" />
      </svg>
    );
  }
  if (kind === "valkyrie") {
    return (
      <svg viewBox="0 0 180 140" aria-hidden="true" className="h-32 w-40 stroke-[#c59a68]/42" fill="none">
        <line x1="30" y1="125" x2="150" y2="15" strokeWidth="1.2" />
        <polygon points="150,15 138,20 145,27" fill="#c59a68" opacity="0.4" />
        <line x1="150" y1="125" x2="30" y2="15" strokeWidth="1.2" />
        <polygon points="30,15 42,20 35,27" fill="#c59a68" opacity="0.4" />
        <path d="M52 25 C105 45 105 95 52 115" strokeWidth="1.15" />
        <circle cx="90" cy="70" r="34" strokeWidth="0.8" strokeDasharray="4 4" />
      </svg>
    );
  }
  if (kind === "scales") {
    return (
      <svg viewBox="0 0 180 130" aria-hidden="true" className="h-28 w-40 stroke-[#c59a68]/45" fill="none">
        <line x1="90" y1="18" x2="90" y2="112" strokeWidth="1.2" />
        <line x1="36" y1="42" x2="144" y2="34" strokeWidth="1.2" />
        <path d="M36 42 L22 76 H50 Z" strokeWidth="1" />
        <path d="M144 34 L130 68 H158 Z" strokeWidth="1" />
        <line x1="64" y1="112" x2="116" y2="112" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "shrine") {
    return (
      <svg viewBox="0 0 180 130" aria-hidden="true" className="h-28 w-40 stroke-[#c59a68]/45" fill="none">
        <path d="M32 34 Q90 22 148 34" strokeWidth="1.5" />
        <line x1="42" y1="48" x2="138" y2="48" strokeWidth="1.1" />
        <line x1="56" y1="34" x2="52" y2="112" strokeWidth="1.3" />
        <line x1="124" y1="34" x2="128" y2="112" strokeWidth="1.3" />
        <polygon points="90,64 98,74 90,84 82,74" strokeWidth="1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 130" aria-hidden="true" className="h-28 w-36 stroke-[#c59a68]/45" fill="none">
      <circle cx="80" cy="65" r="44" strokeWidth="1" />
      <circle cx="80" cy="65" r="28" strokeWidth="0.75" strokeDasharray="3 3" />
      <polygon points="80,16 86,59 128,65 86,71 80,114 74,71 32,65 74,59" strokeWidth="0.95" />
    </svg>
  );
}

type HomePageProps = {
  activeFolioSlug: string;
  onSelectFolioSlug: (slug: string) => void;
};

export function HomePage({ activeFolioSlug, onSelectFolioSlug }: HomePageProps) {
  const { isChinese, text, localizedPath } = useLanguage();
  const [playingAudioEmbed, setPlayingAudioEmbed] = useState(false);

  const orderedProjects = ORDERED_SLUGS.map((slug) => {
    const found = projects.find((p) => p.slug === slug) ?? projects[0];
    return localizeProject(found, isChinese);
  });

  const isReelActive = activeFolioSlug === "reel";
  const currentProjectIndex = Math.max(
    0,
    orderedProjects.findIndex((p) => p.slug === activeFolioSlug),
  );
  const activeProject = orderedProjects[currentProjectIndex];
  const activeMeta = FOLIO_META[activeProject.slug] ?? FOLIO_META["still-life"];

  // Pick the two neighboring background folios to fan behind on left & right
  const leftBgProject = isReelActive
    ? orderedProjects[1]
    : orderedProjects[(currentProjectIndex + 1) % orderedProjects.length];
  const rightBgProject = isReelActive
    ? orderedProjects[2]
    : orderedProjects[(currentProjectIndex + 2) % orderedProjects.length];
  const leftBgMeta = FOLIO_META[leftBgProject.slug];
  const rightBgMeta = FOLIO_META[rightBgProject.slug];

  const selectBinder = (key: string, autoPlayEmbed = false) => {
    setPlayingAudioEmbed(autoPlayEmbed);
    onSelectFolioSlug(key);
  };

  // Keyboard arrow support for shuffling binder tabs
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
      setPlayingAudioEmbed(false);
      onSelectFolioSlug(ALL_BINDER_KEYS[nextIdx]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeFolioSlug, onSelectFolioSlug]);

  const leadYoutubeId =
    activeProject.media.find((m) => m.type === "youtube")?.id ?? "hphiglctUCw";
  const plateImage =
    isChinese && activeMeta.plateSrcZh ? activeMeta.plateSrcZh : activeMeta.plateSrc;

  return (
    <div className="relative flex min-h-[calc(100vh-56px)] flex-col justify-between overflow-x-clip px-4 py-6 sm:px-8 lg:min-h-screen lg:py-5 lg:pr-14">
      <Seo
        title={text("Leficious | Game, Level & Technical Designer", "Leficious | 游戏、关卡与技术设计师")}
        description={text(
          "Game, level, and technical design atelier of Lefi (Kevin) Shan — playable spatial puzzle architecture, multiphase combat systems, and 3D environments.",
          "单凯飞（Leficious）的游戏、关卡与技术设计作品集：空间解谜、多阶段 Boss 战与风格化 3D 环境。",
        )}
        path={localizedPath("/")}
      />

      {/* Mobile / Tablet Compact Binder Strip (< xl) */}
      <div
        className="mx-auto mb-4 flex w-full max-w-4xl flex-wrap items-center justify-center gap-1.5 xl:hidden"
        role="tablist"
        aria-label={text("Select Atelier Folio", "切换作品卷宗")}
      >
        {ALL_BINDER_KEYS.map((key) => {
          const active = activeFolioSlug === key;
          const label =
            key === "reel"
              ? text("Reel", "集锦")
              : isChinese
                ? FOLIO_META[key].tabShortZh
                : FOLIO_META[key].tabShortEn;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectBinder(key)}
              className={`cursor-pointer rounded-xs border px-3 py-1.5 font-display text-xs font-semibold transition-all ${
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

      {/* Main Center Desk Stage */}
      <main id="main-content" tabIndex={-1} className="relative my-auto mx-auto w-full max-w-[980px] pt-2 lg:pt-4">
        {/* Background Fanned Dark-Slate Folios (Desktop) */}
        <div className="pointer-events-none absolute inset-x-0 -top-2 hidden h-[430px] md:block">
          {/* Left Angled Background Slate Folio */}
          <button
            type="button"
            onClick={() => selectBinder(leftBgProject.slug)}
            aria-label={`${text("Bring forward", "切换至")} ${leftBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -left-5 top-2 flex h-[340px] w-[47%] -rotate-[5.5deg] cursor-pointer flex-col justify-between rounded-xs p-6 text-left transition-transform duration-300 hover:-translate-y-2 hover:-rotate-[4deg]"
          >
            <div>
              <p className="font-numeral text-sm tracking-[0.14em] text-foreground/80 transition-colors group-hover:text-[#dfc092]">
                {text("FOLIO", "卷")} {leftBgMeta.roman} — {leftBgProject.title.toUpperCase()}
              </p>
              <p className="mt-1 font-display text-xs italic text-muted-foreground">
                {isChinese ? leftBgMeta.subtitleZh : leftBgMeta.subtitleEn}
              </p>
            </div>
            <div className="my-auto self-center opacity-80 transition-opacity group-hover:opacity-100">
              <SlateFolioEmblem kind={leftBgMeta.emblem} />
            </div>
          </button>

          {/* Right Angled Background Slate Folio */}
          <button
            type="button"
            onClick={() => selectBinder(rightBgProject.slug)}
            aria-label={`${text("Bring forward", "切换至")} ${rightBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -right-5 top-3 flex h-[340px] w-[47%] rotate-[5deg] cursor-pointer flex-col justify-between rounded-xs p-6 text-right transition-transform duration-300 hover:-translate-y-2 hover:rotate-[3.5deg]"
          >
            <div>
              <p className="font-numeral text-sm tracking-[0.14em] text-foreground/80 transition-colors group-hover:text-[#dfc092]">
                {text("FOLIO", "卷")} {rightBgMeta.roman} — {rightBgProject.title.toUpperCase()}
              </p>
              <p className="mt-1 font-display text-xs italic text-muted-foreground">
                {isChinese ? rightBgMeta.subtitleZh : rightBgMeta.subtitleEn}
              </p>
            </div>
            <div className="my-auto self-center opacity-80 transition-opacity group-hover:opacity-100">
              <SlateFolioEmblem kind={rightBgMeta.emblem} />
            </div>
          </button>
        </div>

        {/* Machined Brass Pin & Taut Suspension Threads */}
        <BrassPinThreads animKey={activeFolioSlug} />

        {/* Front Active Rag-Parchment Folio */}
        <article
          key={activeFolioSlug}
          className="parchment-sheet animate-folio-arc relative z-20 mx-auto w-full max-w-[850px] rounded-xs border-[5px] border-[#151821] px-5 py-6 sm:px-9 sm:py-7"
        >
          <FolioCorners tone="parchment" />

          {isReelActive ? (
            /* ==================== 00 · MASTER REEL FOLIO ==================== */
            <div className="relative z-10">
              <header className="text-center">
                <p className="font-numeral text-[11px] tracking-[0.24em] text-parchment-muted">
                  {text("ATELIER SHOWCASE · 2026", "年度实机集锦 · 2026")}
                </p>
                <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-parchment-ink sm:text-3xl">
                  {text("Game, Level & Technical Design Reel", "游戏、关卡与技术设计作品集锦")}
                </h1>
                <p className="mt-0.5 font-display text-base italic text-rubric sm:text-lg">
                  {text(
                    "Lefi (Kevin) Shan · USC School of Cinematic Arts & Gnomon",
                    "单凯飞 Lefi Shan · 南加州大学电影艺术学院 & Gnomon",
                  )}
                </p>
              </header>

              <div className="mt-4 overflow-hidden rounded-xs border border-[#8c683a]/60 bg-[#0b0d12] p-1.5 shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  {playingAudioEmbed ? (
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
                      onClick={() => setPlayingAudioEmbed(true)}
                      className="group relative block h-full w-full cursor-pointer text-left"
                      aria-label={text("Play full 2026 Game Design Reel with sound", "播放带音效完整 2026 作品集锦")}
                    >
                      <video
                        src="/loops/reel-montage.mp4"
                        poster="/reels/game-design-reel-2026.webp"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/5" />
                      <span className="absolute inset-0 grid place-items-center">
                        <span className="brass-plaque inline-flex items-center gap-2.5 rounded-xs px-5 py-2.5 font-display text-sm font-bold tracking-wide transition-transform group-hover:scale-[1.03]">
                          <span aria-hidden="true">▶</span>
                          {text("Play Full 2026 Reel (Audio)", "播放完整 2026 作品集锦")}
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
                      className="cursor-pointer rounded-xs border border-[#8c683a]/45 bg-parchment-deep/55 px-2.5 py-1 font-display text-xs font-semibold text-parchment-ink transition-colors hover:bg-[#181513] hover:text-[#f4ecdc]"
                    >
                      {FOLIO_META[proj.slug].roman} · {proj.title}
                    </button>
                  ))}
                </div>
                <a
                  href={isChinese ? "/resume/Kevin_Shan_CN_Game_Resume.pdf" : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"}
                  download
                  className="inline-flex items-center gap-2 rounded-xs bg-[#181513] px-4 py-2 font-display text-sm font-semibold text-[#f4ecdc] transition-colors hover:bg-[#2c2622]"
                >
                  {text("Download Résumé (PDF)", "下载游戏设计简历")} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
          ) : (
            /* ==================== I–V · PROJECT CASE FOLIO ==================== */
            <div className="relative z-10">
              <header className="relative text-center sm:px-14">
                <CrimsonStamp
                  label={`FOLIO ${activeMeta.roman}`}
                  className="pointer-events-none absolute -top-1.5 right-0 hidden h-12 w-12 opacity-80 sm:block"
                />
                <h1 className="font-display text-xl font-bold tracking-tight text-parchment-ink sm:text-[26px]">
                  <span className="font-numeral text-[0.88em] tracking-wider">
                    {text("FOLIO", "卷")} {activeMeta.roman}
                  </span>{" "}
                  — {activeProject.title.toUpperCase()}
                  <span className="hidden font-normal text-parchment-muted md:inline">
                    {" "}
                    · {isChinese ? activeMeta.subtitleZh : activeMeta.subtitleEn}
                  </span>
                </h1>
                <p className="mt-0.5 font-display text-base italic text-rubric sm:text-[17px]">
                  {activeProject.role} · {activeProject.tags[0]} · {activeProject.year}
                </p>
              </header>

              {/* Dual-Plate Spread: Left = Live Engine Loop, Right = Inked Architectural Cutaway */}
              <div className="mt-4 grid gap-4 md:grid-cols-[1.06fr_0.94fr] md:items-stretch">
                {/* Left Plate: Live Moving Gameplay Window */}
                <div className="flex flex-col justify-between">
                  <div className="overflow-hidden rounded-xs border border-[#735329]/55 bg-[#0c0e13] p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
                    <div className="relative aspect-video w-full overflow-hidden bg-black">
                      {playingAudioEmbed ? (
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
                          onClick={() => setPlayingAudioEmbed(true)}
                          className="group relative block h-full w-full cursor-pointer text-left"
                          aria-label={`${text("Play trailer with audio", "播放有声演示")}: ${activeProject.title}`}
                        >
                          <video
                            key={activeMeta.loopSrc}
                            src={activeMeta.loopSrc}
                            poster={activeProject.heroImage ?? activeProject.cover}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-2 right-2 rounded-xs border border-[#dfc092]/50 bg-[#0e1017]/85 px-2.5 py-1 font-display text-xs font-semibold text-[#f3e7cf] opacity-90 backdrop-blur-xs transition-colors group-hover:bg-[#dfc092] group-hover:text-[#15120e]">
                            ▶ {text("Play w/ Audio", "播放完整视频")}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className={`mt-3 text-xs leading-relaxed text-parchment-muted sm:text-[13.5px] ${isChinese ? "zh-readable" : ""}`}>
                    <FormattedText>{activeProject.summary}</FormattedText>
                  </p>
                </div>

                {/* Right Plate: Ink-Engraved Architectural Floorplan / Breakdown */}
                <Link
                  to={localizedPath(`/projects/${activeProject.slug}`)}
                  viewTransition
                  className="group flex flex-col justify-between rounded-xs border border-[#8c683a]/40 bg-parchment-deep/35 p-2.5 transition-colors hover:border-[#8b2624]/60"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xs border border-[#8c683a]/30 bg-[#e7dcc4]">
                    <img
                      src={plateImage}
                      alt={isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                      loading="eager"
                      decoding="async"
                      className="ink-engraving h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-2.5 flex items-baseline justify-between gap-2 px-0.5">
                    <span className="font-display text-xs italic text-parchment-muted">
                      {isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] text-rubric opacity-85 group-hover:opacity-100">
                      {text("Inspect →", "拆解 →")}
                    </span>
                  </div>
                </Link>
              </div>

              <BrassRule tone="parchment" className="my-4" />

              {/* Folio Footer Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
                <p className="hidden text-xs text-parchment-muted sm:block">
                  {activeProject.tags.join(" · ")}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to={localizedPath(`/projects/${activeProject.slug}`)}
                    viewTransition
                    className="inline-flex items-center gap-2 rounded-xs bg-[#181513] px-5 py-2.5 font-display text-sm font-semibold tracking-wide text-[#f4ecdc] shadow-sm transition-colors hover:bg-[#2c2520]"
                  >
                    {text("Open Full Folio", "展开完整卷宗")} <span aria-hidden="true">→</span>
                  </Link>
                  {activeProject.externalLink ? (
                    <a
                      href={activeProject.externalLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xs border border-[#181513]/65 bg-transparent px-4 py-2.5 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513]/8"
                    >
                      {activeProject.externalLink.label} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <Link
                      to={localizedPath(`/gallery`)}
                      viewTransition
                      className="inline-flex items-center gap-1.5 rounded-xs border border-[#181513]/65 bg-transparent px-4 py-2.5 font-display text-sm font-semibold text-parchment-ink transition-colors hover:bg-[#181513]/8"
                    >
                      {text("View in Atelier Gallery", "查看画廊组图")} <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Bottom Master Reel Trigger Pill */}
      <div className="relative z-20 mt-5 flex flex-col items-center justify-center gap-1.5 pb-1">
        <button
          type="button"
          onClick={() =>
            isReelActive ? selectBinder("still-life", false) : selectBinder("reel", true)
          }
          className="cursor-pointer rounded-full border border-warm/55 bg-[#11141d]/90 px-6 py-2 font-display text-sm font-semibold tracking-wide text-[#ece4d4] shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-all hover:border-[#dfc092] hover:bg-[#1a1f2d] hover:text-[#f7e7c8]"
        >
          {isReelActive ? (
            <>← {text("Return to Case Folios (I–V)", "返回作品卷宗 (I–V)")}</>
          ) : (
            <>
              <span aria-hidden="true" className="mr-2 text-warm">▶</span>
              {text("Watch 2026 Game Design Reel", "观看 2026 游戏设计作品集锦")}
            </>
          )}
        </button>
      </div>

      {/* Right-Edge Physical Stepped Binder Tabs (Desktop xl+) */}
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
                ? FOLIO_META[key].tabShortZh
                : FOLIO_META[key].tabShortEn;

          return (
            <button
              key={key}
              type="button"
              onClick={() => selectBinder(key)}
              aria-current={active ? "true" : undefined}
              className={`group relative flex cursor-pointer items-center justify-center rounded-l-sm border-y border-l py-3.5 transition-all duration-250 ${
                active
                  ? "w-11 -translate-x-0 border-[#8c683a]/60 border-r-[3px] border-r-rubric bg-parchment text-rubric shadow-[-8px_6px_20px_rgba(0,0,0,0.48)]"
                  : "w-9 translate-x-0.5 border-warm/25 bg-[#c8bca4] text-[#241f19] opacity-85 shadow-[-4px_4px_12px_rgba(0,0,0,0.35)] hover:w-10 hover:bg-[#dfd4be] hover:opacity-100"
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
