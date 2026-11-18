import type { ReactNode } from "react";
import { useLanguage } from "../lib/language";

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
  switch (id) {
    case "traveler-arc":
      return <TravelerArcDiagram />;
    case "rule-of-three-matrix":
      return <RuleOfThreeMatrix />;
    case "glacier-state-machine":
      return <GlacierVerificationDiagram />;
    case "city-sequence":
      return <CitySequenceDiagram />;
    case "woods-telemetry-and-cadence":
      return <WoodsTimelineDiagram />;
    case "world-topology-and-wayfinding":
      return <WayfindingHierarchyDiagram />;
    case "still-life-inversion-matrix":
      return <StillLifeInversionSection />;
    case "still-life-specimen-catalog":
      return <StillLifeSpecimenCatalogDrawer />;
    case "still-life-lamp-ai-fsm":
      return <StillLifeLampOnboardingDiagram />;
    case "still-life-room2-combinatorics":
      return <StillLifeRoom2AllocationDiagram />;
    case "still-life-room3-foundry-system":
      return <StillLifeRoom3FoundryDiagram />;
    case "still-life-subversion-arc":
      return <StillLifeSubversionDiagram />;
    case "still-life-shader-telemetry":
      return <StillLifeShaderDrawer />;
  }
}

function DiagramFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <figure className="slate-folio my-8 overflow-hidden rounded-xs border border-warm/35">
      <figcaption className="flex flex-col gap-1 border-b border-warm/25 bg-[#0c0f17]/80 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:px-5">
        <span className="font-display text-base font-bold tracking-tight text-[#f2e8d5]">{title}</span>
        {subtitle && <span className="font-mono text-[11px] text-warm/85">{subtitle}</span>}
      </figcaption>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}

function SpecDrawer({
  summary,
  meta,
  children,
}: {
  summary: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <details className="slate-folio group my-6 overflow-hidden rounded-xs border border-warm/35">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 font-display text-base font-bold text-[#f2e8d5] transition-colors hover:bg-secondary/80 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span className="flex shrink-0 items-center gap-3 font-mono text-xs text-muted-foreground">
          <span className="hidden sm:inline">{meta}</span>
          <span aria-hidden="true" className="inline-block w-3 text-center text-warm group-open:hidden">
            +
          </span>
          <span aria-hidden="true" className="hidden w-3 text-center text-warm group-open:inline-block">
            −
          </span>
        </span>
      </summary>
      <div className="border-t border-warm/25 bg-[#0b0e15]/75">{children}</div>
    </details>
  );
}

/* ============================================================================
 * AN ECHO HAS NO SHAPE — NATIVE ARCHITECTURAL DIAGRAMS
 * ========================================================================== */

function TravelerArcDiagram() {
  const { text } = useLanguage();
  const spokes = [
    {
      index: "01",
      region: text("Glacial Ocean (NW)", "冰川之海（西北）"),
      layout: text("Flanking stepping-stone arc vs. direct shortcut over non-solid decoys.", "侧翼实体浮冰航线对比直线捷径上的无碰撞假冰。"),
      rule: text("Cast E after each 7.0s Siren pulse to confirm solid white ice before jumping.", "在 7.0s 塞壬干扰波过后按 E，验证纯白实体真冰再起跳。"),
      reward: text("Lights Sky Beacon I", "点亮天际光柱 I"),
    },
    {
      index: "02",
      region: text("Unremembered City (NE)", "遗忘之城（东北）"),
      layout: text("Central plaza (Stage 0) surrounded by SW, SE, and NE wings.", "中心广场（阶段 0）连接西南、东南与东北三座侧翼街区。"),
      rule: text("Activate wings in strict 0 → 1 → 2 → 3 order; breaking sequence fires a reset wave.", "按 0 → 1 → 2 → 3 顺序叠加建筑图层；乱序或越界触发重置波。"),
      reward: text("Lights Sky Beacon II", "点亮天际光柱 II"),
    },
    {
      index: "03",
      region: text("Illusory Woods (S)", "幻影之森（南部）"),
      layout: text("8 pass-through illusory walls placed across main corridor junctions.", "8 道无碰撞虚幻树墙横跨通往西南哨塔的主干岔口。"),
      rule: text("Casting E lights false walls solid; waiting 3.0s in silence dissolves them open.", "高频按 E 会令假墙看似死胡同；静默满 3.0s 触发绿波消融通路。"),
      reward: text("Lights Sky Beacon III", "点亮天际光柱 III"),
    },
  ];

  return (
    <DiagramFrame
      title={text("Single-Verb Core Loop & Hub-and-Spoke Gates", "单一按键核心循环与中枢辐射门锁")}
      subtitle={text("Fixed input: E (42m echo, 5.0s cooldown) · F (Interact)", "固定输入：按 E 发声（42m / 5.0s 冷却）· 按 F 交互")}
    >
      <div className="space-y-3">
        <div className="rounded-xs border border-border bg-background/70 px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-sm font-semibold text-foreground">
              {text("Central Hub — Stone Monument", "中央中枢 — 石之纪念碑")}
            </p>
            <span className="font-mono text-[11px] text-muted-foreground">
              {text("Non-linear spoke selection", "三大分支可按任意顺序探索")}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {text(
              "Zero-hazard calibration ring. Reading the central tablet activates three echo-reactive guide trails leading into the fog.",
              "无惩罚安全区。交互中央石碑后点亮三条通往浓雾深处的主干导引流光起点。",
            )}
          </p>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border md:grid-cols-3">
          {spokes.map((spoke) => (
            <div key={spoke.index} className="flex flex-col justify-between bg-background/85 p-4">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-warm">{spoke.index}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{spoke.reward}</span>
                </div>
                <h4 className="mt-2 font-display text-sm font-semibold text-foreground">{spoke.region}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{spoke.layout}</p>
                <p className="mt-2 border-t border-border/70 pt-2 text-xs leading-relaxed text-foreground/85">{spoke.rule}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 rounded-xs border border-warm/45 bg-background/70 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-display text-sm font-semibold text-foreground">
            {text("Finale — 3 / 3 Sky Beacons Lit", "终局 — 三座天际光柱全亮")}
          </p>
          <p className="text-xs text-muted-foreground">
            {text(
              "450m golden wave clears basin fog, locks guide trails on, and opens the central trilithon gate.",
              "450m 黄金回响扫过全盆地，返程流光常驻点亮，开启中央三石塔大门。",
            )}
          </p>
        </div>
      </div>
    </DiagramFrame>
  );
}

function RuleOfThreeMatrix() {
  const { text } = useLanguage();

  const rows = [
    {
      dimension: text("Level Layout", "关卡空间布局"),
      hub: text("Central Hub Ring (3 spoke heads + final gate)", "中央环形广场（3 条分支起点与终局石塔门）"),
      glacier: text("Branching Floe Lanes (Flanking route vs. direct shortcut)", "双线分岔浮冰航道（侧翼真航线对比直线诱饵捷径）"),
      city: text("3-Wing Street Grid (Center plaza + SW / SE / NE wings)", "三翼棋盘式街区（中心广场 + 西南/东南/东北三翼）"),
      woods: text("Corridor Maze (Choke-point gates vs. detour loops)", "林间走廊迷宫（岔口虚幻树墙对比绕行长走廊）"),
    },
    {
      dimension: text("Habit Tested", "考验的玩家习惯"),
      hub: text("Orienting without permanent sight or UI markers", "在无常驻照明与无 UI 路标下定向"),
      glacier: text("Jumping onto every lit platform along a shortcut", "盲目跳上直线捷径中所有发光的平台"),
      city: text("Activating landmarks out of order or leaving early", "乱序激活地标，或在未完成前离开街区"),
      woods: text("Pressing E immediately whenever the 5.0s cooldown ends", "5.0 秒冷却一好就不停按 E 探路"),
    },
    {
      dimension: text("Environmental Signal", "环境声波机制"),
      hub: text("Prophecy Tablet (Lights 3 guide trails)", "中央预言石碑（点亮三条主干道导引流光）"),
      glacier: text("3 Siren Emitters (62m magenta wave every 7.0s)", "3 处塞壬干扰源（每 7.0s 发出 62m 洋红干扰波）"),
      city: text("3 Wing Statues (150m blue / crimson / emerald waves)", "3 座街区雕像（释放 150m 蓝/红/绿建筑图层波）"),
      woods: text("Forest Reply Center (400m green wave after 3.0s pause)", "森林中心回响源（静默 3.0s 后发出 400m 翠绿波）"),
    },
    {
      dimension: text("Fail State / Reset", "失败惩罚与重置"),
      hub: text("Safe zone (zero hazards or reset states)", "安全区（无陷阱或重置惩罚）"),
      glacier: text("Stepping on a decoy floe respawns at last tablet", "误踩无碰撞诱饵冰落水，退回最近检查点"),
      city: text("Wrong order or exiting bounds fires 45 m/s reset wave", "乱序或越界触发 45 m/s 重置波退回阶段 0"),
      woods: text("Pressing E early cuts off green wave & shuts gates", "过早按 E 打断森林绿波，令岔口树墙重新闭合"),
    },
  ];

  return (
    <div className="my-8 overflow-x-auto rounded-xs border border-border bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border bg-background/60 font-semibold text-foreground">
            <th className="p-3.5">{text("Design Axis", "设计维度")}</th>
            <th className="border-l border-border p-3.5">{text("Hub: Monument", "中央中枢")}</th>
            <th className="border-l border-border p-3.5">{text("Region 1: Glacial Ocean", "区域 1：冰川之海")}</th>
            <th className="border-l border-border p-3.5">{text("Region 2: Unremembered City", "区域 2：遗忘之城")}</th>
            <th className="border-l border-border p-3.5">{text("Region 3: Illusory Woods", "区域 3：幻影之森")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.dimension}>
              <td className="p-3.5 font-medium text-foreground">{row.dimension}</td>
              <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{row.hub}</td>
              <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{row.glacier}</td>
              <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{row.city}</td>
              <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{row.woods}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GlacierVerificationDiagram() {
  const { text } = useLanguage();
  return (
    <DiagramFrame
      title={text("Region 1 — Signal Verification Matrix", "区域 1 — 真伪浮冰声波验证逻辑")}
      subtitle={text("Player White Pulse (E) vs. Siren 62m Magenta Wave (every 7.0s)", "玩家白波 (E) 对比 塞壬 62m 洋红波（7.0s 周期）")}
    >
      <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border md:grid-cols-2">
        <div className="bg-background/85 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-display text-sm font-semibold text-foreground">
              {text("Flanking Arc — Solid Stepping Stones", "侧翼弧线 — 隐形实体真冰")}
            </h4>
            <span className="font-mono text-[11px] text-warm">{text("Safe route", "安全主航线")}</span>
          </div>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between gap-4 border-t border-border/70 pt-2">
              <dt className="text-muted-foreground">{text("On Player Echo (E)", "玩家按 E 白波")}</dt>
              <dd className="text-right font-medium text-foreground">{text("Always outlines in pure white (safe to jump)", "100% 显形为纯白轮廓（可安全起跳）")}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border/70 pt-2">
              <dt className="text-muted-foreground">{text("On Siren Wave (7.0s)", "塞壬洋红波扫过")}</dt>
              <dd className="text-right text-muted-foreground">{text("35% tinted magenta · 40% hidden · 25% stays white", "35% 染成洋红 · 40% 隐入浓雾 · 25% 保持纯白")}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-background/85 p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-display text-sm font-semibold text-foreground">
              {text("Direct Line — Non-Solid Decoy Floes", "直线捷径 — 无碰撞诱饵假冰")}
            </h4>
            <span className="font-mono text-[11px] text-muted-foreground">{text("Respawn hazard", "踩踏即落水")}</span>
          </div>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex justify-between gap-4 border-t border-border/70 pt-2">
              <dt className="text-muted-foreground">{text("On Player Echo (E)", "玩家按 E 白波")}</dt>
              <dd className="text-right font-medium text-foreground">{text("Zero return — pulse passes straight through", "无任何反射 — 白波直接穿过假冰")}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border/70 pt-2">
              <dt className="text-muted-foreground">{text("On Siren Wave (7.0s)", "塞壬洋红波扫过")}</dt>
              <dd className="text-right text-muted-foreground">{text("70% lit magenta (indistinguishable from tinted solid ice)", "70% 虚假点亮为洋红（外观与被染色的真冰一致）")}</dd>
            </div>
          </dl>
        </div>
      </div>
    </DiagramFrame>
  );
}

function CitySequenceDiagram() {
  const { text } = useLanguage();
  const stages = [
    {
      step: "00",
      name: text("Center Plaza", "中心广场"),
      wave: text("200m neutral wave", "200m 基准波"),
      layer: text("Reveals baseline street grid", "显形基础棋盘街道骨架"),
    },
    {
      step: "01",
      name: text("SW Wing · The Muse", "西南翼 · 缪斯"),
      wave: text("150m sky-blue wave", "150m 天蓝波"),
      layer: text("Adds courtyards, trees & birds", "叠加庭院花园、林木与飞鸟"),
    },
    {
      step: "02",
      name: text("SE Wing · The Ruler", "东南翼 · 统治者"),
      wave: text("150m crimson wave", "150m 绯红波"),
      layer: text("Adds stone arches & citizens", "叠加拱门柱廊与市民剪影"),
    },
    {
      step: "03",
      name: text("NE Wing · Architect", "东北翼 · 建筑师"),
      wave: text("150m emerald wave", "150m 翡翠波"),
      layer: text("Restores upper walls & roofs", "补全高层墙体、屋顶与拱桥"),
    },
    {
      step: "04",
      name: text("Gold Completion", "黄金完成态"),
      wave: text("Permanent lock", "全城常驻点亮"),
      layer: text("Disables reset gate & lights Beacon II", "解除越界重置并点亮光柱 II"),
    },
  ];

  return (
    <DiagramFrame
      title={text("Region 2 — Additive Architectural Layer Sequence", "区域 2 — 三翼街区逐层叠加顺序回路")}
      subtitle={text("Strict clockwise loop: 00 → 01 → 02 → 03 → 04", "严格顺时针激活：00 → 01 → 02 → 03 → 04")}
    >
      <div className="space-y-3">
        <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-5">
          {stages.map((s) => (
            <div key={s.step} className="bg-background/85 p-3.5">
              <span className="font-mono text-xs text-warm">{s.step}</span>
              <h4 className="mt-1.5 font-display text-xs font-semibold text-foreground sm:text-sm">{s.name}</h4>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">{s.wave}</p>
              <p className="mt-2 border-t border-border/70 pt-2 text-xs leading-relaxed text-muted-foreground">{s.layer}</p>
            </div>
          ))}
        </div>
        <p className="rounded-xs border border-border bg-background/60 px-4 py-2.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{text("Reset boundary rule: ", "重置门锁规则：")}</span>
          {text(
            "Interacting with a wing statue out of sequence or crossing the outer city perimeter before Stage 04 fires a 45 m/s reset wave from the center plaza, collapsing unfinished layers back to Stage 00.",
            "未按顺序交互雕像或在达成阶段 04 前越过城市外围边界，中心广场将发出 45 m/s 重置波，将未锁定图层退回阶段 00。",
          )}
        </p>
      </div>
    </DiagramFrame>
  );
}

function WoodsTimelineDiagram() {
  const { text } = useLanguage();
  return (
    <DiagramFrame
      title={text("Region 3 — 8.0s Input Cadence & Choke-Point Gates", "区域 3 — 8.0 秒输入时序与岔口虚幻门锁")}
      subtitle={text("3.0s silence window tuned across 6 playtest cohorts", "经 6 轮试玩调优的 3.0s 静默等待窗口")}
    >
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex justify-between font-mono text-[11px] text-muted-foreground">
            <span>0.0s ({text("Cast E", "按 E")})</span>
            <span>1.4s ({text("Fade", "白波消退")})</span>
            <span className="text-warm">3.0s ({text("Green reply", "绿波回应")})</span>
            <span>5.0s ({text("Cooldown up", "冷却完毕")})</span>
            <span>8.0s</span>
          </div>
          <div className="grid grid-cols-[17.5fr_20fr_62.5fr] gap-px overflow-hidden rounded-xs border border-border bg-border text-xs">
            <div className="bg-secondary px-2.5 py-2.5">
              <p className="font-medium text-foreground">{text("White Pulse", "玩家白波")}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{text("False walls look solid", "假墙被照亮如死胡同")}</p>
            </div>
            <div className="bg-background/85 px-2.5 py-2.5">
              <p className="font-medium text-foreground">{text("1.6s Silence", "1.6s 暗场静默")}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{text("Hold input", "停步等待")}</p>
            </div>
            <div className="bg-background/95 px-3 py-2.5">
              <p className="font-medium text-warm">{text("400m Forest Reply — 8 Choke Gates Dissolve Open (5.0s)", "400m 森林翠绿回应波 — 8 道岔口树墙消融敞开 (5.0s)")}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {text("Direct path to SW Sentinel Tower stays passable unless interrupted", "通往西南终点哨塔的主干捷径敞开，直至被新白波打断")}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2">
          <div className="bg-background/85 p-3.5">
            <p className="font-display text-xs font-semibold text-foreground">
              {text("Outcome A — Player Waits Without Recasting", "分支 A — 克制不按 E（t = 3.0s – 8.0s）")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {text(
                "Choke-point gates remain dissolved for the full 5.0s window, allowing direct passage to the Sentinel Tower.",
                "岔口虚幻树墙维持 5.0s 消融态，玩家直接穿墙抵达西南终点哨塔。",
              )}
            </p>
          </div>
          <div className="bg-background/85 p-3.5">
            <p className="font-display text-xs font-semibold text-foreground">
              {text("Outcome B — Recasts E on Cooldown (t = 5.0s)", "分支 B — 5.0s 冷却完毕习惯性按 E")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {text(
                "0.35s wave clash visibly cuts off the green reply and snaps false walls shut, teaching the rule without UI text.",
                "0.35s 声波相撞当面截断绿波并令树墙重新闭合，直观教会玩家“留出空白倾听”。",
              )}
            </p>
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}

function WayfindingHierarchyDiagram() {
  const { text } = useLanguage();

  const tiers = [
    {
      index: "01",
      scale: text("Macro Scale", "宏观远景层"),
      range: "150 – 450m",
      mechanism: text("Vertical Sky Beacons & World Wave", "高空天际光柱与黄金回响"),
      fn: text(
        "Completing a spoke sends a 450m golden wave across the basin and ignites a vertical beacon visible above the fog.",
        "每完成一个区域发出 450m 黄金回响并点亮穿透浓雾的高空光柱，提供全盆地远景定向。",
      ),
    },
    {
      index: "02",
      scale: text("Meso Scale", "中观缓冲层"),
      range: "50 – 150m",
      mechanism: text("40m Fog & Audio Crossfade Zones", "40m 雾色与配乐过渡带"),
      fn: text(
        "Smoothly crossfades fog tint, view distance, and regional music stems when crossing spoke boundaries.",
        "穿过区域边缘 40m 缓冲带时平滑渐变雾效色温、能见度与区域配乐，无 UI 提示边界切换。",
      ),
    },
    {
      index: "03",
      scale: text("Micro Scale", "主干引路层"),
      range: "15 – 50m",
      mechanism: text("Echo-Activated Guide Splines", "声波唤醒的主干导引流光"),
      fn: text(
        "Hidden ground splines stay invisible until swept by an echo, then stream forward toward the next tablet.",
        "沿主干道铺设的流光平时隐没，被回声扫过时向前流动指向下一处石碑。",
      ),
    },
    {
      index: "04",
      scale: text("Immediate Scale", "近身视野层"),
      range: "0 – 15m",
      mechanism: text("Checkpoint Silhouettes", "核心检查点微弱剪影"),
      fn: text(
        "Tablets, statues, and spires keep a faint rim outline in the fog so footing stays readable between 5.0s casts.",
        "石碑、雕像与冰塔在浓雾中保留微弱轮廓剪影，保障 5.0s 冷却间隙的近身落脚可读性。",
      ),
    },
  ];

  return (
    <DiagramFrame
      title={text("Four-Layer Sightless Wayfinding Hierarchy", "四层无 UI 空间寻路层级")}
      subtitle={text("Zero HUD · Zero minimap · ~550m × 550m continuous basin", "零 HUD · 零小地图 · 约 550m × 550m 连续盆地")}
    >
      <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => (
          <div key={tier.index} className="flex flex-col justify-between bg-background/85 p-4">
            <div>
              <div className="flex items-baseline justify-between gap-2 font-mono text-xs">
                <span className="text-warm">{tier.index}</span>
                <span className="text-muted-foreground">{tier.range}</span>
              </div>
              <h4 className="mt-2 font-display text-sm font-semibold text-foreground">{tier.scale}</h4>
              <p className="mt-1 text-xs font-medium text-foreground/85">{tier.mechanism}</p>
              <p className="mt-2 border-t border-border/70 pt-2 text-xs leading-relaxed text-muted-foreground">{tier.fn}</p>
            </div>
          </div>
        ))}
      </div>
    </DiagramFrame>
  );
}

/* ============================================================================
 * STILL LIFE — NATIVE ARCHITECTURAL DIAGRAMS & SPEC DRAWERS
 * ========================================================================== */

function StillLifeInversionSection() {
  const { text } = useLanguage();

  const steps = [
    {
      step: "01",
      title: text("Allocate Animal Mass", "收集与分配动物配重"),
      detail: text(
        "Carry motionless animals (5 kg – 100 kg) onto brass pressure plates, tip the 60 kg Giraffe across 4.2m floor gaps, or wedge heavyweights into crusher gears.",
        "抱起静止无声的动物（5 kg – 100 kg）压住黄铜踏板、将长颈鹿横架在 4.2m 断口上搭桥，或塞入冲压机齿轮槽。",
      ),
    },
    {
      step: "02",
      title: text("Clear Route Hazards", "解除路线软门锁"),
      detail: text(
        "Follow floor indicator lines: Cyan runs gates and lifts, Gold powers Focus Stands to levitate Chest Mimics, and vent tiles cut cold air jets.",
        "沿三色地面导流线排障：青色驱动闸门与电梯，金色激活聚光灯定身宝箱怪，断电踏板关闭低温冷风。",
      ),
    },
    {
      step: "03",
      title: text("Escort Lamp to Socket", "护送台灯就位开门"),
      detail: text(
        "Once safe, the Desk Lamp hops behind the player and mounts the room's optical socket to open the exit alongside heavy plate locks.",
        "障碍清除后，台灯伙伴沿安全路线跳跃跟随并自动跳上终点光敏插座，配合重型踏板打开下一房门。",
      ),
    },
  ];

  const rows = [
    {
      dim: text("Behavioral Cue", "外在行为线索"),
      appliances: text(
        "Skittish wildlife: shivers in dark or cold, hops behind the player, warms up when petted, or lunges (Chest Mimics).",
        "活物般的情绪反应：怕黑怕冷发抖、弹簧灯颈跳跃跟随、左键抚摸恢复暖光，或张口扑咬（宝箱怪）。",
      ),
      animals: text(
        "Zero idle motion and zero sound on pedestals, conditioning players to treat them as inert weights.",
        "在展座上保持零待机动作与零声音，引导玩家自然将其当作静态配重块。",
      ),
    },
    {
      dim: text("Gameplay Role", "关卡玩法职能"),
      appliances: text(
        "Dynamic light source & escort target; halts outside active Chest Mimics and cold air streams.",
        "动态光源与护送对象；遇到宝箱怪或低温冷风会停在边缘发抖。",
      ),
      animals: text(
        "5 kg – 100 kg counterweights, walkable 4.2m gap bridges, and mechanical gear wedges.",
        "5 kg – 100 kg 压力板配重、横跨 4.2m 断口的实体桥梁，以及卡死工业齿轮的止动塞。",
      ),
    },
    {
      dim: text("Room 4 Sensor Verdict", "4 号房传感器判定"),
      appliances: text(
        "Accepted as '1 INANIMATE OBJECT' (1.4 kg hardware) despite three rooms of companionship.",
        "被展览馆传感器判定为“1 件无生命物品”（1.4 kg 金属灯具）。",
      ),
      animals: text(
        "Rejected ('LIVING ORGANISM DETECTED!') — safety alarm ejects the Dog unharmed.",
        "触发安全警报被拒（“检测到活体生物！”），将小狗完好弹出。",
      ),
    },
  ];

  return (
    <div className="my-8 space-y-4">
      <DiagramFrame
        title={text("Three-Step Room Loop", "单房间三步核心解谜循环")}
        subtitle={text("Zero-HUD floor lines: Cyan (Lifts/Gates) · Gold (Focus Stands) · Green (Crusher)", "零 HUD 地面导流线：青色（闸门/电梯）· 金色（聚光定身）· 绿色（冲压机）")}
      >
        <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="bg-background/85 p-4">
              <span className="font-mono text-xs text-warm">{s.step}</span>
              <h4 className="mt-1.5 font-display text-sm font-semibold text-foreground">{s.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </DiagramFrame>

      <div className="overflow-x-auto rounded-xs border border-border bg-surface">
        <table className="w-full min-w-[640px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-background/60 font-semibold text-foreground">
              <th className="p-3.5">{text("Design Axis", "设计维度")}</th>
              <th className="border-l border-border p-3.5">{text("Expressive Appliances (Desk Lamp & Mimics)", "活态家电（台灯伙伴与宝箱怪）")}</th>
              <th className="border-l border-border p-3.5">{text("Motionless Animals (5 kg – 100 kg)", "静止无声的动物（5 kg – 100 kg）")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.dim}>
                <td className="p-3.5 font-medium text-foreground whitespace-nowrap">{row.dim}</td>
                <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{row.appliances}</td>
                <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{row.animals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StillLifeSpecimenCatalogDrawer() {
  const { text } = useLanguage();

  const specimens = [
    { id: "SPEC-01", name: text("Chicken", "鸡"), mass: "5 kg", role: text("5 kg increment for 15 / 40 / 55 kg compound locks", "凑齐 15 / 40 / 55 kg 复合踏板的最小单位配重") },
    { id: "SPEC-02", name: text("Cat", "猫"), mass: "10 kg", role: text("Hallway 1 Focus Stand (10 kg) & Room 2 pairings", "1 号走廊聚光踏板 (10 kg) 及 2 号房组合配重") },
    { id: "SPEC-03", name: text("Penguin", "企鹅"), mass: "15 kg", role: text("Single-item activator for 15 kg lifts, vaults & Gold Plates", "单件激活 15 kg 展柜、东南电梯与金色聚光踏板") },
    { id: "SPEC-04", name: text("Dog", "狗"), mass: "25 kg", role: text("25 kg gates; ejected by Room 4 shredder & awakens in Room 5", "25 kg 闸门；4 号房触发活体警报弹出，5 号房苏醒") },
    { id: "SPEC-05", name: text("Deer", "鹿"), mass: "40 kg", role: text("Room 2 Phase 3 reward; powers 3F 40 kg Gold Focus Plate", "2 号房阶段 3 解锁；驱动 3F 顶层 40 kg 聚光踏板") },
    { id: "FIG. 02", name: text("Giraffe", "长颈鹿"), mass: "60 kg", role: text("Dual-use: walkable bridge across 4.2m gaps OR 60 kg plate weight", "双用途：横架 4.2m 断口充当桥梁，或收回充当 60 kg 配重") },
    { id: "FIG. 03", name: text("Tiger", "老虎"), mass: "80 kg", role: text("Powers 2F→3F Lift (80 kg) & jams Room 3 central gears", "驱动 2F→3F 电梯 (80 kg) 并卡死 3 号房中央齿轮") },
    { id: "FIG. 01", name: text("Horse", "马"), mass: "100 kg", role: text("Corners fleeing Lamp in Room 1, opens 100 kg exit & locks 3F flywheel", "1 号房升起拦下台灯、压开 100 kg 出口并锁死 3 号房顶层飞轮") },
    { id: "FIG. 04", name: text("Desk Lamp", "台灯伙伴"), mass: "1.4 kg", role: text("Dynamic light & companion; classified by Room 4 sensors as hardware", "动态光源与伙伴；唯一非 5 kg 整数倍条目，被传感器归为无生命物品") },
  ];

  return (
    <SpecDrawer
      summary={text("View complete 9-item mass & puzzle catalog", "查看完整 9 件动物与家电配重规格表")}
      meta="5 kg – 100 kg · 1.4 kg"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-surface font-semibold text-foreground">
              <th className="p-3.5">{text("ID", "编号")}</th>
              <th className="border-l border-border p-3.5">{text("Subject", "名称")}</th>
              <th className="border-l border-border p-3.5">{text("Mass", "标定重量")}</th>
              <th className="border-l border-border p-3.5">{text("Puzzle Role Across Rooms 1–5", "在 1 至 5 号房中的关卡用途")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {specimens.map((s) => (
              <tr key={s.id}>
                <td className="p-3.5 font-mono text-warm whitespace-nowrap">{s.id}</td>
                <td className="border-l border-border p-3.5 font-medium text-foreground whitespace-nowrap">{s.name}</td>
                <td className="border-l border-border p-3.5 font-mono text-foreground/90 whitespace-nowrap">{s.mass}</td>
                <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{s.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SpecDrawer>
  );
}

function StillLifeLampOnboardingDiagram() {
  const { text } = useLanguage();
  const beat = [
    { n: "01", title: text("Desk Perch", "书桌栖息"), desc: text("Player approaches lit study desk.", "玩家走近书房桌面。") },
    { n: "02", title: text("Startle & Flee", "闪光逃跑"), desc: text("Brief flash; Lamp hops around dark perimeter.", "受惊闪光，跳下书桌沿暗处外圈逃跑。") },
    { n: "03", title: text("15s Hatch Lift", "大马升起封路"), desc: text("100 kg Horse rises to block the escape loop.", "15 秒后地舱升起 100 kg 大马堵截回路。") },
    { n: "04", title: text("LMB Comfort", "左键抚摸回暖"), desc: text("Hold & drag across shade to restore warm glow.", "按住左键抚摸灯罩，恢复温暖光晕。") },
    { n: "05", title: text("Dual Exit", "双锁开门"), desc: text("Lamp mounts socket + Horse weighs 100 kg plate.", "台灯跳上光敏插座 + 大马压开 100 kg 踏板。") },
  ];

  return (
    <DiagramFrame
      title={text("Room 1 & Hallway 1 — Zero-Text Companion Onboarding", "1 号房与 1 号走廊 — 无文字伙伴引导与软门锁")}
      subtitle={text("DeskLampProceduralRig.cs · 5-state behavior flow", "五状态伙伴行为流")}
    >
      <div className="space-y-3">
        <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-5">
          {beat.map((b) => (
            <div key={b.n} className="bg-background/85 p-3.5">
              <span className="font-mono text-xs text-warm">{b.n}</span>
              <h4 className="mt-1 font-display text-xs font-semibold text-foreground sm:text-sm">{b.title}</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2">
          <div className="bg-background/85 p-3.5">
            <p className="font-display text-xs font-semibold text-foreground">
              {text("Soft Gate A — Chest Mimics (Hallway 1 & Room 2)", "路线软门锁 A — 宝箱怪（1 号走廊与 2 号房）")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {text(
                "Lamp stops and shivers outside lunge range until weight on a Gold Plate powers a Focus Stand spotlight, levitating the Mimic.",
                "台灯停在扑咬半径外发抖，需将配重放上金色踏板激活聚光灯座，将宝箱怪悬浮定身。",
              )}
            </p>
          </div>
          <div className="bg-background/85 p-3.5">
            <p className="font-display text-xs font-semibold text-foreground">
              {text("Soft Gate B — Cold Air Jets (Hallway 2 & Room 3)", "路线软门锁 B — 低温冷风（2 号走廊与 3 号房）")}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {text(
                "Player walks freely through cold streams while the Lamp freezes at the edge until shutoff or vent-powering plates cut airflow.",
                "玩家可穿过寒流但台灯会在边缘结霜停步，需压住断电踏板或取走供能动物切断冷风。",
              )}
            </p>
          </div>
        </div>
      </div>
    </DiagramFrame>
  );
}

function StillLifeRoom2AllocationDiagram() {
  const { text } = useLanguage();

  const phases = [
    {
      phase: text("Stage 1 · Pre-Giraffe", "阶段 1 · 解锁长颈鹿前"),
      pool: 55,
      equation: text("15 Gold + 15 SE Lift + 25 Stall Gate = 55 kg", "15 聚光 + 15 东南电梯 + 25 展柜门 = 55 kg"),
      unlock: text("→ Unlocks 60 kg Giraffe", "→ 解锁 60 kg 长颈鹿"),
      segments: [
        { label: "15", pct: (15 / 235) * 100, tone: "bg-warm/75 text-background" },
        { label: "15", pct: (15 / 235) * 100, tone: "bg-foreground/30 text-foreground" },
        { label: "25", pct: (25 / 235) * 100, tone: "bg-foreground/75 text-background" },
      ],
    },
    {
      phase: text("Stage 2 · Pre-Tiger", "阶段 2 · 解锁老虎前"),
      pool: 115,
      equation: text("15 Gold + 60 2F Outer + 40 1F Inner = 115 kg", "15 聚光 + 60 二层外门 + 40 一层内门 = 115 kg"),
      unlock: text("→ Unlocks 80 kg Tiger", "→ 解锁 80 kg 老虎"),
      segments: [
        { label: "15", pct: (15 / 235) * 100, tone: "bg-warm/75 text-background" },
        { label: "60", pct: (60 / 235) * 100, tone: "bg-foreground/55 text-background" },
        { label: "40", pct: (40 / 235) * 100, tone: "bg-foreground/80 text-background" },
      ],
    },
    {
      phase: text("Stage 3 · Pre-Deer", "阶段 3 · 解锁鹿前"),
      pool: 195,
      equation: text("80 West Lift + 60 3F Outer + 55 1F Inner = 195 kg", "80 西侧电梯 + 60 三层外门 + 55 一层内门 = 195 kg"),
      unlock: text("→ Unlocks 40 kg Deer", "→ 解锁 40 kg 鹿"),
      segments: [
        { label: "80", pct: (80 / 235) * 100, tone: "bg-foreground/30 text-foreground" },
        { label: "60", pct: (60 / 235) * 100, tone: "bg-foreground/55 text-background" },
        { label: "55", pct: (55 / 235) * 100, tone: "bg-foreground/80 text-background" },
      ],
    },
    {
      phase: text("Stage 4 · 3F Exit", "阶段 4 · 顶层最终出口"),
      pool: 235,
      equation: text("80 West Lift + 60 3F Bridge + 40 Gold + 55 Exit = 235 kg", "80 电梯 + 60 断口桥 + 40 聚光 + 55 出口门 = 235 kg"),
      unlock: text("→ Opens 3F Penthouse Exit", "→ 开启 3F 顶层出口大门"),
      segments: [
        { label: "80", pct: (80 / 235) * 100, tone: "bg-foreground/30 text-foreground" },
        { label: "60", pct: (60 / 235) * 100, tone: "bg-warm/50 text-foreground" },
        { label: "40", pct: (40 / 235) * 100, tone: "bg-warm/85 text-background" },
        { label: "55", pct: (55 / 235) * 100, tone: "bg-foreground/85 text-background" },
      ],
    },
  ];

  return (
    <DiagramFrame
      title={text("Room 2 — Four-Stage Zero-Slack Weight Progression", "2 号房 — 四阶段 100% 满额配重预算（0 kg 剩余）")}
      subtitle={text("7 animals · 235 kg total pool · 1F / 2F / 3F", "7 只动物 · 总配重池 235 kg · 三层立体联动")}
    >
      <div className="space-y-4">
        {phases.map((p) => (
          <div key={p.phase} className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
              <span className="font-display font-semibold text-foreground">
                {p.phase} <span className="ml-1.5 font-mono font-normal text-muted-foreground">({p.pool} / 235 kg)</span>
              </span>
              <span className="font-mono text-[11px] text-warm">{p.unlock}</span>
            </div>
            <div className="flex h-7 w-full overflow-hidden rounded-xs border border-border bg-background/80 font-mono text-[11px] font-medium">
              {p.segments.map((seg, idx) => (
                <div
                  key={idx}
                  style={{ width: `${seg.pct.toFixed(2)}%` }}
                  className={`flex items-center justify-center border-r border-background/40 ${seg.tone}`}
                >
                  {seg.label}
                </div>
              ))}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground">{p.equation}</p>
          </div>
        ))}
      </div>
    </DiagramFrame>
  );
}

function StillLifeRoom3FoundryDiagram() {
  const { text } = useLanguage();
  return (
    <DiagramFrame
      title={text("Room 3 — Inverted Vent Tiles & Three-Intake Crusher", "3 号房 — 取走即断电踏板与三路冲压机卡塞门锁")}
      subtitle={text("Cryo-Foundry · 3 green floor indicator lines", "低温车间 · 三条绿色地面导流线")}
    >
      <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border md:grid-cols-2">
        <div className="bg-background/85 p-4">
          <span className="font-mono text-xs text-warm">01</span>
          <h4 className="mt-1.5 font-display text-sm font-semibold text-foreground">
            {text("Inverted Vent-Powering Tiles", "逆向“取走即断电”冷风踏板")}
          </h4>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {text(
              "Pre-placed animals start on powered floor tiles that drive freezing air jets across the Lamp's path. Picking an animal up simultaneously cuts power to the cold jet and frees that heavy weight for the crusher.",
              "车间预置动物初始压在供能踏板上，持续驱动阻挡台灯的低温冷风。将动物抱起既能立即断电关闭冷风，又能腾出重型配重去卡死冲压机。",
            )}
          </p>
        </div>

        <div className="bg-background/85 p-4">
          <span className="font-mono text-xs text-warm">02</span>
          <h4 className="mt-1.5 font-display text-sm font-semibold text-foreground">
            {text("Central Crusher — 3 Mechanical Jammers", "中央冲压机 — 三处机械卡塞槽")}
          </h4>
          <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
            <li>• {text("1F West Piston intake → extinguishes Green Line 1", "1F 西侧活塞槽 → 熄灭绿色导流线 1")}</li>
            <li>• {text("2F Central Gears (80 kg Tiger) → extinguishes Green Line 2", "2F 中央齿轮槽（80 kg 老虎）→ 熄灭绿色导流线 2")}</li>
            <li>• {text("3F Upper Flywheel (100 kg Horse) → locks jaws open to Room 4", "3F 顶层飞轮槽（100 kg 马）→ 锁死巨齿开启 4 号房通路")}</li>
          </ul>
        </div>
      </div>
    </DiagramFrame>
  );
}

function StillLifeSubversionDiagram() {
  const { text } = useLanguage();
  const beats = [
    {
      n: "01",
      title: text("Habit Built (Rooms 1–3)", "习惯养成（1–3 号房）"),
      desc: text(
        "Shredder gate reads 'INSERT 1 OBJECT TO PROCEED' beside the Dog. Trained by three rooms, players drop the Dog in first.",
        "4 号房粉碎机提示“投入 1 件物品以继续”，身旁只有小狗。受前序习惯驱使，玩家下意识将狗投入料斗。",
      ),
    },
    {
      n: "02",
      title: text("Safety Alarm Rejection", "活体警报弹出"),
      desc: text(
        "'LIVING ORGANISM DETECTED!' — hopper ejects the Dog unharmed. With zero loose props on the grating, the animals' silence recontextualizes.",
        "警报拉响“检测到活体生物！”并将小狗完好弹出。四周空无他物，玩家瞬间意识到静止动物从始至终都是活体。",
      ),
    },
    {
      n: "03",
      title: text("Hardware Classification", "投入 1.4 kg 台灯"),
      desc: text(
        "Matching Blueprint FIG. 04's sensor note, the shivering Desk Lamp registers as the room's sole inanimate object, opening the portal.",
        "呼应第 4 张蓝图批注，一路护送的发抖台灯成为传感器唯一认可的“无生命物品”，开启终局门廊。",
      ),
    },
    {
      n: "04",
      title: text("Room 5 Awakening", "纯白空间苏醒"),
      desc: text(
        "Ink cross-hatching dissolves into pure white; ahead, the Dog breathes, perks its ears, tilts its head, and wags its tail.",
        "单色版画排线消融为纯白空间；远处的小狗恢复呼吸、竖耳、歪头注视并摇起尾巴。",
      ),
    },
  ];

  return (
    <DiagramFrame
      title={text("Rooms 4 & 5 — Unscripted Habit Reversal", "4 号房与 5 号房 — 无台词习惯反转流程")}
      subtitle={text("Zero dialogue · Enacted directly by player input", "零对白说教 · 由玩家亲手操作完成反转")}
    >
      <div className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {beats.map((b) => (
          <div key={b.n} className="bg-background/85 p-4">
            <span className="font-mono text-xs text-warm">{b.n}</span>
            <h4 className="mt-1.5 font-display text-sm font-semibold text-foreground">{b.title}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </DiagramFrame>
  );
}

function StillLifeShaderDrawer() {
  const { text } = useLanguage();
  const systems = [
    {
      sys: text("Animal Print Shader", "静态动物版画表现"),
      tech: text("Monochrome ink cross-hatching, matte tonal steps, brass base ring, and zero idle animation.", "单色版画交叉排线、哑光色阶、黄铜刻度底座与零待机动作。"),
    },
    {
      sys: text("Appliance Boiling Outline", "活态家电手绘轮廓"),
      tech: text("7 FPS hand-drawn boiling outlines, cold-air shivering, and warm point-light falloff on the Desk Lamp.", "7 FPS 手绘抖动轮廓线、遇冷颤抖与台灯周围的温暖漫反射光晕。"),
    },
    {
      sys: text("Tri-Color Floor Lines", "三色地面导流线"),
      tech: text("Right-angle floor/wall lines trace every circuit without UI icons: Cyan (lifts/gates), Gold (Focus Stands), Green (Crusher).", "直角铺设的地面与墙面导流线交代跨楼层机关因果：青色（电梯/闸门）、金色（聚光灯座）、绿色（冲压机）。"),
    },
    {
      sys: text("Room 5 Dissolve", "终局纯白消融"),
      tech: text("Paper grain and cross-hatch post-process dissolve to pure white as the Dog wakes in Room 5.", "进入 5 号房时退去纸张纹理与单色排线滤镜，在小狗苏醒时过渡为纯白空间。"),
    },
  ];

  return (
    <SpecDrawer
      summary={text("View visual treatment & zero-HUD floor-line notes", "查看视觉材质对比与三色导流线细目")}
      meta={text("4 presentation systems", "4 项视觉与引导机制")}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-xs">
          <tbody className="divide-y divide-border">
            {systems.map((s) => (
              <tr key={s.sys}>
                <td className="p-3.5 font-medium text-foreground whitespace-nowrap">{s.sys}</td>
                <td className="border-l border-border p-3.5 leading-relaxed text-muted-foreground">{s.tech}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SpecDrawer>
  );
}
