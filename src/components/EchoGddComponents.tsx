import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../lib/language";

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
      return <MermaidBlock chart={isChinese ? TRAVELER_ARC_ZH : TRAVELER_ARC_EN} title={isChinese ? "认识论前提与三阶段体验弧线" : "The Epistemological Premise & 3-Stage Arc"} />;
    case "rule-of-three-matrix":
      return <RuleOfThreeMatrix />;
    case "glacier-state-machine":
      return <MermaidBlock chart={isChinese ? GLACIER_STATE_ZH : GLACIER_STATE_EN} title={isChinese ? "冰川之海：真伪浮冰状态流转" : "Glacial Ocean: Solid vs. Illusory Iceberg State Flow"} />;
    case "city-sequence":
      return <MermaidBlock chart={isChinese ? CITY_SEQUENCE_ZH : CITY_SEQUENCE_EN} title={isChinese ? "遗忘之城：多视角记忆合成序列" : "Unremembered City: Overlapping Perspective Sequence"} />;
    case "woods-telemetry-and-cadence":
      return <MermaidBlock chart={isChinese ? WOODS_CADENCE_ZH : WOODS_CADENCE_EN} title={isChinese ? "幻影之森：8 秒呼应节拍" : "Illusory Woods: The 8-Second Call-and-Response Cadence"} />;
    case "world-topology-and-wayfinding":
      return (
        <>
          <MermaidBlock chart={isChinese ? WORLD_TOPOLOGY_ZH : WORLD_TOPOLOGY_EN} title={isChinese ? "声学盆地世界拓扑结构" : "Seamless World Topology"} />
          <WayfindingTable />
        </>
      );
  }
}

const TRAVELER_ARC_EN = `flowchart TD
    subgraph Thesis["The Epistemological Premise (World as Presence)"]
        P["<b>“An Echo Has No Intrinsic Shape”</b><br/>The Traveler never perceives the world directly, only what returns through presence, movement, and attention."]
    end

    P --> C1["<b>Constraint #1: One Unchanging Verb</b><br/>Only <i>Cast Echo (E)</i> & <i>Attune (F)</i>.<br/>Depth comes from changing the world's rules,<br/>not expanding the player's toolkit."]
    P --> C2["<b>Constraint #2: Interpretation Over Mastery</b><br/>No enemies or dexterity fail-states.<br/>Tension comes from tolerating absence<br/>and questioning what appears in the fog."]
    P --> C3["<b>Constraint #3: Diegetic & Seamless</b><br/>No cutscenes, quest logs, or HUD markers.<br/>All 3 regions exist in one continuous<br/>fog volume connected by reverberations."]

    C1 & C2 & C3 --> Arc["<b>The Traveler's 3-Stage Experiential Arc</b>"]

    Arc --> S1["<b>I. Glacial Ocean (Deception)</b><br/><i>“Can I trust what appears in the fog?”</i><br/>Cross-examining your echo against the Siren's false claims."]
    Arc --> S2["<b>II. Unremembered City (Bearing Witness)</b><br/><i>“Whose memory of the world is complete?”</i><br/>Synthesizing three biased historical projections."]
    Arc --> S3["<b>III. Illusory Woods (Relinquishing Control)</b><br/><i>“What happens when I stop forcing my voice?”</i><br/>Realizing your own echoes sustain the barrier; pausing to listen."]`;

const TRAVELER_ARC_ZH = `flowchart TD
    subgraph Thesis["认识论前提（作为在场的世界）"]
        P["<b>“回声本身并无固有之形”</b><br/>旅人从不直接看见客观世界，只能感知通过自身在场、移动与倾听而折返的回响。"]
    end

    P --> C1["<b>设计约束 #1：单一不变动词</b><br/>全程仅有<i>释放回声 (E)</i> 与<i>共鸣 (F)</i>。<br/>深度来自改变世界回应的认知规则，<br/>而非扩充角色技能列表。"]
    P --> C2["<b>设计约束 #2：解读优先于操作</b><br/>没有敌人或操作型失败惩罚。<br/>张力来自对空白的耐受，<br/>以及对雾中显形之物的审视。"]
    P --> C3["<b>设计约束 #3：内生规则与单场景</b><br/>零过场动画、任务日志或 HUD 路标。<br/>三大区域共存于同一连续雾场中，<br/>由世界回响彼此相连。"]

    C1 & C2 & C3 --> Arc["<b>旅人的三阶段体验弧线</b>"]

    Arc --> S1["<b>I. 冰川之海（欺瞒）</b><br/><i>“我能相信雾中显形的轮廓吗？”</i><br/>用自己的回声与塞壬的虚假信号交叉求证。"]
    Arc --> S2["<b>II. 遗忘之城（见证）</b><br/><i>“谁对过去的记忆才是完整的？”</i><br/>在三段偏颇的历史投影间识别规律并拼合废墟。"]
    Arc --> S3["<b>III. 幻影之森（克制）</b><br/><i>“当我停止强行发声时会发生什么？”</i><br/>意识到正是自己的回声维持着迷障，停下脚步倾听回应。"]`;

const GLACIER_STATE_EN = `stateDiagram-v2
    direction LR
    [*] --> HiddenInFog: Hidden Stepping Stone

    state "Solid Iceberg (Anchor + Hidden)" as Solid {
        HiddenInFog --> RevealedWhite: Player Echo (E)
        RevealedWhite --> OverwrittenPink: Siren Pulse (35% Overwrite)
        RevealedWhite --> ErasedToFog: Siren Pulse (40% Erase)
        RevealedWhite --> RetainedWhite: Siren Pulse (25% Untouched)
        OverwrittenPink --> RevealedWhite: Player Re-Echoes (E)
        ErasedToFog --> RevealedWhite: Player Re-Echoes (E)
    }

    state "Illusory Iceberg (Non-Solid Trap)" as Fake {
        InvisibleInFog --> RemainsInvisible: Player Echo (E) (0% Reveal)
        InvisibleInFog --> ConjuredPink: Siren Pulse (70% False Reveal)
        ConjuredPink --> WaterHazard: Player Steps On (Submerges)
    }`;

const GLACIER_STATE_ZH = `stateDiagram-v2
    direction LR
    [*] --> HiddenInFog: 隐形实体浮冰

    state "实体浮冰（常驻锚点 + 隐形踏脚石）" as Solid {
        HiddenInFog --> RevealedWhite: 玩家回声 (E)
        RevealedWhite --> OverwrittenPink: 塞壬脉冲（35% 篡改为粉红）
        RevealedWhite --> ErasedToFog: 塞壬脉冲（40% 抹回浓雾）
        RevealedWhite --> RetainedWhite: 塞壬脉冲（25% 保持白色）
        OverwrittenPink --> RevealedWhite: 玩家再次回声 (E)
        ErasedToFog --> RevealedWhite: 玩家再次回声 (E)
    }

    state "虚幻浮冰（非实体溺水陷阱）" as Fake {
        InvisibleInFog --> RemainsInvisible: 玩家回声 (E)（0% 显形）
        InvisibleInFog --> ConjuredPink: 塞壬脉冲（70% 虚假点亮粉红）
        ConjuredPink --> WaterHazard: 玩家踏上（下沉落水）
    }`;

const CITY_SEQUENCE_EN = `sequenceDiagram
    autonumber
    actor Player
    participant Tablet as 0. Central Tablet (Plaza)
    participant Muse as 1. The Muse (SW: Sky-Blue)
    participant Ruler as 2. The Ruler (SE: Crimson)
    participant Arch as 3. The Architect (NE: Emerald)
    participant City as Multi-Wave State & Fog

    Player->>Tablet: Attune / Read (F)
    Tablet->>City: Neutral Wave (Stage 0)<br/>Reveals baseline skeletal ruins
    Player->>Muse: Attune to Muse (SW Quarter)
    Muse->>City: Wave #1 (Sky-Blue) + Cerulean Fog<br/>Materializes courtyards & living flora
    Player->>Ruler: Attune to Ruler (SE Quarter)
    Ruler->>City: Wave #2 (Crimson) + Crimson Fog<br/>Layers colonnades & gates over flora
    alt Player Attunes Out of Sequence or Exits City Bounds
        City-->>Player: Spatial Reset Wave (45 m/s)<br/>Collapses unfinished perspective chain back to fog
    else Player Attunes to Architect (NE Quarter)
        Player->>Arch: Attune to Architect
        Arch->>City: Wave #3 (Emerald) -> Synthesizes Stage 4 Gold Wave<br/>All three perspective groups stand simultaneously
        City-->>Player: Triggers Global World Reverberation
    end`;

const CITY_SEQUENCE_ZH = `sequenceDiagram
    autonumber
    actor Player as 玩家
    participant Tablet as 0. 中央石碑（中心广场）
    participant Muse as 1. 缪斯（西南：天蓝）
    participant Ruler as 2. 统治者（东南：绯红）
    participant Arch as 3. 建筑师（东北：翡翠）
    participant City as 多重波纹状态与雾场

    Player->>Tablet: 共鸣 / 阅读 (F)
    Tablet->>City: 中性基准波（第 0 阶段）<br/>显形基础街道网格与废墟骨架
    Player->>Muse: 与缪斯雕像共鸣（西南街区）
    Muse->>City: 波纹 #1（天蓝）+ 蔚蓝雾场<br/>具象化庭院与繁茂植被
    Player->>Ruler: 与统治者雕像共鸣（东南街区）
    Ruler->>City: 波纹 #2（绯红）+ 绯红雾场<br/>在植被之上叠加门廊与柱列
    alt 顺序错误或中途离开城市外边界
        City-->>Player: 空间重置波（45 m/s）<br/>将未完成的记忆投影坍缩回迷雾
    else 与建筑师雕像共鸣（东北街区）
        Player->>Arch: 与建筑师雕像共鸣
        Arch->>City: 波纹 #3（翡翠）-> 合成为第 4 阶段黄金波纹<br/>三大主观视角建筑群同时完整矗立
        City-->>Player: 触发全局黄金世界回响
    end`;

const WOODS_CADENCE_EN = `flowchart LR
    subgraph Timeline["The 8-Second Call-and-Response Cadence"]
        direction LR
        T0["<b>t = 0.0s: Player Presses E</b><br/>White pulse sweeps out (14 m/s).<br/>Illuminates pass-through illusory walls.<br/><i>Player Cooldown (5.0s) starts.</i>"]
        T3["<b>t = 3.0s: The Silence Threshold</b><br/>White ring fades in the distance.<br/><b>Forest Reply (Green)</b> erupts at 50 m/s.<br/>Illusory walls dissolve for 5.0s."]
        T5["<b>t = 5.0s: The Temptation Window</b><br/>Player's E cooldown finishes while<br/>Forest Reply is holding open the path<br/>(t = 3.0s to 8.0s)."]
    end

    T0 --> T3 --> T5
    T5 -- "Player Refrains From Pressing E<br/>(Listens & Walks Through)" --> Win["<b>Path Remains Open (5.0s Hold)</b><br/>Player walks through dissolved barriers<br/>toward the SW Sentinel Tower"]
    T5 -- "Player Presses E on Cooldown<br/>(Interrupts Reply)" --> Punish["<b>Active Wave Overwrite (0.35s)</b><br/>Player's white wave erases green wave,<br/>ducks forest audio, & restores barriers"]`;

const WOODS_CADENCE_ZH = `flowchart LR
    subgraph Timeline["8 秒呼应节拍"]
        direction LR
        T0["<b>t = 0.0s：玩家按下 E</b><br/>白色声波向外扩散（14 m/s）。<br/>点亮可穿过的虚幻树墙。<br/><i>启动 5.0 秒技能冷却。</i>"]
        T3["<b>t = 3.0s：静默阈值</b><br/>玩家白波在远处消散。<br/><b>森林翠绿回应波</b>以 50 m/s 爆发。<br/>虚幻树墙消融敞开 5.0 秒。"]
        T5["<b>t = 5.0s：诱惑窗口</b><br/>森林回应波维持通道敞开期间<br/>（t = 3.0s 至 8.0s），<br/>玩家的 E 键冷却恰好转好。"]
    end

    T0 --> T3 --> T5
    T5 -- "克制按 E<br/>（倾听并穿过）" --> Win["<b>通道保持敞开（持续 5.0s）</b><br/>玩家穿过消融的树墙<br/>抵达西南方哨塔终点"]
    T5 -- "冷却一好立即按 E<br/>（打断森林回应）" --> Punish["<b>主动声波覆写（0.35s）</b><br/>玩家白波当面抹除绿波、<br/>压低森林音效并重新闭合树墙"]`;

const WORLD_TOPOLOGY_EN = `flowchart TD
    Hub["<b>Central Hub: Stone Monument</b><br/>Prophecy Tablet & Acoustic Guide Splines"]

    subgraph NorthWest["Northwest Basin: Glacial Ocean"]
        G_Start["Glacier Entry Tablet"] --> G_Mid["Midpoint Tablet & Siren Emitters"] --> G_End["Glacier End Tablet & Sky Beacon"]
    end

    subgraph East["Eastern Plateau: Unremembered City"]
        C_Tab["0. Central Plaza Tablet & Sky Beacon"] --> C_Witness["1. Muse (SW) → 2. Ruler (SE) → 3. Architect (NE)"]
    end

    subgraph South["Southern Valley: Illusory Woods"]
        W_In["NW & SE Outskirts Tablets"] --> W_Src["3.0s Forest Reply Center"] --> W_End["SW Clearing, Sentinel Tower & Sky Beacon"]
    end

    Hub -->|"NW Guide Spline"| G_Start
    Hub -->|"West Bridge Causeway"| C_Tab
    Hub -->|"SW Guide Spline"| W_In

    G_End ==>|"Completion Pulse #1"| Gate["<b>World Reverberation & Golden Gate</b><br/>Unlocks at 3/3 Regional Silences Broken"]
    C_Witness ==>|"Completion Pulse #2"| Gate
    W_End ==>|"Completion Pulse #3"| Gate`;

const WORLD_TOPOLOGY_ZH = `flowchart TD
    Hub["<b>中央中枢：石之纪念碑</b><br/>预言石碑与声学导引流光"]

    subgraph NorthWest["西北盆地：冰川之海"]
        G_Start["冰川起点石碑"] --> G_Mid["中点石碑与塞壬干扰源"] --> G_End["冰川终点石碑与天际光柱"]
    end

    subgraph East["东部高地：遗忘之城"]
        C_Tab["0. 中心广场石碑与天际光柱"] --> C_Witness["1. 缪斯（西南）→ 2. 统治者（东南）→ 3. 建筑师（东北）"]
    end

    subgraph South["南部山谷：幻影之森"]
        W_In["西北与东南外围石碑"] --> W_Src["3.0 秒森林回应中心"] --> W_End["西南空地、哨塔与天际光柱"]
    end

    Hub -->|"西北导引流光"| G_Start
    Hub -->|"西侧长桥通道"| C_Tab
    Hub -->|"西南导引流光"| W_In

    G_End ==>|"完成脉冲 #1"| Gate["<b>全局世界回响与黄金大门</b><br/>打破 3/3 区域寂静后解锁"]
    C_Witness ==>|"完成脉冲 #2"| Gate
    W_End ==>|"完成脉冲 #3"| Gate`;

function MermaidBlock({ chart, title }: { chart: string; title: string }) {
  const { text } = useLanguage();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(async (mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        securityLevel: "loose",
        markdownAutoWrap: false,
        fontFamily: '"DM Sans Variable", system-ui, sans-serif',
        flowchart: {
          htmlLabels: true,
          wrappingWidth: 900,
          nodeSpacing: 32,
          rankSpacing: 38,
          padding: 12,
        },
        themeVariables: {
          darkMode: true,
          background: "#1c1f24",
          primaryColor: "#181a1f",
          primaryTextColor: "#e8edf2",
          primaryBorderColor: "#8b95a1",
          lineColor: "#9aa4b0",
          secondaryColor: "#20242b",
          tertiaryColor: "#181a1f",
          clusterBkg: "#1e2229",
          clusterBorder: "#8b95a1",
          edgeLabelBackground: "#23272f",
          actorBkg: "#181a1f",
          actorBorder: "#8b95a1",
          actorTextColor: "#e8edf2",
          actorLineColor: "#8b95a1",
          signalColor: "#9aa4b0",
          signalTextColor: "#e8edf2",
          labelBoxBkgColor: "#1e2229",
          labelBoxBorderColor: "#8b95a1",
          labelTextColor: "#e8edf2",
          loopTextColor: "#e8edf2",
          noteBkgColor: "#23272f",
          noteTextColor: "#e8edf2",
          noteBorderColor: "#8b95a1",
        },
      });
      try {
        const { svg: rendered } = await mermaid.render(`mermaid-${id}-${Math.random().toString(36).slice(2, 7)}`, chart);
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        console.error("Mermaid render error:", err);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

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

  if (!svg) {
    return <div className="my-8 min-h-48 rounded-lg border border-border bg-[#1c1f24] p-6" />;
  }

  return (
    <>
      <figure className="my-8">
        <div className="group relative overflow-hidden rounded-lg border border-border bg-[#1c1f24] p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={`${text("Expand diagram", "放大图表")}: ${title}`}
            className="block w-full cursor-zoom-in overflow-x-auto text-center focus-visible:outline-none"
          >
            <div
              className="mermaid-svg mx-auto flex justify-center [&_svg]:max-h-[440px] [&_svg]:w-auto [&_svg]:max-w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </button>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="absolute right-3 top-3 rounded border border-foreground/20 bg-background/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:border-accent hover:text-foreground group-hover:opacity-100"
          >
            {text("Expand", "放大")} +
          </button>
        </div>
      </figure>

      {expanded &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-background/95 p-4 backdrop-blur-xl sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setExpanded(false);
            }}
          >
            <div className="relative flex max-h-[92vh] w-full max-w-[min(96vw,1600px)] cursor-default flex-col items-center overflow-auto rounded-lg border border-border bg-[#1c1f24] p-6 sm:p-10">
              <button
                ref={closeRef}
                type="button"
                onClick={() => setExpanded(false)}
                className="sticky right-0 top-0 ml-auto rounded-full border border-foreground/20 bg-background/90 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground hover:border-accent hover:text-accent"
              >
                {text("Close", "关闭")} ×
              </button>
              <div
                className="my-auto w-full overflow-auto py-4 flex justify-center [&_svg]:h-auto [&_svg]:max-w-none"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
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
