import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App";
import { LanguageProvider } from "./lib/language";

export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = "";
    output.on("data", chunk => { html += chunk.toString(); });
    output.on("end", () => resolve(html));
    output.on("error", reject);
    const stream = renderToPipeableStream(
      <StaticRouter location={path}><LanguageProvider><App /></LanguageProvider></StaticRouter>,
      { onAllReady() { stream.pipe(output); }, onError: reject },
    );
  });
}
