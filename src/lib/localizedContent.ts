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
    summary: "一个历时 15 周的玩法原型，将角色移动、技能、自动索敌、背包、商店与数据驱动拾取物整合为完整可玩循环。",
    designGoal: "围绕移动、战斗、物品与商人构建完整可玩循环，而不是把每套系统拆成彼此孤立的测试。",
    ownership: "独立负责技术游戏设计、玩法实现、关卡设计、UI、动画整合与场景搭建。",
    scope: "历时 15 周的个人原型；角色和环境视觉资产来自第三方。",
    outcomes: [
      "通过共享玩法数据连接移动、技能、索敌、背包、商店与战利品系统。",
      "搭建可复用的拾取物与商人流程，无需为每件物品制作一次性 Actor 或手工界面。",
    ],
    overview: "《星岸》是一个历时 15 周的个人项目，用来探索少量相互连接的玩法系统如何支撑完整循环。我负责玩法逻辑、角色与动画蓝图、关卡设计、场景搭建、界面和系统整合。项目使用第三方角色与环境资产，让制作重点保持在设计和实现上。",
    authorNote: "《星岸》最初来自一个很直接的念头：为什么有些动漫风动作 RPG 操作起来特别顺？我不想只做一段角色控制器演示，于是继续加入索敌、技能、物品、商店，以及让整个玩法循环真正成立的各种小系统。",
    responsibilities: [
      "搭建角色移动、技能、索敌、背包、商店与战利品系统。",
      "连接玩法状态、动画行为、UI 与可复用物品数据。",
      "设计并搭建可玩空间，以程序化植被建立初稿，再进行手工调整。",
    ],
    mediaCaptions: ["《星岸》原型的完整实机演示。"],
    sections: [
      { eyebrow: "01 / 世界", title: "设计与布局", body: ["环境被搭建成一个紧凑空间，用于同时测试移动、战斗、商人和物品交互，而不是把系统分散到独立测试房间。", "程序化植被体积快速建立初稿，再围绕路线、地标和交互空间手工调整。角色与环境美术来自现有资产包；关卡设计、场景搭建和玩法实现由我负责。"], captions: ["完成后的原型环境与主要移动空间。", "关卡布局与场景搭建的另一视角。"] },
      { eyebrow: "02 / 角色", title: "操控与动画", body: ["角色拥有普通移动与高速飞行两种主要状态。双击前进进入飞行，松开输入或状态被打断时退出，在保持快速响应的同时避免额外的常驻切换键。", "动画系统在普通移动/闪避的宽方向 Blend Space 与飞行时偏前向的 Blend Space 之间切换。攻击与受击通过专用动画槽播放 Montage，因此能够清晰叠加在移动之上。"], captions: ["编辑器中的飞行动作与动画混合。", "连接输入、移动状态和动画的蓝图逻辑。"] },
      { eyebrow: "03 / 框架", title: "属性与技能管理", body: ["生命、法力、冷却、技能和临时状态使用统一技能框架。属性由效果修改，而技能行为与视听反馈相互分离，使每层都能独立调整。", "Gameplay Tag 记录关键状态，并为角色、技能、界面和受击反馈之间的条件判断提供统一语言。"], captions: ["角色属性与技能配置。", "用于应用和传递玩法数值的效果逻辑。"] },
      { eyebrow: "04 / 战斗支持", title: "自动索敌", body: ["基础法术使用被动索敌，让玩家将注意力放在移动与时机上。周期性球形检测寻找实现统一伤害接口的邻近 Actor；锁定目标后暂停搜索，避免不稳定切换。", "目标在 750 单位内且位于镜头前方 45 度内时保持有效。越过任一阈值便清除目标并恢复搜索；未来可在不替换底层验证规则的情况下加入手动切换。"], captions: ["自动索敌与伤害接口筛选。", "通过距离和镜头角度维持目标的验证逻辑。"] },
      { eyebrow: "05 / 界面", title: "背包系统", body: ["背包内容以物品 ID 保存，并由 ID 解析共享结构化数据。界面根据底层列表动态生成条目，而不是依赖手工制作的固定画面。", "分类筛选根据物品类型重建可见列表，使表现层与背包数据分离，并让同一份物品定义能在其他系统复用。"], captions: ["模块化背包界面与物品详情。", "筛选与动态创建物品条目的蓝图。"] },
      { eyebrow: "06 / 经济", title: "商店系统", body: ["商人通过可配置物品 ID 列表定义库存，并在购买时调用玩家背包组件。商店界面使用与背包相同的模块化方式，根据数据生成条目。", "物品位置根据列表索引计算，使不同规模的商店都能生成一致网格，无需逐个手工摆放。"], captions: ["通过可复用物品界面显示的商人库存。", "动态网格生成与背包整合。"] },
      { eyebrow: "07 / 数据", title: "通用拾取物", body: ["无需为每件物品创建独立 Actor；一个可复用 Actor 从 Data Table 配置自身。物品数据控制身份与表现，包括稀有度特效，同时保留使用独特模型或附加效果的空间。", "战利品组件定义 Actor 可掉落的物品及数量。触发后生成对应拾取物并施加冲量，让掉落以清晰的物理反馈进入场景。"], captions: ["可玩场景中的稀有度拾取物特效。", "可复用拾取物与战利品配置。"] },
    ],
  },
  "fallen-valkyrie": {
    title: "堕落女武神",
    role: "技术 / 战斗设计师",
    summary: "一个历时 10 周的动作战斗原型，核心包括武器差异化招式、方向受击、锁定系统与多阶段 Boss 战。",
    designGoal: "打造清晰可读的动作战斗遭遇，让武器状态、受击反馈、敌人行为与竞技场推进相互强化。",
    ownership: "独立负责技术与战斗设计、蓝图实现、Boss AI、关卡脚本、动画系统、实时过场和场景搭建。",
    scope: "历时 10 周的个人原型；环境、角色与源动画资产来自第三方。",
    outcomes: ["完成长枪与弓箭两套战斗模式，以及武器相关的索敌、资源和方向受击系统。", "使用可复用 StateTree Task 与阶段专属行为，构建事件驱动的多阶段 Boss 战。"],
    overview: "《堕落女武神》围绕战斗设计、角色动画与遭遇 AI 展开。我负责玩法逻辑、角色与动画蓝图、关卡设计、实时过场和场景搭建。环境、角色与源动画由第三方资产支持；玩法系统、动画逻辑、Blend Space 与遭遇行为均为该原型专门实现。",
    authorNote: "我制作《堕落女武神》，是因为我很喜欢动作游戏中动画、敌人行为、时机与玩家反馈相互影响的部分。Boss 战让我能在同一个场景里把这些东西放在一起测试。",
    responsibilities: ["设计并实现长枪、弓箭、索敌、资源、伤害与方向受击系统。", "通过不同战斗状态和过渡搭建模块化敌人行为与多阶段 Boss 遭遇。", "搭建 Boss 关卡，并连接推进门槛、过场、动画和界面反馈。"],
    mediaCaptions: ["《堕落女武神》战斗原型完整演示。"],
    sections: [
      { eyebrow: "01 / 遭遇", title: "设计与布局", body: ["关卡采用线性 Boss 舞台结构。触发体控制玩家进入各区域，事件驱动的敌人追踪器负责状态变化，例如在满足战斗条件后开启主门。", "Boss 战分为多个阶段，并以引擎内过场衔接主要转折。视觉资产来自环境和角色包；我负责将关卡设计、场景搭建、玩法逻辑和系统整合为完整可玩流程。"], captions: ["主要 Boss 竞技场及周边遭遇空间。", "围绕战斗门槛与触发器搭建的推进区域。"] },
      { eyebrow: "02 / 角色", title: "输入与动画", body: ["玩家可在空手、长枪和弓箭三种状态间切换。枚举武器状态选择对应移动状态机，并决定各输入触发哪段 Montage，使同一角色框架支持差异化招式。", "分层混合与动画槽将瞄准、治疗和换武器等上下半身行为分离。重定向动画被整合进 Blend Space 和 Montage；翅膀、头发与布料使用 Kawaii Physics 增强轮廓响应。"], captions: ["武器状态机、分层混合、动画槽与次级动态。", "包含攻击窗口和 Notify 事件的长枪 Montage。"] },
      { eyebrow: "03 / 战斗基础", title: "角色资源与伤害", body: ["生命、耐力和法力使用统一的数值变化、界面更新与恢复逻辑。耐力和法力在最近一次消耗两秒后开始恢复，形成清晰的消耗与回复节奏。", "伤害通过蓝图接口传递；该接口同时筛选检测结果并向其他战斗系统提供命中信息。武器碰撞体绑定至骨骼插槽，只在 Anim Notify 窗口启用，使伤害帧与动作一致。"], captions: ["法力消耗、界面反馈与延迟恢复。", "生命修改、UI 更新与死亡状态。"] },
      { eyebrow: "04 / 索敌", title: "武器相关瞄准与锁定", body: ["索敌方式随武器改变。长枪攻击通过球形检测寻找邻近目标，并将角色朝向有效伤害接口对象；弓箭则切换越肩镜头，从镜头穿过准星检测并计算弹道方向。", "独立锁定输入沿镜头前方搜索，并持续让控制器朝向目标。进入弓箭瞄准时会暂时覆盖该行为，在保留整体战斗框架的同时提供自由瞄准。"], captions: ["通过伤害接口验证目标并旋转角色。", "资源消耗、朝向目标与 Montage 播放的攻击门控。"] },
      { eyebrow: "05 / 反馈", title: "方向受击系统", body: ["受击反应使用伤害接口传入的碰撞信息。由于重叠事件无法提供可用命中位置，系统会立即从武器插槽或投射物记录的出生点向受击对象进行短距离检测。", "将所得方向与目标前向、右向量比较，选择对应反应。单次攻击也可启用击倒；受击 Montage 在高优先级动画槽播放，使清晰反馈能够打断当前动作。"], captions: ["通过点积判断来袭方向并选择反应。", "后续检测补回初始重叠事件缺失的命中信息。"] },
      { eyebrow: "06 / 敌人行为", title: "模块化 StateTree AI", body: ["Boss 与普通敌人使用 StateTree 和可复用 Task 模块组织行为。可配置参数让相关敌人共享行为基础，同时改变移动、朝向、攻击和状态过渡。", "Boss 会周期性进入决策状态，按条件和优先级评估近战、突进或法术，再选择位移兜底。加权子状态为各类别增加变化，部分移动行为会立即请求下一次决策以保持节奏。"], captions: ["按距离、优先级与动作类别组织的 Boss 决策结构。", "StateTree 中的 Task 配置与血量驱动过渡。"] },
      { eyebrow: "07 / 升级", title: "Boss 阶段", body: ["遭遇控制器以阶段参数生成 Boss，绑定死亡事件，并使用信号协调下一段过场和战斗状态。旧 Actor 会被新的配置版本替换，使每阶段拥有独立 StateTree 与表现，无需把所有变化塞进单一 Actor。", "第二阶段中，血量阈值会强制触发中场转折：Boss 升空、暂时无敌、召唤普通敌人并以投射物压制竞技场，在重新回到正面对抗前制造明确节奏变化。"], captions: ["空中阶段协调投射物压力与敌人召唤。", "关卡蓝图以生成和死亡事件连接各战斗阶段。"] },
    ],
  },
  "sacred-forest": {
    title: "圣域森林",
    role: "环境 / 技术美术",
    summary: "从建模、程序化材质和植被，到灯光、特效与引擎搭建，完整制作的风格化森林神社环境。",
    designGoal: "将风格化概念转化为统一的实时环境，并以一致的材质、植被、灯光与特效支撑整体视觉。",
    ownership: "环境制作与技术美术：建模、雕刻、纹理、植被、灯光、VFX、着色器整合及 Python 工具。",
    scope: "基于 En Moroldo 原创概念完成的个人环境项目。",
    outcomes: ["从主视觉神社和程序化材质，到植被、氛围与最终搭建，独立完成整个场景。", "自动化球面顶点法线传递，使风格化植被资产保持一致而柔和的受光。"],
    overview: "《圣域森林》的目标，是让单个资产与最终场景保持统一的视觉语言。我负责建模、雕刻、纹理、灯光、视觉特效、植被和引擎搭建，并使用 Maya、ZBrush、Substance Painter、Substance Designer、Photoshop 与 Unreal Engine 完成整套制作流程。",
    authorNote: "在转向技术设计之前，我的大部分训练都在 3D 美术。《圣域森林》最能体现这段背景。我从主神社开始向外搭建整个场景，并在植被流程变得重复时写了一个工具来处理它。",
    responsibilities: ["为场景主视觉神社完成建模、雕刻、烘焙与纹理。", "制作程序化及手绘材质、模块化植被、灯光和氛围效果。", "开发 Maya Python 工具，自动化风格化植被的顶点法线传递。"],
    mediaCaptions: ["《圣域森林》环境完整展示。"],
    sections: [
      { eyebrow: "01 / 核心资产", title: "风格化神社", body: ["神社锚定整体构图并确立环境造型语言。低模结构在 Maya 中完成，再进入 ZBrush 进行高模雕刻，随后烘焙并在 Substance Painter 中绘制纹理。", "细节与污渍信息被整合进打包贴图，并通过可复用材质函数组合。这既保持引擎内调节空间，也减少最终资产所需的独立纹理与材质运算。"], captions: ["最终神社的正反两面纹理展示。", "最终纹理和材质前的神社正面建模与雕刻形体。"] },
      { eyebrow: "02 / 表面语言", title: "程序化与手绘纹理", body: ["环境中的风格化表面先在 Substance Designer 中程序化生成，再于 ZBrush 和 Photoshop 中补充需要更强手工控制的部分。共享的造型和磨损原则让神社、岩石、地面与植被保持同一视觉处理。", "裂纹石材与木材强调在环境尺度下仍清晰可读的大形体。共同的程序化方法便于在整个场景中维持一致的磨损程度与风格化水平。"], captions: ["在圆柱与球体预览上的 Substance Designer 程序化石材。", "在 Substance Designer 中建立的程序化木材与树皮形体。"] },
      { eyebrow: "03 / 场景整合", title: "植被、融合与工具", body: ["植被由共享手绘 Texture Atlas 的轻量卡片组成。在 Unreal Engine 中，Runtime Virtual Texture 采样地形颜色并传入植被材质，让植物与地面自然融合，而不是像独立贴片。", "灌木等饱满形体使用从球体传递的顶点法线，得到更柔和统一的受光。我开发 Maya Python 工具自动处理该流程，减少重复资产准备步骤并保持整套植被一致。"], captions: ["结合建模茎叶与轻量花朵、地被卡片的植被套件。", "Stylize Normals Toolkit 在 Maya 中预览并应用受控顶点法线。"] },
    ],
  },
};

const galleryTranslations: Record<string, Pick<GalleryEntry, "title" | "description" | "contribution">> = {
  "fallen-valkyrie-technical-design": { title: "堕落女武神", description: "围绕武器差异化招式、方向受击、锁定系统与多阶段 Boss 战制作的动作战斗原型。", contribution: "独立技术与战斗设计、蓝图实现、Boss AI、动画系统、实时过场和场景搭建" },
  "starshore-technical-design": { title: "星岸", description: "将角色移动、技能、索敌、背包、商店与数据驱动拾取物连接为完整循环的玩法原型。", contribution: "独立技术游戏设计、玩法实现、关卡设计、UI、动画整合与场景搭建" },
  "grid-based-tactical-rpg-template": { title: "网格战术 RPG 模板", description: "可复用的 Unreal Engine 战术网格框架，支持吸附式网格编辑、移动范围可视化与网格寻路。", contribution: "技术游戏设计、A* 与 Dijkstra 寻路、UMG 网格生成工具、共享玩法数据结构和可复用动画蓝图模板" },
  "water-blossoms": { title: "水之花", description: "以 Idafaber 的角色资产为核心，扩展为完整实时环境展示。", contribution: "场景布置、灯光、植被、地形，以及桥梁建模与纹理" },
  "stylized-classroom": { title: "风格化教室 · 原画还原", description: "基于 ArseniXC 原画完成的 3D 环境，将其构图、材质与灯光转译为完整场景。", contribution: "3D 环境制作、材质、灯光与最终呈现" },
  "flintlock-pistol": { title: "燧发手枪", description: "通过最终渲染与材质拆解展示的硬表面道具练习。", contribution: "建模、纹理、材质开发与展示" },
  "cube-burst-vfx": { title: "魔方爆裂 VFX", description: "结合自制 Maya 绑定、分层 Niagara 系统与蓝图时序控制的实时魔法爆裂特效。", contribution: "特效概念与实现、魔方绑定和动画、Niagara 粒子、材质与蓝图时序" },
  "homing-projectile-vfx": { title: "追踪弹体 VFX", description: "在 Unreal Engine 中设计并实现的实时追踪弹体特效。", contribution: "实时 VFX 设计与 Unreal Engine 实现" },
  "castle-town-lighting": { title: "城镇灯光练习", description: "以冷色浓雾环境和暖色建筑点缀为核心的外景灯光练习；底层模型与纹理由他人提供。", contribution: "场景布置、灯光、渲染与最终呈现；模型和纹理由他人提供" },
  "stylized-shrine": { title: "风格化神社", description: "完成建模、雕刻、烘焙、纹理并配备可复用材质控制的游戏级核心资产。", contribution: "建模、雕刻、烘焙、纹理、着色器设置与展示" },
  "sacred-forest": { title: "圣域森林", description: "基于 En Moroldo 原创概念制作的风格化森林环境，涵盖建模、材质、植被、灯光、VFX 与引擎搭建。", contribution: "建模、材质、植被、灯光、VFX、引擎搭建和 Python 工具" },
  "tenebria-character-rig": { title: "Tenebria 角色与绑定", description: "从建模、雕刻、烘焙、纹理和绑定，到使用 Yeti 程序化生成 Hair Card 的游戏角色全流程。", contribution: "建模、雕刻、烘焙、纹理、绑定、程序化 Hair Card 生成与展示" },
  "abigail-williams-sculpt": { title: "阿比盖尔·威廉姆斯雕刻", description: "使用 Maya 与 ZBrush 制作的《Fate/Grand Order》阿比盖尔·威廉姆斯角色雕刻。", contribution: "角色雕刻与展示" },
  "zelda-animation-studies": { title: "角色动画练习", description: "使用 Christoph Schoch 绑定完成的跑酷、体操与坐姿角色动画练习合集。", contribution: "角色动画" },
  "mel-clockwork-platform": { title: "MEL 驱动发条平台", description: "完全通过 Maya MEL 脚本完成绑定与动画的机械发条平台。", contribution: "MEL 脚本、机械绑定与程序化动画" },
  "t14-armata": { title: "T-14 阿玛塔模型", description: "通过 Matcap 与线框视图展示的硬表面载具模型。", contribution: "硬表面建模与拓扑" },
  "fantasy-vehicle": { title: "幻想载具模型", description: "以干净硬表面建模和拓扑视图探索的风格化载具设计。", contribution: "硬表面建模与拓扑" },
  "hazy-city": { title: "雾城", description: "从缩略图、线稿到氛围完成的数字环境概念，后期尝试 AI 放大与 Photoshop 滤镜效果。", contribution: "概念开发、缩略图、线稿与数字绘画" },
  "sketchbook-studies": { title: "透视与形体练习", description: "聚焦透视、比例与复杂硬表面形体的铅笔结构练习。", contribution: "透视绘画与形体构建" },
  "storyboard-master-studies": { title: "分镜大师临摹", description: "通过《终结者》和《千与千寻》片段分析镜头推进、调度、构图与明度。", contribution: "分镜重构、镜头构图与段落分析" },
  "skyward-island-concept": { title: "天空岛概念", description: "以戏剧化透视、尺度和有机形体探索悬浮景观的圆珠笔环境概念。", contribution: "环境概念设计与圆珠笔绘画" },
  "vertex-normals-tool": { title: "Stylize Normals Toolkit", description: "面向制作的 Maya 工具，可在风格化资产上转移、生成、预览、检查、修复并比较自定义顶点法线。", contribution: "Python 与 Maya API 开发、UX 与工作流设计、测试和文档" },
  "hotel-room": { title: "酒店房间摄影匹配", description: "在 Maya 中建模并使用 V-Ray 渲染的摄影匹配环境。", contribution: "建模、灯光、Look Development 与渲染" },
  "alien-landscape": { title: "异星景观", description: "由独立建模资产组成、在 Houdini 中程序化散布并使用 Redshift 渲染的环境。", contribution: "资产建模、程序化散布、Look Development 与渲染" },
  "antique-tabletop": { title: "古董桌面", description: "围绕一组古董道具完成的建模、纹理、灯光与渲染练习。", contribution: "建模、纹理、灯光、构图与渲染" },
  "misty-night": { title: "雾夜", description: "围绕他人提供的古董汽车模型完成的灯光与表面练习。", contribution: "场景整理、纹理、灯光、渲染与后期" },
  dunes: { title: "沙丘 · 沙中之城", description: "基于他人提供环境场景完成的表面与渲染练习。", contribution: "纹理、Look Development、场景整理与渲染" },
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
