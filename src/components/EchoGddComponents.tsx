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
          title={isChinese ? "单一按键在三大区域中的规则重构与终局门锁聚合图" : "Single-Verb Recontextualization & Regional Gating Progression"}
        />
      );
    case "rule-of-three-matrix":
      return <RuleOfThreeMatrix />;
    case "glacier-state-machine":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "glacier-state-zh" : "glacier-state-en"}
          title={isChinese ? "区域 1（冰川之海）：侧翼安全航线、直线诱饵捷径与真伪信号求证" : "Region 1 (Glacial Ocean): Lane Routing & Platform Signal Verification"}
        />
      );
    case "city-sequence":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "city-sequence-zh" : "city-sequence-en"}
          title={isChinese ? "区域 2（遗忘之城）：三翼街区顺序门锁依赖图 (0 -> 1 -> 2 -> 3) 与越界重置" : "Region 2 (Unremembered City): Lock-and-Key Sequence (0 -> 1 -> 2 -> 3) & Reset Gate"}
        />
      );
    case "woods-telemetry-and-cadence":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "woods-cadence-zh" : "woods-cadence-en"}
          title={isChinese ? "区域 3（幻影之森）：8 秒输入时序轴与主干道岔口虚幻门锁开闭图" : "Region 3 (Illusory Woods): 8-Second Input Timing & Choke-Gate State Switch"}
        />
      );
    case "world-topology-and-wayfinding":
      return (
        <>
          <MermaidBlock
            diagramKey={isChinese ? "world-topology-zh" : "world-topology-en"}
            title={isChinese ? "四层无 UI 空间寻路层级与中枢往返闭环图" : "4-Layer Sightless Wayfinding Hierarchy & Hub-and-Spoke Loop"}
          />
          <WayfindingTable />
        </>
      );
    case "still-life-inversion-matrix":
      return (
        <>
          <MermaidBlock
            diagramKey={isChinese ? "still-life-lop-loop-zh" : "still-life-lop-loop-en"}
            title={isChinese ? "角色倒置前提与三步核心解谜循环" : "Role Inversion & Three-Step Core Puzzle Loop"}
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
          title={isChinese ? "1 号房与 1 号走廊：伙伴引导流程与路线障碍机制" : "Room 1 & Hallway 1: Companion Onboarding & Hazard Gating"}
        />
      );
    case "still-life-room2-combinatorics":
      return (
        <>
          <MermaidBlock
            diagramKey={isChinese ? "still-life-room2-flow-zh" : "still-life-room2-flow-en"}
            title={isChinese ? "2 号房：三层闸门、升降梯与展柜解锁依赖流程图 (235 kg)" : "Room 2: 3-Story Gate, Elevator & Vault Dependency Flowchart (235 kg)"}
          />
          <MermaidBlock
            diagramKey={isChinese ? "still-life-room2-math-zh" : "still-life-room2-math-en"}
            title={isChinese ? "2 号房：四阶段 100% 满额配重预算表 (55 -> 115 -> 195 -> 235 kg)" : "Room 2: 4-Stage Full-Allocation Weight Budget (55 -> 115 -> 195 -> 235 kg)"}
          />
        </>
      );
    case "still-life-room3-foundry-system":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "still-life-room3-circuit-zh" : "still-life-room3-circuit-en"}
          title={isChinese ? "3 号房（低温车间）：取走即断电踏板与三路冲压机卡塞门锁" : "Room 3 (Cryo-Foundry): Vent-Powering Tiles & 3-Jammer Crusher Gate"}
        />
      );
    case "still-life-subversion-arc":
      return (
        <MermaidBlock
          diagramKey={isChinese ? "still-life-subversion-zh" : "still-life-subversion-en"}
          title={isChinese ? "4 号房与 5 号房：粉碎机门锁反转与纯白空间终局流程" : "Room 4 & Room 5: Shredder Gate Reversal & Pure White Finale"}
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
      dimension: text("Level Topology", "空间拓扑结构"),
      hub: text("Central Hub Ring (3 spoke heads + final gate)", "中央环形广场（3 条分支起点与终局石塔门）"),
      glacier: text("Branching Floe Lanes (Flanking arc vs. direct shortcut)", "双线分岔浮冰航道（侧翼真航线对比直线诱饵捷径）"),
      city: text("3-Wing Street Grid (Center plaza + SW / SE / NE wings)", "三翼棋盘式街区（中心广场 + 西南/东南/东北三翼）"),
      woods: text("Corridor Maze (Choke-point gates vs. detour loops)", "林间走廊迷宫（岔口虚幻树墙对比绕行长走廊）"),
    },
    {
      dimension: text("Habit Tested", "考验的玩家习惯"),
      hub: text("Navigating without permanent sight or UI markers", "在无常驻照明与无 UI 路标下定向"),
      glacier: text("Jumping onto every lit platform along a shortcut", "盲目跳上直线捷径中所有发光的平台"),
      city: text("Activating landmarks in random order or leaving early", "乱序激活地标，或在未完成前离开街区"),
      woods: text("Spamming E immediately whenever the 5.0s cooldown ends", "5.0 秒冷却一好就不停按 E 探路"),
    },
    {
      dimension: text("Environmental Signal", "环境声波机制"),
      hub: text("Prophecy Tablet (Ignites 3 guide splines)", "中央预言石碑（唤醒三条主干道导引流光）"),
      glacier: text("3 Siren Emitters (62m pink wave every 7.0s)", "3 处塞壬干扰源（每 7.0s 广播 62m 洋红欺瞒波）"),
      city: text("3 Wing Statues (150m blue / red / green waves)", "3 座街区见证者雕像（释放 150m 蓝/红/绿建筑图层波）"),
      woods: text("Forest Reply Center (400m green wave after 3.0s wait)", "森林中心回响源（静默 3.0s 后爆发 400m 翠绿波）"),
    },
    {
      dimension: text("Fail State / Reset", "失败惩罚与重置"),
      hub: text("Safe zone (zero hazards or reset states)", "安全区（无陷阱或重置惩罚）"),
      glacier: text("Stepping on a pink decoy floe respawns at last tablet", "误踩无碰撞洋红诱饵冰落水，重置回检查点"),
      city: text("Wrong order or exiting bounds fires 45 m/s reset wave", "乱序或越界触发 45 m/s 坍缩波重置回阶段 0"),
      woods: text("Pressing E early overwrites green wave & shuts gates", "过早按 E 触发 0.35s 声波覆写，令岔口树墙闭合"),
    },
    {
      dimension: text("Color & Fog Identity", "色彩与雾场特征"),
      hub: text("Obsidian Teal & Pale Sage", "黑曜青与浅鼠尾草绿"),
      glacier: text("Glacial Slate & Siren Magenta", "冰川灰蓝与塞壬洋红"),
      city: text("Sky Blue / Crimson / Emerald -> Locked Gold", "天蓝 / 绯红 / 翡翠 -> 锁定黄金完成态"),
      woods: text("Deep Pine & Verdant Green", "深松绿与翠绿"),
    },
    {
      dimension: text("Tablet Clue", "石碑提示文本"),
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
            <th className="p-3.5">{text("Design Axis", "设计维度")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Hub: Stone Monument", "中央中枢：石之纪念碑")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Region 1: Glacial Ocean", "区域 1：冰川之海")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Region 2: Unremembered City", "区域 2：遗忘之城")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Region 3: Illusory Woods", "区域 3：幻影之森")}</th>
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
      scale: text("1. Macro Scale", "1. 宏观远景层"),
      range: "150m to 450m",
      mechanism: text("Sky Beacons & World Wave", "垂直天际光柱与世界回响"),
      fn: text(
        "Completing a region fires a 450m golden wave across the basin and ignites its vertical sky beacon, providing a high-altitude landmark visible above the fog.",
        "每完成一个区域，向整个盆地扫过一道 450m 的黄金世界回响并点亮高空光柱，在浓雾上方提供远景定向地标。",
      ),
    },
    {
      scale: text("2. Meso Scale", "2. 中观缓冲层"),
      range: "50m to 150m",
      mechanism: text("Nested Fog & Audio Bounds", "内外双层雾效与配乐过渡"),
      fn: text(
        "Crossfades fog color, view distance, and regional music tracks across the 40m buffer between outer and inner trigger bounds.",
        "当玩家穿过各区域 40m 宽的内外触发框缓冲带时，平滑过渡雾效色温、能见度与区域配乐。",
      ),
    },
    {
      scale: text("3. Micro Scale", "3. 主干引路层"),
      range: "15m to 50m",
      mechanism: text("Breadcrumb Guide Splines", "声波唤醒的导引流光"),
      fn: text(
        "Spline ribbons along main paths stay invisible until struck by an echo, then stream particles forward toward the next checkpoint.",
        "沿主干路径铺设的导引流光平时隐没，在被回声扫过时沿切线奔涌，在不借助常驻地面箭头的情况下引导主干道推进。",
      ),
    },
    {
      scale: text("4. Immediate Scale", "4. 近身视野层"),
      range: "0m to 15m",
      mechanism: text("Anchor Silhouettes vs. Echo Terrain", "常驻地标剪影与回声地形"),
      fn: text(
        "Key checkpoints (tablets, statues, spires) retain a faint silhouette in the fog, while secondary terrain appears only when swept by an echo.",
        "核心检查点（石碑、雕像、冰塔）在浓雾中保留微弱剪影，而次级地形与隐藏路径仅在声波扫过时显形。",
      ),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Wayfinding Layer", "寻路距离层级")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Effective Range", "有效距离")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Level Design Mechanism", "空间引导机制")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Player Navigation Purpose", "对玩家的实际引导作用")}</th>
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
      dim: text("Visual & Behavioral Cue", "外在表现与动效状态"),
      appliances: text(
        "Expressive, skittish wildlife: shivers in the dark or cold, hops along behind the player, warms up when petted, or lunges when approached (Chest Mimics).",
        "富有生气的“野生动物”表现：在黑暗或寒风中发抖，靠弹簧灯颈跳跃跟随，在抚摸下恢复暖光，或具领地攻击性（宝箱怪）。",
      ),
      animals: text(
        "Zero idle animation and zero sound: animals stand still on pedestals, leading players to treat them as static puzzle props.",
        "零待机动作、零叫声：动物在展座上保持静止，使玩家自然将其当作静态解谜道具。",
      ),
    },
    {
      dim: text("Level Design Role", "关卡玩法职能"),
      appliances: text(
        "Companion & route constraints: the Desk Lamp lights dark rooms and powers optical sockets, but stops in front of cold air jets or active Chest Mimics.",
        "同行伙伴与路线约束：台灯伙伴负责照亮暗处、激活光敏插座，但遇到低温冷风或未定身的宝箱怪会停下发抖。",
      ),
      animals: text(
        "Physical puzzle props (5 kg to 100 kg): counterweights on brass pressure plates, walkable bridges across 4.2m floor gaps, and mechanical gear wedges.",
        "物理机关道具（5 kg 至 100 kg）：黄铜压力踏板上的配重块、横跨 4.2m 地板断口的实体桥梁，以及卡死工业齿轮的止动塞。",
      ),
    },
    {
      dim: text("Shader & Material Treatment", "材质与视觉区分"),
      appliances: text(
        "Hand-drawn boiling outlines (7 FPS), shivering displacement in cold air, and warm light falloff around the Desk Lamp.",
        "7 FPS 手绘抖动轮廓线、寒冷环境下的颤抖位移，以及台灯周围的温暖漫反射光晕。",
      ),
      animals: text(
        "Triplanar ink cross-hatching, flat matte shading, and a brass calibration ring at base height.",
        "三平面版画交叉排线、哑光色阶明暗，以及底座高度的黄铜刻度环。",
      ),
    },
    {
      dim: text("Room 4 Shredder Sensor Check", "4 号房粉碎机传感器判定"),
      appliances: text(
        "Accepted as '1 INANIMATE OBJECT': Despite its warmth and fear, the gallery's sensors classify the Desk Lamp (1.4 kg) as metal hardware.",
        "被判定为“1 件无生命物品”：尽管它会发抖、怕黑、依恋玩家，但展览馆传感器认定台灯（1.4 kg）只是一件金属死物。",
      ),
      animals: text(
        "Rejected ('LIVING ORGANISM DETECTED!'): Dropping the Dog into the hopper triggers the safety alarm and ejects it unharmed, revealing the animals were alive all along.",
        "触发安全警报被拒（“检测到活体生物！”）：将狗投入料斗时被立即完好弹出，揭晓所有沉默的动物从始至终都是活着的生命。",
      ),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Design Axis", "设计维度")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Expressive Appliances (Desk Lamp & Mimics)", "活态家用电器（台灯伙伴与拟态障碍）")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Motionless Animals (5 kg to 100 kg Counterweights)", "静止不动的动物（5 kg 至 100 kg 配重）")}</th>
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
      role: text("Small Weight Increment", "最小配重块"),
      usage: text("5 kg unit used to reach 15 kg, 40 kg, and 55 kg combined plate thresholds in Rooms 2 and 3.", "用于 2 号房与 3 号房中凑齐 15 kg、40 kg 与 55 kg 复合压力踏板的最小单位配重。"),
    },
    {
      id: "SPEC-02",
      name: text("Cat", "猫 (Cat)"),
      mass: "10 kg",
      role: text("Light Counterweight", "轻型配重"),
      usage: text("Powers Hallway 1's Focus Stand plate (10 kg) and pairs with Chicken (5 kg) for 15 kg locks.", "在 1 号走廊驱动聚光灯座踏板 (10 kg)，并在 2 号房与鸡组合解开 15 kg 门锁。"),
    },
    {
      id: "SPEC-03",
      name: text("Penguin", "企鹅 (Penguin)"),
      mass: "15 kg",
      role: text("Standard Counterweight", "标准配重"),
      usage: text("Single-item activator for 15 kg plates (2F West Dog Vault, 1F SE Elevator, and Gold Focus Plates).", "单件即可激活 15 kg 踏板（2F 西侧狗展柜、1F 东南升降梯与金色聚光踏板）。"),
    },
    {
      id: "SPEC-04",
      name: text("Dog", "狗 (Dog)"),
      mass: "25 kg",
      role: text("Medium Weight & Finale Subject", "中型配重与终局活体"),
      usage: text("Opens 25 kg gates in Rooms 2 and 3; rejected by Room 4's shredder as a LIVING ORGANISM before awakening in Room 5.", "解开 25 kg 闸门；在 4 号房被粉碎机检测为“活体生物”弹出，并在 5 号房纯白空间苏醒。"),
    },
    {
      id: "SPEC-05",
      name: text("Deer", "鹿 (Deer)"),
      mass: "40 kg",
      role: text("Stage 3 Vault Key", "阶段 3 展柜配重"),
      usage: text("Unlocked in Room 2's NW Dual Vault; powers the 40 kg 3F Penthouse Gold Focus Plate.", "在 2 号房西北双重门锁展柜解锁，用于压住 3F 顶层的 40 kg 金色聚光灯踏板。"),
    },
    {
      id: "FIG. 02",
      name: text("Giraffe (Loading Blueprint #2)", "长颈鹿 (加载蓝图 FIG. 02)"),
      mass: "60 kg",
      role: text("4.2m Gap Bridge & Heavy Weight", "4.2m 断口桥梁兼重型配重"),
      usage: text("Multi-use prop: tips horizontally across 2F and 3F 4.2m floor gaps as a walkable bridge, or weighs 60 kg on vault plates.", "多用途道具：可横放架设于 2F 与 3F 的 4.2m 断口上作为实体桥梁通行，也可收回背包充当 60 kg 配重。"),
    },
    {
      id: "FIG. 03",
      name: text("Tiger (Loading Blueprint #3)", "老虎 (加载蓝图 FIG. 03)"),
      mass: "80 kg",
      role: text("Elevator Weight & Gear Wedge", "升降梯配重与齿轮卡塞物"),
      usage: text("Powers Room 2's 80 kg 2F->3F Elevator and wedges into Room 3's Central Crusher gears.", "在 2 号房驱动 80 kg 升降梯，并在 3 号房直接塞入中央冲压机齿轮槽将其卡死。"),
    },
    {
      id: "FIG. 01",
      name: text("Horse (Loading Blueprint #1)", "马 (加载蓝图 FIG. 01)"),
      mass: "100 kg",
      role: text("Path Blocker & Heavy Weight", "路径封堵墙与百公斤重物"),
      usage: text("Rises from Room 1's floor hatch to block the fleeing Desk Lamp, opens the 100 kg exit plate, and locks Room 3's upper flywheel.", "从 1 号房地舱升起堵截逃跑的台灯，压开 100 kg 出口踏板，并在 3 号房锁死顶层工业飞轮。"),
    },
    {
      id: "FIG. 04",
      name: text("Desk Lamp (Loading Blueprint #4)", "台灯伙伴 (加载蓝图 FIG. 04)"),
      mass: "1.4 kg",
      role: text("Light Source, Companion & 'Object'", "动态光源、同行伙伴与“唯一物品”"),
      usage: text("Blueprint note: 'It shivers in the dark and leans into your hand like something alive, but to the gallery's sensors it is still just an object.'", "蓝图批注：“它在黑暗中发抖、像活物一样依偎你的手心，但在展览馆传感器眼里，它依然只是一件无生命物品。”"),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[740px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Catalog ID", "图鉴编号")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Animal / Appliance", "动物 / 家电名称")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Recorded Weight", "标定重量")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Puzzle Function", "解谜职能分类")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Level Design Usage Across Rooms 1 to 5", "在 1 至 5 号房中的具体关卡用途")}</th>
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
      sys: text("Still Animal Ink Shader", "静止动物版画材质"),
      domain: text("Static Animal Props (5 to 100 kg)", "静态动物道具 (5 至 100 kg)"),
      tech: text(
        "Triplanar ink cross-hatching, flat matte shading, and a brass calibration ring at base height with zero idle animation.",
        "三平面程序化版画排线、哑光色阶与底座高度的黄铜校准环，配合零待机动画，强化动物作为静态道具的视觉观感。",
      ),
    },
    {
      sys: text("Living Appliance Shader", "活态家电材质"),
      domain: text("Desk Lamp, Chest Mimics & Books", "台灯伙伴、宝箱怪与飞书"),
      tech: text(
        "7 FPS hand-drawn boiling outlines, shivering displacement in cold air, and warm light falloff around the Desk Lamp.",
        "7 FPS 手绘抖动轮廓、寒冷与受惊状态下的高频颤抖位移，以及靠近台灯时的温暖漫反射光晕。",
      ),
    },
    {
      sys: text("Color-Coded Floor Indicator Lines", "三色地面导流线系统"),
      domain: text("Zero-HUD Puzzle State Feedback", "零 HUD 机关连线反馈"),
      tech: text(
        "Floor and wall indicator lines connect every plate to its target door or machine: Cyan for gates and lifts, Gold for Focus Stands, and Green for Crusher jammers.",
        "沿地板与墙面铺设的导流线直接连接踏板与目标机关：青色代表闸门与升降梯，金色代表聚光灯座，绿色代表冲压机卡塞槽。",
      ),
    },
    {
      sys: text("Room 4 Static Mesh Consolidation", "4 号房四向无限钢网静态合并"),
      domain: text("4-Directional Infinite Lattice", "四向无限延伸钢网空间"),
      tech: text(
        "Merges hundreds of repeated steel grating cells and columns across Hallway 3 and Room 4 into 6 static meshes (~6 draw calls at 200+ FPS).",
        "将 3 号走廊与 4 号房向上下左右四向延伸的镂空钢网与立柱合并烘焙为 6 个静态网格（约 6 次 Draw Call，保持 200+ FPS）。",
      ),
    },
    {
      sys: text("Painterly Post-Process & Finale Dissolve", "版画后期滤镜与纯白终局消融"),
      domain: text("Full-Screen Ink Filter -> Room 5 Whiteout", "全屏版画滤镜 -> 5 号房纯白消融"),
      tech: text(
        "Combines Kuwahara painterly filtering, paper grain, and ink outlines across Rooms 1 to 4 before dissolving to pure white as the Dog wakes in Room 5.",
        "在 1 至 4 号房应用桑原笔触滤波、纸张纹理与水墨轮廓，并在踏入 5 号房时平滑消融为纯白空间。",
      ),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-lg border border-border bg-surface/30">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-surface/60 text-xs font-semibold text-foreground">
            <th className="p-3.5">{text("Visual / Technical System", "视觉与技术系统")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Target Domain", "应用对象")}</th>
            <th className="border-l border-border/60 p-3.5">{text("Implementation & Level Design Purpose", "实现方式与关卡设计作用")}</th>
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
