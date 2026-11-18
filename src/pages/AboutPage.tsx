import { useRef, useState } from "react";
import { BrassRule, CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { useLanguage } from "../lib/language";

type IconName = "email" | "linkedin" | "itch" | "github";

function ContactIcon({ name }: { name: IconName }) {
  if (name === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3.5 6 8.5 6.5L20.5 6" />
      </svg>
    );
  }
  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4.5 w-4.5 fill-current">
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708C16 15.487 15.474 16 14.825 16H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z" />
      </svg>
    );
  }
  if (name === "itch") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M3.129 1.338C2.082 1.96.02 4.329 0 4.95v1.029c0 1.304 1.219 2.45 2.325 2.45 1.329 0 2.436-1.101 2.436-2.408 0 1.307 1.069 2.408 2.398 2.408s2.364-1.101 2.364-2.408c0 1.307 1.137 2.408 2.466 2.408h.024c1.329 0 2.466-1.101 2.466-2.408 0 1.307 1.035 2.408 2.364 2.408s2.398-1.101 2.398-2.408c0 1.307 1.107 2.408 2.436 2.408 1.107 0 2.325-1.146 2.325-2.45V4.95c-.02-.621-2.082-2.991-3.129-3.612-3.254-.114-5.51-.134-8.871-.133s-7.945.053-8.871.133Zm6.377 6.477a2.83 2.83 0 0 1-2.418 1.396 2.82 2.82 0 0 1-2.396-1.385 2.82 2.82 0 0 1-2.437 1.384c-.091 0-.186-.025-.263-.052-.107 1.112-.152 2.175-.168 2.95-.002.394-.004.717-.006 1.167.021 2.334-.231 7.564 1.029 8.849 1.953.455 5.546.663 9.151.664 3.605-.001 7.198-.209 9.151-.664 1.26-1.285 1.008-6.516 1.029-8.849-.002-.45-.004-.773-.006-1.167-.016-.775-.061-1.838-.168-2.95-.077.026-.172.052-.263.052a2.82 2.82 0 0 1-2.437-1.384 2.82 2.82 0 0 1-2.396 1.385 2.83 2.83 0 0 1-2.418-1.396 2.83 2.83 0 0 1-2.421 1.397h-.159a2.83 2.83 0 0 1-2.416-1.397Zm-2.004 2.591c.794.002 1.498 0 2.372.953a20.4 20.4 0 0 1 4.25 0c.873-.953 1.578-.952 2.372-.953.375 0 1.875 0 2.92 2.935l1.122 4.026c.832 2.995-.266 3.069-1.636 3.071-2.031-.076-3.156-1.551-3.156-3.026-2.248.368-5.248.368-7.496 0 0 1.475-1.125 2.95-3.156 3.026-1.37-.003-2.468-.076-1.636-3.071l1.123-4.026c1.045-2.935 2.545-2.935 2.92-2.935ZM12 12.713s-2.138 1.964-2.523 2.662l1.399-.056v1.22c0 .057.561.034 1.123.008.562.026 1.123.049 1.123-.008v-1.22l1.399.056c-.384-.698-2.523-2.662-2.523-2.662Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.57-.3-5.27-1.29-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.4-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.06c0 .31.21.67.79.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  );
}

const callingCards: {
  label: string;
  detail: string;
  detailZh: string;
  href: string;
  icon: IconName;
  tilt: string;
}[] = [
  {
    label: "LinkedIn",
    detail: "Career history & direct messages",
    detailZh: "职场履历与直接私信",
    href: "https://www.linkedin.com/in/leficious/",
    icon: "linkedin",
    tilt: "sm:-rotate-[0.8deg]",
  },
  {
    label: "itch.io Builds",
    detail: "Playable prototypes & archives",
    detailZh: "可玩实机包与独立作品",
    href: "https://leficious.itch.io/",
    icon: "itch",
    tilt: "sm:rotate-[0.7deg]",
  },
  {
    label: "GitHub Tools",
    detail: "Pipeline scripts, C# & C++ source",
    detailZh: "Maya 工具脚本与核心源码",
    href: "https://github.com/Leficious",
    icon: "github",
    tilt: "sm:-rotate-[0.5deg]",
  },
];

const outsideDisciplines = [
  {
    roman: "I",
    title: "Chamber Music",
    titleZh: "室内乐与管弦乐",
    description:
      "15 years of piano and cello in orchestra and chamber ensembles—shaping how I tune cadence, counterpoint, and deliberate silence.",
    descriptionZh:
      "约 15 年钢琴与大提琴训练及室内乐合奏经验，直接塑造了我对节奏、声部呼应与“留白”的直觉。",
  },
  {
    roman: "II",
    title: "Figure Skating & Dance",
    titleZh: "花样滑冰与舞蹈",
    description:
      "Years of competitive figure skating alongside ballet and ballroom—informing weight transfer, anticipation, and combat frame feel.",
    descriptionZh:
      "长期花样滑冰、芭蕾与标准舞训练，使我对重心转移、预备动作与收势帧数保持身体层面的敏感。",
  },
  {
    roman: "III",
    title: "Touchstones & Systems",
    titleZh: "机制表达与参考谱系",
    description:
      "Zenless Zone Zero, FE Fates: Conquest, Arknights, Magritte, and Shin Sekai Yori—where mechanics and framing carry the argument without spelling it out.",
    descriptionZh:
      "《绝区零》《暗夜王国》《明日方舟》、马格利特与《来自新世界》——用空间构图与规则本身完成表达。",
  },
];

export function AboutPage() {
  const { isChinese, text, localizedPath } = useLanguage();
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLSpanElement>(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("leficious@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
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

  return (
    <div className="min-h-screen text-foreground">
      <Seo
        title={text("Biographical Folio & Contact | Leficious", "个人档案与联络 | Leficious")}
        description={text(
          "About Lefi (Kevin) Shan — M.S. Game Design and Development student at USC School of Cinematic Arts.",
          "关于单凯飞（Leficious）：南加州大学电影艺术学院游戏设计与开发硕士在读。",
        )}
        path={localizedPath("/about")}
      />

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1240px] px-5 pt-8 pb-12 sm:px-8 lg:pt-11">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:gap-9">
          {/* ==================== LEFT: BIOGRAPHICAL RAG-PARCHMENT FOLIO ==================== */}
          <article className="parchment-sheet relative rounded-xs border-[5px] border-[#151821] px-6 py-7 sm:px-9 sm:py-9">
            <FolioCorners tone="parchment" />

            <div className="relative z-10">
              {/* Top Dossier Stamp + Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-numeral text-[11px] font-semibold tracking-[0.22em] text-parchment-muted">
                    {text("ARCHITECT DOSSIER · LOS ANGELES", "设计师个人卷宗 · 洛杉矶")}
                  </p>
                  <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-parchment-ink sm:text-5xl">
                    {text("Lefi Shan", "单凯飞 · Lefi Shan")}
                  </h1>
                  <p className="mt-1 font-display text-base italic text-rubric sm:text-lg">
                    {text(
                      "Game, Level & Technical Designer · USC School of Cinematic Arts & Gnomon",
                      "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
                    )}
                  </p>
                </div>
                <CrimsonStamp label="ARCHITECT BIO" className="hidden h-14 w-14 opacity-85 sm:block" />
              </div>

              {/* Portrait Plate + Two-Paragraph Editorial Bio */}
              <div className="mt-6 grid gap-6 sm:grid-cols-[195px_1fr] sm:items-start">
                <figure className="mx-auto w-full max-w-[210px] sm:mx-0">
                  <div className="overflow-hidden rounded-xs border-2 border-[#735329]/65 bg-[#0e1017] p-1.5 shadow-md">
                    <img
                      src="/about/lefi-shan-portrait.webp"
                      alt={text("Portrait of Lefi Shan", "单凯飞（Kevin Shan）肖像")}
                      width="1000"
                      height="1000"
                      className="aspect-[4/5] w-full rounded-xs object-cover object-center"
                    />
                  </div>
                  <figcaption className="mt-2 flex items-center justify-between px-0.5 font-numeral text-[10px] tracking-[0.14em] text-parchment-muted">
                    <span>KEVIN SHAN</span>
                    <span>LITTLE TOKYO</span>
                  </figcaption>
                </figure>

                <div
                  className={`space-y-3.5 text-pretty text-sm leading-relaxed text-parchment-ink/92 sm:text-[15px] ${
                    isChinese ? "zh-readable" : ""
                  }`}
                >
                  <p>
                    {text(
                      "I started out in 3D environment and technical art at Gnomon, building spaces, procedural materials, and Maya tools from the ground up. Over time, I cared more about what players actually do inside those spaces than the static assets alone. Prototyping combat systems, enemy AI, and character feel in Unreal Engine gave me a direct way to tie animation timing and state rules to player decisions.",
                      "我本科在 Gnomon 学习 3D 环境与技术美术，从零搭建场景、程序化材质与 Maya 工具管线。做得越久，我越关心玩家在空间里的实际行动与判断，于是转向游戏设计。在 Unreal Engine 里制作战斗系统、敌人 AI 与角色操控，让我能把动画时机、状态规则与玩家决策直接联系起来。",
                    )}
                  </p>
                  <p>
                    {text(
                      "Now as an M.S. student at USC's School of Cinematic Arts, my work spans multiphase action-combat prototypes in Unreal and first-person spatial puzzle games in Unity where floorplan structure and player habit carry the argument without dialogue.",
                      "进入南加州大学（USC）电影艺术学院攻读游戏设计与开发硕士后，我的作品既涵盖 Unreal 多阶段动作 Boss 战原型，也包括在无对白条件下依靠空间动线与玩家习惯推进主题的 Unity 第一人称解谜游戏。",
                    )}
                  </p>
                </div>
              </div>

              <BrassRule tone="parchment" className="my-6" />

              {/* Outside the Engine — Three Engraved Columns */}
              <section aria-labelledby="outside-engine-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2
                    id="outside-engine-heading"
                    className="font-numeral text-xs font-bold tracking-[0.2em] text-parchment-ink uppercase"
                  >
                    {text("Outside the Engine — Three Disciplines", "引擎之外 — 三重长期训练")}
                  </h2>
                  <span className="font-display text-xs italic text-parchment-muted">
                    {text("Rhythm, physical weight & compact rules", "节奏、重心与精简规则")}
                  </span>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {outsideDisciplines.map((item) => (
                    <div
                      key={item.roman}
                      className="rounded-xs border border-[#8c683a]/35 bg-parchment-deep/45 p-3.5"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-numeral text-xs font-bold text-rubric">{item.roman}</span>
                        <h3 className="font-display text-base font-bold leading-snug text-parchment-ink">
                          {isChinese ? item.titleZh : item.title}
                        </h3>
                      </div>
                      <p className={`mt-2 text-xs leading-relaxed text-parchment-muted ${isChinese ? "zh-readable" : ""}`}>
                        <FormattedText>{isChinese ? item.descriptionZh : item.description}</FormattedText>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </article>

          {/* ==================== RIGHT: GUILD CREDENTIALS & CALLING-CARD TRAY ==================== */}
          <div className="flex flex-col gap-6">
            {/* Dark-Slate Academic & Guild Credentials Plaque */}
            <section
              aria-labelledby="credentials-heading"
              className="slate-folio relative rounded-xs p-6 transition-transform duration-300 lg:-rotate-[0.6deg] lg:hover:rotate-0 sm:p-7"
            >
              <FolioCorners tone="slate" inset="inset-2" />

              <div className="relative z-10">
                <h2
                  id="credentials-heading"
                  className="font-numeral text-xs font-semibold tracking-[0.22em] text-[#dfc092] uppercase"
                >
                  {text("Academic & Guild Credentials", "学术履历与背景")}
                </h2>

                <div className="mt-4 divide-y divide-warm/20 border-y border-warm/20">
                  <div className="flex items-baseline justify-between gap-4 py-3.5">
                    <div>
                      <p className="font-display text-lg font-bold text-foreground">
                        {text("M.S. in Game Design & Development", "游戏设计与开发理学硕士（在读）")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {text("USC School of Cinematic Arts", "南加州大学电影艺术学院 (USC SCA)")}
                      </p>
                    </div>
                    <span className="shrink-0 font-numeral text-xs text-warm">{text("2028", "预计 2028")}</span>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 py-3.5">
                    <div>
                      <p className="font-display text-lg font-bold text-foreground">
                        {text("B.F.A. in Digital Production (Games)", "数字制作艺术学士（游戏方向）")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {text("Gnomon School of Visual Effects · Student Reel", "Gnomon · 入选学院年度作品集锦")}
                      </p>
                    </div>
                    <span className="shrink-0 font-numeral text-xs text-warm">2025</span>
                  </div>

                  <div className="grid gap-4 py-3.5 sm:grid-cols-2">
                    <div>
                      <p className="font-numeral text-[10px] tracking-[0.18em] text-warm/80 uppercase">
                        {text("Languages", "语言能力")}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-foreground/90">
                        {text("English (Fluent) · Mandarin (Fluent Spoken)", "英语（流利）· 普通话（口语流利）")}
                      </p>
                    </div>
                    <div>
                      <p className="font-numeral text-[10px] tracking-[0.18em] text-warm/80 uppercase">
                        {text("Work Regions", "意向地区")}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {text("US · Canada · Europe · Japan · China", "美国 · 加拿大 · 欧洲 · 日本 · 中国")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Correspondence & Letterpress Calling-Card Tray */}
            <section id="contact" className="scroll-mt-24 space-y-4" aria-labelledby="correspondence-heading">
              <div className="flex items-baseline justify-between px-1">
                <h2
                  id="correspondence-heading"
                  className="font-numeral text-xs font-semibold tracking-[0.22em] text-warm uppercase"
                >
                  {text("Correspondence & Calling Cards", "信函联络与名片盘")}
                </h2>
                <span className="font-display text-xs italic text-muted-foreground">
                  {text("Internships & full-time roles", "开放实习与全职机会")}
                </span>
              </div>

              {/* Primary Rag-Parchment Dispatch Card w/ Interactive Crimson Stamp */}
              <button
                type="button"
                onClick={copyEmail}
                className="parchment-sheet group relative flex w-full cursor-pointer items-center justify-between gap-4 rounded-xs border-2 border-[#151821] px-5 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.995]"
              >
                <div className="relative z-10 min-w-0">
                  <div className="flex items-center gap-2 text-rubric">
                    <ContactIcon name="email" />
                    <span className="font-numeral text-[10.5px] font-bold tracking-[0.2em] uppercase">
                      {copied
                        ? text("Dispatch Address Copied", "信函地址已钤印复制")
                        : text("Direct Dispatch · Stamp to Copy", "主联络信箱 · 点击钤印复制")}
                    </span>
                  </div>
                  <span
                    ref={emailRef}
                    className="mt-1.5 block truncate font-display text-2xl font-bold tracking-tight text-parchment-ink"
                  >
                    leficious@gmail.com
                  </span>
                </div>

                <div className="relative z-10 shrink-0">
                  <CrimsonStamp
                    label={copied ? "COPIED" : "DISPATCH"}
                    stamped={copied}
                    className={`h-13 w-13 transition-opacity ${copied ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}
                  />
                </div>
              </button>

              {/* Three Tactile Angled Calling Cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                {callingCards.map((card) => (
                  <a
                    key={card.label}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`slate-folio group relative flex flex-col justify-between rounded-xs border border-warm/35 p-4 transition-all duration-250 hover:-translate-y-1 hover:rotate-0 hover:border-[#dfc092] ${card.tilt}`}
                  >
                    <div className="flex items-center justify-between text-warm transition-colors group-hover:text-[#f5e3c0]">
                      <ContactIcon name={card.icon} />
                      <span aria-hidden="true" className="font-mono text-xs">↗</span>
                    </div>
                    <div className="mt-4">
                      <p className="font-display text-base font-bold text-foreground group-hover:text-[#f5e3c0]">
                        {card.label}
                      </p>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">
                        {isChinese ? card.detailZh : card.detail}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Brushed-Brass Full Résumé Plaque */}
              <a
                href={resumeHref}
                download
                className="brass-plaque flex w-full items-center justify-between rounded-xs px-5 py-3.5 font-display text-sm font-bold tracking-wide transition-transform active:scale-[0.99]"
              >
                <span>
                  {text("Download Full Game Design Résumé (PDF)", "下载完整中文游戏开发简历 (PDF)")}
                </span>
                <span aria-hidden="true" className="font-mono text-xs">↓</span>
              </a>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
