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
  },
  {
    path: "/about",
    title: "About & Contact — Leficious",
    description:
      "About Leficious — technical game designer focused on combat design and gameplay systems, with experience across AI, animation, technical art, and 3D production.",
    image: "/social/leficious-site-preview.png",
    imageWidth: 1584,
    imageHeight: 396,
    schemaType: "ProfilePage",
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
      /<script type="application\/ld\+json" data-portfolio-structured-data>.*?<\/script>/,
      `<script type="application/ld+json" data-portfolio-structured-data>${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>`,
    );

  const output = join("dist", route.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

await copyFile("dist/index.html", "dist/404.html");
