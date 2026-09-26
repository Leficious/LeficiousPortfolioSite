import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const routes = [
  {
    path: "/gallery",
    title: "Gallery — Leficious",
    description:
      "A gallery of technical design, 3D, 2D, environment, character, animation, and technical art work by Leficious.",
    image: "/gallery/thumbnails/water-blossoms.webp",
    imageWidth: 1000,
    imageHeight: 563,
    schemaType: "CollectionPage",
    lang: "en",
  },
  {
    path: "/about",
    title: "About & Contact — Leficious",
    description:
      "About Leficious — technical game designer focused on combat design and gameplay systems, with experience across AI, animation, technical art, and 3D production.",
    image: "/social/leficious-og-1200x630.png",
    imageWidth: 1200,
    imageHeight: 630,
    schemaType: "ProfilePage",
    lang: "en",
  },
  {
    path: "/projects/starshore",
    title: "Starshore — Leficious",
    description:
      "A 15-week gameplay prototype connecting character movement, abilities, targeting, inventory, shops, and data-driven pickups.",
    image: "/projects/starshore/design-layout-01.avif",
    imageWidth: 1589,
    imageHeight: 920,
    schemaType: "CreativeWork",
    lang: "en",
  },
  {
    path: "/projects/fallen-valkyrie",
    title: "Fallen Valkyrie — Leficious",
    description:
      "A 10-week action-combat prototype centered on weapon-dependent movesets, directional hit reactions, lock-on targeting, and a multiphase boss encounter.",
    image: "/projects/fallen-valkyrie/cover.avif",
    imageWidth: 1715,
    imageHeight: 963,
    schemaType: "CreativeWork",
    lang: "en",
  },
  {
    path: "/projects/sacred-forest",
    title: "Sacred Forest — Leficious",
    description:
      "A stylized forest shrine developed end to end through modeling, procedural materials, foliage, lighting, effects, and engine assembly.",
    image: "/projects/sacred-forest/cover.avif",
    imageWidth: 1715,
    imageHeight: 963,
    schemaType: "CreativeWork",
    lang: "en",
  },
  {
    path: "/zh",
    title: "Leficious — 技术与战斗设计作品集",
    description: "Leficious 的精选作品，涵盖战斗设计、玩法系统、技术动画、AI 与游戏 3D 制作。",
    image: "/social/leficious-og-1200x630.png",
    imageWidth: 1200,
    imageHeight: 630,
    schemaType: "WebSite",
    lang: "zh-CN",
  },
  {
    path: "/zh/gallery",
    title: "作品画廊 — Leficious",
    description: "Leficious 的技术设计、3D、2D、环境、角色、动画与技术美术作品画廊。",
    image: "/gallery/thumbnails/water-blossoms.webp",
    imageWidth: 1000,
    imageHeight: 563,
    schemaType: "CollectionPage",
    lang: "zh-CN",
  },
  {
    path: "/zh/about",
    title: "关于与联系 — Leficious",
    description: "关于 Leficious：专注战斗设计与玩法系统的技术游戏设计师，具备 AI、动画、技术美术与 3D 制作经验。",
    image: "/social/leficious-og-1200x630.png",
    imageWidth: 1200,
    imageHeight: 630,
    schemaType: "ProfilePage",
    lang: "zh-CN",
  },
  {
    path: "/zh/projects/starshore",
    title: "Starshore — Leficious",
    description: "一个为期 15 周的玩法原型，将角色移动、能力、瞄准、背包、商店与数据驱动拾取系统连接起来。",
    image: "/projects/starshore/design-layout-01.avif",
    imageWidth: 1589,
    imageHeight: 920,
    schemaType: "CreativeWork",
    lang: "zh-CN",
  },
  {
    path: "/zh/projects/fallen-valkyrie",
    title: "Fallen Valkyrie — Leficious",
    description: "一个为期 10 周的动作战斗原型，围绕武器相关招式、方向性受击反馈、锁定目标与多阶段 Boss 战展开。",
    image: "/projects/fallen-valkyrie/cover.avif",
    imageWidth: 1715,
    imageHeight: 963,
    schemaType: "CreativeWork",
    lang: "zh-CN",
  },
  {
    path: "/zh/projects/sacred-forest",
    title: "Sacred Forest — Leficious",
    description: "一个从建模、程序化材质、植被、灯光、特效到引擎搭建完整制作的风格化森林神社。",
    image: "/projects/sacred-forest/cover.avif",
    imageWidth: 1715,
    imageHeight: 963,
    schemaType: "CreativeWork",
    lang: "zh-CN",
  },
];

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const shell = await readFile("dist/index.html", "utf8");

const personId = "https://leficious.com/#person";
const person = { "@type": "Person", "@id": personId, name: "Lefi (Kevin) Shan", alternateName: "Leficious", url: "https://leficious.com/", jobTitle: "Technical Game Designer", sameAs: ["https://www.linkedin.com/in/leficious/", "https://github.com/Leficious"] };
const imageType = (path) => path.endsWith(".png") ? "image/png" : path.endsWith(".webp") ? "image/webp" : "image/avif";

for (const route of routes) {
  const canonical = `https://leficious.com${route.path}`;
  const socialImage = `https://leficious.com${route.image}`;
  const pageData = route.schemaType === "CreativeWork"
    ? { "@type": "CreativeWork", name: route.title.replace(" — Leficious", ""), description: route.description, url: canonical, image: socialImage, creator: { "@id": personId } }
    : { "@type": route.schemaType, name: route.title, description: route.description, url: canonical, image: socialImage, author: { "@id": personId } };
  const structuredData = { "@context": "https://schema.org", "@graph": [person, pageData] };
  const englishPath = route.path.replace(/^\/zh(?=\/|$)/, "") || "/";
  const chinesePath = englishPath === "/" ? "/zh" : `/zh${englishPath}`;
  const html = shell
    .replace(/<html lang=".*?"/, `<html lang="${route.lang}"`)
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description" content=".*?"\s*\/?>/,
      `<meta name="description" content="${escapeAttribute(route.description)}" />`,
    )
    .replace(
      /<meta property="og:title" content=".*?"\s*\/?>/,
      `<meta property="og:title" content="${escapeAttribute(route.title)}" />`,
    )
    .replace(
      /<meta property="og:description" content=".*?"\s*\/?>/,
      `<meta property="og:description" content="${escapeAttribute(route.description)}" />`,
    )
    .replace(
      /<meta property="og:url" content=".*?"\s*\/?>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /<meta property="og:locale" content=".*?"\s*\/?>/,
      `<meta property="og:locale" content="${route.lang === "zh-CN" ? "zh_CN" : "en_US"}" />`,
    )
    .replace(
      /<meta property="og:image" content=".*?"\s*\/?>/,
      `<meta property="og:image" content="${socialImage}" />`,
    )
    .replace(
      /<meta property="og:image:width" content=".*?"\s*\/?>/,
      `<meta property="og:image:width" content="${route.imageWidth}" />`,
    )
    .replace(
      /<meta property="og:image:height" content=".*?"\s*\/?>/,
      `<meta property="og:image:height" content="${route.imageHeight}" />`,
    )
    .replace(
      /<meta property="og:image:type" content=".*?"\s*\/?>/,
      `<meta property="og:image:type" content="${imageType(route.image)}" />`,
    )
    .replace(
      /<meta name="twitter:title" content=".*?"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content=".*?"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeAttribute(route.description)}" />`,
    )
    .replace(
      /<meta name="twitter:image" content=".*?"\s*\/?>/,
      `<meta name="twitter:image" content="${socialImage}" />`,
    )
    .replace(
      /<link rel="canonical" href=".*?"\s*\/?>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replace(
      /<link rel="alternate" hreflang="en" href=".*?"\s*\/?>/,
      `<link rel="alternate" hreflang="en" href="https://leficious.com${englishPath === "/" ? "/" : englishPath}" />`,
    )
    .replace(
      /<link rel="alternate" hreflang="zh-CN" href=".*?"\s*\/?>/,
      `<link rel="alternate" hreflang="zh-CN" href="https://leficious.com${chinesePath}" />`,
    )
    .replace(
      /<link rel="alternate" hreflang="x-default" href=".*?"\s*\/?>/,
      `<link rel="alternate" hreflang="x-default" href="https://leficious.com${englishPath === "/" ? "/" : englishPath}" />`,
    )
    .replace(
      /<script type="application\/ld\+json" data-portfolio-structured-data>.*?<\/script>/,
      `<script type="application/ld+json" data-portfolio-structured-data>${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>`,
    );

  const output = join("dist", route.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

await copyFile("dist/index.html", "dist/404.html");
