import { Fragment } from "react";

const formalWorkTitles = [
  "Zenless Zone Zero",
  "Fire Emblem",
  "Fire Emblem Fates",
  "Fire Emblem Engage",
  "Monogatari Series",
  "Shin Sekai Yori",
  "Fate/Grand Order",
  "The Terminator",
  "Spirited Away",
  "Starshore",
  "Fallen Valkyrie",
  "Sacred Forest",
  "《绝区零》",
  "《火焰之纹章》",
  "《火焰之纹章 if》",
  "《火焰之纹章 Engage》",
  "《物语系列》",
  "《来自新世界》",
  "《星岸》",
  "《堕落女武神》",
  "《圣域森林》",
];

const escapedTitles = formalWorkTitles
  .sort((a, b) => b.length - a.length)
  .map((title) => title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
const titlePattern = new RegExp(`(${escapedTitles.join("|")})`, "g");
const formalWorkTitleSet = new Set(formalWorkTitles);

export function FormattedText({ children }: { children: string }) {
  return (
    <>
      {children.split(titlePattern).map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {formalWorkTitleSet.has(part) ? <cite className="italic">{part}</cite> : part}
        </Fragment>
      ))}
    </>
  );
}
