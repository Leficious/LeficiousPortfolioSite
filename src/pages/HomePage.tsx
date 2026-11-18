import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BrassPinThreads, BrassRule, CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { useLanguage } from "../lib/language";
import { localizeProject } from "../lib/localizedContent";
import { projects } from "../lib/projects";

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

/** Crisp mathematical vector emblems etched on the exposed wings of background dark-slate folios */
function SlateFolioEmblem({ kind }: { kind: FolioMeta["emblem"] }) {
  if (kind === "wave") {
    return (
      <svg viewBox="0 0 120 150" aria-hidden="true" className="h-32 w-24 stroke-[#c59a68]/55 transition-colors group-hover:stroke-[#ebd1a3]" fill="none">
        {Array.from({ length: 19 }, (_, i) => {
          const y = 16 + i * 6.5;
          const amp = Math.sin((i / 18) * Math.PI) * (i % 2 === 0 ? 38 : 20);
          return <line key={i} x1={60 - amp} y1={y} x2={60 + amp} y2={y} strokeWidth="1.05" />;
        })}
        <line x1="60" y1="8" x2="60" y2="142" strokeWidth="0.75" opacity="0.65" />
      </svg>
    );
  }
  if (kind === "valkyrie") {
    return (
      <svg viewBox="0 0 120 150" aria-hidden="true" className="h-32 w-24 stroke-[#c59a68]/55 transition-colors group-hover:stroke-[#ebd1a3]" fill="none">
        <line x1="22" y1="128" x2="98" y2="22" strokeWidth="1.25" />
        <polygon points="98,22 87,27 93,34" fill="#c59a68" opacity="0.5" />
        <line x1="98" y1="128" x2="22" y2="22" strokeWidth="1.25" />
        <polygon points="22,22 33,27 27,34" fill="#c59a68" opacity="0.5" />
        <circle cx="60" cy="75" r="32" strokeWidth="0.9" strokeDasharray="4 4" />
        <polygon points="60,36 66,75 60,114 54,75" strokeWidth="0.9" />
      </svg>
    );
  }
  if (kind === "scales") {
    return (
      <svg viewBox="0 0 120 150" aria-hidden="true" className="h-32 w-24 stroke-[#c59a68]/55 transition-colors group-hover:stroke-[#ebd1a3]" fill="none">
        <line x1="60" y1="20" x2="60" y2="128" strokeWidth="1.25" />
        <line x1="22" y1="48" x2="98" y2="38" strokeWidth="1.2" />
        <path d="M22 48 L10 82 H34 Z" strokeWidth="1" />
        <path d="M98 38 L86 72 H110 Z" strokeWidth="1" />
        <line x1="38" y1="128" x2="82" y2="128" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "shrine") {
    return (
      <svg viewBox="0 0 120 150" aria-hidden="true" className="h-32 w-24 stroke-[#c59a68]/55 transition-colors group-hover:stroke-[#ebd1a3]" fill="none">
        <path d="M16 40 Q60 28 104 40" strokeWidth="1.5" />
        <line x1="24" y1="54" x2="96" y2="54" strokeWidth="1.1" />
        <line x1="36" y1="40" x2="32" y2="126" strokeWidth="1.3" />
        <line x1="84" y1="40" x2="88" y2="126" strokeWidth="1.3" />
        <polygon points="60,72 68,84 60,96 52,84" strokeWidth="1.05" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 150" aria-hidden="true" className="h-32 w-24 stroke-[#c59a68]/55 transition-colors group-hover:stroke-[#ebd1a3]" fill="none">
      <circle cx="60" cy="75" r="38" strokeWidth="1.05" />
      <circle cx="60" cy="75" r="24" strokeWidth="0.75" strokeDasharray="3 3" />
      <polygon points="60,26 66,69 106,75 66,81 60,124 54,81 14,75 54,69" strokeWidth="1" />
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
          "Game, level, and technical design atelier of Lefi (Kevin) Shan — playable spatial puzzle worlds, multiphase combat systems, and 3D environments.",
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
      <main id="main-content" tabIndex={-1} className="relative my-auto mx-auto w-full max-w-[1020px] pt-2 lg:pt-4">
        {/* Background Fanned Dark-Slate Folios w/ Exposed Outer Emblems & Cursor Parallax */}
        <div
          className="pointer-events-none absolute inset-x-0 -top-1 hidden h-[440px] md:block"
          style={{
            transform: "translate3d(calc(var(--mx) * -9px), calc(var(--my) * -5px), 0)",
          }}
        >
          {/* Left Angled Background Slate Folio */}
          <button
            type="button"
            onClick={() => selectBinder(leftBgProject.slug)}
            aria-label={`${text("Bring forward", "切换至")} ${leftBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -left-4 top-2 flex h-[370px] w-[48%] -rotate-[6.5deg] cursor-pointer flex-col justify-between rounded-xs p-5 text-left transition-all duration-300 hover:-translate-x-2.5 hover:-translate-y-2 hover:-rotate-[8deg] hover:border-[#dfc092]/55 xl:-left-12"
          >
            <div>
              <p className="font-numeral text-xs tracking-[0.16em] text-foreground/85 transition-colors group-hover:text-[#f2dab0] sm:text-sm">
                {text("FOLIO", "卷")} {leftBgMeta.roman} — {leftBgProject.title.toUpperCase()}
              </p>
              <p className="mt-1 font-display text-xs italic text-muted-foreground">
                {isChinese ? leftBgMeta.subtitleZh : leftBgMeta.subtitleEn}
              </p>
            </div>
            {/* Positioned in exposed left wing so emblem peeks visibly out from behind front parchment */}
            <div className="mb-3 ml-0.5 self-start opacity-85 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100">
              <SlateFolioEmblem kind={leftBgMeta.emblem} />
              <span className="mt-1 block font-numeral text-[9.5px] tracking-[0.22em] text-warm/70 group-hover:text-[#ebd1a3]">
                {text("PULL FOLIO", "抽出卷宗")} ↗
              </span>
            </div>
          </button>

          {/* Right Angled Background Slate Folio */}
          <button
            type="button"
            onClick={() => selectBinder(rightBgProject.slug)}
            aria-label={`${text("Bring forward", "切换至")} ${rightBgProject.title}`}
            className="slate-folio pointer-events-auto group absolute -right-4 top-3 flex h-[370px] w-[48%] rotate-[6deg] cursor-pointer flex-col justify-between rounded-xs p-5 text-right transition-all duration-300 hover:translate-x-2.5 hover:-translate-y-2 hover:rotate-[7.5deg] hover:border-[#dfc092]/55 xl:-right-12"
          >
            <div>
              <p className="font-numeral text-xs tracking-[0.16em] text-foreground/85 transition-colors group-hover:text-[#f2dab0] sm:text-sm">
                {text("FOLIO", "卷")} {rightBgMeta.roman} — {rightBgProject.title.toUpperCase()}
              </p>
              <p className="mt-1 font-display text-xs italic text-muted-foreground">
                {isChinese ? rightBgMeta.subtitleZh : rightBgMeta.subtitleEn}
              </p>
            </div>
            {/* Positioned in exposed right wing so emblem peeks visibly out from behind front parchment */}
            <div className="mb-3 mr-0.5 self-end opacity-85 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100">
              <SlateFolioEmblem kind={rightBgMeta.emblem} />
              <span className="mt-1 block font-numeral text-[9.5px] tracking-[0.22em] text-warm/70 group-hover:text-[#ebd1a3]">
                ↖ {text("PULL FOLIO", "抽出卷宗")}
              </span>
            </div>
          </button>
        </div>

        {/* Machined Brass Pin & Damped Pendulum Suspension Threads */}
        <BrassPinThreads animKey={activeFolioSlug} />

        {/* Front Active Rag-Parchment Folio w/ Subtle Foreground Parallax */}
        <div
          style={{
            transform: "translate3d(calc(var(--mx) * 3.5px), calc(var(--my) * 2.5px), 0)",
          }}
        >
          <article
            key={activeFolioSlug}
            className="parchment-sheet animate-folio-arc relative z-20 mx-auto w-full max-w-[856px] rounded-xs border-[5px] border-[#151821] px-5 py-6 sm:px-9 sm:py-7"
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
            ) : (
              /* ==================== I–V · PROJECT CASE FOLIO ==================== */
              <div className="relative z-10">
                <header className="relative text-center sm:px-14">
                  <CrimsonStamp
                    label={`FOLIO ${activeMeta.roman}`}
                    className="pointer-events-none absolute -top-1.5 right-0 hidden h-12 w-12 opacity-80 sm:block"
                  />
                  {/* Balanced single-line headline across all Folios I-V */}
                  <h1 className="font-display text-xl font-bold tracking-tight text-parchment-ink sm:text-[27px]">
                    <span className="font-numeral text-[0.86em] tracking-wider">
                      {text("FOLIO", "卷")} {activeMeta.roman}
                    </span>{" "}
                    — {activeProject.title.toUpperCase()}
                  </h1>
                  <p className="mt-0.5 font-display text-base italic text-rubric sm:text-[17.5px]">
                    {isChinese ? activeMeta.subtitleZh : activeMeta.subtitleEn} · {activeProject.role} · {activeProject.year}
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
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015]"
                            />
                            <span className="absolute bottom-2 right-2 rounded-xs border border-[#dfc092]/55 bg-[#0e1017]/88 px-2.5 py-1 font-display text-xs font-semibold text-[#f3e7cf] opacity-95 backdrop-blur-xs transition-all group-hover:scale-[1.03] group-hover:bg-[#dfc092] group-hover:text-[#15120e]">
                              ▶ {text("Play w/ Audio", "播放完整视频")}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                    <p
                      className={`mt-3 text-[14.5px] leading-relaxed text-parchment-ink/88 sm:text-[15px] ${
                        isChinese ? "zh-readable" : ""
                      }`}
                    >
                      <FormattedText>{activeProject.summary}</FormattedText>
                    </p>
                  </div>

                  {/* Right Plate: Ink-Engraved Architectural Floorplan / Breakdown */}
                  <Link
                    to={localizedPath(`/projects/${activeProject.slug}`)}
                    viewTransition
                    className="group flex flex-col justify-between rounded-xs border border-[#8c683a]/45 bg-parchment-deep/38 p-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8b2624]/65 hover:shadow-md"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-xs border border-[#8c683a]/35 bg-[#e7dcc4]">
                      <img
                        src={plateImage}
                        alt={isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                        loading="eager"
                        decoding="async"
                        className="ink-engraving h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      {/* Subtle surveyor corner reticles */}
                      <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-[#181513]/40" />
                      <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 border-r border-t border-[#181513]/40" />
                      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l border-[#181513]/40" />
                      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-[#181513]/40" />
                    </div>
                    <div className="mt-2.5 flex items-baseline justify-between gap-2 px-0.5">
                      <span className="font-display text-[13px] italic text-parchment-muted">
                        {isChinese ? activeMeta.plateLabelZh : activeMeta.plateLabelEn}
                      </span>
                      <span className="shrink-0 font-numeral text-[10px] font-bold tracking-wider text-rubric transition-transform group-hover:translate-x-0.5">
                        {text("INSPECT →", "拆解 →")}
                      </span>
                    </div>
                  </Link>
                </div>

                <BrassRule tone="parchment" className="my-4" />

                {/* Folio Footer Actions */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-between">
                  <p className="hidden font-numeral text-[10.5px] tracking-[0.14em] text-parchment-muted uppercase sm:block">
                    {activeProject.tags.join(" · ")}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                      to={localizedPath(`/projects/${activeProject.slug}`)}
                      viewTransition
                      className="inline-flex items-center gap-2 rounded-xs bg-[#181513] px-5 py-2.5 font-display text-sm font-semibold tracking-wide text-[#f4ecdc] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#2c2520]"
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
        </div>
      </main>

      {/* Bottom Master Reel Trigger Pill */}
      <div className="relative z-20 mt-5 flex flex-col items-center justify-center gap-1.5 pb-1">
        <button
          type="button"
          onClick={() =>
            isReelActive ? selectBinder("still-life", false) : selectBinder("reel", true)
          }
          className="cursor-pointer rounded-full border border-warm/55 bg-[#11141d]/90 px-6 py-2 font-display text-sm font-semibold tracking-wide text-[#ece4d4] shadow-[0_6px_20px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-0.5 hover:border-[#dfc092] hover:bg-[#1a1f2d] hover:text-[#f7e7c8]"
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
              className={`group relative flex cursor-pointer items-center justify-center rounded-l-sm border-y border-l py-3.5 transition-all duration-250 active:scale-95 ${
                active
                  ? "w-11.5 -translate-x-0 border-[#8c683a]/70 border-r-[3.5px] border-r-rubric bg-parchment text-rubric shadow-[-10px_6px_22px_rgba(0,0,0,0.52)]"
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
