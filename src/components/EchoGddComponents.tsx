import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../lib/language";
import { ECHO_MERMAID_SVGS } from "./echoMermaidSvgs";
import { STILL_LIFE_MERMAID_SVGS } from "./stillLifeMermaidSvgs";

const ALL_PROJECT_SVGS: Record<string, string> = {
  ...ECHO_MERMAID_SVGS,
  ...STILL_LIFE_MERMAID_SVGS,
};

export type EchoGddWidgetId =
  | "traveler-arc"
  | "rule-of-three-matrix"
  | "glacier-state-machine"
  | "city-sequence"
  | "woods-telemetry-and-cadence"
  | "world-topology-and-wayfinding"
  | "still-life-inversion-matrix"
  | "still-life-specimen-catalog"
  | "still-life-lamp-ai-fsm"
  | "still-life-room2-combinatorics"
  | "still-life-room3-foundry-system"
  | "still-life-subversion-arc"
  | "still-life-shader-telemetry";

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
    case "still-life-inversion-matrix":
      return (
        <>
          <MermaidBlock
            diagramKey={isChinese ? "still-life-lop-loop-zh" : "still-life-lop-loop-en"}
            title={isChinese ? "角色倒置前提与 L.O.P. 核心解谜循环" : "Selective Empathy Inversion & The L.O.P. Core Loop"}
          />
          <StillLifeInversionMatrix />
        </>
      );
    case "still-life-specimen-catalog":
      return <StillLifeSpecimenCatalogTable />;
    case "still-life-lamp-ai-fsm":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "still-life-lamp-fsm-zh" : "still-life-lamp-fsm-en"}
          title={isChinese ? "台灯伙伴五状态 AI 状态机与环境恐惧中断" : "Desk Lamp 5-State Companion FSM & Environmental Fear Interrupts"}
        />
      );
    case "still-life-room2-combinatorics":
      return (
        <>
          <MermaidBlock
            diagramKey={isChinese ? "still-life-room2-flow-zh" : "still-life-room2-flow-en"}
            title={isChinese ? "展厅 II：三层闸门、升降梯与展柜解锁依赖流程图 (235 kg)" : "Room II: 3-Story Gate, Elevator & Vault Dependency Flowchart (235 kg)"}
          />
          <MermaidBlock
            diagramKey={isChinese ? "still-life-room2-math-zh" : "still-life-room2-math-en"}
            title={isChinese ? "展厅 II：四阶段 100% 零冗余配重预算表" : "Room II: 4-Phase Zero-Slack Weight Combinatorics"}
          />
        </>
      );
    case "still-life-room3-foundry-system":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "still-life-room3-circuit-zh" : "still-life-room3-circuit-en"}
          title={isChinese ? "展厅 III：逆向断电冷风踏板与三信标中央冲压机回路" : "Room III: Inverted 'Turn-Off' Vent Tiles & 3-Marker Central Stomper Circuit"}
        />
      );
    case "still-life-subversion-arc":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "still-life-subversion-zh" : "still-life-subversion-en"}
          title={isChinese ? "展厅 IV 与 V：打破工具化心理惯性与纯白终局苏醒弧线" : "Room IV & V: Breaking Player Conditioning & The Pure White Awakening"}
        />
      );
    case "still-life-shader-telemetry":
      return <StillLifeShaderTelemetryTable />;
  }
}

function MermaidBlock({ diagramKey, title }: { diagramKey: string; title: string }) {
  const { text } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const svg = ALL_PROJECT_SVGS[diagramKey] ?? "";
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

function StillLifeInversionMatrix() {
  const { text } = useLanguage();

  const rows = [
    {
      dim: text("Surface Presentation", "外在表现与动效状态"),
      appliances: text(
        "Expressive, skittish wildlife: shivers at 7 FPS in cold/dark, hops on a spring neck, leans into warm touch, or lunges territorially (Mimic Chests).",
        "富有生命力与情绪的“野生生物”：在黑暗或寒风中以 7 FPS 手绘抖动，靠弹簧脖子跳跃跟随，在抚摸下发出暖光，或具领地攻击性（宝箱怪）。",
      ),
      animals: text(
        "Taxidermy-still museum specimens: zero vertex animation, zero vocalization, rigid posture, engraved with brass calibration rings.",
        "如博物馆石膏标本般纹丝不动：零顶点动画、零叫声、刚体姿态锁死，底座刻有黄铜校准环与克数铭牌。",
      ),
    },
    {
      dim: text("Gameplay Function", "核心玩法职能"),
      appliances: text(
        "Emotional anchor & light/fear constraints: Desk Lamp illuminates dark rooms, powers optical sockets, and refuses to cross freezing jets or Mimics.",
        "情感锚点与路线约束：台灯伙伴负责照亮黑暗、激活光敏插座，但遇到低温冷风或未镇压的宝箱怪会恐惧停滞。",
      ),
      animals: text(
        "Deadpan industrial hardware (5 kg to 100 kg): counterweights on brass scales, 4.2m chasm bridges (60 kg Giraffe), and mechanical gear wedges.",
        "冷酷的工业硬件（5 kg 至 100 kg）：黄铜天平上的配重砝码、横跨 4.2m 断渊的实体桥梁（60 kg 长颈鹿），以及卡死工业齿轮的止动塞。",
      ),
    },
    {
      dim: text("Shader & Visual Language", "着色器与视觉语言"),
      appliances: text(
        "LivingApplianceCreature.shader: 7 FPS hand-drawn vertex line-boil, warm subsurface life-blush near the Lamp, and shivering displacement.",
        "LivingApplianceCreature.shader：7 FPS 手绘顶点沸腾轮廓、靠近台灯时的温暖次表面红润感，以及受惊颤抖位移。",
      ),
      animals: text(
        "ArchivalAnimalSpecimen.shader: Triplanar museum ink cross-hatching, deadpan plaster/taxidermy shading, and world-space brass calibration ring.",
        "ArchivalAnimalSpecimen.shader：三平面博物馆版画交叉排线、冷峻石膏/标本明暗，以及世界空间黄铜校准环。",
      ),
    },
    {
      dim: text("Room IV Shredder Verdict", "展厅 IV 粉碎机终极判定"),
      appliances: text(
        "Accepted as '1 INANIMATE OBJECT': Despite its warmth and fear, the gallery's sensors classify the 1.4 kg Desk Lamp as mere metal hardware.",
        "被判定为“1 件无生命物品”：尽管它会发抖、怕黑、依恋玩家，但展览馆传感器认定 1.4 kg 的台灯只是一件金属死物。",
      ),
      animals: text(
        "Rejected ('LIVING ORGANISM DETECTED!'): Feeding the 25 kg Dog triggers the safety alarm—exposing that the rigid animals were alive all along.",
        "触发安全警报被拒（“检测到活体生物！”）：将 25 kg 狗投入粉碎机时被立即弹出——揭穿所有沉默的动物从始至终都是活着的生命。",
      ),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Design Dimension", "设计维度")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Living Household Appliances (1.4 kg Lamp & Mimics)", "活物家用电器（1.4 kg 台灯伙伴与拟态家电）")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Rigid Animal Specimens (5 kg – 100 kg Hardware)", "刚体动物标本（5 kg – 100 kg 工业硬件）")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-xs">
          {rows.map((row) => (
            <tr key={row.dim}>
              <td className="p-3.5 font-medium text-foreground whitespace-nowrap">{row.dim}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{row.appliances}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{row.animals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StillLifeSpecimenCatalogTable() {
  const { text } = useLanguage();

  const specimens = [
    {
      id: "SPEC-01",
      name: text("Chicken", "鸡 (Chicken)"),
      mass: "5 kg",
      role: text("Calibration Shim", "校准垫片"),
      usage: text("Fine-grain 5 kg increment for 15 kg / 20 kg / 55 kg composite locks in Rooms II & III.", "用于展厅 II 与 III 中凑齐 15 kg / 20 kg / 55 kg 复合门锁的最小精度垫片。"),
    },
    {
      id: "SPEC-02",
      name: text("Cat", "猫 (Cat)"),
      mass: "10 kg",
      role: text("Light Counterweight", "轻型镇纸配重"),
      usage: text("Powers Hallway I's Focus Machine plate (10 kg) and pairs with Chicken (5 kg) for 15 kg locks.", "在长廊 I 驱动聚光灯座踏板 (10 kg)，并在展厅 II 与鸡组合解开 15 kg 门锁。"),
    },
    {
      id: "SPEC-03",
      name: text("Penguin", "企鹅 (Penguin)"),
      mass: "15 kg",
      role: text("Standard Counterbalance", "标准平衡锤"),
      usage: text("Single-unit 15 kg activator for 2F West Dog Vault, 1F SE Elevator, and Gold Focus Plates.", "单件即可激活 15 kg 踏板（2F 西侧狗展柜、1F 东南升降梯与金色聚光踏板）。"),
    },
    {
      id: "SPEC-04",
      name: text("Dog", "狗 (Dog)"),
      mass: "25 kg",
      role: text("Medium Doorstop & Finale Anchor", "中型门挡与终局活体"),
      usage: text("Opens 25 kg gates in Rooms II–III; rejected by Room IV's shredder as a LIVING ORGANISM before awakening in Room V.", "解开 25 kg 闸门；在展厅 IV 被粉碎机检测为“活体生物”弹出，并在展厅 V 纯白空间彻底苏醒。"),
    },
    {
      id: "SPEC-05",
      name: text("Deer", "鹿 (Deer)"),
      mass: "40 kg",
      role: text("Phase 3 Vault Key", "三阶段高台密钥"),
      usage: text("Unlocked in Room II's Back-West Dual Vault; powers the 40 kg 3F Penthouse Gold Focus Plate.", "在展厅 II 西北双重锁展柜解锁，用于压住 3F 顶楼的 40 kg 金色聚光灯踏板。"),
    },
    {
      id: "FIG. 02",
      name: text("Giraffe (Loading Blueprint #2)", "长颈鹿 (加载蓝图 FIG. 02)"),
      mass: "60 kg",
      role: text("4.2m Chasm Bridge & Heavy Weight", "4.2m 断渊桥梁兼重型配重"),
      usage: text("Dual-purpose specimen: tips horizontally across 2F & 3F 4.2m floor chasms as a walkable plank OR weighs 60 kg on vault plates.", "双重用途标本：可横放架设于 2F 与 3F 的 4.2m 断渊上作为实体桥梁通行，也可回收充当 60 kg 巨型砝码。"),
    },
    {
      id: "FIG. 03",
      name: text("Tiger (Loading Blueprint #3)", "老虎 (加载蓝图 FIG. 03)"),
      mass: "80 kg",
      role: text("Lift Ballast & Crusher Gear Wedge", "升降梯压舱物与齿轮止动塞"),
      usage: text("Powers Room II's 80 kg 2F->3F Elevator and jams Room III's Central Mechanical Crusher gears.", "在展厅 II 驱动 80 kg 三层升降梯，并在展厅 III 直接塞入中央巨型冲压机齿轮槽将其卡死。"),
    },
    {
      id: "FIG. 01",
      name: text("Horse (Loading Blueprint #1)", "石膏马 (加载蓝图 FIG. 01)"),
      mass: "100 kg",
      role: text("Path Blocker & Maximum Ballast", "路径封堵墙与百公斤极重压舱物"),
      usage: text("Rises from Room I's floor hatch to corner the fleeing Desk Lamp, opens the 100 kg exit plate, and jams Room III's Upper Flywheel.", "从展厅 I 地下舱门升起以堵截受惊逃跑的台灯，压开 100 kg 出口踏板，并在展厅 III 锁死顶层工业飞轮。"),
    },
    {
      id: "FIG. 04",
      name: text("Desk Lamp (Loading Blueprint #4)", "台灯伙伴 (加载蓝图 FIG. 04)"),
      mass: "1.4 kg",
      role: text("Light Source, Companion & 'Object'", "动态光源、情感伙伴与“唯一物品”"),
      usage: text("Catalog note: 'It shivers in the dark and leans into your hand like something alive, but to the gallery's sensors it is still just an object.'", "图鉴批注：“它在黑暗中发抖、像活物一样依偎你的手心，但在展览馆传感器眼里，它依然只是一件无生命物品。”"),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[740px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Catalog ID", "图鉴编号")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Specimen / Appliance", "标本 / 家电名称")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Recorded Mass", "记录质量")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Mechanical Classification", "机械职能分类")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Systemic Role Across Rooms I–V", "在展厅 I–V 中的核心系统作用")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-xs">
          {specimens.map((s) => (
            <tr key={s.id}>
              <td className="p-3.5 font-mono font-semibold text-accent whitespace-nowrap">{s.id}</td>
              <td className="border-l border-border/50 p-3.5 font-medium text-foreground whitespace-nowrap">{s.name}</td>
              <td className="border-l border-border/50 p-3.5 font-mono text-foreground/90 whitespace-nowrap">{s.mass}</td>
              <td className="border-l border-border/50 p-3.5 font-medium text-foreground/90">{s.role}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{s.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StillLifeShaderTelemetryTable() {
  const { text } = useLanguage();

  const systems = [
    {
      sys: "ArchivalAnimalSpecimen.shader",
      domain: text("Rigid Animal Specimens (5–100 kg)", "刚体动物标本着色器 (5–100 kg)"),
      tech: text(
        "Triplanar procedural ink cross-hatching + deadpan plaster/taxidermy diffuse ramp + world-space brass calibration ring at pedestal height (zero vertex displacement).",
        "三平面程序化版画交叉排线 + 冷峻石膏漫反射阶梯 + 底座高度的世界空间黄铜校准环（零顶点位移，强化死物工具感）。",
      ),
    },
    {
      sys: "LivingApplianceCreature.shader",
      domain: text("Living Appliances (Lamp, Mimics, Books)", "活物家电着色器（台灯、拟态箱、飞书）"),
      tech: text(
        "Quantized 7 FPS hand-drawn vertex line-boil + high-frequency shivering displacement in cold/dark + warm subsurface blush driven by global _StillLife_LampPosWS.",
        "量化 7 FPS 手绘顶点沸腾轮廓 + 寒冷/受惊高频颤抖位移 + 由全局 _StillLife_LampPosWS 驱动的近距离温暖次表面红润光泽。",
      ),
    },
    {
      sys: "ConduitDirectionalPulse.shader",
      domain: text("Zero-HUD Manhattan Conduit Telemetry", "零 HUD 曼哈顿导管遥测系统"),
      tech: text(
        "Orthogonal floor/wall conduit meshes with directional energy pulses color-coded by circuit type: Dormant Charcoal -> Active Cyan (Gates/Lifts), Gold (Focus Stands), Green (Stomper Jammers).",
        "沿地板与墙面正交铺设的曼哈顿导管网格，按回路类型进行色彩与流向编码：休眠炭黑 -> 激活亮青（闸门/电梯）、暖金（聚光灯座）、翠绿（冲压机卡死槽）。",
      ),
    },
    {
      sys: "Room4AvantGardeInfiniteBuilder.cs",
      domain: text("4-Directional Infinite Megastructure", "四向无限格栅巨构合并渲染"),
      tech: text(
        "Consolidates hundreds of 4-directional (Left, Right, Up, Down) Hallway III & Room IV replica cells, steel grating floors, and shredder silhouettes into 6 UInt32 static meshes (~6 draw calls at 200+ FPS).",
        "将长廊 III 与展厅 IV 向左、右、上、下四向无限延伸的镂空钢网、石柱与粉碎机剪影合并烘焙为 6 个 UInt32 静态网格（仅约 6 次 Draw Call，维持 200+ FPS）。",
      ),
    },
    {
      sys: "StillLifeSurrealistRendererFeature.cs",
      domain: text("Kuwahara & Pure White Finale Dissolve", "桑原油画滤镜与纯白终局消融"),
      tech: text(
        "Full-screen URP renderer feature combining Kuwahara painterly brush filtering (radius 1.25), 6 FPS boiling paper grain, ink outlines, and PureWhiteFinaleSuppression (1.0 -> 0.0 dissolve in Room V).",
        "全屏 URP 渲染特性：结合桑原（Kuwahara）油画笔触滤波、6 FPS 沸腾纸张纹理与水墨轮廓，并在进入展厅 V 时通过 PureWhiteFinaleSuppression 平滑消融为纯白画面。",
      ),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Shader / Technical System", "着色器 / 技术系统")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Target Visual Domain", "目标视觉领域")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Implementation & Design Function", "底层实现与设计意图")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 text-xs">
          {systems.map((s) => (
            <tr key={s.sys}>
              <td className="p-3.5 font-mono font-medium text-accent whitespace-nowrap">{s.sys}</td>
              <td className="border-l border-border/50 p-3.5 font-medium text-foreground whitespace-nowrap">{s.domain}</td>
              <td className="border-l border-border/50 p-3.5 leading-relaxed text-muted-foreground">{s.tech}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

