import type { EchoGddWidgetId } from "../components/EchoGddComponents";

export type MediaItem =
  | { type: "image"; src: string; alt: string; caption?: string; width?: number; height?: number; fullWidth?: boolean; naturalAspect?: boolean }
  | { type: "video"; src: string; poster?: string; caption?: string }
  | { type: "youtube"; id: string; caption?: string; thumbnailSrc?: string };

export type CodeSnippet = {
  language: "cpp" | "python";
  title?: string;
  code: string;
};

export type ProjectSection = {
  eyebrow?: string;
  title: string;
  body: string[];
  widget?: EchoGddWidgetId;
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
  heroImage?: string;
  coverWidth: number;
  coverHeight: number;
  designGoal: string;
  ownership: string;
  scope: string;
  outcomes: string[];
  relatedGalleryIds?: string[];
  overview: string;
  authorNote?: string;
  externalLink?: { url: string; label: string };
  downloads?: Array<{ url: string; label: string }>;
  responsibilities: string[];
  media: MediaItem[];
  snippets: CodeSnippet[];
  sections?: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "an-echo-has-no-shape",
    title: "An Echo Has No Shape",
    role: "Solo Game Designer & Developer",
    year: "2026",
    summary:
      "A 4-week first-person acoustic exploration and puzzle labyrinth built around a single, unchanging echolocation verb across three regions that subvert how the world answers back.",
    tags: ["Unity", "C#", "Game Design", "Level Design"],
    cover: "/projects/an-echo-has-no-shape/cover.webp",
    heroImage: "/projects/an-echo-has-no-shape/hero-poster.webp",
    coverWidth: 1920,
    coverHeight: 1080,
    designGoal:
      "Sustain a multi-region first-person labyrinth on a single, unchanging echolocation input (Press E) without ability creep, combat, or non-diegetic UI.",
    ownership:
      "Solo game design, level and labyrinth layout, C# gameplay and regional echo-state systems, diegetic wayfinding, audio-fog crossfades, and world assembly.",
    scope:
      "4-week solo project in Unity 6 (URP) developed for Peter Brinson's course at USC around the Situated Player Role of The Traveler (World as Presence).",
    outcomes: [
      "Built a continuous ~550m × 550m sightless acoustic basin connecting a central hub and three regional labyrinths with zero HUD markers, minimaps, or loading screens.",
      "Designed three distinct epistemic inversions of the same E input: adversarial signal cross-examination (Glacial Ocean), 3-stage memory synthesis (Unremembered City), and a 3.0s silence-and-reply cadence (Illusory Woods).",
    ],
    relatedGalleryIds: ["an-echo-has-no-shape"],
    overview:
      "An Echo Has No Shape is a solo 4-week project built in Unity 6 for Peter Brinson's class at USC around the Situated Player Role of The Traveler (World as Presence). To focus the entire month on level design and systemic puzzle variation, I kept the player's action set fixed to a single button (Cast Echo on E, plus Attune on F) across three regional labyrinths where progression comes from changing how the world answers back.",
    authorNote:
      "Most echolocation games treat sound as a binary flashlight in the dark: once the pulse reveals the room, the mechanic stops evolving. Here, the title is literal: an echo has no intrinsic shape of its own. Across the three regions, the player's relationship to their voice shifts from skeptical verification, to bearing witness, to relinquishing control.",
    externalLink: {
      url: "https://leficious.itch.io/an-echo-has-no-shape",
      label: "Play on itch.io",
    },
    downloads: [
      {
        url: "/projects/an-echo-has-no-shape/An_Echo_Has_No_Shape_GDD.pdf",
        label: "Download GDD (PDF)",
      },
    ],
    responsibilities: [
      "Designed the core 1-verb loop and three regional rulesets (signal deception, multi-perspective synthesis, and silence-and-reply).",
      "Assembled the ~550m × 550m continuous acoustic basin with a 4-tier sightless wayfinding stack.",
      "Tuned the Illusory Woods 3.0s silence threshold and 0.35s active wave-overwrite feedback.",
    ],
    media: [
      {
        type: "youtube",
        id: "AAVAfjhv6IA",
        caption: "Official trailer for An Echo Has No Shape.",
        thumbnailSrc: "/projects/an-echo-has-no-shape/hero-poster.webp",
      },
      {
        type: "youtube",
        id: "fQMKXwIIvok",
        caption: "Full uncut playthrough across all three regions and the Golden Gate ending.",
        thumbnailSrc: "/projects/an-echo-has-no-shape/cover.webp",
      },
    ],
    snippets: [],
    sections: [
      {
        eyebrow: "01 / Philosophy",
        title: "Presence and one-verb restraint",
        body: [
          "In Peter Brinson's framework, narrative for the Traveler is constituted by presence: where the player walks, when they pause, and what they stop to hear determine what the world reveals. The brief called for a multicursal labyrinth that moves the player from feeling lost in wonder, to recognizing a pattern, to finding their way through interpretation.",
          "Drawing on Samuel Beckett's sparse landscapes and Jorge Luis Borges's labyrinths, monumental ruins and stone tablets sit inside an open mist with no exposition dump. Every presence in the basin projects a voice into the void, mistaking what bounces back for the whole world.",
        ],
        widget: "traveler-arc",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/banner-siren-clash.webp",
            alt: "An Echo Has No Shape cinemascope key art showing white-gold player echo colliding with magenta Siren waves",
            caption: "Key visual: the Traveler's ivory-gold echo pulse colliding with the Siren's magenta interference across the abyssal basin.",
            width: 1920,
            height: 420,
            fullWidth: true,
            naturalAspect: true,
          },
        ],
      },
      {
        eyebrow: "02 / Epistemic Matrix",
        title: "The Rule of Three matrix",
        body: [
          "Rather than unlocking new abilities, each region asks what assumption the player has formed about their echo and subverts it. Keeping the input identical meant every region had to recontextualize how the returning signal is read.",
        ],
        widget: "rule-of-three-matrix",
      },
      {
        eyebrow: "03 / Glacial Ocean",
        title: "Signal vs. deception",
        body: [
          "First-person platforming across ice floes becomes routine if the echo is always reliable, and frustrating if jumps demand tight dexterity. The Glacial Ocean places the tension in evaluating where to jump rather than in physical execution.",
          "Across two true routes and a false shortcut branch, ice floes are split into permanent anchor islands, hidden solid stepping stones revealed in white by the player's echo, and non-solid decoy floes that submerge when stepped on. Three unseen Siren emitters broadcast a magenta wave every 7 seconds that overwrites 35% of revealed ice in pink, erases 40% back into fog, and falsely lights 70% of decoys in pink, forcing players to cross-examine the Siren's song with their own voice.",
        ],
        widget: "glacier-state-machine",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-02-glacial-ocean.webp",
            alt: "Region I Level Design Map: Glacial Ocean showing solid anchor floes, hidden stepping stones, decoy floes, and Siren emitters",
            caption: "Architectural level design map of the Glacial Ocean: solid anchor floes (white), hidden solid stepping stones (cyan), non-solid Siren traps (magenta dashed), and 62m Siren emitter radii.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/glacier-white-echo.webp",
            alt: "Glacial Ocean in-game view of white player echo illuminating ice floes and twin ice spires",
            caption: "A player-cast white echo revealing solid stepping stones in front of the twin ice spires.",
            width: 1920,
            height: 896,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/glacier-gold-splines.webp",
            alt: "Glacial Ocean completed golden route and acoustic guide spline ribbon",
            caption: "Completed Glacial Ocean route illuminated in gold alongside the acoustic guide spline ribbon.",
            width: 1920,
            height: 897,
          },
        ],
      },
      {
        eyebrow: "04 / Unremembered City",
        title: "Subjective memory synthesis",
        body: [
          "The Unremembered City expresses its central theme (that history is a collection of biased, incomplete projections over a ruin) entirely through spatial layout and environmental state, with zero dialogue trees.",
          "Attuning to the central plaza tablet reveals only the skeletal street grid (Stage 0). Three statues in separate quarters project partial historical lenses: The Muse (SW) restores sanctuary courtyards and flora, The Ruler (SE) layers imperial gates and citizen silhouettes, and The Architect (NE) restores load-bearing walls and arches. Attuning out of sequence or leaving the city collapses the chain back to fog; layering all three in sequence (0 → 1 → 2 → 3) synthesizes the city into a permanent golden state.",
        ],
        widget: "city-sequence",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-03-unremembered-city.webp",
            alt: "Region II Level Design Map: Unremembered City street layout, witness statue quarters, and 0-1-2-3 attunement sequence",
            caption: "Architectural map of the Unremembered City showing the central plaza tablet (0) and the three witness quarters: The Muse (1, SW), The Ruler (2, SE), and The Architect (3, NE).",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage0-neutral.webp",
            alt: "Stage 0 Neutral Wave revealing baseline skeletal ruins and central tablet beacon",
            caption: "Stage 0 (Neutral Wave): Baseline skeletal ruins and the central plaza beacon.",
            width: 1920,
            height: 900,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage1-muse.webp",
            alt: "Stage 1 The Muse sky-blue wave materializing cerulean fog, courtyards, birds, and flora",
            caption: "Stage 1 (The Muse): Sky-blue fog, sanctuary courtyards, birds, and living flora.",
            width: 1920,
            height: 893,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage2-ruler-arch.webp",
            alt: "Stage 2 The Ruler crimson wave materializing imperial archway and citizen silhouettes",
            caption: "Stage 2 (The Ruler): Imperial crimson fog, monumental archway, and citizen silhouettes.",
            width: 1920,
            height: 895,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage3-architect.webp",
            alt: "Stage 3 The Architect emerald wave restoring structural geometry and buttresses",
            caption: "Stage 3 (The Architect): Emerald fog and load-bearing structural geometry.",
            width: 1920,
            height: 891,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage4-gold-panorama.webp",
            alt: "Stage 4 Golden Synthesis showing all three perspective groups restored simultaneously across the city",
            caption: "Stage 4 (Golden Synthesis): All three subjective perspective groups restored simultaneously.",
            width: 1920,
            height: 897,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage4-gold-street.webp",
            alt: "Eye-level street view inside the Unremembered City during Stage 4 Golden Synthesis",
            caption: "Eye-level street perspective inside the synthesized golden city.",
            width: 1920,
            height: 892,
          },
        ],
      },
      {
        eyebrow: "05 / Illusory Woods",
        title: "Tuning the 3-second silence",
        body: [
          "In the Illusory Woods, the player's own echoes maintain the barrier. Casting a white echo illuminates pass-through illusory tree walls alongside real corridor walls, making direct junctions appear blocked. To dissolve those barriers, the player must cast an echo and wait in silence so the heart of the forest can answer back with a 400m green reply wave.",
          "If the reply delay was too short (< 1.5s), players triggered the green reply by accident; if too long (> 5.0s), restless players pressed E again on cooldown and reset the timer. Setting the delay to 3.0s and adding a 0.35s active wave overwrite (where pressing E during the forest's 5.0s hold window carves through the green wave and snaps the illusory tree walls shut) taught the silence rule purely through systemic cause and effect.",
        ],
        widget: "woods-telemetry-and-cadence",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-04-illusory-woods.webp",
            alt: "Region III Level Design Map: Illusory Woods showing dirt-corridor labyrinth, green pass-through illusory barriers, outskirts tablets, and forest reply center",
            caption: "Architectural level design map of the Illusory Woods: pass-through illusory barriers (bright green bars) block arterial junctions until dissolved by the 400m forest reply wave.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/woods-shimmer-path.webp",
            alt: "Illusory Woods pine corridor with acoustic guide ribbon",
            caption: "Pine corridor inside the Illusory Woods illuminated by an acoustic guide ribbon.",
            width: 1920,
            height: 901,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/woods-sentinel-tower.webp",
            alt: "Illusory Woods southwest final clearing, ruined archway, and Sentinel Tower in emerald reply glow",
            caption: "The southwest clearing and Sentinel Tower revealed after passing through the dissolved forest barriers.",
            width: 1920,
            height: 900,
          },
        ],
      },
      {
        eyebrow: "06 / World Topology",
        title: "Sightless wayfinding",
        body: [
          "To maintain zero HUD markers, minimaps, or loading screens, the entire ~550m × 550m acoustic basin lives inside one continuous scene around the central Stone Monument Hub.",
          "Players orient themselves across four spatial scales: 450m golden world reverberations and sky beacons on regional completion, volumetric fog and music crossfades across regional outskirts, acoustic guide splines that shimmer when echoed, and a visibility hierarchy separating permanent landmark silhouettes from echo-revealed terrain.",
        ],
        widget: "world-topology-and-wayfinding",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-01-world-overview.webp",
            alt: "Master World Map: The Acoustic Basin showing the Stone Monument Hub, all three regional fog bounds, and connecting guide splines",
            caption: "Master World Map (~550m × 550m): the central Stone Monument Hub, nested inner and outer regional fog bounds, outskirts tablets, and connecting acoustic guide splines.",
            width: 1600,
            height: 1600,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/monument-initial-echo.webp",
            alt: "Stone Monument Hub in initial state with white player echo and glowing prophecy tablet",
            caption: "Stone Monument Hub (Initial State): A player echo sweeps across the monoliths and prophecy tablet.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/monument-goldengate.webp",
            alt: "Stone Monument Hub at 3/3 completion with unlocked golden trilithon gate, guide splines, and sky beacons",
            caption: "Stone Monument Hub (3/3 Completion): Breaking all three regional silences unlocks the golden trilithon gate and illuminates the basin's guide splines and sky beacons.",
            width: 1920,
            height: 901,
          },
        ],
      },
      {
        eyebrow: "07 / Retrospective",
        title: "Design takeaways",
        body: [
          "1. Mechanical Restraint vs. Epistemic Variety: Keeping the player on a single E input meant progression had to come from recontextualizing how signals are read rather than expanding the action set, shifting from verification (Glacial Ocean), to synthesis (Unremembered City), to restraint (Illusory Woods).",
          "2. Diegetic Feedback Over Text: In the Illusory Woods, tablet poetry alone did not stop players from echoing on cooldown. Adding the active wave overwrite (where a new player pulse visibly erases the forest's green reply and snaps the illusory walls shut) let players infer the 3.0s silence rule from systemic cause and effect.",
          "3. Aligning Topology With Acoustic Rules: Each region's physical layout reinforces its mechanic: decoy floes mimic convenient shortcuts in the Glacial Ocean, three witnesses sit in separate quarters of the Unremembered City, and pass-through barriers block arterial junctions in the Illusory Woods until the player pauses to listen.",
        ],
      },
    ],
  },
  {
    slug: "starshore",
    title: "Starshore",
    role: "Solo Technical Game Designer",
    year: "2025",
    summary:
      "A 15-week gameplay prototype connecting character movement, abilities, targeting, inventory, shops, and data-driven pickups.",
    tags: ["Unreal Engine", "Blueprints", "Gameplay Systems", "UI"],
    cover: "/projects/starshore/design-layout-01.avif",
    coverWidth: 1589,
    coverHeight: 920,
    designGoal: "Build a complete playable loop around traversal, combat, items, and vendors without isolating each system into a separate test.",
    ownership: "Solo technical game design, gameplay implementation, level design, UI, animation integration, and scene assembly.",
    scope: "15-week solo prototype using third-party character and environment assets.",
    outcomes: [
      "Connected movement, abilities, targeting, inventory, shops, and loot through shared gameplay data.",
      "Built reusable pickup and vendor workflows that can expand without one-off actors or manually authored interface screens.",
    ],
    overview:
      "Starshore was a solo project built over 15 weeks to explore how a small set of interconnected gameplay systems could support a complete playable loop. I handled the gameplay logic, character and animation Blueprints, level design, scene assembly, interface work, and system integration. Third-party character and environment assets were used to keep the focus on design and implementation.",
    authorNote:
      "Starshore started as my attempt to understand why certain anime action RPGs feel so fluid. I wanted to build more than a controller demo, so I kept following the design into targeting, abilities, items, shops, and the smaller systems that make a playable loop hold together.",
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
          { type: "image", src: "/projects/starshore/inventory-01.avif", alt: "Starshore inventory interface showing the Codex Fulgur item", caption: "The modular inventory interface and item detail view." },
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
          { type: "image", src: "/projects/starshore/shop-01.avif", alt: "Starshore shop interface showing the Damage V item and purchase controls", caption: "Vendor stock displayed through the reusable item interface." },
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
    slug: "fallen-valkyrie",
    title: "Fallen Valkyrie",
    role: "Technical / Combat Designer",
    year: "2025",
    summary:
      "A 10-week action-combat prototype centered on weapon-dependent movesets, directional hit reactions, lock-on targeting, and a multiphase boss encounter.",
    tags: ["Unreal Engine", "Blueprints", "Combat Design", "Enemy AI"],
    cover: "/projects/fallen-valkyrie/cover.avif",
    coverWidth: 1715,
    coverHeight: 963,
    designGoal: "Create a readable action-combat encounter whose weapon states, hit reactions, enemy behavior, and arena progression reinforce one another.",
    ownership: "Solo technical and combat design, Blueprint implementation, boss AI, level scripting, animation systems, cinematics, and scene assembly.",
    scope: "10-week solo prototype using third-party environment, character, and source animation assets.",
    outcomes: [
      "Delivered spear and bow combat modes with weapon-aware targeting, resources, and directional reactions.",
      "Built an event-driven multiphase boss encounter with reusable StateTree tasks and phase-specific behavior.",
    ],
    overview:
      "Fallen Valkyrie was built as a focused study of combat design, character animation, and encounter AI. I handled the gameplay logic, character and animation Blueprints, level design, cinematics, and scene assembly. Third-party environment, character, and animation assets were used for production support, while the gameplay systems, animation logic, blendspaces, and encounter behavior were implemented specifically for the prototype.",
    authorNote:
      "I made Fallen Valkyrie because I wanted to work on the part of action games I enjoy most: how animation, enemy behavior, timing, and player feedback work together. The boss fight gave me one place to test all of those pieces.",
    responsibilities: [
      "Designed and implemented the spear, bow, targeting, resource, damage, and directional reaction systems.",
      "Built modular enemy behavior and a multiphase boss encounter with distinct combat states and transitions.",
      "Assembled the playable boss stage and connected its progression gates, cinematics, animation, and interface feedback.",
    ],
    media: [
      {
        type: "youtube",
        id: "b9TmdVsIF5s",
        caption: "Full walkthrough of the Fallen Valkyrie combat prototype.",
      },
    ],
    snippets: [],
    sections: [
      {
        eyebrow: "01 / Encounter",
        title: "Design and layout",
        body: [
          "The level is structured as a linear boss stage. Trigger volumes control progression into each space, while an event-driven enemy tracker coordinates state changes such as unlocking the main gate after combat conditions are met.",
          "The boss encounter unfolds across multiple phases, with in-engine cinematics bridging major transitions. Environment and character packs supplied the visual assets; I was responsible for the level design, scene assembly, gameplay logic, and integration that turn them into a complete playable sequence.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/design-layout-01.avif", alt: "Overhead editor view of the Fallen Valkyrie boss arena", caption: "The primary boss arena and its surrounding encounter space." },
          { type: "image", src: "/projects/fallen-valkyrie/design-layout-02.avif", alt: "Editor view of a gated Fallen Valkyrie combat space", caption: "A progression space assembled around combat gates and encounter triggers." },
        ],
      },
      {
        eyebrow: "02 / Character",
        title: "Inputs and animation",
        body: [
          "The player can move between an unarmed state and two weapons: spear and bow. An enumerated weapon state selects the appropriate locomotion state machine and determines which animation montage responds to each input, allowing the same character framework to support distinct movesets.",
          "Layered blends and animation slots separate upper- and lower-body behavior for actions such as aiming, healing, and switching weapons. Retargeted source animations were integrated into the final blendspaces and montages, while secondary motion on wings, hair, and cloth uses Kawaii Physics for a more responsive silhouette.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/character-animation-01.avif", alt: "Fallen Valkyrie animation Blueprint showing weapon state blending", caption: "Weapon-dependent state machines, layered blends, slots, and secondary-motion integration." },
          { type: "image", src: "/projects/fallen-valkyrie/character-animation-02.avif", alt: "Spear attack montage configured with animation notifies", caption: "A spear attack montage with timing windows and notify-driven gameplay events." },
        ],
      },
      {
        eyebrow: "03 / Combat foundation",
        title: "Character resources and damage",
        body: [
          "Health, stamina, and mana use a shared pattern for value changes, interface updates, and regeneration. Stamina and mana begin recovering two seconds after their most recent use, creating a clear rhythm between expenditure and recovery.",
          "Damage is routed through a Blueprint interface that also filters trace results and passes hit information to other combat systems. Weapon colliders are attached to mesh sockets and enabled only during animation-notify windows, keeping damaging frames aligned with the authored attack motion.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/stats-01.avif", alt: "Mana consumption and delayed regeneration Blueprint", caption: "Mana updates, interface feedback, and timer-based regeneration." },
          { type: "image", src: "/projects/fallen-valkyrie/stats-02.avif", alt: "Health and death handling Blueprint", caption: "Health modification, UI updates, and the transition into the death state." },
        ],
      },
      {
        eyebrow: "04 / Targeting",
        title: "Weapon-aware aim and lock-on",
        body: [
          "Targeting changes with the equipped weapon. Spear attacks search for nearby actors through a sphere trace and orient the character toward a valid damage-interface target. Bow aim instead shifts to an over-the-shoulder camera and traces from the camera through the crosshair to calculate the projectile direction.",
          "A separate lock-on input searches along the camera's forward direction and keeps the controller oriented toward the selected actor. Entering bow aim temporarily overrides that behavior, preserving free aiming without discarding the current combat framework.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/targeting-01.avif", alt: "Sphere-trace targeting and look-at rotation Blueprint", caption: "Target validation through the damage interface followed by character orientation." },
          { type: "image", src: "/projects/fallen-valkyrie/targeting-02.avif", alt: "Attack input logic connecting stamina, targeting, and animation", caption: "Attack gating connects resource cost, target-facing behavior, and montage playback." },
        ],
      },
      {
        eyebrow: "05 / Feedback",
        title: "Directional stagger system",
        body: [
          "Hit reactions use impact information passed through the damage interface. Because overlap events do not provide a usable hit location, the system immediately performs a short trace from the weapon socket—or from a projectile's recorded spawn position—to the affected actor.",
          "The resulting direction is compared with the target's forward and right vectors to select an appropriate reaction. Individual attacks can also opt into knockdown behavior, and the reaction montage plays in a high-priority slot so a readable hit response can interrupt the current action.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/stagger-01.avif", alt: "Directional stagger calculation using forward and right vectors", caption: "Dot-product checks classify the incoming hit direction for reaction selection." },
          { type: "image", src: "/projects/fallen-valkyrie/stagger-02.avif", alt: "Projectile overlap and impact-location trace Blueprint", caption: "A follow-up trace recovers impact data unavailable from the initial overlap event." },
        ],
      },
      {
        eyebrow: "06 / Enemy behavior",
        title: "Modular StateTree AI",
        body: [
          "Boss and lesser-enemy behavior is organized with StateTrees and reusable task modules. Configurable values allow related enemies to share a behavioral foundation while varying how they move, orient, attack, and transition between states.",
          "The boss periodically enters a choice state and evaluates actions by condition and priority: close-range attacks, gap closers or spells, then repositioning fallbacks. Weighted substates add variation inside those categories, while selected movement actions can immediately request another decision to keep the encounter moving.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/ai-statetree-01.avif", alt: "Boss StateTree with locomotion, attack, and fallback branches", caption: "The boss choice structure organized by distance, priority, and action category." },
          { type: "image", src: "/projects/fallen-valkyrie/ai-statetree-02.avif", alt: "StateTree transitions and mid-fight phase conditions", caption: "Task configuration and health-driven transition conditions inside the StateTree." },
        ],
      },
      {
        eyebrow: "07 / Escalation",
        title: "Boss phases",
        body: [
          "The encounter controller spawns the boss with phase-specific parameters, binds to its death event, and uses that signal to coordinate the next cinematic and combat state. The original actor is replaced with a newly configured version so each phase can use its own StateTree and presentation without overloading one actor with every variation.",
          "During the second phase, a health threshold forces a mid-fight transition: the boss takes flight, becomes temporarily invulnerable, summons lesser enemies, and pressures the arena with projectiles. This creates a distinct pacing break before the direct fight resumes.",
        ],
        media: [
          { type: "image", src: "/projects/fallen-valkyrie/ai-phases-01.avif", alt: "Boss aerial phase Blueprint with summons and projectiles", caption: "The aerial subphase coordinates timed projectile pressure and enemy summons." },
          { type: "image", src: "/projects/fallen-valkyrie/ai-phases-02.avif", alt: "Level Blueprint coordinating boss spawn and death events", caption: "Phase-specific spawning and event binding connect combat outcomes to encounter flow." },
        ],
      },
    ],
  },
  {
    slug: "sacred-forest",
    title: "Sacred Forest",
    role: "Environment / Technical Artist",
    year: "2026",
    summary:
      "A stylized forest shrine developed end to end through modeling, procedural materials, foliage, lighting, effects, and engine assembly.",
    tags: ["Unreal Engine", "Environment Art", "Substance", "Maya / Python"],
    cover: "/projects/sacred-forest/cover.avif",
    coverWidth: 1715,
    coverHeight: 963,
    designGoal: "Translate a stylized concept into a cohesive realtime environment supported by consistent materials, foliage, lighting, and effects.",
    ownership: "Environment production and technical art: modeling, sculpting, texturing, foliage, lighting, VFX, shader integration, and Python tooling.",
    scope: "Individual environment project based on an original concept by En Moroldo.",
    outcomes: [
      "Completed the scene end to end, from its hero shrine and procedural materials through foliage, atmosphere, and final assembly.",
      "Automated sphere-based vertex-normal transfers to keep stylized foliage lighting consistent across the asset set.",
    ],
    relatedGalleryIds: ["sacred-forest", "stylized-shrine", "vertex-normals-tool"],
    overview:
      "Sacred Forest is a stylized environment built to carry a consistent visual language from individual assets through the final scene. I handled the modeling, sculpting, texturing, lighting, visual effects, foliage, and engine assembly, using a compact production pipeline across Maya, ZBrush, Substance Painter, Substance Designer, Photoshop, and Unreal Engine.",
    authorNote:
      "Before I focused on technical design, most of my training was in 3D art. Sacred Forest is the clearest example of that background. I built the scene from the main shrine outward, then wrote a tool when the foliage workflow became repetitive.",
    responsibilities: [
      "Modeled, sculpted, baked, and textured the shrine as the environment's primary focal point.",
      "Created procedural and hand-painted materials, modular foliage, lighting, and atmospheric effects.",
      "Built a Maya Python tool to automate vertex-normal transfers for stylized foliage assets.",
    ],
    media: [
      {
        type: "youtube",
        id: "XUKIeKSg3Ko",
        caption: "Full walkthrough of the Sacred Forest environment.",
      },
    ],
    snippets: [],
    sections: [
      {
        eyebrow: "01 / Focal asset",
        title: "Stylized shrine",
        body: [
          "The shrine anchors the composition and establishes the environment's shape language. Its low-poly structure was modeled in Maya, then taken into ZBrush for a high-poly sculpting pass before being baked and textured in Substance Painter.",
          "Detail and grunge information was condensed into packed texture maps and combined through reusable material functions. This kept the asset flexible in-engine while reducing the number of separate textures and material operations needed for the final result.",
        ],
        media: [
          { type: "image", src: "/projects/sacred-forest/shrine-01.avif", alt: "Two finished views of the textured Sacred Forest shrine", caption: "Final textured shrine shown from its open and closed sides." },
          { type: "image", src: "/gallery/artstation/stylized-shrine/zbrush-sculpt.jpg", alt: "Front view of the untextured Sacred Forest shrine sculpt", caption: "The shrine's front-facing modeled and sculpted forms before the final texture and material pass." },
        ],
      },
      {
        eyebrow: "02 / Surface language",
        title: "Procedural and painted textures",
        body: [
          "The environment's stylized surfaces were generated procedurally in Substance Designer, then adjusted in ZBrush and Photoshop where more authored control was needed. Building the materials from shared shape and wear principles helped the shrine, rocks, terrain, and foliage sit within the same visual treatment.",
          "The cracked stone and wood materials were built around broad, readable surface forms that hold up at environment scale. Their shared procedural approach made it easier to maintain a consistent level of wear and stylization across the scene.",
        ],
        media: [
          { type: "image", src: "/projects/sacred-forest/textures-01.avif", alt: "Stylized stone material shown on cylinder and sphere previews", caption: "Procedural stone forms developed in Substance Designer." },
          { type: "image", src: "/gallery/artstation/sacred-forest/bark-material.jpg", alt: "Stylized procedural wood material shown on cylinder and sphere previews", caption: "Procedural wood and bark forms developed in Substance Designer." },
        ],
      },
      {
        eyebrow: "03 / Scene integration",
        title: "Foliage, blending, and tooling",
        body: [
          "Foliage was assembled from lightweight cards using a hand-painted texture atlas. In Unreal Engine, Runtime Virtual Texture data samples the landscape color and feeds it into the foliage material, helping plants blend into the terrain instead of reading as disconnected assets.",
          "Bushes and other fuller forms use vertex normals transferred from a sphere to produce softer, more cohesive lighting. I built a Python utility in Maya to automate that transfer workflow, reducing a repetitive asset-preparation step and keeping the treatment consistent across the foliage set.",
        ],
        media: [
          { type: "image", src: "/projects/sacred-forest/foliage-01.avif", alt: "Wireframe view of stylized flowers, clover, and foliage cards", caption: "The foliage set combines modeled stems and leaves with lightweight flower and ground-cover cards." },
          { type: "image", src: "/projects/sacred-forest/stylize-normals-toolkit.avif", alt: "Stylize Normals Toolkit demonstrated on stylized foliage in Maya", caption: "The Stylize Normals Toolkit previews and applies controlled vertex normals across selected foliage assets." },
        ],
      },
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
