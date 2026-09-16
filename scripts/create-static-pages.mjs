import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const routes = [
  {
    path: "/gallery",
    title: "Gallery — Leficious",
    description:
      "A gallery of 3D, 2D, environment, character, animation, and technical art work by Leficious.",
    image: "/gallery/thumbnails/water-blossoms.webp",
  },
  {
    path: "/about",
    title: "About & Contact — Leficious",
    description:
      "About Leficious — technical game designer focused on combat design and gameplay systems, with experience across AI, animation, technical art, and 3D production.",
    image: "/social/leficious-site-preview.png",
  },
  {
    path: "/projects/starshore",
    title: "Starshore — Leficious",
    description:
      "A 15-week gameplay prototype connecting character movement, abilities, targeting, inventory, shops, and data-driven pickups.",
    image: "/projects/starshore/design-layout-01.avif",
  },
  {
    path: "/projects/fallen-valkyrie",
    title: "Fallen Valkyrie — Leficious",
    description:
      "A 10-week action-combat prototype centered on weapon-dependent movesets, directional hit reactions, lock-on targeting, and a multiphase boss encounter.",
    image: "/projects/fallen-valkyrie/cover.avif",
  },
  {
    path: "/projects/sacred-forest",
    title: "Sacred Forest — Leficious",
    description:
      "A stylized forest shrine developed end to end through modeling, procedural materials, foliage, lighting, effects, and engine assembly.",
    image: "/projects/sacred-forest/cover.avif",
  },
];

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const shell = await readFile("dist/index.html", "utf8");

for (const route of routes) {
  const canonical = `https://leficious.com${route.path}`;
  const socialImage = `https://leficious.com${route.image}`;
  const html = shell
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
      /<meta property="og:image" content=".*?"\s*\/?>/,
      `<meta property="og:image" content="${socialImage}" />`,
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
    );

  const output = join("dist", route.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

await copyFile("dist/index.html", "dist/404.html");
