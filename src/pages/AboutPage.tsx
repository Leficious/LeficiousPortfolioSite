import { useRef, useState } from "react";
import { BrassRule, CrimsonStamp, FolioCorners } from "../components/AtelierChrome";
import { FormattedText } from "../components/FormattedText";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { useLanguage } from "../lib/language";

const callingCards: {
  label: string;
  labelZh: string;
  href: string;
  stock: "leather" | "vellum" | "oxblood";
  tilt: string;
}[] = [
  {
    label: "LinkedIn",
    labelZh: "LinkedIn 履历",
    href: "https://www.linkedin.com/in/leficious/",
    stock: "leather",
    tilt: "",
  },
  {
    label: "itch.io Builds",
    labelZh: "itch.io 实机包",
    href: "https://leficious.itch.io/",
    stock: "vellum",
    tilt: "sm:-rotate-[0.9deg]",
  },
  {
    label: "GitHub Code",
    labelZh: "GitHub 源码",
    href: "https://github.com/Leficious",
    stock: "oxblood",
    tilt: "sm:rotate-[0.8deg]",
  },
];

const outsideDisciplines = [
  {
    roman: "I",
    title: "Chamber Music",
    titleZh: "室内乐与管弦乐",
    description:
      "15 years of piano & cello in orchestra and chamber ensembles; timing, counterpoint, and deliberate silence.",
    descriptionZh:
      "约 15 年钢琴与大提琴室内乐合奏训练，塑造了对节奏、声部呼应与“留白”的敏感度。",
  },
  {
    roman: "II",
    title: "Figure Skating & Dance",
    titleZh: "花样滑冰与舞蹈",
    description:
      "Competitive figure skating alongside ballet and ballroom—informing physical weight transfer and combat frame feel.",
    descriptionZh:
      "长期花样滑冰、芭蕾与标准舞训练，使我对重心转移、预备动作与战斗帧数保持身体层面的直觉。",
  },
  {
    roman: "III",
    title: "Touchstones",
    titleZh: "机制与参考谱系",
    description:
      "Zenless Zone Zero, Fire Emblem Fates: Conquest, Arknights, Magritte, and Shin Sekai Yori.",
    descriptionZh:
      "《绝区零》《火焰之纹章 if：暗夜王国》《明日方舟》、雷内·马格利特与《来自新世界》。",
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
        title={text("Dossier & Correspondence | Leficious", "个人档案与信函 | Leficious")}
        description={text(
          "About Lefi (Kevin) Shan — M.S. Game Design and Development student at USC School of Cinematic Arts.",
          "关于单凯飞（Leficious）：南加州大学电影艺术学院游戏设计与开发硕士在读。",
        )}
        path={localizedPath("/about")}
      />

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-[1260px] px-5 pt-10 pb-12 sm:px-8 lg:pt-12">
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          {/* ==================== LEFT: WAX-SEALED BIOGRAPHICAL RAG-VELLUM FOLIO ==================== */}
          <div>
            <p className="mb-5 text-center font-numeral text-xs font-semibold tracking-[0.24em] text-[#ece2d0]/85 uppercase">
              {text("BIOGRAPHICAL DOSSIER · LOS ANGELES", "个人档案卷宗 · 洛杉矶")}
            </p>

            <article className="parchment-sheet relative border-[5px] border-[#15100d] px-6 pt-10 pb-8 sm:px-10 sm:pt-11 sm:pb-9">
              {/* Authentic Embossed Deep-Crimson Sealing-Wax Stamp Straddling the Top Border */}
              <CrimsonStamp className="pointer-events-none absolute -top-7 left-1/2 z-30 h-15 w-15 -translate-x-1/2" />

              <FolioCorners tone="parchment" />

              <div className="relative z-10">
                {/* Portrait Plate + Two-Paragraph Literary Bio */}
                <div className="grid gap-7 sm:grid-cols-[205px_1fr] sm:items-start">
                  <figure className="mx-auto w-full max-w-[215px] sm:mx-0">
                    <div className="border-2 border-[#7a582e] bg-[#120d0a] p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
                      <img
                        src="/about/lefi-shan-portrait.webp"
                        alt={text("Portrait of Lefi Shan", "单凯飞（Kevin Shan）肖像")}
                        width="1000"
                        height="1000"
                        className="aspect-[4/5] w-full object-cover object-center transition-transform duration-500 hover:scale-[1.015]"
                      />
                    </div>
                    <figcaption className="mt-2.5 text-center font-display text-xs italic text-parchment-muted">
                      {text("Lefi (Kevin) Shan · Little Tokyo, LA", "单凯飞（Kevin Shan）· 洛杉矶")}
                    </figcaption>
                  </figure>

                  <div>
                    <h1 className="font-display text-4xl font-semibold tracking-tight text-parchment-ink sm:text-[46px] sm:leading-[1.06]">
                      {text("Lefi Shan", "单凯飞 · Lefi Shan")}
                    </h1>
                    <p className="mt-1.5 font-display text-[15.5px] italic text-rubric sm:text-[17px]">
                      {text(
                        "Game, Level & Technical Designer · USC SCA & Gnomon",
                        "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
                      )}
                    </p>

                    <div
                      className={`mt-4 space-y-3.5 text-pretty text-[16.5px] leading-[1.62] text-parchment-ink/94 sm:text-[17.5px] ${
                        isChinese ? "zh-readable" : ""
                      }`}
                    >
                      <p>
                        {text(
                          "I started out in 3D environment and technical art at Gnomon, building spaces, procedural materials, and Maya tools from the ground up. Over time, I cared more about what players actually do inside those spaces than the static assets alone—turning to Unreal Engine and Unity to tie animation timing and state rules directly to player decisions.",
                          "我本科在 Gnomon 学习 3D 环境与技术美术，从零搭建场景、程序化材质与 Maya 工具管线。做得越久，我越关心玩家在空间里的实际行动与判断，于是转向在 Unreal 与 Unity 中将动画帧数、状态规则与玩家决策直接结合。",
                        )}
                      </p>
                      <p>
                        {text(
                          "Now as an M.S. student at USC's School of Cinematic Arts, my work spans multiphase action-combat encounters in Unreal and first-person spatial puzzle worlds in Unity where floorplan structure and player habit carry the argument without dialogue.",
                          "进入南加州大学（USC）电影艺术学院攻读游戏设计与开发硕士后，我的作品既涵盖 Unreal 多阶段动作 Boss 战原型，也包括在无对白条件下依靠空间动线与玩家习惯推进主题的 Unity 第一人称解谜游戏。",
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <BrassRule tone="parchment" className="my-7" />

                {/* Outside the Engine — Authentic Victorian Horizontal Ledger Rows (Zero SaaS Bento Grid!) */}
                <section aria-labelledby="outside-engine-heading">
                  <h2
                    id="outside-engine-heading"
                    className="font-display text-lg font-semibold tracking-tight text-parchment-ink sm:text-xl"
                  >
                    {text("Outside the Engine — Three Disciplines", "引擎之外 — 三重长期训练")}
                  </h2>

                  <div className="mt-3 divide-y divide-[#7a582e]/35 border-y border-[#7a582e]/35">
                    {outsideDisciplines.map((item) => (
                      <div
                        key={item.roman}
                        className="grid gap-1 py-3 sm:grid-cols-[205px_1fr] sm:items-baseline sm:gap-5"
                      >
                        <h3 className="font-display text-[15.5px] font-semibold text-parchment-ink">
                          <span className="mr-1.5 font-numeral text-xs font-bold text-rubric">{item.roman}</span>
                          · {isChinese ? item.titleZh : item.title}
                        </h3>
                        <p
                          className={`text-[15.5px] leading-snug text-parchment-muted ${
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

          {/* ==================== RIGHT: SMOKED-MAHOGANY CREDENTIALS & CALLING-CARD TRAY ==================== */}
          <div className="flex flex-col gap-6">
            <p className="text-center font-numeral text-xs font-semibold tracking-[0.24em] text-[#ece2d0]/85 uppercase">
              {text("CREDENTIALS & CORRESPONDENCE", "学术履历与信函联络")}
            </p>

            {/* Smoked-Mahogany Academic Credentials Plaque w/ Stacked Backing Card */}
            <section
              aria-labelledby="credentials-heading"
              onPointerMove={(e) => handleTactileCardMove(e, 1.6)}
              onPointerLeave={resetTactileCard}
              className="slate-folio tactile-tilt relative border border-warm/40 p-6 shadow-[0_22px_50px_rgba(0,0,0,0.75),6px_-5px_0_-1px_#140f0c,7px_-6px_0_0_rgba(168,132,82,0.3)] sm:p-7"
            >
              <FolioCorners tone="slate" inset="inset-2.5" />

              <div className="relative z-10 text-center">
                <h2
                  id="credentials-heading"
                  className="font-numeral text-xs font-semibold tracking-[0.22em] text-[#d6b27c] uppercase"
                >
                  {text("Academic & Guild Credentials", "学术履历与背景")}
                </h2>

                <div className="mt-4 space-y-3 border-y border-warm/25 py-4 text-[16px]">
                  <div>
                    <p className="font-display font-semibold text-foreground">
                      {text("M.S. in Game Design & Development", "游戏设计与开发理学硕士（在读）")}
                    </p>
                    <p className="text-[15px] italic text-muted-foreground">
                      {text("USC School of Cinematic Arts (2028)", "南加州大学电影艺术学院 · 预计 2028")}
                    </p>
                  </div>

                  <div>
                    <p className="font-display font-semibold text-foreground">
                      {text("B.F.A. in Digital Production (Games)", "数字制作艺术学士（游戏方向）")}
                    </p>
                    <p className="text-[15px] italic text-muted-foreground">
                      {text("Gnomon School of Visual Effects · Student Reel (2025)", "Gnomon · 入选学院年度集锦 (2025)")}
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1 text-[15px] text-muted-foreground">
                  <p>
                    <span className="font-numeral text-[11px] tracking-[0.14em] text-[#d6b27c] uppercase">
                      {text("Languages: ", "语言：")}
                    </span>
                    {text("English · Mandarin Chinese (Spoken)", "英语 · 普通话（口语流利）")}
                  </p>
                  <p>
                    <span className="font-numeral text-[11px] tracking-[0.14em] text-[#d6b27c] uppercase">
                      {text("Regions: ", "意向地区：")}
                    </span>
                    {text("US · Canada · Europe · Japan · China", "美国 · 加拿大 · 欧洲 · 日本 · 中国")}
                  </p>
                </div>
              </div>
            </section>

            {/* Correspondence & Mixed-Stock Letterpress Calling-Card Tray */}
            <section id="contact" className="scroll-mt-24 space-y-4" aria-labelledby="correspondence-heading">
              <h2
                id="correspondence-heading"
                className="text-center font-display text-lg font-medium tracking-wide text-[#ece2d0]/90"
              >
                {text("Correspondence & Calling-Card Tray", "主联络信函与名片盘")}
              </h2>

              {/* Primary Rag-Vellum Dispatch Envelope w/ Real Embossed Red Sealing-Wax Stamp */}
              <button
                type="button"
                onClick={copyEmail}
                className="parchment-sheet group relative flex w-full cursor-pointer items-center justify-between gap-4 border-2 border-[#15100d] px-6 py-5 text-left transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <div className="relative z-10 min-w-0">
                  <span
                    ref={emailRef}
                    className="block truncate font-display text-xl font-semibold tracking-tight text-parchment-ink sm:text-[25px]"
                  >
                    leficious@gmail.com
                  </span>
                  <span className="mt-1 block font-numeral text-[10px] font-bold tracking-[0.18em] text-rubric uppercase">
                    {copied
                      ? text("✓ Sealed & Copied to Clipboard", "✓ 已钤印并复制信箱地址")
                      : text("Direct Dispatch · Click Seal to Copy", "主联络信箱 · 点击红漆火印复制")}
                  </span>
                </div>

                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <CrimsonStamp stamped={copied} className="h-15 w-15 transition-transform group-hover:scale-106" />
                  <span className="mt-1 font-display text-[11px] italic text-parchment-muted">
                    {copied ? text("[ Copied ]", "[ 已复制 ]") : text("[ Stamp & Copy ]", "[ 钤印复制 ]")}
                  </span>
                </div>
              </button>

              {/* 3 Mixed-Stock Victorian Letterpress Calling Cards (Smoked Mahogany, Rag Vellum, Venetian Oxblood) */}
              <div className="grid gap-3 sm:grid-cols-3">
                {callingCards.map((card) => {
                  const isVellum = card.stock === "vellum";
                  const isOxblood = card.stock === "oxblood";
                  return (
                    <a
                      key={card.label}
                      href={card.href}
                      target="_blank"
                      rel="noreferrer"
                      onPointerMove={(e) => handleTactileCardMove(e, 3.5)}
                      onPointerLeave={resetTactileCard}
                      className={`tactile-tilt group relative flex min-h-[86px] flex-col items-center justify-center px-2.5 py-3.5 text-center transition-all hover:rotate-0 ${card.tilt} ${
                        isVellum
                          ? "parchment-sheet border-2 border-[#15100d]"
                          : isOxblood
                            ? "border border-[#c6a06a]/55 bg-gradient-to-b from-[#541313] to-[#330a0a] shadow-[0_14px_32px_rgba(0,0,0,0.68)]"
                            : "slate-folio border border-warm/45"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-1.5 border ${
                          isVellum
                            ? "border-[#7a582e]/45"
                            : isOxblood
                              ? "border-[#c6a06a]/35"
                              : "border-warm/30"
                        }`}
                      />
                      <span
                        className={`relative z-10 whitespace-nowrap font-display text-[14.5px] font-semibold leading-snug ${
                          isVellum
                            ? "text-parchment-ink group-hover:text-rubric"
                            : "text-[#f0e4cd] group-hover:text-[#e6c48c]"
                        }`}
                      >
                        {isChinese ? card.labelZh : card.label}{" "}
                        <span aria-hidden="true" className="font-numeral text-[0.82em]">↗</span>
                      </span>
                    </a>
                  );
                })}
              </div>

              {/* Chamfered Antique-Bronze Full Résumé Bar */}
              <a
                href={resumeHref}
                download
                className="brass-plaque flex w-full items-center justify-center gap-2.5 px-5 py-3.5 font-numeral text-xs font-bold tracking-[0.16em] uppercase transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <span>{text("Download Full Résumé (PDF)", "下载完整游戏开发简历 (PDF)")}</span>
                <span aria-hidden="true">↓</span>
              </a>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
