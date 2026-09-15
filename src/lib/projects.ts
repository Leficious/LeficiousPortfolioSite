export type MediaItem =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "youtube"; id: string; caption?: string };

export type CodeSnippet = {
  language: "cpp" | "python";
  title?: string;
  code: string;
};

export type ProjectSection = {
  eyebrow?: string;
  title: string;
  body: string[];
  media?: MediaItem[];
};

export type Project = {
  slug: string;
  title: string;
  role: string;
  year: string;
  summary: string;
  tags: string[];
  cover: string;
  overview: string;
  responsibilities: string[];
  media: MediaItem[];
  snippets: CodeSnippet[];
  sections?: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "starshore",
    title: "Starshore",
    role: "Solo Technical Game Designer",
    year: "2025",
    summary:
      "A 15-week gameplay prototype connecting character movement, abilities, targeting, inventory, shops, and data-driven pickups.",
    tags: ["Unreal Engine", "Blueprints", "Gameplay Systems", "UI"],
    cover: "/projects/starshore/design-layout-01.avif",
    overview:
      "Starshore was a solo project built over 15 weeks to explore how a small set of interconnected gameplay systems could support a complete playable loop. I handled the gameplay logic, character and animation Blueprints, level design, scene assembly, interface work, and system integration. Third-party character and environment assets were used to keep the focus on design and implementation.",
    responsibilities: [
      "Built the character movement, ability, targeting, inventory, shop, and loot systems.",
      "Connected gameplay states, animation behavior, UI, and reusable item data.",
      "Designed and assembled the playable space, using procedural foliage with hand-authored adjustments.",
    ],
    media: [
      {
        type: "youtube",
        id: "oDeL2cEAWg4",
        caption: "Uncut gameplay capture from the Starshore prototype.",
      },
    ],
    snippets: [],
    sections: [
      {
        eyebrow: "01 / World",
        title: "Design and layout",
        body: [
          "The environment was assembled as a compact space for testing traversal, combat, vendors, and item interactions without separating each system into an isolated test room.",
          "Procedural foliage volumes established the first pass quickly, followed by manual adjustments around routes, landmarks, and interaction spaces. Existing asset packs supplied the characters and environment art while I owned the level design, scene assembly, and gameplay implementation.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/design-layout-01.avif", alt: "Starshore environment and encounter space", caption: "The assembled prototype environment and primary traversal space." },
          { type: "image", src: "/projects/starshore/design-layout-02.avif", alt: "Starshore level layout view", caption: "A second view of the level layout and scene assembly." },
        ],
      },
      {
        eyebrow: "02 / Character",
        title: "Controls and animation",
        body: [
          "The character can move in two primary states: standard locomotion and a faster flight mode. Flight begins with a double-tap forward input and ends when the input is released or the state is interrupted, keeping the transition quick without adding another persistent toggle.",
          "The animation setup switches between a broad locomotion blend space for standard movement and dodging, and a narrower forward-driven blend space for flight. Attacks and reactions are played as montages through a dedicated animation slot so they can layer cleanly over locomotion.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/character-controls-01.avif", alt: "Character flight animation setup", caption: "Flight locomotion and animation blending in the editor." },
          { type: "image", src: "/projects/starshore/character-controls-02.avif", alt: "Character control Blueprint logic", caption: "Movement-state logic connecting input, locomotion, and animation." },
        ],
      },
      {
        eyebrow: "03 / Framework",
        title: "Stats and ability management",
        body: [
          "Health, mana, cooldowns, abilities, and temporary states share a consistent ability framework. Attribute values are modified through effects, while ability behavior and audiovisual responses are separated so each layer can be changed without rebuilding the entire interaction.",
          "Tags track important gameplay states and provide a common language for conditions across the character, abilities, interface, and reactions.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/abilities-01.avif", alt: "Character ability configuration", caption: "Character attributes and ability configuration." },
          { type: "image", src: "/projects/starshore/abilities-02.avif", alt: "Gameplay effect Blueprint graph", caption: "Effect logic used to apply and route gameplay values." },
        ],
      },
      {
        eyebrow: "04 / Combat support",
        title: "Automatic targeting",
        body: [
          "Basic spell attacks use passive target acquisition so the player can focus on movement and timing. Periodic sphere traces find nearby actors that expose the shared damage interface; once a target is found, acquisition pauses to avoid unstable retargeting.",
          "The target remains valid while it is within 750 units and within 45 degrees of the camera's forward direction. Crossing either threshold clears the target and resumes acquisition. A future pass could add manual target switching without replacing the underlying validation rules.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/targeting-01.avif", alt: "Automatic targeting Blueprint overview", caption: "Target acquisition and shared damage-interface filtering." },
          { type: "image", src: "/projects/starshore/targeting-02.avif", alt: "Target validation Blueprint logic", caption: "Distance and camera-angle validation for retaining a target." },
        ],
      },
      {
        eyebrow: "05 / Interface",
        title: "Inventory system",
        body: [
          "Inventory contents are stored as item identifiers that resolve to shared structured data. The interface creates its item entries dynamically, so the underlying list—not a manually authored screen—determines what appears.",
          "Category filters rebuild the visible list from each item's type field. This kept presentation separate from the inventory data and made the same item definitions reusable elsewhere in the project.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/inventory-01.avif", alt: "Starshore inventory interface", caption: "The modular inventory interface and item detail view." },
          { type: "image", src: "/projects/starshore/inventory-02.avif", alt: "Inventory filtering Blueprint", caption: "Filtering and dynamic item-entry construction." },
        ],
      },
      {
        eyebrow: "06 / Economy",
        title: "Shop system",
        body: [
          "Vendors define their available stock as a configurable list of item identifiers and call into the player's inventory component when a purchase is made. The shop interface builds its entries from that data using the same modular approach as the inventory.",
          "Item position is calculated from its list index, allowing the interface to create a consistent grid for inventories of different sizes without hand-placing individual entries.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/shop-01.avif", alt: "Starshore shop interface", caption: "Vendor stock displayed through the reusable item interface." },
          { type: "image", src: "/projects/starshore/shop-02.avif", alt: "Shop construction Blueprint", caption: "Dynamic grid construction and inventory integration." },
        ],
      },
      {
        eyebrow: "07 / Data",
        title: "Master pickup item",
        body: [
          "Rather than creating a separate actor for every pickup, one reusable actor configures itself from a data table. Item data controls its identity and presentation, including rarity-based effects, while leaving room for unique meshes or additional effects when needed.",
          "A loot component defines which items an actor can drop and in what quantities. When triggered, it spawns the configured pickups and applies an impulse so drops enter the scene with a readable physical response.",
        ],
        media: [
          { type: "image", src: "/projects/starshore/pickup-item-01.avif", alt: "Starshore pickup item in the game world", caption: "A rarity-driven pickup effect in the playable scene." },
          { type: "image", src: "/projects/starshore/pickup-item-02.avif", alt: "Master pickup item data configuration", caption: "Reusable pickup and loot configuration in the editor." },
        ],
      },
    ],
  },
  {
    slug: "adaptive-enemy-ai",
    title: "Adaptive Enemy AI",
    role: "Technical / Combat Designer",
    year: "2025",
    summary:
      "Utility-AI driven enemies that adapt aggression based on the player's recent combat behavior.",
    tags: ["Python", "Utility AI", "Behavior Trees"],
    cover:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Enemies sample the player's last 20 actions and re-weight utility scores for aggressive, defensive, and flanking branches. Designed in Python tooling, exported to engine as data tables.",
    responsibilities: [
      "Authored utility curves and tuning tool in Python.",
      "Designed encounter pacing rules across three biomes.",
      "Ran A/B playtests to validate adaptation feels fair, not unfair.",
    ],
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
        alt: "AI utility curve editor",
      },
    ],
    snippets: [
      {
        language: "python",
        title: "utility_ai.py",
        code: `def score_action(action, context):
    """Score an action 0..1 based on weighted context curves."""
    score = 1.0
    for axis, curve in action.curves.items():
        value = context.get(axis, 0.0)
        score *= curve.evaluate(value)
    return score * action.base_weight


def pick_best(actions, context):
    return max(actions, key=lambda a: score_action(a, context))`,
      },
    ],
  },
  {
    slug: "modular-weapon-framework",
    title: "Modular Weapon Framework",
    role: "Technical Designer",
    year: "2024",
    summary:
      "Data-driven weapon system with hot-swappable movesets, hit reactions, and VFX hooks.",
    tags: ["UE5", "C++", "Data Assets"],
    cover:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Designed a weapon framework where movesets, hit reactions, sounds, and VFX are defined in data assets. Designers can author a new weapon class in under 15 minutes without engineering support.",
    responsibilities: [
      "Authored data asset schema and editor tooling.",
      "Built combo chain resolver with cancel windows.",
      "Documented workflow for the rest of the design team.",
    ],
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&w=1600&q=80",
        alt: "Weapon data asset",
      },
    ],
    snippets: [
      {
        language: "cpp",
        title: "WeaponData.h",
        code: `USTRUCT(BlueprintType)
struct FComboLink
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere) UAnimMontage* Montage = nullptr;
    UPROPERTY(EditAnywhere) float CancelWindowStart = 0.4f;
    UPROPERTY(EditAnywhere) float CancelWindowEnd   = 0.8f;
    UPROPERTY(EditAnywhere) TArray<FName> NextOnInput;
};`,
      },
    ],
  },
  {
    slug: "encounter-balancing-tool",
    title: "Encounter Balancing Tool",
    role: "Tools / Combat Designer",
    year: "2024",
    summary:
      "A Python tool that simulates thousands of encounters to surface difficulty outliers before playtesting.",
    tags: ["Python", "Tooling", "Analytics"],
    cover:
      "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Monte-Carlo simulator that runs 10k synthetic encounters against player loadouts and outputs heatmaps of TTK, deaths, and resource burn. Cut tuning iteration time roughly in half.",
    responsibilities: [
      "Wrote the simulator and CLI in Python.",
      "Integrated with the design team's encounter spreadsheets.",
      "Trained designers on reading the resulting reports.",
    ],
    media: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        alt: "TTK heatmap output",
      },
    ],
    snippets: [
      {
        language: "python",
        title: "simulate.py",
        code: `def simulate_encounter(player, enemies, rng):
    t = 0.0
    while player.hp > 0 and any(e.hp > 0 for e in enemies):
        target = pick_target(enemies, rng)
        dmg = roll_damage(player.weapon, target, rng)
        target.hp -= dmg
        t += player.weapon.swing_time
        for e in enemies:
            if e.hp > 0:
                player.hp -= e.attack(rng)
    return {"ttk": t, "survived": player.hp > 0}`,
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
