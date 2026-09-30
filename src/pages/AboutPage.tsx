import { useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { SiteFooter } from "../components/SiteNav";
import { FormattedText } from "../components/FormattedText";
import { useLanguage } from "../lib/language";

type IconName = "email" | "linkedin" | "linktree" | "github";

function ContactIcon({ name }: { name: IconName }) {
  if (name === "email") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path fill="#4285F4" d="M1.636 20.182h3.819v-9.273L0 6.818v11.728c0 .903.733 1.636 1.636 1.636Z" />
        <path fill="#34A853" d="M18.545 20.182h3.819c.903 0 1.636-.733 1.636-1.636V6.818l-5.455 4.091v9.273Z" />
        <path fill="#EA4335" d="M18.545 3.818v7.091L24 6.818V4.636c0-2.023-2.31-3.178-3.927-1.964l-1.528 1.146Z" />
        <path fill="#FBBC04" d="M0 4.636v2.182l5.455 4.091V3.818L3.927 2.672C2.31 1.459 0 2.613 0 4.636Z" />
        <path fill="#C5221F" d="M5.455 10.909V3.818L12 8.727l6.545-4.909v7.091L12 15.818l-6.545-4.909Z" />
      </svg>
    );
  }

  const brands: Record<Exclude<IconName, "email">, { viewBox: string; color: string; path: ReactNode }> = {
    linkedin: {
      viewBox: "0 0 16 16",
      color: "text-[#0A66C2]",
      path: <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708C16 15.487 15.474 16 14.825 16H1.175C.526 16 0 15.487 0 14.854V1.146Zm4.943 12.248V6.169H2.542v7.225h2.401Zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248h.016Zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4Z" />,
    },
    linktree: {
      viewBox: "0 0 24 24",
      color: "text-[#43E55E]",
      path: <path d="m13.736 5.853 4.005-4.117 2.325 2.381-4.201 4.004h5.909v3.305h-5.937l4.229 4.108-2.325 2.334L12 12.099l-5.74 5.769-2.325-2.325 4.229-4.108H2.226V8.121h5.909L3.934 4.117l2.325-2.381 4.005 4.117V0h3.472v5.853Zm-3.472 10.306h3.472V24h-3.472v-7.841Z" />,
    },
    github: {
      viewBox: "0 0 24 24",
      color: "text-foreground",
      path: <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.22.7-3.9-1.37-3.9-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.72 1.27 3.38.97.11-.75.41-1.27.74-1.56-2.57-.3-5.27-1.29-5.27-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.9 10.9 0 0 1 5.76 0c2.19-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.4-2.71 5.38-5.29 5.67.42.36.79 1.06.79 2.14v3.06c0 .31.21.67.79.56A11.5 11.5 0 0 0 12 .7Z" />,
    },
  };
  const brand = brands[name];

  return (
    <svg viewBox={brand.viewBox} aria-hidden="true" className={`h-6 w-6 fill-current ${brand.color}`}>
      {brand.path}
    </svg>
  );
}

const systems = [
  {
    number: "01",
    title: "Combat Design",
    titleZh: "战斗设计",
    description: "Player actions, enemies, hit reactions, and encounter pacing.",
    descriptionZh: "玩家动作、敌人行为、受击反馈与战斗节奏。",
    image: "/projects/fallen-valkyrie/cover.avif",
    href: "/projects/fallen-valkyrie",
  },
  {
    number: "02",
    title: "Gameplay Systems",
    titleZh: "玩法系统",
    description: "Abilities, targeting, inventory, shops, and reusable gameplay logic.",
    descriptionZh: "技能、索敌、背包、商店与可复用玩法逻辑。",
    image: "/projects/starshore/shop-02.avif",
    href: "/projects/starshore",
  },
  {
    number: "03",
    title: "Technical Animation",
    titleZh: "技术动画",
    description: "State machines, animation Blueprints, retargeting, and runtime rigs.",
    descriptionZh: "状态机、动画蓝图、重定向与运行时绑定。",
    image: "/projects/fallen-valkyrie/character-animation-01.avif",
    href: "/projects/fallen-valkyrie",
  },
  {
    number: "04",
    title: "Tools & Technical Art",
    titleZh: "工具与技术美术",
    description: "Maya tools, procedural workflows, shaders, and asset implementation.",
    descriptionZh: "Maya 工具、程序化流程、着色器与资产接入。",
    image: "/gallery/tools/stylize-normals-toolkit/menus.avif",
    href: "/gallery?entry=vertex-normals-tool",
  },
];

const contactLinks: { label: string; detail: string; detailZh: string; href: string; icon: IconName }[] = [
  { label: "LinkedIn", detail: "Connect professionally", detailZh: "职业联系", href: "https://www.linkedin.com/in/leficious/", icon: "linkedin" },
  { label: "Linktree", detail: "Everything in one place", detailZh: "所有链接汇总", href: "https://linktr.ee/leficious", icon: "linktree" },
  { label: "GitHub", detail: "Tools and code", detailZh: "工具与代码", href: "https://github.com/Leficious", icon: "github" },
];

const outsideEditor = [
  {
    number: "01",
    title: "Music",
    titleZh: "音乐",
    description: "I have played piano and cello for about 15 years, including orchestra and chamber performances. It taught me a lot about timing, rehearsal, and how individual parts fit together.",
    descriptionZh: "我学了约 15 年钢琴和大提琴，也参加过管弦乐团与室内乐演出。长期排练让我对节奏、配合和细节变化一直很敏感。",
  },
  {
    number: "02",
    title: "Movement",
    titleZh: "运动",
    description: "I trained seriously in figure skating, along with ballet and ballroom dance. I still draw on that experience when I think about weight, balance, anticipation, and motion.",
    descriptionZh: "我曾长期训练花样滑冰，也学过芭蕾和标准舞。现在做角色动作时，我仍会想到训练里对重心、平衡和预备动作的要求。",
  },
  {
    number: "03",
    title: "Stories and ideas",
    titleZh: "故事与思考",
    description: "I like moving between technical and human questions: why a mechanic changes player behavior, how media shapes the communities around it, or why a story stays with someone. Games are part of that, but so are anime, novels, history, sociology, and the occasional political rabbit hole.",
    descriptionZh: "我会关注游戏规则如何影响玩家行为，以及一部作品怎样形成自己的社群。平时也喜欢动画、小说、历史和社会学，有时会顺着一个政治话题查很久。",
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
      <Seo title={text("About & Contact — Leficious", "关于与联系 — Leficious")} description={text("About Leficious — technical game designer focused on combat design and gameplay systems, with experience across AI, animation, technical art, and 3D production.", "Leficious 是一名专注战斗设计与玩法系统的技术设计师，具备游戏 AI、技术动画、技术美术与 3D 制作经验。")} path={localizedPath("/about")} />
      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <section className="route-reveal relative isolate overflow-hidden border-x border-b border-border/60 px-6 py-16 sm:px-10 md:py-24 lg:px-14">
          <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-35 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div aria-hidden="true" className="absolute -right-28 -top-32 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

          <div className="grid min-w-0 grid-cols-1 items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="min-w-0">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span className="h-px w-8 bg-warm" />
                {text("Technical / Game designer", "技术设计 / 游戏设计")}
              </div>
              <h1 className="mt-7 max-w-3xl break-words font-display text-5xl font-semibold leading-[0.95] text-balance sm:text-6xl lg:text-7xl">
                {text("Technical design, gameplay systems, ", "技术设计、玩法系统与")}<span className="text-accent">{text("3D production.", "3D 制作。")}</span>
              </h1>
              <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {text("I started out in 3D art. Over time I became more interested in what players could do with the things I was building, so I moved into game design. Combat ended up being the part I enjoyed most. Technical design also lets me stay involved in how the work is built, which suits me.", "我最早做的是 3D 美术，后来逐渐把重心转向游戏设计。比起只完成一个资产，我更想知道玩家能拿它做什么。现在我主要做战斗与技术设计，也会继续参与动画、工具和玩法实现。")}
              </p>
            </div>

            <figure className="relative mx-auto min-w-0 w-full max-w-full sm:max-w-[390px] lg:translate-y-3">
              <span aria-hidden="true" className="absolute -bottom-3 -left-3 h-[72%] w-[72%] border-b border-l border-warm/70" />
              <div className="relative overflow-hidden border border-border/70 bg-surface shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
                <img src="/about/lefi-shan-portrait.webp" alt={text("Portrait of Lefi Shan", "单凯飞（Kevin Shan）肖像")} width="1000" height="1000" className="aspect-[4/5] w-full object-cover object-center" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
              </div>
              <figcaption className="mt-4 flex flex-col items-start gap-1 pl-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <span>{text("Lefi Shan (legal name Kevin Shan)", "单凯飞（Kevin Shan）")}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em]">{text("Los Angeles · California", "美国 · 加利福尼亚州 · 洛杉矶")}</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className="route-reveal border-b border-border/60 py-16 md:py-24" aria-labelledby="systems-title">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Selected disciplines", "主要方向")}</p>
              <h2 id="systems-title" className="mt-4 font-display text-3xl font-semibold leading-tight">{text("What I work on.", "我通常做的工作。")}</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{text("Four parts of development I return to across projects.", "这些方向经常在我的项目里交叉出现。")}</p>
          </div>

          <div className="route-reveal-list grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {systems.map((system) => (
              <Link
                key={system.number}
                to={localizedPath(system.href)}
                viewTransition
                className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-border bg-surface/50 transition-all duration-300 hover:-translate-y-1 hover:border-accent/70 hover:shadow-[0_16px_45px_rgba(0,0,0,0.18)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img src={system.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025] group-hover:brightness-110" />
                  <span className="absolute left-3 top-3 rounded-full border border-foreground/15 bg-background/80 px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] text-foreground backdrop-blur">{system.number}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-accent">{isChinese ? system.titleZh : system.title}</h3>
                    <span aria-hidden="true" className="text-sm text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent">→</span>
                  </div>
                  <p className="zh-readable mt-3 text-sm leading-relaxed text-muted-foreground">{isChinese ? system.descriptionZh : system.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="route-reveal border-t border-border/60 py-16 md:py-24" aria-labelledby="personal-title">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Outside the editor", "编辑器之外")}</p>
              <h2 id="personal-title" className="mt-4 font-display text-3xl font-semibold leading-tight">{text("A little more ", "工作之外的")}<span className="text-warm">{text("about me.", "一些事。")}</span></h2>
              <p className="zh-readable mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{text("I like technically solid work, but I do not want the result to feel sterile. I try to make sure the mechanics and presentation are working toward the same thing.", "我喜欢技术和表现都经得起推敲的作品。做项目时，我也会留意机制、动画和视觉是不是在表达同一件事。")}</p>
            </div>
            <div className="route-reveal-list grid gap-4 md:col-span-8">
              {outsideEditor.map((item) => (
                <article key={item.number} className="grid gap-3 rounded-lg border border-border bg-surface/45 p-5 sm:grid-cols-[auto_1fr] sm:gap-5 sm:p-6">
                  <span className="font-mono text-[9px] tracking-[0.18em] text-warm">{item.number}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{isChinese ? item.titleZh : item.title}</h3>
                    <p className="zh-readable mt-2 text-sm leading-relaxed text-muted-foreground">{isChinese ? item.descriptionZh : item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-4 rounded-lg border border-border/70 bg-background/45 p-6 md:grid-cols-[0.28fr_0.72fr] md:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">{text("A few influences", "一些影响")}</p>
            <p className="zh-readable text-sm leading-relaxed text-muted-foreground"><FormattedText>{text("Zenless Zone Zero is one of my references for how animation, VFX, UI, and graphic design can all push the same attitude. Fire Emblem interests me for a different reason: class abilities, map geometry, turn order, and imperfect information can turn a compact ruleset into decisions that feel personal. A story like Shin Sekai Yori stayed with me enough that I wrote a sociology paper about surveillance, social conditioning, and the systems holding its society together.", "《绝区零》是我观察动画、VFX、UI 和平面设计如何共同塑造作品气质的重要参考。《火焰之纹章》吸引我的则是另一点：职业技能、地图结构、行动顺序和信息差，能让一套并不复杂的规则产生很个人化的选择。《来自新世界》给我留下了很深的印象，我还专门写过一篇社会学论文，讨论其中的监视、社会规训，以及维系这个社会的制度。")}</FormattedText></p>
          </div>
        </section>

        <section className="route-reveal mb-16 grid overflow-hidden rounded-lg border border-border md:grid-cols-[0.32fr_0.68fr]" aria-labelledby="education-title">
          <div className="border-b border-border bg-surface/55 p-6 md:border-b-0 md:border-r md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Foundation", "基础")}</p>
            <h2 id="education-title" className="mt-3 font-display text-2xl font-semibold">{text("Education", "教育背景")}</h2>
          </div>
          <div className="divide-y divide-border/60">
            <div className="grid gap-2 p-6 sm:grid-cols-[1fr_auto] sm:items-end md:px-8"><div><p className="font-display text-lg font-semibold">{text("MS, Game Design and Development", "游戏设计与开发硕士（在读）")}</p><p className="mt-1 text-sm text-muted-foreground">{text("USC School of Cinematic Arts", "南加州大学电影艺术学院")}</p></div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{text("Expected 2028", "预计 2028 年毕业")}</p></div>
            <div className="grid gap-2 p-6 sm:grid-cols-[1fr_auto] sm:items-end md:px-8"><div><p className="font-display text-lg font-semibold">{text("BFA, Digital Production - Games", "数字制作艺术学士（游戏方向）")}</p><p className="mt-1 text-sm text-muted-foreground">{text("Gnomon School of Visual Effects · Featured in Gnomon's student reel", "Gnomon School of Visual Effects · 作品入选 Gnomon 学生作品集锦")}</p></div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">2025</p></div>
          </div>
        </section>

        <section className="route-reveal route-reveal-list mb-16 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2" aria-label={text("Languages and geographic availability", "语言与地区可用性")}>
          <article className="bg-surface/55 p-6 md:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">{text("Languages", "语言")}</p>
            <h2 className="mt-4 font-display text-xl font-semibold">{text("English + Mandarin Chinese", "英语 + 普通话")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{text("English fluent · Mandarin fluent spoken, limited professional reading and writing", "英语流利 · 普通话口语流利；中文专业读写可借助翻译工具")}</p>
          </article>
          <article className="bg-surface/55 p-6 md:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">{text("Geographic availability", "工作地区")}</p>
            <h2 className="mt-4 font-display text-xl font-semibold">{text("Open to select global regions", "可考虑多个国家与地区")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text("United States · Canada · Northern & Western Europe · Japan · China", "美国 · 加拿大 · 北欧与西欧 · 日本 · 中国")}</p>
          </article>
        </section>

        <section id="contact" className="route-reveal relative scroll-mt-24 overflow-hidden rounded-xl border border-border bg-surface/35 p-6 sm:p-10 md:p-12">
          <div aria-hidden="true" className="absolute right-0 top-0 h-40 w-40 bg-[radial-gradient(circle_at_center,var(--color-accent)_1px,transparent_1.5px)] opacity-20 [background-size:12px_12px] [mask-image:linear-gradient(135deg,black,transparent_75%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{text("Contact / Open channel", "联系我 / 合作机会")}</p>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight sm:text-4xl">{text("Let's make something ", "一起做出真正")}<span className="text-accent">{text("feel good", "好玩")}</span>{text(" to play.", "的东西。")}</h2>
              <p className="zh-readable mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{text("If you're building an interesting combat system, gameplay prototype, or anything that needs a designer who can get under the hood, I'd be glad to hear about it.", "如果你正在制作有意思的战斗系统或玩法原型，需要一位愿意亲自参与实现的设计师，欢迎联系我。")}</p>
              <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />{text("Focused on technical, combat, and gameplay design · open to adjacent opportunities", "求职方向：技术设计 / 战斗策划 / 玩法策划 · 也欢迎相关岗位")}</div>
              <a href={isChinese ? "/resume/Kevin_Shan_CN_Game_Resume.pdf" : "/resume/Leficious_Technical_Game_Designer_Resume.pdf"} download className="mt-6 inline-flex items-center gap-3 rounded-full border border-accent/60 bg-background/55 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground">
                {text("Download technical design résumé", "下载中文游戏开发简历")} <span aria-hidden="true">↓</span>
              </a>
            </div>

            <div className="route-reveal-list grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={copyEmail} className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-background/55 p-5 text-left transition-all hover:-translate-y-1 hover:border-accent hover:bg-background">
                <div className="flex items-start justify-between text-muted-foreground transition-colors group-hover:text-accent"><ContactIcon name="email" /><span className="font-mono text-[9px] uppercase tracking-[0.16em]">{copied ? text("Copied", "已复制") : text("Copy", "复制")}</span></div>
                <div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Email</p><span ref={emailRef} className="mt-1 block font-mono text-xs sm:text-sm">leficious@gmail.com</span></div>
              </button>
              {contactLinks.map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="group flex min-h-32 flex-col justify-between rounded-lg border border-border bg-background/55 p-5 transition-all hover:-translate-y-1 hover:border-accent hover:bg-background">
                  <div className="flex items-start justify-between text-muted-foreground transition-colors group-hover:text-accent"><ContactIcon name={link.icon} /><span aria-hidden="true" className="font-mono text-xs transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span></div>
                  <div><p className="font-display text-lg font-semibold">{link.label}</p><p className="mt-1 text-xs text-muted-foreground">{isChinese ? link.detailZh : link.detail}</p></div>
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
