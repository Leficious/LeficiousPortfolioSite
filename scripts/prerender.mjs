import { readFile, writeFile } from "node:fs/promises";
import { render } from "../.prerender/entry-server.js";

const paths = ["/", "/about", "/gallery", "/projects/starshore", "/projects/fallen-valkyrie", "/projects/sacred-forest"];
for (const path of [...paths, ...paths.map(path => path === "/" ? "/zh" : `/zh${path}`)]) {
  const file = path === "/" ? "dist/index.html" : `dist${path}/index.html`;
  const template = await readFile(file, "utf8");
  const content = await render(path);
  if (!content.includes('<h1')) throw new Error(`Missing primary heading: ${path}`);
  await writeFile(file, template.replace('<div id="root"></div>', () => `<div id="root" data-prerender-path="${path}">${content}</div>`));
  console.log(`Prerendered ${path}`);
}
