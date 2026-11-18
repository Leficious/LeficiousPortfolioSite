import { useRef, useState } from "react";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { FormattedText } from "../components/FormattedText";
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

const contactLinks: { label: string; detail: string; detailZh: string; href: string; icon: IconName }[] = [
  { label: "LinkedIn", detail: "linkedin.com/in/leficious", detailZh: "linkedin.com/in/leficious", href: "https://www.linkedin.com/in/leficious/", icon: "linkedin" },
  { label: "itch.io", detail: "Playable builds & jam entries", detailZh: "可玩原型与比赛作品", href: "https://leficious.itch.io/", icon: "itch" },
  { label: "GitHub", detail: "Tools, scripts & source", detailZh: "工具脚本与源码", href: "https://github.com/Leficious", icon: "github" },
];

const outsideEditor = [
  {
    number: "01",
    title: "Music",
    titleZh: "音乐",
    description:
      "About 15 years of piano and cello, including orchestra and chamber performances. Long ensemble rehearsals shaped how I think about timing, counterpoint, and when to leave space.",
    descriptionZh:
      "我学了约 15 年钢琴和大提琴，参加过管弦乐团与室内乐演出。长期合奏排练让我对节奏、声部配合和留白一直很敏感。",
  },
  {
    number: "02",
    title: "Movement",
    titleZh: "肢体与运动",
    description:
      "I trained seriously in figure skating, alongside ballet and ballroom dance. That physical sense of weight transfer, balance, anticipation, and follow-through still informs how I tune character feel and combat timing.",
    descriptionZh:
      "我曾长期训练花样滑冰，也学过芭蕾和标准舞。训练里对重心转移、平衡、预备动作与收势的体会，至今直接影响我调校角色手感与战斗帧数。",
  },
  {
    number: "03",
    title: "Media & Systems",
    titleZh: "叙事与社会系统",
    description:
      "Outside of engines, I gravitate toward stories and essays about how rules, institutions, and spaces shape human behavior — across games, anime, literature, sociology, and modern history.",
    descriptionZh:
      "在引擎之外，我常关注规则、制度与空间如何改变人的习惯和判断——无论是游戏、动画、文学，还是社会学与近现代史。",
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
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      if (!emailRef.current) return;
      const range = document.createRange();
      range.selectNodeContents(emailRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo
        title={text("About & Contact | Leficious", "关于与联系 | Leficious")}
        description={text(
          "About Lefi (Kevin) Shan — M.S. Game Design and Development student at USC School of Cinematic Arts.",
          "关于单凯飞（Leficious）：南加州大学电影艺术学院游戏设计与开发硕士在读。",
        )}
        path={localizedPath("/about")}
      />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="border-b border-border py-14 md:py-20">
          <div className="grid min-w-0 grid-cols-1 items-start gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                {text("Lefi (Kevin) Shan · Game, Level & Technical Designer", "单凯飞（Kevin Shan） · 游戏、关卡与技术设计师")}
              </p>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {text("About", "关于我")}
              </h1>

              <div className={`mt-7 max-w-2xl space-y-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg ${isChinese ? "zh-readable" : ""}`}>
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

              <div className="mt-8 border-l-2 border-warm pl-5">
                <p className="text-xs font-medium text-foreground/80">{text("Design touchstones", "常翻看的参考")}</p>
                <p className={`mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                  <FormattedText>
                    {text(
                      "Zenless Zone Zero for how animation timing, VFX, and graphic UI push the exact same combat attitude; Fire Emblem Fates: Conquest and Arknights for map geometry and compact rule sets; and René Magritte, Lewis Carroll, and Shin Sekai Yori for framing and letting mechanics make an argument without spelling it out.",
                      "《绝区零》在动画帧数、VFX 与平面 UI 上对打击节奏的高度统一；《火焰之纹章 if：暗夜王国》与《明日方舟》的地图几何与精简规则；以及雷内·马格利特、刘易斯·卡罗尔与《来自新世界》对视角构图和“用机制本身表达观点”的启发。",
                    )}
                  </FormattedText>
                </p>
              </div>
            </div>

            <figure className="mx-auto w-full max-w-[380px] lg:mx-0 lg:justify-self-end">
              <div className="overflow-hidden rounded-xs border border-border bg-surface">
                <img
                  src="/about/lefi-shan-portrait.webp"
                  alt={text("Portrait of Lefi Shan", "单凯飞（Kevin Shan）肖像")}
                  width="1000"
                  height="1000"
                  className="aspect-[4/5] w-full object-cover object-center"
                />
              </div>
              <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>{text("Lefi Shan (Kevin Shan)", "单凯飞（Kevin Shan）")}</span>
                <span className="font-mono text-[11px]">{text("Little Tokyo · Los Angeles", "美国 · 洛杉矶")}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="border-b border-border py-14 md:py-20" aria-labelledby="personal-title">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="personal-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {text("Outside the Engine", "引擎之外")}
              </h2>
              <p className={`mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                {text(
                  "Most of my instincts around pacing, rhythm, and physical weight come from years of practice outside game engines.",
                  "我对节奏、结构与肢体反馈的很多直觉，来自游戏引擎之外的长期训练与阅读。",
                )}
              </p>
            </div>

            <div className="divide-y divide-border border-y border-border md:col-span-8">
              {outsideEditor.map((item) => (
                <article key={item.number} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr] sm:gap-4 sm:py-6">
                  <span className="font-mono text-xs text-warm">{item.number}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                      {isChinese ? item.titleZh : item.title}
                    </h3>
                    <p className={`mt-1.5 text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                      {isChinese ? item.descriptionZh : item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-14 md:py-20" aria-labelledby="education-title">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 id="education-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {text("Education & Background", "教育与背景")}
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border md:col-span-8">
              <div className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight">
                    {text("M.S. in Game Design and Development", "游戏设计与开发理学硕士（在读）")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {text("USC School of Cinematic Arts", "南加州大学电影艺术学院 (USC School of Cinematic Arts)")}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{text("Expected 2028", "预计 2028")}</p>
              </div>

              <div className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight">
                    {text("B.F.A. in Digital Production (Games)", "数字制作艺术学士（游戏方向）")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {text(
                      "Gnomon School of Visual Effects · Featured in Gnomon's student reel",
                      "Gnomon School of Visual Effects · 作品入选学院年度集锦",
                    )}
                  </p>
                </div>
                <p className="font-mono text-xs text-muted-foreground">2025</p>
              </div>

              <div className="grid gap-6 py-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-foreground/75">{text("Languages", "语言")}</p>
                  <p className="mt-1.5 text-sm text-foreground">
                    {text("English (fluent) · Mandarin Chinese (fluent spoken)", "英语（流利） · 普通话（口语流利）")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground/75">{text("Work regions", "意向地区")}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {text("US · Canada · Europe · Japan · China", "美国 · 加拿大 · 欧洲 · 日本 · 中国")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 pt-14 md:pt-20" aria-labelledby="contact-title">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="contact-title" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {text("Contact", "联系与合作")}
              </h2>
              <p className={`mt-3 max-w-md text-sm leading-relaxed text-muted-foreground ${isChinese ? "zh-readable" : ""}`}>
                {text(
                  "Open to internships and roles across game design, level design, combat design, and technical design. Reach out directly by email or LinkedIn.",
                  "正在寻找游戏设计、关卡策划、战斗设计及技术策划方向的实习与全职机会，欢迎通过邮件或 LinkedIn 直接联系。",
                )}
              </p>
              <a
                href={isChinese ? "/resume/Kevin_Shan_CN_Game_Resume.pdf" : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"}
                download
                className="mt-6 inline-flex items-center gap-2.5 rounded-xs border border-border bg-surface px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
              >
                {text("Download game design résumé (PDF)", "下载中文游戏开发简历 (PDF)")} <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:col-span-7">
              <button
                type="button"
                onClick={copyEmail}
                className="group flex min-h-28 cursor-pointer flex-col justify-between bg-surface p-5 text-left transition-colors hover:bg-secondary"
              >
                <div className="flex items-center justify-between text-muted-foreground transition-colors group-hover:text-foreground">
                  <ContactIcon name="email" />
                  <span className="font-mono text-[11px]">
                    {copied ? text("Copied", "已复制") : text("Copy", "复制")}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="font-display text-base font-semibold text-foreground">Email</p>
                  <span ref={emailRef} className="mt-0.5 block font-mono text-xs text-muted-foreground">
                    leficious@gmail.com
                  </span>
                </div>
              </button>

              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-28 flex-col justify-between bg-surface p-5 transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center justify-between text-muted-foreground transition-colors group-hover:text-foreground">
                    <ContactIcon name={link.icon} />
                    <span aria-hidden="true" className="font-mono text-xs">↗</span>
                  </div>
                  <div className="mt-4">
                    <p className="font-display text-base font-semibold text-foreground">{link.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{isChinese ? link.detailZh : link.detail}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
