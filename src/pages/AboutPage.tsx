import { useEffect, useRef, useState } from "react";
import {
  ArchivalPaperSheaf,
  BrassCornerClasps,
  BrassPinThreads,
  BrassRule,
  CrimsonStamp,
  FolioCorners,
} from "../components/AtelierChrome";
import { B04Crest } from "../components/BrandMark";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { useLanguage } from "../lib/language";

type CallingCardKind = "linkedin" | "itch" | "github";

const callingCards: {
  id: CallingCardKind;
  label: string;
  labelZh: string;
  sublabel: string;
  sublabelZh: string;
  href: string;
  surfaceClass: string;
}[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    labelZh: "LinkedIn",
    sublabel: "in/leficious",
    sublabelZh: "职业履历档案",
    href: "https://www.linkedin.com/in/leficious/",
    surfaceClass:
      "bg-gradient-to-br from-[#382317] via-[#23150d] to-[#120b07] shadow-[3px_3px_0_-1px_#e8dcc2,5px_5px_0_0_#0c0907,0_18px_38px_rgba(0,0,0,0.88)]",
  },
  {
    id: "itch",
    label: "itch.io",
    labelZh: "itch.io",
    sublabel: "5 Playable Builds",
    sublabelZh: "5 款实机试玩",
    href: "https://leficious.itch.io/",
    surfaceClass:
      "bg-gradient-to-br from-[#4f181a] via-[#330f11] to-[#190708] shadow-[3px_3px_0_-1px_#e8dcc2,5px_5px_0_0_#0c0907,0_18px_38px_rgba(0,0,0,0.88)]",
  },
  {
    id: "github",
    label: "GitHub",
    labelZh: "GitHub",
    sublabel: "@Leficious",
    sublabelZh: "开源工具与源码",
    href: "https://github.com/Leficious",
    surfaceClass:
      "bg-gradient-to-br from-[#231c16] via-[#16110d] to-[#0c0907] shadow-[3px_3px_0_-1px_#e8dcc2,5px_5px_0_0_#0c0907,0_18px_38px_rgba(0,0,0,0.88)]",
  },
];

const craftStackChips: { en: string; zh: string }[] = [
  { en: "Unreal Engine 5", zh: "Unreal Engine 5" },
  { en: "Blueprints · GAS · StateTree", zh: "Blueprints · GAS · StateTree" },
  { en: "Unity 6", zh: "Unity 6" },
  { en: "Combat · 3C · Level Design", zh: "战斗 · 3C · 关卡设计" },
  { en: "Maya · ZBrush · Substance", zh: "Maya · ZBrush · Substance" },
  { en: "Python · Maya API", zh: "Python · Maya 工具" },
];

type OutsideIconKind = "strings" | "blade" | "astral";

const outsideDisciplines: {
  roman: string;
  icon: OutsideIconKind;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
}[] = [
  {
    roman: "I",
    icon: "strings",
    title: "Piano & Cello",
    titleZh: "钢琴与大提琴",
    description:
      "Played piano and cello for about fifteen years in orchestras and small chamber groups.",
    descriptionZh: "练了约十五年钢琴和大提琴，参加过管弦乐团与室内乐合奏。",
  },
  {
    roman: "II",
    icon: "blade",
    title: "Skating & Dance",
    titleZh: "花样滑冰与舞蹈",
    description:
      "Trained in competitive figure skating alongside ballet and ballroom dance.",
    descriptionZh: "长期学习竞技花样滑冰、芭蕾与国标舞。",
  },
  {
    roman: "III",
    icon: "astral",
    title: "Favorites",
    titleZh: "常玩与偏爱",
    description:
      "Zenless Zone Zero, Fire Emblem Fates: Conquest, Arknights, René Magritte, Dostoevsky, and Shin Sekai Yori.",
    descriptionZh:
      "《绝区零》《火焰之纹章 if：暗夜王国》《明日方舟》、马格利特、陀思妥耶夫斯基与《来自新世界》。",
  },
];

function OutsideMiniSigil({ kind }: { kind: OutsideIconKind }) {
  if (kind === "strings") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4.5 w-4.5 shrink-0">
        <path
          d="M12 2.5 L14.2 6.2 L12 8.4 L9.8 6.2 Z"
          fill="#8a181a"
        />
        <path
          d="M12 8.2 V21.5 M8.5 5.5 C6.8 8.2 6.8 15.8 8.5 18.5 M15.5 5.5 C17.2 8.2 17.2 15.8 15.5 18.5 M7.2 12 H16.8"
          stroke="#4b3520"
          strokeWidth="1.35"
          strokeLinecap="square"
        />
      </svg>
    );
  }
  if (kind === "blade") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4.5 w-4.5 shrink-0">
        <path
          d="M4 17.5 C8.5 17.5 15.5 16.8 19.5 13.2 C20.8 12 20.6 10.2 19.2 9.6"
          stroke="#4b3520"
          strokeWidth="1.45"
          strokeLinecap="square"
        />
        <path d="M7.5 17.2 L9.5 10.5 L15 11.8 L14 16.6" stroke="#4b3520" strokeWidth="1.3" />
        <path d="M12 4 L13.6 6.8 L12 9.6 L10.4 6.8 Z" fill="#8a181a" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4.5 w-4.5 shrink-0">
      <rect
        x="5.2"
        y="5.2"
        width="13.6"
        height="13.6"
        transform="rotate(45 12 12)"
        stroke="#4b3520"
        strokeWidth="1.2"
      />
      <path
        d="M12 3.2 L13.9 10.1 L20.8 12 L13.9 13.9 L12 20.8 L10.1 13.9 L3.2 12 L10.1 10.1 Z"
        fill="#8a181a"
      />
    </svg>
  );
}

function CallingCardEmblem({ kind }: { kind: CallingCardKind }) {
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className="h-6 w-6">
        <rect
          x="5.5"
          y="5.5"
          width="17"
          height="17"
          transform="rotate(45 14 14)"
          stroke="#d4ad73"
          strokeOpacity="0.65"
          strokeWidth="1.15"
        />
        <path d="M10.2 11.8 V18.2 M10.2 9.3 V9.5" stroke="#f5ebd6" strokeWidth="1.75" strokeLinecap="square" />
        <path
          d="M13.6 18.2 V12.2 H15.8 C17.1 12.2 17.8 12.9 17.8 14.2 V18.2"
          stroke="#f5ebd6"
          strokeWidth="1.65"
          strokeLinecap="square"
        />
        <circle cx="10.2" cy="9.2" r="1.25" fill="#be2024" />
      </svg>
    );
  }
  if (kind === "itch") {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className="h-6 w-6">
        <rect
          x="5.5"
          y="5.5"
          width="17"
          height="17"
          transform="rotate(45 14 14)"
          stroke="#ebd09e"
          strokeOpacity="0.72"
          strokeWidth="1.15"
        />
        <path d="M11.6 9.8 L18.8 14 L11.6 18.2 Z" fill="#f5ebd6" />
        <path d="M13.2 12.5 L15.8 14 L13.2 15.5 Z" fill="#be2024" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" className="h-6 w-6">
      <rect
        x="5.5"
        y="5.5"
        width="17"
        height="17"
        transform="rotate(45 14 14)"
        stroke="#d4ad73"
        strokeOpacity="0.65"
        strokeWidth="1.15"
      />
      <path d="M11 9.8 V18.2 M11 14.2 C14.2 14.2 17 13 17 10.6" stroke="#f5ebd6" strokeWidth="1.55" />
      <circle cx="11" cy="9.8" r="1.55" fill="#f5ebd6" />
      <circle cx="11" cy="18.2" r="1.55" fill="#f5ebd6" />
      <circle cx="17" cy="10.6" r="1.65" fill="#be2024" />
    </svg>
  );
}

export function AboutPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [stampSeq, setStampSeq] = useState(0);
  const [activeSection, setActiveSection] = useState<"dossier" | "credentials" | "contact">("dossier");
  const emailRef = useRef<HTMLSpanElement>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const contactEl = document.getElementById("contact");
      const credEl = document.getElementById("credentials");
      if (contactEl && contactEl.getBoundingClientRect().top <= 260) {
        setActiveSection("contact");
      } else if (credEl && credEl.getBoundingClientRect().top <= 220 && window.scrollY > 80) {
        setActiveSection("credentials");
      } else {
        setActiveSection("dossier");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    };
  }, []);

  const jumpTo = (id: "dossier" | "credentials" | "contact") => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyEmail = async () => {
    setStampSeq((s) => s + 1);
    try {
      await navigator.clipboard.writeText("leficious@gmail.com");
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2600);
    } catch {
      if (!emailRef.current) return;
      const range = document.createRange();
      range.selectNodeContents(emailRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  const resumeHref = isChinese
    ? "/resume/Kevin_Shan_CN_Game_Resume.pdf"
    : "/resume/Leficious_Technical_Game_Designer_Resume.pdf";
  const artResumeHref = "/resume/Leficious_3D_Environment_Artist_Resume.pdf";

  return (
    <div className="min-h-screen overflow-x-clip px-4 pb-5 text-foreground sm:px-8 lg:px-10 lg:pb-6 xl:pl-11 xl:pr-28">
      <Seo
        title={text("Lefi Shan | Dossier & Correspondence", "单凯飞 · Lefi Shan | 个人档案与信函")}
        description={text(
          "About Lefi (Kevin) Shan, M.S. Game Design and Development student at USC School of Cinematic Arts.",
          "关于单凯飞（Lefi Shan）：南加州大学电影艺术学院游戏设计与开发硕士在读。",
        )}
        path={localizedPath("/about")}
      />

      <main id="main-content" tabIndex={-1} className="mx-auto mt-5 max-w-[1260px] pb-14 lg:mt-6">
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[1.16fr_0.84fr] lg:gap-10">
          {/* ==================== LEFT: 2-PLANE PARALLAX BIOGRAPHICAL DOSSIER ==================== */}
          <div id="dossier" className="atelier-entrance-sheet relative scroll-mt-16">
            {/* Angled Backing Cordovan & Morocco Archive Sleeve (Opposite-Vector Cursor Parallax) */}
            <div
              aria-hidden="true"
              style={{
                transform: "translate3d(calc(var(--mx) * -9px), calc(var(--my) * -5px), 0)",
              }}
              className="pointer-events-none absolute top-14 -left-3.5 bottom-4 z-0 hidden w-[96%] lg:block"
            >
              <div className="h-full w-full -rotate-[2.1deg] border border-[#e5c489]/65 bg-gradient-to-br from-[#471618] via-[#2c0e10] to-[#160708] shadow-[-3px_2px_0_0_#efe2c8,-5px_4px_0_0_#0e0906,-7px_6px_0_0_#cbb48d,-22px_28px_52px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,238,202,0.34)]">
                <span className="absolute inset-2 border border-[#e5c489]/35" />
                <span
                  style={{ writingMode: "vertical-rl" }}
                  className="absolute top-8 left-2 font-numeral text-[10.5px] font-bold tracking-[0.22em] text-[#e8c78c]/78 uppercase"
                >
                  {text("ARCHIVE DOSSIER · LS-26", "馆藏履历卷宗 · LS-26")}
                </span>
              </div>
            </div>

            {/* Foreground Rag-Vellum Biographical Sheet */}
            <div
              className="relative z-10"
              style={{
                transform: "translate3d(calc(var(--mx) * 3px), calc(var(--my) * 2px), 0)",
              }}
            >
              <BrassPinThreads animKey="about-dossier" />

              <article className="parchment-sheet relative overflow-hidden border-[5px] border-[#110b07] px-6 pt-8 pb-7 shadow-[0_36px_88px_rgba(0,0,0,0.92),6px_6px_0_-1px_#dfd0b2,8px_8px_0_0_#110b07] sm:px-9 sm:pt-9 sm:pb-8">
                <FolioCorners tone="parchment" />

                {/* Subtle Intaglio B-04 Crest Watermark Stamped into Upper-Right Vellum */}
                <B04Crest
                  tone="vellum"
                  interactive={false}
                  className="pointer-events-none absolute -top-5 -right-5 h-48 w-48 opacity-[0.075] sm:h-56 sm:w-56"
                />

                <div className="relative z-10">
                  <div className="grid gap-6 sm:grid-cols-[206px_1fr] sm:items-start sm:gap-7">
                    {/* Tactile Silver-Gelatin Darkroom Portrait Plate */}
                    <figure className="mx-auto w-full max-w-[214px] sm:mx-0">
                      <div
                        onPointerMove={(e) => handleTactileCardMove(e, 4.2)}
                        onPointerLeave={resetTactileCard}
                        className="tactile-tilt group/portrait relative border border-[#5c3f1e] bg-[#0a0806] p-1.5 shadow-[0_16px_34px_rgba(0,0,0,0.58),3px_3px_0_0_#dfd0b2,4px_4px_0_0_#2b1d10]"
                      >
                        <BrassCornerClasps sizeClass="h-6.5 w-6.5" />
                        <div className="relative overflow-hidden bg-[#080605]">
                          <img
                            src="/about/lefi-shan-portrait.webp"
                            alt={text("Portrait of Lefi Shan", "单凯飞（Kevin Shan）肖像")}
                            width="1000"
                            height="1000"
                            className="aspect-[4/5] w-full object-cover object-center contrast-[1.03] transition-[transform,filter] duration-500 group-hover/portrait:scale-[1.028] group-hover/portrait:contrast-[1.08]"
                          />
                          {/* Cursor-Tracked Silver-Gelatin Darkroom Glass Sheen */}
                          <span
                            aria-hidden="true"
                            style={{
                              background:
                                "radial-gradient(190px circle at var(--glint-x, 50%) var(--glint-y, 35%), rgba(255,244,220,0.22), transparent 68%)",
                            }}
                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/portrait:opacity-100"
                          />
                          {/* Bottom Specimen Register Micro-Strip */}
                          <div className="flex items-center justify-between border-t border-[#d4ad73]/32 bg-[#0d0a08]/92 px-2.5 py-1">
                            <span className="font-numeral text-[10.5px] font-bold tracking-[0.18em] text-[#e8c78c] uppercase">
                              {text("PLATE 00", "肖像 00")}
                            </span>
                            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#be2024]" />
                            <span className="font-numeral text-[10.5px] tracking-[0.14em] text-[#d8cab2]/85 uppercase">
                              {text("LOS ANGELES", "洛杉矶")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <figcaption className="mt-2 text-center font-display text-[13.5px] italic text-parchment-muted">
                        {text("Lefi (Kevin) Shan · Little Tokyo, LA", "单凯飞（Kevin Shan）· 洛杉矶")}
                      </figcaption>
                    </figure>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 font-numeral text-[11.5px] font-bold tracking-[0.18em] text-parchment-muted uppercase">
                        <span className="text-rubric">{text("DOSSIER · LS-26", "个人卷宗 · LS-26")}</span>
                        <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-rubric" />
                        <span>{text("VANCOUVER → LITTLE TOKYO, LA", "温哥华 → 洛杉矶")}</span>
                      </div>

                      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-parchment-ink sm:text-[45px] sm:leading-[1.05]">
                        {text("Lefi Shan", "单凯飞 · Lefi Shan")}
                      </h1>
                      <p className="mt-1.5 font-display text-[17px] font-semibold italic text-rubric sm:text-[18.5px]">
                        {text(
                          "Game, Level & Technical Designer · USC SCA & Gnomon",
                          "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
                        )}
                      </p>

                      <div
                        className={`mt-3.5 space-y-3 text-pretty text-[17.5px] leading-[1.62] text-parchment-ink sm:text-[18px] ${
                          isChinese ? "zh-readable" : ""
                        }`}
                      >
                        <p>
                          {text(
                            "I grew up around Vancouver and moved to Los Angeles to study 3D art at Gnomon. Halfway through making environments and props, I realized I cared a lot more about what a player actually does in a space than how it looks in a still render, so I moved into game design.",
                            "我在温哥华长大，后来搬到洛杉矶，在 Gnomon 学 3D 美术。做场景和道具做到一半，我发现比起一张静态渲染图好不好看，我其实更在意玩家走进空间之后能做什么，于是转向了游戏设计。",
                          )}
                        </p>
                        <p>
                          {text(
                            "I'm now in the M.S. Game Design program at USC. Most of my projects are action combat prototypes or puzzle games, and the part I enjoy most is getting the mechanics and the presentation to pull in the same direction.",
                            "现在我在南加大（USC）读游戏设计硕士。平时做得最多的是动作战斗原型和解谜游戏，我最喜欢琢磨的，是怎么让玩法机制和视听表现往同一个方向使劲。",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <BrassRule ornate tone="parchment" className="my-5" />

                  {/* Outside of Games: Interactive Victorian Ledger Rows w/ Custom Stencil Mini-Sigils */}
                  <section aria-labelledby="outside-engine-heading">
                    <div className="flex items-center justify-between gap-3">
                      <h2
                        id="outside-engine-heading"
                        className="font-display text-xl font-bold tracking-tight text-parchment-ink sm:text-[22px]"
                      >
                        {text("Outside of Games", "游戏之外")}
                      </h2>
                      <span className="font-numeral text-[11px] font-bold tracking-[0.18em] text-parchment-muted/85 uppercase">
                        {text("PERSONAL LEDGER · I - III", "个人侧写 · I - III")}
                      </span>
                    </div>

                    <div className="mt-2.5 divide-y divide-[#684720]/38 border-y border-[#684720]/45">
                      {outsideDisciplines.map((item) => (
                        <div
                          key={item.roman}
                          className="group/row relative grid gap-1.5 px-2.5 py-2.5 transition-colors duration-200 hover:bg-[#684720]/[0.06] sm:grid-cols-[204px_1fr] sm:items-center sm:gap-5"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-1.5 left-0 w-[2.5px] origin-center scale-y-0 bg-rubric transition-transform duration-200 group-hover/row:scale-y-100"
                          />
                          <h3 className="flex items-center gap-2 font-display text-[17px] font-bold text-parchment-ink">
                            <span className="transition-transform duration-200 group-hover/row:scale-110 group-hover/row:-rotate-6">
                              <OutsideMiniSigil kind={item.icon} />
                            </span>
                            <span>
                              <span className="mr-1 font-numeral text-[13.5px] font-bold text-rubric">
                                {item.roman}
                              </span>
                              · {isChinese ? item.titleZh : item.title}
                            </span>
                          </h3>
                          <p
                            className={`text-[16.5px] leading-[1.5] text-parchment-muted transition-colors duration-200 group-hover/row:text-parchment-ink ${
                              isChinese ? "zh-readable" : ""
                            }`}
                          >
                            <FormattedText>{isChinese ? item.descriptionZh : item.description}</FormattedText>
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </article>
            </div>
          </div>

          {/* ==================== RIGHT: HOROLOGICAL GUILD PLAQUE & CALLING-CARD TRAY ==================== */}
          <div
            className="flex flex-col gap-4 lg:pt-5"
            style={{
              transform: "translate3d(calc(var(--mx) * 5px), calc(var(--my) * 3px), 0)",
            }}
          >
            {/* 1. Academic & Guild Credentials + Scannable Craft & Engine Matrix */}
            <section
              id="credentials"
              aria-labelledby="credentials-heading"
              onPointerMove={(e) => handleTactileCardMove(e, 1.8)}
              onPointerLeave={resetTactileCard}
              className="slate-folio tactile-tilt animate-folio-arc group relative scroll-mt-20 border border-[#d8b47c]/62 px-5 pt-4.5 pb-5 shadow-[4px_4px_0_0_#e8dcc2,5px_5px_0_0_#0e0906,7px_7px_0_0_#c8b28b,0_26px_58px_rgba(0,0,0,0.92)] sm:px-6"
            >
              <FolioCorners tone="slate" inset="inset-2" sizeClass="h-5.5 w-5.5" />

              <div className="relative z-10">
                {/* Crest-Crowned Header */}
                <div className="flex items-center justify-between gap-3 border-b border-warm/28 pb-3">
                  <div className="flex items-center gap-2.5">
                    <B04Crest
                      tone="gilt"
                      compact
                      interactive
                      detentStep={stampSeq}
                      className="h-10 w-10"
                    />
                    <div>
                      <h2
                        id="credentials-heading"
                        className="font-numeral text-[12.5px] font-bold tracking-[0.19em] text-[#e8c78c] uppercase"
                      >
                        {text("Academic & Guild Credentials", "学术履历与技术栈")}
                      </h2>
                      <p className="font-display text-[14px] italic text-muted-foreground">
                        {text("Degrees, Core Engines & Eligibility", "学位背景、核心引擎与工作地区")}
                      </p>
                    </div>
                  </div>
                  <span className="hidden border border-warm/38 bg-[#0b0806]/80 px-2 py-0.5 font-numeral text-[11px] font-bold tracking-[0.16em] text-[#ebd09e] uppercase sm:inline-block">
                    {text("CPT / OPT", "实习 / 全职")}
                  </span>
                </div>

                {/* Structured Degree Rows */}
                <div className="divide-y divide-warm/18 border-b border-warm/28">
                  <div className="flex items-baseline justify-between gap-3 py-2.5">
                    <div>
                      <p className="font-display text-[17.5px] font-semibold leading-snug text-foreground">
                        {text("M.S. in Game Design & Development", "游戏设计与开发理学硕士（在读）")}
                      </p>
                      <p className="text-[15px] italic text-muted-foreground">
                        {text("USC School of Cinematic Arts", "南加州大学电影艺术学院 (USC SCA)")}
                      </p>
                    </div>
                    <span className="shrink-0 font-numeral text-[12.5px] font-bold tracking-[0.14em] text-[#e8c78c]">
                      2028
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-3 py-2.5">
                    <div>
                      <p className="font-display text-[17.5px] font-semibold leading-snug text-foreground">
                        {text("B.F.A. in Digital Production (Games)", "数字制作艺术学士（游戏方向）")}
                      </p>
                      <p className="text-[15px] italic text-muted-foreground">
                        {text("Gnomon School of Visual Effects · Student Reel", "Gnomon · 入选学院年度集锦")}
                      </p>
                    </div>
                    <span className="shrink-0 font-numeral text-[12.5px] font-bold tracking-[0.14em] text-[#e8c78c]">
                      2025
                    </span>
                  </div>
                </div>

                {/* Core Craft & Engine Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {craftStackChips.map((chip) => (
                    <span
                      key={chip.en}
                      className="border border-[#d8b47c]/36 bg-[#0b0806]/78 px-2.5 py-0.5 font-numeral text-[11.5px] font-semibold tracking-[0.07em] text-[#efe3cc] transition-colors hover:border-[#ebd09e]/75 hover:text-white"
                    >
                      {isChinese ? chip.zh : chip.en}
                    </span>
                  ))}
                </div>

                {/* Languages & Regions Footer */}
                <div className="mt-3 space-y-0.5 border-t border-warm/20 pt-2.5 text-[15px] text-muted-foreground">
                  <p>
                    <span className="font-numeral text-[11.5px] font-bold tracking-[0.14em] text-[#e8c78c] uppercase">
                      {text("Languages: ", "语言：")}
                    </span>
                    {text("English · Mandarin Chinese (Spoken)", "英语 · 普通话（口语流利）")}
                  </p>
                  <p>
                    <span className="font-numeral text-[11.5px] font-bold tracking-[0.14em] text-[#e8c78c] uppercase">
                      {text("Regions: ", "意向地区：")}
                    </span>
                    {text("US · Canada · Europe · Japan · China", "美国 · 加拿大 · 欧洲 · 日本 · 中国")}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Correspondence, Tactile Wax-Seal Dispatch & 3-Stock Calling-Card Tray */}
            <section
              id="contact"
              style={{ animationDelay: "65ms" }}
              className="animate-folio-arc scroll-mt-24 space-y-3.5"
              aria-labelledby="correspondence-heading"
            >
              <h2 id="correspondence-heading" className="sr-only">
                {text("Correspondence & Links", "联络信箱与外部主页")}
              </h2>

              <BrassRule ornate tone="slate" />

              {/* Primary Rag-Vellum Dispatch Envelope w/ Wax-Seal Shockwave Press */}
              <button
                type="button"
                onClick={copyEmail}
                onPointerMove={(e) => handleTactileCardMove(e, 2.0)}
                onPointerLeave={resetTactileCard}
                className="parchment-sheet tactile-tilt group relative flex w-full cursor-pointer items-center justify-between gap-4 overflow-hidden border-[3px] border-[#14100c] px-5 py-4 text-left shadow-[0_22px_52px_rgba(0,0,0,0.84),5px_5px_0_-1px_#dfd2b7,7px_7px_0_0_#14100c] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.992] sm:px-6"
              >
                <FolioCorners tone="parchment" inset="inset-1.5" sizeClass="h-4.5 w-4.5" />
                <div className="relative z-10 min-w-0">
                  <span
                    ref={emailRef}
                    className="block truncate font-display text-xl font-bold tracking-tight text-parchment-ink sm:text-[24px]"
                  >
                    leficious@gmail.com
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 font-numeral text-[11.5px] font-bold tracking-[0.15em] text-rubric uppercase">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rotate-45 transition-transform duration-300 ${
                        copied ? "scale-125 bg-[#1f6f3d]" : "bg-rubric"
                      }`}
                    />
                    {copied
                      ? text("Sealed & Copied to Clipboard", "已钤印并复制信箱地址")
                      : text("Direct Dispatch · Click Seal to Copy", "主联络信箱 · 点击红漆火印复制")}
                  </span>
                </div>

                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div className="relative grid place-items-center">
                    {stampSeq > 0 && (
                      <span
                        key={`burst-${stampSeq}`}
                        aria-hidden="true"
                        className="animate-wax-burst pointer-events-none absolute h-14 w-14 rounded-full border-2 border-[#9e191c]/75 shadow-[0_0_16px_rgba(190,32,36,0.45)]"
                      />
                    )}
                    <div key={`stamp-${stampSeq}`} className={stampSeq > 0 ? "animate-stamp-press" : undefined}>
                      <CrimsonStamp
                        stamped={copied}
                        className="h-13.5 w-13.5 transition-transform duration-200 group-hover:scale-106"
                      />
                    </div>
                  </div>
                  <span className="mt-0.5 font-display text-[12.5px] italic text-parchment-muted">
                    {copied ? text("[ Copied ✓ ]", "[ 已复制 ✓ ]") : text("[ Stamp & Copy ]", "[ 钤印复制 ]")}
                  </span>
                </div>
              </button>

              {/* 3 Distinct Bookbinding Calling Cards (Havana Morocco, Venetian Cordovan, Smoked Ebony) */}
              <div className="grid gap-3 sm:grid-cols-3">
                {callingCards.map((card) => (
                  <a
                    key={card.id}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    onPointerMove={(e) => handleTactileCardMove(e, 3.8)}
                    onPointerLeave={resetTactileCard}
                    className={`tactile-tilt group relative flex min-h-[86px] flex-col items-center justify-center border border-[#e5c489]/62 px-3 py-2.5 text-center transition-[translate,border-color] duration-200 hover:-translate-y-1 hover:border-[#fff0cc] ${card.surfaceClass}`}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-1.5 border border-[#e5c489]/28 transition-colors group-hover:border-[#f5dfb2]/55"
                    />
                    <span className="relative z-10 mb-1 transition-transform duration-200 group-hover:scale-110">
                      <CallingCardEmblem kind={card.id} />
                    </span>
                    <span className="relative z-10 whitespace-nowrap font-display text-[16px] font-bold leading-tight text-[#f7f0e2] transition-colors group-hover:text-white">
                      {isChinese ? card.labelZh : card.label}{" "}
                      <span
                        aria-hidden="true"
                        className="inline-block font-numeral text-[0.82em] text-[#e8c78c] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </span>
                    <span className="relative z-10 mt-0.5 font-numeral text-[11px] tracking-[0.08em] text-[#dccbb0]/85">
                      {isChinese ? card.sublabelZh : card.sublabel}
                    </span>
                  </a>
                ))}
              </div>

              {/* Dual-Track Résumé Plaques (Game/Tech Design Primary + 3D/Tech Art Secondary on EN) */}
              {isChinese ? (
                <a
                  href={resumeHref}
                  download
                  className="brass-plaque flex w-full items-center justify-center gap-2.5 px-5 py-3 font-display text-[13.5px] font-bold tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <span>下载完整游戏开发简历 (PDF)</span>
                  <span aria-hidden="true">↓</span>
                </a>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-[1.42fr_1fr]">
                  <a
                    href={resumeHref}
                    download
                    className="brass-plaque flex items-center justify-center gap-2 px-4 py-3 font-display text-[13px] font-bold tracking-[0.11em] whitespace-nowrap uppercase transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                  >
                    <span>Game & Tech Design CV</span>
                    <span aria-hidden="true">↓</span>
                  </a>
                  <a
                    href={artResumeHref}
                    download
                    className="victorian-ticket slate-folio group flex items-center justify-center gap-1.5 px-3.5 py-3 font-display text-[12.5px] font-bold tracking-[0.1em] whitespace-nowrap text-[#f4e5c8] uppercase transition-all hover:-translate-y-0.5 hover:text-white active:scale-[0.99]"
                  >
                    <span>3D & Tech Art CV</span>
                    <span aria-hidden="true" className="text-[#e8c78c]">↓</span>
                  </a>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {/* Right-Edge 4-Ply Archival Paper Sheaf & Section Dividers */}
      <ArchivalPaperSheaf
        ariaLabel={text("Dossier Section Dividers", "档案纸质分隔签")}
        topFlag={{
          label: text("CV PDF", "简历"),
          href: resumeHref,
          download: true,
        }}
        tabs={[
          {
            id: "dossier",
            label: text("I. Dossier", "I · 个人档案"),
            active: activeSection === "dossier",
            onClick: () => jumpTo("dossier"),
          },
          {
            id: "credentials",
            label: text("II. Guild", "II · 学术履历"),
            active: activeSection === "credentials",
            onClick: () => jumpTo("credentials"),
          },
          {
            id: "contact",
            label: text("III. Dispatch", "III · 主联络函"),
            active: activeSection === "contact",
            onClick: () => jumpTo("contact"),
          },
        ]}
      />

      <SiteFooter />
    </div>
  );
}
