import type { GalleryEntry, GalleryTag } from "./gallery";
import type { MediaItem, Project, ProjectSection } from "./projects";

type ProjectTranslation = Pick<Project, "title" | "role" | "summary" | "designGoal" | "ownership" | "scope" | "outcomes" | "overview" | "authorNote" | "responsibilities"> & {
  sections: Array<Pick<ProjectSection, "eyebrow" | "title" | "body"> & { captions?: string[] }>;
  mediaCaptions?: string[];
};

const projectTranslations: Record<string, ProjectTranslation> = {
  starshore: {
    title: "星岸",
    role: "独立技术设计师",
    summary: "历时 15 周完成的玩法原型，将移动、技能、自动索敌、背包、商店与数据驱动拾取物串成一套完整循环。",
    designGoal: "在同一个可玩场景里验证移动、战斗、物品和商店之间的衔接，而不是分别制作互不关联的系统演示。",
    ownership: "独立完成技术设计、玩法蓝图、关卡搭建、UI、动画接入与场景整合。",
    scope: "历时 15 周的个人原型；角色和环境视觉资产来自第三方。",
    outcomes: [
      "用共享数据结构打通移动、技能、索敌、背包、商店和掉落系统。",
      "以通用 Actor 和 Data Table 驱动拾取物与商店内容，减少一次性蓝图和手工界面。",
    ],
    overview: "《星岸》是一个历时 15 周的个人项目，重点是把几套小型玩法系统真正接到一起。我负责玩法逻辑、角色与动画蓝图、关卡设计、场景搭建、UI 和系统整合。角色与环境美术使用第三方资产，制作时间主要投入在设计和实现上。",
    authorNote: "《星岸》最初来自一个很直接的念头：为什么有些动漫风动作 RPG 操作起来特别顺？我不想只做一段角色控制器演示，于是继续加入索敌、技能、物品、商店，以及让整个玩法循环真正成立的各种小系统。",
    responsibilities: [
      "搭建角色移动、技能、索敌、背包、商店与战利品系统。",
      "连接玩法状态、动画行为、UI 与可复用物品数据。",
      "设计并搭建可玩场景，先用程序化植被铺出初稿，再手工调整路线和地标。",
    ],
    mediaCaptions: ["《星岸》原型的完整实机演示。"],
    sections: [
      { eyebrow: "01 / 场景", title: "关卡设计与搭建", body: ["关卡集中在一块紧凑区域内，方便同时验证移动、战斗、商店和物品交互，不必在多个测试房间之间切换。", "我先用程序化植被快速铺出场景，再围绕路线、地标和交互空间手工调整。角色与环境美术来自现有资产包；关卡设计、场景搭建和玩法实现由我完成。"], captions: ["完成后的原型场景与主要移动区域。", "关卡布局与场景搭建的另一视角。"] },
      { eyebrow: "02 / 角色", title: "操控与动画", body: ["角色有普通移动和高速飞行两种状态。双击前进进入飞行，松开输入或被其他状态打断时退出，不需要额外设置一个常驻切换键。", "动画系统会在覆盖多方向移动与闪避的 Blend Space，和偏向前方飞行的 Blend Space 之间切换。攻击与受击通过专用动画槽播放 Montage，可以叠加在移动之上。"], captions: ["编辑器中的飞行动作与动画混合。", "连接输入、移动状态和动画的蓝图逻辑。"] },
      { eyebrow: "03 / 框架", title: "属性与技能管理", body: ["生命、法力、冷却、技能和临时状态共用一套技能框架。数值变化、技能逻辑和视听反馈彼此分开，方便单独调整。", "Gameplay Tag 记录关键状态，供角色、技能、UI 和受击反馈统一判断条件。"], captions: ["角色属性与技能配置。", "用于应用和传递玩法数值的效果逻辑。"] },
      { eyebrow: "04 / 战斗支持", title: "自动索敌", body: ["基础法术使用被动索敌，让玩家把注意力放在移动和出手时机上。系统定期用球形检测寻找附近实现伤害接口的 Actor；锁定后暂时停止搜索，避免目标来回跳动。", "目标必须保持在 750 单位内，并位于镜头前方 45 度范围内。超出距离或角度就会解除锁定并重新搜索；同一套判断以后也可以继续扩展手动切换目标。"], captions: ["自动索敌与伤害接口筛选。", "通过距离和镜头角度维持目标的判断逻辑。"] },
      { eyebrow: "05 / 界面", title: "背包系统", body: ["背包只保存物品 ID，再通过 ID 读取共享数据。UI 根据物品列表动态生成条目，不需要手工摆出固定界面。", "分类筛选会按物品类型重建显示列表。背包数据与 UI 分开后，同一份物品定义也能直接给商店和掉落系统使用。"], captions: ["模块化背包界面与物品详情。", "筛选与动态创建物品条目的蓝图。"] },
      { eyebrow: "06 / 经济", title: "商店系统", body: ["商人通过可配置物品 ID 列表定义库存，并在购买时调用玩家背包组件。商店界面使用与背包相同的模块化方式，根据数据生成条目。", "物品位置根据列表索引计算，使不同规模的商店都能生成一致网格，无需逐个手工摆放。"], captions: ["通过可复用物品界面显示的商人库存。", "动态网格生成与背包整合。"] },
      { eyebrow: "07 / 数据", title: "通用拾取物", body: ["所有物品共用一个拾取物 Actor，并从 Data Table 读取类型、模型和稀有度特效。特殊物品仍可指定独立模型或附加效果。", "掉落组件负责配置物品种类和数量。生成拾取物时会施加冲量，让战利品有明确的抛出和落地效果。"], captions: ["可玩场景中的稀有度拾取物特效。", "可复用拾取物与掉落配置。"] },
    ],
  },
  "fallen-valkyrie": {
    title: "堕落女武神",
    role: "技术 / 战斗设计师",
    summary: "历时 10 周完成的动作战斗原型，包含武器差异化招式、方向受击、锁定系统与多阶段 Boss 战。",
    designGoal: "让武器差异、受击反馈、敌人行为和关卡推进共同服务于一场节奏清楚的 Boss 战。",
    ownership: "独立负责技术与战斗设计、蓝图实现、Boss AI、关卡脚本、动画系统、实时过场和场景搭建。",
    scope: "历时 10 周的个人原型；环境、角色与原始动画资产来自第三方。",
    outcomes: ["完成长枪与弓箭两套战斗模式，以及武器相关的索敌、资源和方向受击系统。", "使用可复用 StateTree Task 与阶段专属行为，构建事件驱动的多阶段 Boss 战。"],
    overview: "《堕落女武神》主要验证战斗设计、角色动画和 Boss AI。我负责玩法逻辑、角色与动画蓝图、关卡设计、实时过场和场景搭建。环境、角色和原始动画使用第三方资产；玩法系统、动画逻辑、Blend Space 与敌人行为均由我为这个原型制作。",
    authorNote: "我制作《堕落女武神》，是因为我很喜欢动作游戏中动画、敌人行为、时机与玩家反馈相互影响的部分。Boss 战让我能在同一个场景里把这些东西放在一起测试。",
    responsibilities: ["设计并实现长枪、弓箭、索敌、资源、伤害与方向受击系统。", "通过不同战斗状态和过渡搭建模块化敌人行为与多阶段 Boss 战。", "搭建 Boss 关卡，并串联关卡触发、过场、动画和 UI 反馈。"],
    mediaCaptions: ["《堕落女武神》战斗原型完整演示。"],
    sections: [
      { eyebrow: "01 / 关卡", title: "Boss 战流程", body: ["关卡采用线性推进结构。Trigger 控制玩家进入各区域，敌人计数和事件状态负责开门、锁场等流程变化。", "Boss 战分为多个阶段，并用引擎内过场连接关键转折。环境和角色使用现有资产包；关卡、玩法逻辑和整套流程由我完成。"], captions: ["主要 Boss 场地及周边战斗区域。", "围绕触发器和战斗条件搭建的推进区域。"] },
      { eyebrow: "02 / 角色", title: "输入与动画", body: ["玩家可在空手、长枪和弓箭三种状态间切换。武器枚举选择对应的移动状态机，也决定输入会触发哪段 Montage，让同一角色框架支持不同招式。", "分层混合与动画槽把瞄准、治疗和换武器等上半身动作从移动中分离。重定向动画接入 Blend Space 和 Montage；翅膀、头发与布料使用 Kawaii Physics 增加动作层次。"], captions: ["武器状态机、分层混合、动画槽与次级动态。", "包含攻击窗口和 Notify 事件的长枪 Montage。"] },
      { eyebrow: "03 / 战斗基础", title: "角色资源与伤害", body: ["生命、耐力和法力使用统一的数值变化、界面更新与恢复逻辑。耐力和法力在最近一次消耗两秒后开始恢复，形成清晰的消耗与回复节奏。", "伤害通过蓝图接口传递；该接口同时筛选检测结果并向其他战斗系统提供命中信息。武器碰撞体绑定至骨骼插槽，只在 Anim Notify 窗口启用，使伤害帧与动作一致。"], captions: ["法力消耗、界面反馈与延迟恢复。", "生命修改、UI 更新与死亡状态。"] },
      { eyebrow: "04 / 索敌", title: "武器相关瞄准与锁定", body: ["索敌方式会随武器变化。长枪攻击通过球形检测寻找附近目标，并让角色朝向实现伤害接口的对象；弓箭会切换到越肩镜头，从镜头穿过准星检测并计算弹道方向。", "独立锁定输入会沿镜头前方搜索，并持续让控制器朝向目标。弓箭瞄准时暂时接管镜头，让玩家可以自由瞄准，同时保留原有锁定框架。"], captions: ["通过伤害接口验证目标并旋转角色。", "攻击条件、角色朝向与 Montage 播放逻辑。"] },
      { eyebrow: "05 / 反馈", title: "方向受击系统", body: ["受击反应读取伤害接口传入的碰撞信息。由于 Overlap 事件没有可用的命中位置，系统会立刻从武器插槽或投射物出生点朝受击对象做一次短距离检测。", "检测方向与目标的前向、右向量做点积比较，再选择对应的受击动作。攻击也可以触发击倒；受击 Montage 在高优先级动画槽播放，必要时会打断当前动作。"], captions: ["通过点积判断来袭方向并选择反应。", "补充检测用于取得 Overlap 事件缺失的命中信息。"] },
      { eyebrow: "06 / 敌人行为", title: "模块化 StateTree AI", body: ["Boss 与普通敌人都使用 StateTree 和可复用 Task 组织行为。不同敌人可以共用基础逻辑，再通过参数调整移动、朝向、攻击和状态切换。", "Boss 会定期进入决策状态，按条件和优先级检查近战、突进或法术。若没有攻击满足条件，则执行移动行为。各攻击类别下还会按权重选择具体动作，让连续决策不至于完全重复。"], captions: ["按距离、优先级与动作类别组织的 Boss 决策结构。", "StateTree 中的 Task 配置与血量驱动过渡。"] },
      { eyebrow: "07 / 阶段", title: "多阶段 Boss 战", body: ["关卡控制器按阶段参数生成 Boss，监听死亡事件，并用事件信号衔接下一段过场和战斗状态。每个阶段都能使用独立的 StateTree 和角色配置，不必把所有变化塞进同一个 Actor。", "第二阶段会在指定血量强制转场：Boss 升空并暂时无敌，同时召唤普通敌人、向场地发射投射物。完成这一段后再回到正面对抗，让战斗节奏出现明显变化。"], captions: ["空中阶段同时处理投射物和敌人召唤。", "关卡蓝图通过生成与死亡事件连接各战斗阶段。"] },
    ],
  },
  "sacred-forest": {
    title: "圣域森林",
    role: "环境 / 技术美术",
    summary: "一套从建模、程序化材质、植被，到灯光、特效与 Unreal 场景搭建均由我完成的风格化森林神社环境。",
    designGoal: "把风格化概念做成完整的实时场景，并统一材质、植被、灯光与特效的表现。",
    ownership: "环境制作与技术美术：建模、雕刻、纹理、植被、灯光、VFX、着色器整合及 Python 工具。",
    scope: "基于 En Moroldo 原创概念完成的个人环境项目。",
    outcomes: ["从主神社、程序化材质到植被、氛围和最终搭建，独立完成整个场景。", "开发工具自动完成球面法线传递，让风格化植被获得更柔和、统一的光照。"],
    overview: "《圣域森林》从单个资产开始，逐步搭成完整场景。我负责建模、雕刻、纹理、灯光、视觉特效、植被和引擎搭建，并使用 Maya、ZBrush、Substance Painter、Substance Designer、Photoshop 与 Unreal Engine 完成整套制作流程。",
    authorNote: "在转向技术设计之前，我的大部分训练都在 3D 美术。《圣域森林》最能体现这段背景。我从主神社开始向外搭建整个场景，并在植被流程变得重复时写了一个工具来处理它。",
    responsibilities: ["为场景主视觉神社完成建模、雕刻、烘焙与纹理。", "制作程序化及手绘材质、模块化植被、灯光和氛围效果。", "开发 Maya Python 工具，自动化风格化植被的顶点法线传递。"],
    mediaCaptions: ["《圣域森林》环境完整展示。"],
    sections: [
      { eyebrow: "01 / 核心资产", title: "风格化神社", body: ["神社是场景的视觉中心，也决定了整体造型风格。低模在 Maya 中完成，再进入 ZBrush 雕刻高模，随后烘焙并在 Substance Painter 中绘制纹理。", "细节与污渍信息整合进打包贴图，再由可复用材质函数组合。这样既保留引擎内调整空间，也减少独立纹理和材质运算。"], captions: ["最终神社的正反两面纹理展示。", "完成纹理前的神社正面模型与雕刻形体。"] },
      { eyebrow: "02 / 材质", title: "程序化与手绘纹理", body: ["风格化材质先在 Substance Designer 中程序化生成，再用 ZBrush 和 Photoshop 补充需要手工控制的部分。神社、岩石、地面和植被共用一致的形状与磨损处理。", "裂纹石材和木材都优先保留远景中依然清楚的大块形状。程序化流程也便于统一整个场景的磨损程度和风格。"], captions: ["在圆柱与球体上预览的 Substance Designer 程序化石材。", "在 Substance Designer 中制作的程序化木材与树皮。"] },
      { eyebrow: "03 / 场景整合", title: "植被、融合与工具", body: ["植被使用共享手绘 Texture Atlas 的轻量卡片。Unreal Engine 中的 Runtime Virtual Texture 会读取地形颜色并传给植被材质，让植物更自然地融入地面。", "体积较圆的灌木使用从球体传递的顶点法线，获得更柔和统一的光照。我开发了 Maya Python 工具自动完成这套流程，减少重复操作，也让整套植被保持一致。"], captions: ["结合建模茎叶与轻量花朵、地被卡片的植被套件。", "Stylize Normals Toolkit 在 Maya 中预览并应用自定义顶点法线。"] },
    ],
  },
};

const galleryTranslations: Record<string, Pick<GalleryEntry, "title" | "description" | "contribution">> = {
  "fallen-valkyrie-technical-design": { title: "堕落女武神", description: "围绕武器差异化招式、方向受击、锁定系统与多阶段 Boss 战制作的动作战斗原型。", contribution: "独立技术与战斗设计、蓝图实现、Boss AI、动画系统、实时过场和场景搭建" },
  "starshore-technical-design": { title: "星岸", description: "将移动、技能、索敌、背包、商店与数据驱动拾取物串成完整循环的玩法原型。", contribution: "独立完成技术设计、玩法实现、关卡设计、UI、动画接入与场景搭建" },
  "grid-based-tactical-rpg-template": { title: "网格战术 RPG 模板", description: "可复用的 Unreal Engine 战术网格框架，支持吸附式关卡编辑、移动范围显示与网格寻路。", contribution: "技术设计、A* 与 Dijkstra 寻路、UMG 网格生成工具、共享玩法数据结构和可复用动画蓝图模板" },
  "water-blossoms": { title: "水之花", description: "围绕 Idafaber 的角色资产搭建的实时环境作品。", contribution: "场景布置、灯光、植被、地形，以及桥梁建模与纹理" },
  "stylized-classroom": { title: "风格化教室 · 原画还原", description: "基于 ArseniXC 原画制作的 3D 环境，在场景中还原构图、材质与灯光。", contribution: "3D 环境制作、材质、灯光与最终呈现" },
  "flintlock-pistol": { title: "燧发手枪", description: "硬表面道具练习，包含成品渲染与材质拆解。", contribution: "建模、纹理、材质制作与展示" },
  "cube-burst-vfx": { title: "魔方爆裂 VFX", description: "结合自制 Maya 绑定、分层 Niagara 系统与蓝图时序控制的实时魔法爆裂特效。", contribution: "特效概念与实现、魔方绑定和动画、Niagara 粒子、材质与蓝图时序" },
  "homing-projectile-vfx": { title: "追踪弹体 VFX", description: "在 Unreal Engine 中设计并实现的实时追踪弹体特效。", contribution: "实时 VFX 设计与 Unreal Engine 实现" },
  "castle-town-lighting": { title: "城镇灯光练习", description: "以冷色雾气和暖色窗光为重点的室外灯光练习；场景模型与纹理由他人提供。", contribution: "场景布置、灯光、渲染与最终呈现；模型和纹理由他人提供" },
  "stylized-shrine": { title: "风格化神社", description: "完整完成建模、雕刻、烘焙与纹理，并在引擎中配置可调材质。", contribution: "建模、雕刻、烘焙、纹理、着色器设置与展示" },
  "sacred-forest": { title: "圣域森林", description: "基于 En Moroldo 原创概念制作的风格化森林环境，涵盖建模、材质、植被、灯光、VFX 与引擎搭建。", contribution: "建模、材质、植被、灯光、VFX、引擎搭建和 Python 工具" },
  "tenebria-character-rig": { title: "Tenebria 角色与绑定", description: "完整游戏角色流程，包含建模、雕刻、烘焙、纹理、绑定，以及使用 Yeti 程序化生成 Hair Card。", contribution: "建模、雕刻、烘焙、纹理、绑定、程序化 Hair Card 生成与展示" },
  "abigail-williams-sculpt": { title: "阿比盖尔·威廉姆斯雕刻", description: "使用 Maya 与 ZBrush 制作的《Fate/Grand Order》阿比盖尔·威廉姆斯角色雕刻。", contribution: "角色雕刻与展示" },
  "zelda-animation-studies": { title: "角色动画练习", description: "使用 Christoph Schoch 绑定完成的跑酷、体操与坐姿角色动画练习合集。", contribution: "角色动画" },
  "mel-clockwork-platform": { title: "MEL 驱动发条平台", description: "完全通过 Maya MEL 脚本完成绑定与动画的机械发条平台。", contribution: "MEL 脚本、机械绑定与程序化动画" },
  "t14-armata": { title: "T-14 阿玛塔模型", description: "通过 Matcap 与线框视图展示的硬表面载具模型。", contribution: "硬表面建模与拓扑" },
  "fantasy-vehicle": { title: "幻想载具模型", description: "风格化载具设计练习，重点展示硬表面建模与拓扑。", contribution: "硬表面建模与拓扑" },
  "hazy-city": { title: "雾城", description: "从缩略图和线稿逐步完成的数字环境概念，后期尝试了 AI 放大与 Photoshop 滤镜。", contribution: "概念开发、缩略图、线稿与数字绘画" },
  "sketchbook-studies": { title: "透视与形体练习", description: "聚焦透视、比例与复杂硬表面形体的铅笔结构练习。", contribution: "透视绘画与形体构建" },
  "storyboard-master-studies": { title: "分镜大师临摹", description: "通过《终结者》和《千与千寻》片段分析镜头推进、调度、构图与明度。", contribution: "分镜重构、镜头构图与段落分析" },
  "skyward-island-concept": { title: "天空岛概念", description: "用圆珠笔绘制的悬浮景观概念，重点练习夸张透视、尺度和有机形体。", contribution: "环境概念设计与圆珠笔绘画" },
  "vertex-normals-tool": { title: "Stylize Normals Toolkit", description: "面向制作的 Maya 工具，可在风格化资产上转移、生成、预览、检查、修复并比较自定义顶点法线。", contribution: "Python 与 Maya API 开发、UX 与工作流设计、测试和文档" },
  "hotel-room": { title: "酒店房间照片匹配", description: "在 Maya 中根据参考照片建模，并使用 V-Ray 完成灯光与渲染。", contribution: "建模、灯光、Look Development 与渲染" },
  "alien-landscape": { title: "异星景观", description: "先独立制作场景资产，再用 Houdini 程序化散布，并通过 Redshift 完成渲染。", contribution: "资产建模、程序化散布、Look Development 与渲染" },
  "antique-tabletop": { title: "古董桌面", description: "围绕一组古董道具完成的建模、纹理、灯光与渲染练习。", contribution: "建模、纹理、灯光、构图与渲染" },
  "misty-night": { title: "雾夜", description: "使用他人提供的古董汽车模型完成的材质与灯光练习。", contribution: "场景整理、纹理、灯光、渲染与后期" },
  dunes: { title: "沙丘 · 沙中之城", description: "使用他人提供的环境场景完成的材质、灯光与渲染练习。", contribution: "纹理、Look Development、场景整理与渲染" },
};

export const galleryTagZh: Record<GalleryTag, string> = {
  "3D": "3D", "2D": "2D", Environment: "环境", Realtime: "实时", Character: "角色", Rigging: "绑定", Tools: "工具", "Technical Design": "技术设计", VFX: "特效", Animations: "动画", "Props/Vehicles": "道具 / 载具",
};

function localizeMedia(items: MediaItem[], captions?: string[]) {
  if (!captions) return items;
  return items.map((item, index) => captions[index] ? { ...item, caption: captions[index] } : item);
}

export function localizeProject(project: Project, chinese: boolean): Project {
  if (!chinese) return project;
  const translation = projectTranslations[project.slug];
  if (!translation) return project;
  return {
    ...project,
    ...translation,
    media: localizeMedia(project.media, translation.mediaCaptions),
    sections: project.sections?.map((section, index) => {
      const localized = translation.sections[index];
      return localized ? { ...section, ...localized, media: section.media ? localizeMedia(section.media, localized.captions) : undefined } : section;
    }),
  };
}

export function localizeGalleryEntry(entry: GalleryEntry, chinese: boolean): GalleryEntry {
  if (!chinese) return entry;
  const translation = galleryTranslations[entry.id];
  return translation ? { ...entry, ...translation } : entry;
}
