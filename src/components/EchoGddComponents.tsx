import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../lib/language";
import { ECHO_MERMAID_SVGS } from "./echoMermaidSvgs";

export type EchoGddWidgetId =
  | "traveler-arc"
  | "rule-of-three-matrix"
  | "glacier-state-machine"
  | "city-sequence"
  | "woods-telemetry-and-cadence"
  | "world-topology-and-wayfinding";

export function EchoGddWidget({ id }: { id: EchoGddWidgetId }) {
  const { isChinese } = useLanguage();

  switch (id) {
    case "traveler-arc":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "traveler-arc-zh" : "traveler-arc-en"}
          title={isChinese ? "认识论前提与三阶段体验弧线" : "The Epistemological Premise & 3-Stage Arc"}
        />
      );
    case "rule-of-three-matrix":
      return <RuleOfThreeMatrix />;
    case "glacier-state-machine":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "glacier-state-zh" : "glacier-state-en"}
          title={isChinese ? "冰川之海：真伪浮冰状态流转" : "Glacial Ocean: Solid vs. Illusory Iceberg State Flow"}
        />
      );
    case "city-sequence":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "city-sequence-zh" : "city-sequence-en"}
          title={isChinese ? "遗忘之城：多视角记忆合成序列" : "Unremembered City: Overlapping Perspective Sequence"}
        />
      );
    case "woods-telemetry-and-cadence":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "woods-cadence-zh" : "woods-cadence-en"}
          title={isChinese ? "幻影之森：8 秒呼应节拍" : "Illusory Woods: The 8-Second Call-and-Response Cadence"}
        />
      );
    case "world-topology-and-wayfinding":
      return (
        <>
          <MermaidBlock
            diagramKey={isChinese ? "world-topology-zh" : "world-topology-en"}
            title={isChinese ? "声学盆地世界拓扑结构" : "Seamless World Topology"}
          />
          <WayfindingTable />
        </>
      );
  }
}

function MermaidBlock({ diagramKey, title }: { diagramKey: string; title: string }) {
  const { text } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const svg = ECHO_MERMAID_SVGS[diagramKey] ?? "";
  const baseId = "m-" + diagramKey.replace(/[^a-z0-9]/g, "");
  const modalSvg = expanded ? svg.replaceAll(baseId, `${baseId}-modal`) : "";

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  if (!svg) return null;

  return (
    <>
      <figure className="my-8">
        <div className="group relative overflow-hidden rounded-lg border border-border bg-[#1c1f24] p-3 sm:p-6">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setExpanded(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded(true);
              }
            }}
            aria-label={`${text("Expand diagram", "放大图表")}: ${title}`}
            className="w-full cursor-zoom-in overflow-x-auto focus-visible:outline-none"
          >
            <div
              className="mermaid-svg mx-auto min-w-[600px] sm:min-w-0 [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:[-webkit-text-size-adjust:100%]"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="absolute right-3 top-3 rounded border border-foreground/20 bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground opacity-90 backdrop-blur transition-opacity hover:border-accent hover:text-foreground sm:opacity-0 sm:group-hover:opacity-100"
          >
            {text("Expand", "放大")} +
          </button>
        </div>
      </figure>

      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-background/95 p-3 backdrop-blur-xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setExpanded(false);
            }}
          >
            <div className="relative flex max-h-[92vh] w-full max-w-[min(96vw,1600px)] cursor-default flex-col rounded-lg border border-border bg-[#1c1f24] p-4 sm:p-8">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="font-mono text-xs text-muted-foreground">{title}</span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="rounded-full border border-foreground/20 bg-background/90 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground hover:border-accent hover:text-accent"
                >
                  {text("Close", "关闭")} ×
                </button>
              </div>
              <div className="my-auto w-full overflow-auto py-2">
                <div
                  className="mx-auto min-w-[680px] [&_svg]:mx-auto [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg]:[-webkit-text-size-adjust:100%]"
                  dangerouslySetInnerHTML={{ __html: modalSvg }}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function RuleOfThreeMatrix() {
  const { text } = useLanguage();

  const rows = [
    {
      dimension: text("Epistemological Question", "核心认知问题"),
      hub: text("How do I give shape to silence?", "我该如何赋予寂静以形状？"),
      glacier: text("Which signal in the fog is lying?", "雾中的哪一道信号在说谎？"),
      city: text("Whose memory of the past is complete?", "谁对过去的记忆才是完整的？"),
      woods: text("What happens when I leave room to listen?", "当我留出倾听的空白时会发生什么？"),
    },
    {
      dimension: text("Player Habit Subverted", "被颠覆的玩家习惯"),
      hub: text("Relying on permanent sight", "依赖常驻的视觉几何"),
      glacier: text("Treating every lit contour as solid geometry", "默认所有被照亮的轮廓都是实体平台"),
      city: text("Assuming a single observer sees the whole truth", "以为单一视角就能还原全部真相"),
      woods: text("Casting echoes automatically on cooldown (5s)", "冷却一好（5 秒）就机械式连按回声"),
    },
    {
      dimension: text("Acoustic Counterpart", "声学交互对象"),
      hub: text("The Prophecy Tablet (Static Anchor)", "预言石碑（静态锚点）"),
      glacier: text("The Siren (Adversarial Emitter)", "塞壬（对抗性干扰源）"),
      city: text("Muse, Ruler, Architect (Subjective Memories)", "缪斯、统治者、建筑师（主观记忆）"),
      woods: text("The Forest Reply (Delayed Call & Response)", "森林回响（延迟呼应与覆写）"),
    },
    {
      dimension: text("Source of Friction", "核心张力来源"),
      hub: text("Disorientation in open mist", "开阔迷雾中的方向迷失"),
      glacier: text("Distinguishing solid ice from non-solid decoys", "区分实体浮冰与踩踏即沉的幻影诱饵"),
      city: text("Out-of-order attunement collapses the city state", "顺序错误或离开边界会导致城市坍缩重置"),
      woods: text("Speaking too soon overwrites the forest's reply", "过早再次发声会直接抹除森林的回应波"),
    },
    {
      dimension: text("Chromatic & Fog Identity", "色彩与雾场特征"),
      hub: text("Obsidian Teal & Pale Sage", "黑曜青与浅鼠尾草绿"),
      glacier: text("Glacial Slate & Siren Magenta", "冰川灰蓝与塞壬洋红"),
      city: text("Sky Blue / Crimson / Emerald → Unified Gold", "天蓝 / 绯红 / 翡翠 → 统一黄金态"),
      woods: text("Deep Pine & Verdant Green", "深松绿与翠绿"),
    },
    {
      dimension: text("Diegetic Lore Hint", "场景石碑提示"),
      hub: text("“Three silences wait in the mist...”", "“三重寂静在雾中等待……”"),
      glacier: text("“Not every voice across the ice wishes you to reach the shore.”", "“冰面上传来的并非每一道声音，都希望你抵达彼岸。”"),
      city: text("“The city stands whole within the meeting of many eyes.”", "“唯有众目交汇之处，这座城才得以完整矗立。”"),
      woods: text("“The woods have opened to the voice you left room to hear.”", "“森林已向你留出空白去倾听的那道声音敞开。”"),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Design Dimension", "设计维度")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Hub: Stone Monument", "中枢：石之纪念碑")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Region I: Glacial Ocean", "区域 I：冰川之海")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Region II: Unremembered City", "区域 II：遗忘之城")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Region III: Illusory Woods", "区域 III：幻影之森")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-xs">
          {rows.map((row) => (
            <tr key={row.dimension}>
              <td className="p-3.5 font-medium text-foreground">{row.dimension}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{row.hub}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{row.glacier}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{row.city}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{row.woods}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WayfindingTable() {
  const { text } = useLanguage();

  const tiers = [
    {
      scale: text("1. Macro Scale", "1. 宏观尺度"),
      range: "150m to 450m",
      mechanism: text("World Reverberations & Sky Beacons", "全局世界回响与天际光柱"),
      fn: text(
        "Sweeps a 450m golden wave across the entire basin upon regional completion, orienting the player to macro-topography and distant sky beacons.",
        "每完成一个区域，向整个盆地扫过一道 450m 的黄金世界回响，照亮宏观地形与远方天际光柱。",
      ),
    },
    {
      scale: text("2. Meso Scale", "2. 中观尺度"),
      range: "50m to 150m",
      mechanism: text("Dual-Collider Fog & Music Crossfades", "双层边界体积雾与音乐分轨平滑过渡"),
      fn: text(
        "Interpolates volumetric fog color and regional music stems as the player crosses the outskirts between the outer and inner regional boundaries.",
        "当玩家穿过各区域的外边界与内边界缓冲区时，平滑插值体积雾色彩与区域音乐分轨。",
      ),
    },
    {
      scale: text("3. Micro Scale", "3. 微观尺度"),
      range: "15m to 50m",
      mechanism: text("Acoustic Guide Splines", "声学导引流光"),
      fn: text(
        "Shimmering threads along arterial paths that activate briefly when struck by an echo, guiding transitions between the hub and regional outskirts without UI arrows.",
        "沿主干路径铺设的声学导引流光，在被回声扫过时短暂亮起，在不借助任何 UI 箭头的情况下引导中枢与各区域外围的衔接。",
      ),
    },
    {
      scale: text("4. Immediate Scale", "4. 贴身尺度"),
      range: "0m to 15m",
      mechanism: text("Seen vs. Unseen Visibility Hierarchy", "常驻剪影与回声显形层级"),
      fn: text(
        "Primary landmarks retain a faint silhouette in the fog, while secondary terrain and hidden routes appear only while an echo wave passes over them.",
        "核心地标在浓雾中保留淡淡的剪影，而次级地形与隐藏路径仅在声波扫过时显形。",
      ),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Wayfinding Scale", "寻路尺度")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Effective Range", "有效距离")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Diegetic Mechanism", "内生机制")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Navigational Function", "空间导引作用")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-xs">
          {tiers.map((tier) => (
            <tr key={tier.scale}>
              <td className="p-3.5 font-medium text-foreground whitespace-nowrap">{tier.scale}</td>
              <td className="border-l border-border/50 p-3.5 font-mono text-muted-foreground whitespace-nowrap">{tier.range}</td>
              <td className="border-l border-border/50 p-3.5 font-medium text-foreground/90">{tier.mechanism}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{tier.fn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
