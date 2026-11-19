import { useEffect, useRef, useState } from "react";
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
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { handleTactileCardMove, resetTactileCard } from "../lib/atelierMotion";
import { useLanguage } from "../lib/language";

const callingCards: {
  label: string;
  labelZh: string;
  href: string;
  stock: "leather" | "vellum" | "oxblood";
}[] = [
  {
    label: "LinkedIn",
    labelZh: "LinkedIn 履历",
    href: "https://www.linkedin.com/in/leficious/",
    stock: "leather",
  },
  {
    label: "itch.io Builds",
    labelZh: "itch.io 实机包",
    href: "https://leficious.itch.io/",
    stock: "vellum",
  },
  {
    label: "GitHub Code",
    labelZh: "GitHub 源码",
    href: "https://github.com/Leficious",
    stock: "oxblood",
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
  const [activeSection, setActiveSection] = useState<"dossier" | "credentials" | "contact">("dossier");
  const emailRef = useRef<HTMLSpanElement>(null);

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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpTo = (id: "dossier" | "credentials" | "contact") => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
    <div className="min-h-screen px-4 py-5 text-foreground sm:px-8 lg:px-10 lg:py-6 xl:pl-11 xl:pr-28">
      <Seo
        title={text("Lefi Shan | Dossier & Correspondence", "单凯飞 · Lefi Shan | 个人档案与信函")}
        description={text(
          "About Lefi (Kevin) Shan — M.S. Game Design and Development student at USC School of Cinematic Arts.",
          "关于单凯飞（Lefi Shan）：南加州大学电影艺术学院游戏设计与开发硕士在读。",
        )}
        path={localizedPath("/about")}
      />

      {/* ==================== 1. UNIFIED VICTORIAN ARCHIVAL HEADER RAIL ==================== */}
      <AtelierHeaderRail
        eyebrow={text("LEFI SHAN", "单凯飞 · LEFI SHAN")}
        subtitle={text(
          "Little Tokyo, Los Angeles · USC SCA & Gnomon",
          "洛杉矶小东京 · 南加大电影学院 & Gnomon",
        )}
        maxWidthClass="max-w-[1380px]"
        rightSlot={
          <a
            href={resumeHref}
            download
            className="brass-plaque inline-flex items-center gap-1.5 px-3.5 py-1.5 font-display text-[12px] font-bold tracking-[0.12em] whitespace-nowrap uppercase transition-transform hover:-translate-y-0.5 active:scale-97 2xl:px-4.5 2xl:text-[12.5px]"
          >
            <span>{text("Résumé (PDF)", "下载简历")}</span>
            <span aria-hidden="true">↓</span>
          </a>
        }
      />

      <main id="main-content" tabIndex={-1} className="mx-auto mt-6 max-w-[1260px] pb-10 lg:mt-7">
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[1.18fr_0.82fr] lg:gap-10">
          {/* ==================== LEFT: SUSPENDED RAG-VELLUM BIOGRAPHICAL DOSSIER ==================== */}
          <div id="dossier" className="scroll-mt-16">
            <BrassPinThreads animKey="about-dossier" />

            <article className="parchment-sheet animate-folio-arc relative border-[5px] border-[#110b07] px-6 pt-9 pb-8 shadow-[0_36px_88px_rgba(0,0,0,0.92),6px_6px_0_-1px_#dfd0b2,8px_8px_0_0_#110b07] sm:px-10 sm:pt-10 sm:pb-9">
              <FolioCorners tone="parchment" />

              <div className="relative z-10">
                <div className="grid gap-7 sm:grid-cols-[205px_1fr] sm:items-start">
                  <figure className="mx-auto w-full max-w-[215px] sm:mx-0">
                    <div className="relative border border-[#5c3f1e] bg-[#0a0806] p-1.5 shadow-[0_14px_32px_rgba(0,0,0,0.52)]">
                      <BrassCornerClasps sizeClass="h-6.5 w-6.5" />
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
                    <h1 className="font-display text-4xl font-bold tracking-tight text-parchment-ink sm:text-[46px] sm:leading-[1.06]">
                      {text("Lefi Shan", "单凯飞 · Lefi Shan")}
                    </h1>
                    <p className="mt-1.5 font-display text-[15.5px] font-medium italic text-rubric sm:text-[17px]">
                      {text(
                        "Game, Level & Technical Designer · USC SCA & Gnomon",
                        "游戏、关卡与技术设计师 · 南加州大学电影艺术学院 & Gnomon",
                      )}
                    </p>

                    <div
                      className={`mt-4 space-y-3.5 text-pretty text-[16.5px] leading-[1.62] text-parchment-ink sm:text-[17.5px] ${
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

                <BrassRule ornate tone="parchment" className="my-6" />

                {/* Outside the Engine — Authentic Victorian Horizontal Ledger Rows */}
                <section aria-labelledby="outside-engine-heading">
                  <h2
                    id="outside-engine-heading"
                    className="font-display text-lg font-bold tracking-tight text-parchment-ink sm:text-xl"
                  >
                    {text("Outside the Engine — Three Disciplines", "引擎之外 — 三重长期训练")}
                  </h2>

                  <div className="mt-3 divide-y divide-[#684720]/40 border-y border-[#684720]/45">
                    {outsideDisciplines.map((item) => (
                      <div
                        key={item.roman}
                        className="grid gap-1 py-3 sm:grid-cols-[205px_1fr] sm:items-baseline sm:gap-5"
                      >
                        <h3 className="font-display text-[15.5px] font-bold text-parchment-ink">
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

          {/* ==================== RIGHT: EBONY-MOROCCO CREDENTIALS & LETTERPRESS CALLING-CARD TRAY ==================== */}
          <div className="flex flex-col gap-6 lg:pt-8">
            <section
              id="credentials"
              aria-labelledby="credentials-heading"
              onPointerMove={(e) => handleTactileCardMove(e, 1.6)}
              onPointerLeave={resetTactileCard}
              className="slate-folio tactile-tilt relative scroll-mt-20 border border-[#d8b47c]/60 p-6 shadow-[4px_4px_0_0_#e8dcc2,5px_5px_0_0_#0e0906,7px_7px_0_0_#c8b28b,0_26px_58px_rgba(0,0,0,0.92)] sm:p-7"
            >
              <FolioCorners tone="slate" inset="inset-2" sizeClass="h-6 w-6" />

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center gap-2.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#e8c78c]" />
                  <h2
                    id="credentials-heading"
                    className="font-numeral text-xs font-bold tracking-[0.22em] text-[#e8c78c] uppercase"
                  >
                    {text("Academic & Guild Credentials", "学术履历与背景")}
                  </h2>
                  <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-[#e8c78c]" />
                </div>

                <div className="mt-4 space-y-3 border-y border-warm/28 py-4 text-[16px]">
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
                    <span className="font-numeral text-[11px] font-semibold tracking-[0.14em] text-[#e8c78c] uppercase">
                      {text("Languages: ", "语言：")}
                    </span>
                    {text("English · Mandarin Chinese (Spoken)", "英语 · 普通话（口语流利）")}
                  </p>
                  <p>
                    <span className="font-numeral text-[11px] font-semibold tracking-[0.14em] text-[#e8c78c] uppercase">
                      {text("Regions: ", "意向地区：")}
                    </span>
                    {text("US · Canada · Europe · Japan · China", "美国 · 加拿大 · 欧洲 · 日本 · 中国")}
                  </p>
                </div>
              </div>
            </section>

            {/* Correspondence & Cohesive Ebony-Gilt Letterpress Calling-Card Tray */}
            <section id="contact" className="scroll-mt-24 space-y-4" aria-labelledby="correspondence-heading">
              <BrassRule ornate tone="slate" />

              {/* Primary Rag-Vellum Dispatch Envelope w/ Stacked Book-Edge Lip & Red Sealing-Wax Stamp */}
              <button
                type="button"
                onClick={copyEmail}
                className="parchment-sheet group relative flex w-full cursor-pointer items-center justify-between gap-4 border-[3px] border-[#14100c] px-6 py-5 text-left shadow-[0_22px_52px_rgba(0,0,0,0.84),5px_5px_0_-1px_#dfd2b7,7px_7px_0_0_#14100c] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99]"
              >
                <FolioCorners tone="parchment" inset="inset-1.5" sizeClass="h-4.5 w-4.5" />
                <div className="relative z-10 min-w-0">
                  <span
                    ref={emailRef}
                    className="block truncate font-display text-xl font-bold tracking-tight text-parchment-ink sm:text-[25px]"
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
                  <CrimsonStamp stamped={copied} className="h-14 w-14 transition-transform group-hover:scale-106" />
                  <span className="mt-1 font-display text-[11px] italic text-parchment-muted">
                    {copied ? text("[ Copied ]", "[ 已复制 ]") : text("[ Stamp & Copy ]", "[ 钤印复制 ]")}
                  </span>
                </div>
              </button>

              {/* 3 Unified Ebony-Gilt Letterpress Calling Cards */}
              <div className="grid gap-3 sm:grid-cols-3">
                {callingCards.map((card) => (
                  <a
                    key={card.label}
                    href={card.href}
                    target="_blank"
                    rel="noreferrer"
                    onPointerMove={(e) => handleTactileCardMove(e, 3.2)}
                    onPointerLeave={resetTactileCard}
                    className="slate-folio tactile-tilt group relative flex min-h-[76px] flex-col items-center justify-center border border-[#d8b47c]/55 px-2.5 py-3 text-center transition-all hover:-translate-y-0.5 hover:border-[#f3dfb9]"
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-1.5 border border-warm/22" />
                    <span className="relative z-10 whitespace-nowrap font-display text-[14.5px] font-semibold leading-snug text-[#f7f0e2] transition-colors group-hover:text-[#f5dfb2]">
                      {isChinese ? card.labelZh : card.label}{" "}
                      <span aria-hidden="true" className="font-numeral text-[0.82em] text-[#e8c78c]">↗</span>
                    </span>
                  </a>
                ))}
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
