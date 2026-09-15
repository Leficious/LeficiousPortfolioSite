import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const routes = [
  {
    path: "/gallery",
    title: "Gallery — Leficious",
    description:
      "A gallery of 3D, 2D, environment, character, animation, and technical art work by Leficious.",
  },
  {
    path: "/about",
    title: "About & Contact — Leficious",
    description:
      "About Leficious — technical and combat designer focused on combat systems, AI, and tooling. Contact and portfolio links.",
  },
  {
    path: "/projects/starshore",
    title: "Starshore — Leficious",
    description:
      "A 15-week gameplay prototype connecting character movement, abilities, targeting, inventory, shops, and data-driven pickups.",
  },
  {
    path: "/projects/adaptive-enemy-ai",
    title: "Adaptive Enemy AI — Leficious",
    description:
      "Utility-AI driven enemies that adapt aggression based on the player's recent combat behavior.",
  },
  {
    path: "/projects/modular-weapon-framework",
    title: "Modular Weapon Framework — Leficious",
    description:
      "A data-driven weapon system with hot-swappable movesets, hit reactions, and VFX hooks.",
  },
  {
    path: "/projects/encounter-balancing-tool",
    title: "Encounter Balancing Tool — Leficious",
    description:
      "A Python tool that simulates thousands of encounters to surface difficulty outliers before playtesting.",
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
      /<meta name="twitter:title" content=".*?"\s*\/?>/,
      `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`,
    )
    .replace(
      /<meta name="twitter:description" content=".*?"\s*\/?>/,
      `<meta name="twitter:description" content="${escapeAttribute(route.description)}" />`,
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
