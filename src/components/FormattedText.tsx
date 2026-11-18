import { Fragment, type ReactNode } from "react";

const formalWorkTitles = [
  "Alice's Adventures in Wonderland",
  "Zenless Zone Zero",
  "Fire Emblem Fates: Conquest",
  "Fire Emblem Fates",
  "Fire Emblem Engage",
  "Fire Emblem",
  "Monogatari Series",
  "Shin Sekai Yori",
  "Papo & Yo",
  "Paprika",
  "Superliminal",
  "Fate/Grand Order",
  "The Terminator",
  "Spirited Away",
  "Starshore",
  "Fallen Valkyrie",
  "Sacred Forest",
  "《绝区零》",
  "《火焰之纹章 if：暗夜王国》",
  "《火焰之纹章 if》",
  "《火焰之纹章 Engage》",
  "《火焰之纹章》",
  "《明日方舟》",
  "《物语系列》",
  "《来自新世界》",
  "《爱丽丝梦游仙境》",
  "《红辣椒》",
  "《星岸》",
  "《堕落女武神》",
  "《圣域森林》",
];

const escapedTitles = [...formalWorkTitles]
  .sort((a, b) => b.length - a.length)
  .map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const titlePattern = new RegExp(`(${escapedTitles.join("|")})`, "g");
const formalWorkTitleSet = new Set(formalWorkTitles);
const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function renderItalicTitles(segment: string, keyPrefix: string) {
  return segment.split(titlePattern).map((part, index) => (
    <Fragment key={`${keyPrefix}-${index}`}>
      {formalWorkTitleSet.has(part) ? <cite className="italic">{part}</cite> : part}
    </Fragment>
  ));
}

export function FormattedText({ children }: { children: string }) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const regex = new RegExp(markdownLinkPattern);

  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(renderItalicTitles(children.slice(lastIndex, match.index), `t-${lastIndex}`));
    }
    const [, label, href] = match;
    nodes.push(
      <a
        key={`l-${match.index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-current underline decoration-current/45 underline-offset-4 transition-opacity hover:opacity-75"
      >
        {renderItalicTitles(label, `lt-${match.index}`)}
        <span aria-hidden="true" className="ml-0.5 font-mono text-[0.78em] opacity-80">↗</span>
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < children.length) {
    nodes.push(renderItalicTitles(children.slice(lastIndex), `t-${lastIndex}`));
  }

  return <>{nodes}</>;
}
