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
    slug: "still-life",
    title: "Still Life",
    role: "Solo Game Designer & Developer",
    year: "2026",
    summary:
      "A surrealist first-person puzzle game where motionless animal specimens serve as counterweights, bridges, and gear wedges while household appliances shiver, flee, and lean into your hand for warmth.",
    tags: ["Unity", "C#", "Game Design", "Level Design"],
    cover: "/projects/still-life/cover.webp",
    heroImage: "/projects/still-life/hero-poster.webp",
    coverWidth: 1920,
    coverHeight: 1080,
    designGoal:
      "Build a five-room puzzle progression that trains players to use static animals as physical puzzle tools while escorting a skittish Desk Lamp companion, setting up an unscripted reversal at the finale.",
    ownership:
      "Solo game design, multi-floor level design, C# companion AI and puzzle systems, custom HLSL ink/painterly shaders, floor indicator line systems, and world assembly.",
    scope:
      "Solo project in Unity 6 (URP) developed for Peter Brinson's course at USC around the Situated Player Role of The Dreamer.",
    outcomes: [
      "Designed a 4-stage, 235 kg multi-floor puzzle room (Room 2) where unlocking each new animal requires allocating 100% of your currently unlocked weight pool across elevators, bridges, focus stands, and gates with 0 kg left over.",
      "Built a 5-state Desk Lamp companion AI (flashbang flee, cornered shivering, LMB petting recovery, hopping follow, and hazard stops) paired with color-coded floor indicator lines across 5 rooms.",
    ],
    relatedGalleryIds: ["still-life"],
    overview:
      "Still Life is a solo first-person puzzle game built in Unity 6 (URP) for Peter Brinson's class at USC around the Situated Player Role of The Dreamer. Inside a monochrome ink-and-plaster gallery, biological roles are inverted: animals stand frozen like museum specimens that players carry as weights, planks, and gear wedges, while a Desk Lamp shivers in the dark, flees when startled, and leans into your hand for warmth.",
    authorNote:
      "Rather than lecturing the player about empathy through dialogue, I wanted the level design itself to build a habit. Across the first three rooms, every pressure plate, floor gap, and crusher trains you to treat animals strictly as puzzle weights and the Desk Lamp as your companion, until Room 4's industrial shredder rejects the Dog as a 'Living Organism' and leaves you holding the only inanimate object in the room.",
    externalLink: {
      url: "https://leficious.itch.io/still-life",
      label: "Play on itch.io",
    },
    downloads: [
      {
        url: "/projects/still-life/Still_Life_GDD.pdf",
        label: "Download GDD (PDF)",
      },
    ],
    responsibilities: [
      "Designed the role-inversion premise, 9-item counterweight roster (5 kg to 100 kg), and 3-step core puzzle loop.",
      "Built the 200m linear facility across 5 rooms and 3 connecting hallways, including Room 2's 4-stage 235 kg weight progression and Room 3's vent-powering tile layout.",
      "Programmed the Desk Lamp 5-state companion AI, Chest Mimic and Cold Vent soft gates, floor indicator line shaders, and static mesh consolidation (200+ FPS in Room 4).",
    ],
    media: [
      {
        type: "youtube",
        id: "4zkp4cTV8LU",
        caption: "Official trailer for Still Life.",
        thumbnailSrc: "/projects/still-life/hero-poster.webp",
      },
      {
        type: "youtube",
        id: "LAEXC_xDIP4",
        caption: "Full uncut walkthrough across all five rooms and the Pure White finale.",
        thumbnailSrc: "/projects/still-life/cover.webp",
      },
    ],
    snippets: [],
    sections: [
      {
        eyebrow: "01 / Premise & Core Loop",
        title: "Role inversion and the three-step puzzle loop",
        body: [
          "In Peter Brinson's framework, the Dreamer navigates a world governed by dream logic: an internal rule set that the player acts within before realizing what its rules imply. Inspired by Rene Magritte's object paradoxes and the industrial silhouettes of Limbo and Inside, Still Life swaps the behavioral cues of living creatures and household hardware.",
          "Every room runs on a three-step loop: collect and place static animal specimens onto brass pressure plates, across 4.2m floor gaps, and into crusher gears; clear route hazards (using Gold Focus Stands to pin Chest Mimics and shutting off cold air vents); and escort the Desk Lamp to the room's optical socket to open the exit.",
        ],
        widget: "still-life-inversion-matrix",
        media: [
          {
            type: "image",
            src: "/projects/still-life/map-01-overview.webp",
            alt: "Master Facility Plan of Still Life (Z = -12m to +188m) showing Rooms 1 through 5 and Hallways 1 through 3",
            caption: "Master Facility Plan (Z = -12m to +188m): orthographic floorplan and gating overview across Rooms 1 to 5 and Hallways 1 to 3.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-01-title-diorama.webp",
            alt: "Still Life 3D cutaway title diorama showing the gallery rooms and living lamp",
            caption: "3D cutaway title diorama introducing the monochrome ink-and-plaster gallery aesthetic.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-02-loading-fig01.webp",
            alt: "Archival loading blueprint FIG. 01: HORSE (100 KG)",
            caption: "Loading screen blueprint (FIG. 01: HORSE, 100 kg) framing animals as calibrated counterweight hardware.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "02 / Specimen Roster",
        title: "The 9-item counterweight catalog",
        body: [
          "To keep pressure-plate math readable without messy physics stacking, every animal in the facility is tuned to a clean multiple of 5 kg (from the 5 kg Chicken up to the 100 kg Horse), with only one non-multiple entry in the entire catalog: FIG. 04: Desk Lamp (1.4 kg).",
        ],
        widget: "still-life-specimen-catalog",
      },
      {
        eyebrow: "03 / Room 1 & Hallway 1",
        title: "Companion onboarding and soft hazard gates",
        body: [
          "Room 1 (The Study & Plaster Horse) teaches both halves of the core loop without tutorial text. Approaching the Desk Lamp startles it: the lamp flashes brightly, leaps off the desk, and flees around the dark perimeter. Fifteen seconds into the chase, a central floor hatch opens and the Plaster Horse rises on a hydraulic lift, physically blocking the loop and cornering the Lamp so the player can hold and drag LMB across its shade to calm it down.",
          "Once comforted, the Lamp hops behind the player and mounts the optical socket while the Horse weighs down the 100 kg brass plate to open the exit. In Hallway 1, the Lamp stops and shivers outside the reach of a lunging Chest Mimic until the player places the Cat onto a 10 kg Gold Plate, powering a Focus Stand whose golden spotlight levitates and pins the Mimic in mid-air.",
        ],
        widget: "still-life-lamp-ai-fsm",
        media: [
          {
            type: "image",
            src: "/projects/still-life/shot-03-room1-horse.webp",
            alt: "Room 1 Plaster Horse rising from the central floor hatch",
            caption: "Room 1: The Plaster Horse rises from the central floor hatch to block the loop and corner the startled Desk Lamp.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-04-room1-lamp-plate.webp",
            alt: "Room 1 Dual Exit Plate with the comforted Desk Lamp mounted on the Lamp Socket",
            caption: "Room 1 Dual Exit: The comforted Desk Lamp mounted on its optical socket alongside the 100 kg counterweight plate.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-05-hallway1-focus.webp",
            alt: "Hallway 1 Focus Stand projecting a golden beam to levitate and pin a Chest Mimic",
            caption: "Hallway 1: Placing the Cat on the 10 kg Gold Plate powers the Focus Stand, levitating the Chest Mimic so the Lamp can pass.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "04 / Room 2",
        title: "The Three-Story Archive (235 kg full-allocation progression)",
        body: [
          "Room 2 expands into a three-story vertical hall (1F Courtyard, 2F Mezzanine, and 3F Penthouse) containing 7 animals totaling 235 kg. To prevent leftover items from bypassing later doors, the room uses a 4-stage progression (55 kg -> 115 kg -> 195 kg -> 235 kg) where unlocking each new animal requires simultaneously committing 100% of your currently unlocked weight pool across elevators, gold focus plates, gap bridges, and vault gates with 0 kg left over.",
          "The Giraffe acts as a multi-use prop: it can be tipped horizontally across 4.2m floor gaps on 2F and 3F as a walkable bridge, or picked back up to serve as a 60 kg counterweight on vault plates. Once the 40 kg Deer is unlocked in Stage 3, the Giraffe locks permanently across the 3F gap so the player cannot accidentally strand themselves on the top floor during the 235 kg finale.",
        ],
        widget: "still-life-room2-combinatorics",
        media: [
          {
            type: "image",
            src: "/projects/still-life/map-02-three-story-archive.webp",
            alt: "Room 2 Architectural Map: The Three-Story Archive (1F, 2F, 3F) and 235 kg flow layout",
            caption: "Room 2 Flow & Gating Map: Multi-elevation floorplan (1F Courtyard, 2F Mezzanine, 3F Penthouse) showing player flow, all 7 animal vaults, 3 Focus Stands, 2 elevators, and 4.2m Giraffe bridges.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-06-room2-atrium.webp",
            alt: "Room 2 Three-Story Archive atrium view with fluttering living books",
            caption: "Room 2 Atrium: Looking across the three-story archive where flocks of animated books flutter past static animal vaults.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-07-room2-giraffe-focus.webp",
            alt: "Carrying the Giraffe past a golden Focus Stand beam in Room 2",
            caption: "Carrying the Giraffe past an active golden Focus Stand beam pinning a 1F Chest Mimic.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-08-room2-giraffe-bridge.webp",
            alt: "Tipping the Giraffe across the 2F 4.2m gap as a walkable bridge",
            caption: "Multi-use prop: tipping the Giraffe across the 4.2m 2F floor gap to reach the SwitchBox and latch the elevator.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "05 / Hallway 2 & Room 3",
        title: "The Cryo-Foundry and vent-powering tiles",
        body: [
          "Hallway 2 introduces cold air vents that blast freezing streams across the corridor. While the player can walk straight through cold jets, the Desk Lamp shivers and stops at the edge of the stream until a brass plate cuts power to the vent.",
          "Room 3 (The Cryo-Foundry) reverses standard pressure-plate behavior with vent-powering tiles. Pre-placed animals sit on floor tiles that actively keep the room's cold jets running. Picking an animal up off its tile shuts off the cold air stream (clearing a safe path for the Desk Lamp) and adds that animal to your inventory so you can wedge the heavy specimens directly into the three gear intakes of the Central Crusher.",
        ],
        widget: "still-life-room3-foundry-system",
        media: [
          {
            type: "image",
            src: "/projects/still-life/map-03-cryo-foundry.webp",
            alt: "Hallway 2 & Room 3 Architectural Map: The Cryo-Foundry, Vent-Powering Tiles, and 3-Jammer Central Crusher",
            caption: "Hallway 2 & Room 3 Flow & Gating Map: Cold air vent streams, vent-powering tiles, and the 3 green indicator lines feeding the Central Crusher.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-09-hallway2-cryo.webp",
            alt: "Hallway 2 freezing air vent stream blocking the Desk Lamp",
            caption: "Hallway 2: Cold air jets block the shivering Desk Lamp until the Dog weighs down the shutoff plate.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-10-room3-foundry.webp",
            alt: "Room 3 Cryo-Foundry overview showing the Central Crusher and 3 green indicator lines",
            caption: "Room 3 Cryo-Foundry: The Central Crusher connected to three active green floor indicator lines.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-11-room3-tiger-jam.webp",
            alt: "Jamming the Central Crusher gears with the Tiger specimen",
            caption: "Mechanical jamming: wedging the Tiger directly into Jammer Intake #2 to lock the central gears.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-12-room3-horse-conduits.webp",
            alt: "Room 3 upper flywheel jammed by the Horse with all 3 green indicator lines deactivated",
            caption: "Jamming the upper flywheel with the Horse turns off the final green indicator line and locks open the Central Crusher.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "06 / Room 4 & Room 5 Finale",
        title: "Subverting player habit at the Shredder gate",
        body: [
          "Before entering Hallway 3 and Room 4, the loading screen displays FIG. 04: DESK LAMP (1.4 KG) with a catalog note: 'It shivers in the dark and leans into your hand like something alive, but to the gallery's sensors it is still just an object.' Inside Room 4's 4-directional infinite steel lattice, an Industrial Shredder blocks the exit with the prompt: INSERT 1 OBJECT TO PROCEED. Sitting beside the hopper is the Dog.",
          "Trained by three rooms of using animals as puzzle hardware, players instinctively grab the Dog and drop it into the chute, only for the shredder to blare 'BZZZT! SAFETY MECHANISM ACTIVATED: LIVING ORGANISM DETECTED!' and eject the Dog unharmed. With no other loose props in the room, the realization lands without a word of dialogue: the mute animals were alive all along, and the shivering Desk Lamp is the only inanimate object the sensor will accept. Sacrificing the Lamp opens the portal into Room 5's pure white space, where the ink outlines dissolve and the Dog wakes up: breathing, perking its ears, tilting its head, and wagging its tail.",
        ],
        widget: "still-life-subversion-arc",
        media: [
          {
            type: "image",
            src: "/projects/still-life/map-04-shredder-finale.webp",
            alt: "Hallway 3, Room 4 & Room 5 Architectural Map: 4-Directional Infinite Lattice, Industrial Shredder, and Pure White Finale",
            caption: "Hallway 3, Room 4 & Room 5 Flow & Gating Map: The 4-directional infinite lattice, the Industrial Shredder gate reversal, and the Room 5 Pure White Awakening.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-13-loading-fig04-lamp.webp",
            alt: "Loading screen FIG. 04: DESK LAMP (1.4 KG) foreshadowing the shredder sensor rule",
            caption: "Foreshadowing via loading screen: FIG. 04: DESK LAMP (1.4 KG) notes that to the gallery's sensors, the Lamp is still just an object.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-14-room4-shredder-dog.webp",
            alt: "Room 4 Industrial Shredder rejecting the Dog as a Living Organism inside the infinite lattice",
            caption: "Room 4: The Industrial Shredder rejects the Dog ('LIVING ORGANISM DETECTED!'), subverting three rooms of player habit.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-15-room4-lamp-sacrifice.webp",
            alt: "Holding the shivering Desk Lamp in front of the Industrial Shredder hopper",
            caption: "The unscripted reversal: holding the shivering Desk Lamp, the only inanimate object the shredder sensor will accept.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-16-room5-living-dog.webp",
            alt: "Room 5 Pure White Finale where the awakened Dog breathes, tilts its head, and wags its tail",
            caption: "Room 5 (Pure White Finale): Stripped of the gallery's ink-and-plaster filter, the Dog wakes up, breathing, tilting its head, and wagging its tail.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "07 / Technical Art & Retrospective",
        title: "Visual contrast, floor indicator lines, and level design takeaways",
        body: [
          "1. Contrasting Shaders Reinforce Player Habit: Static animals use triplanar ink cross-hatching, matte plaster shading, and zero vertex motion, while appliances use 7 FPS hand-drawn boiling outlines, shivering displacement, and warm light falloff. The visual presentation reinforces the player's assumptions before Room 4 flips them.",
          "2. Color-Coded Floor Indicator Lines: Every pressure plate, focus stand, elevator, and crusher connects to its target via right-angle floor and wall indicator lines color-coded by function (Cyan for gates and lifts, Gold for Focus Stands, and Green for Crusher jammers), keeping complex 3-story sightlines readable without floating UI markers.",
          "3. Full-Allocation Weight Budgets Prevent Sequence Breaks: Requiring 100% of the player's unlocked animal weight pool at each stage of Room 2 (55 kg -> 115 kg -> 195 kg -> 235 kg) ensured every specimen had to be reclaimed and re-routed rather than left behind as spare weight.",
        ],
        widget: "still-life-shader-telemetry",
      },
    ],
  },
  {
    slug: "an-echo-has-no-shape",
    title: "An Echo Has No Shape",
    role: "Solo Game Designer & Developer",
    year: "2026",
    summary:
      "A 4-week first-person acoustic exploration and puzzle game built around a single, unchanging echolocation input across three regions that change how the environment responds.",
    tags: ["Unity", "C#", "Game Design", "Level Design"],
    cover: "/projects/an-echo-has-no-shape/cover.webp",
    heroImage: "/projects/an-echo-has-no-shape/hero-poster.webp",
    coverWidth: 1920,
    coverHeight: 1080,
    designGoal:
      "Sustain a multi-region first-person exploration game on a single primary action (Press E to Emit Echo) without ability unlocks, combat, or HUD markers.",
    ownership:
      "Solo game design, level layout and gating, C# gameplay and regional echo-state systems, 4-layer sightless wayfinding, audio-fog crossfades, and world assembly.",
    scope:
      "4-week solo project in Unity 6 (URP) developed for Peter Brinson's course at USC around the Situated Player Role of The Traveler.",
    outcomes: [
      "Built a continuous ~550m x 550m fog-covered basin connecting a central hub and three spoke regions with zero HUD markers, minimaps, or loading screens.",
      "Designed three distinct regional puzzle rules around the same E input: platform verification against decoy signals (Glacial Ocean), a 3-wing sequential street loop (Unremembered City), and a 3.0s pause-and-reply gate (Illusory Woods).",
    ],
    relatedGalleryIds: ["an-echo-has-no-shape"],
    overview:
      "An Echo Has No Shape is a solo 4-week project built in Unity 6 for Peter Brinson's class at USC around the Situated Player Role of The Traveler. To focus the entire month on level design and puzzle variety, I locked the player's move set to a single primary action (Emit Echo on E, plus Interact on F) across three regional spokes where progression comes from changing how each space responds to your pulse.",
    authorNote:
      "Many echolocation games treat sound as a simple flashlight in the dark: once the pulse reveals the room geometry, the mechanic stops evolving. Across these three regions, the level design changes what your echo accomplishes: verifying solid footing against decoy traps, unlocking a 3-wing city in sequence, and pausing so the forest can open choke-point gates.",
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
      "Designed the single-verb core loop and three regional gating rules (platform verification, 3-wing sequential loop, and 3.0s silence gates).",
      "Built the ~550m x 550m continuous hub-and-spoke basin with a 4-layer sightless wayfinding system.",
      "Playtested and tuned the Illusory Woods 3.0s wait window and 0.35s wave-overwrite feedback across 6 test cohorts.",
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
        eyebrow: "01 / Level Design Pillars",
        title: "Exploration through pacing and single-verb restraint",
        body: [
          "Rather than piecing together text logs, the player reads the world through movement, positioning, and timing. Where you stand when you emit a pulse, and when you stop to listen, directly control which paths open.",
          "The player's move set never expands: Emit Echo (E, 42m range, 5.0s cooldown) and Interact (F at stone tablets). Removing combat, inventory, and ability upgrades forces every regional puzzle to come from level layout and signal behavior.",
        ],
        widget: "traveler-arc",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/banner-siren-clash.webp",
            alt: "An Echo Has No Shape key art showing white player echo colliding with magenta Siren waves",
            caption: "Key visual: the player's white echo pulse colliding with the Siren's magenta wave in the Glacial Ocean.",
            width: 1920,
            height: 420,
            fullWidth: true,
            naturalAspect: true,
          },
        ],
      },
      {
        eyebrow: "02 / Regional Rule Matrix",
        title: "Three regional variations on one verb",
        body: [
          "Rather than unlocking new abilities, each spoke tests a different habit the player has formed around pressing E and changes how the environment responds.",
        ],
        widget: "rule-of-three-matrix",
      },
      {
        eyebrow: "03 / Region 1: Glacial Ocean",
        title: "Flanking safe routes vs. baited decoy shortcuts",
        body: [
          "First-person platforming over water becomes repetitive if every visible platform is safe, and frustrating if jumps require pixel-perfect timing. The Glacial Ocean builds tension through route verification.",
          "Between Checkpoints 1 -> 2 -> 3, platforms are split into permanent anchor islands, hidden solid stepping stones along the flanking arc (revealed in white by the player's E pulse), and non-solid decoy floes placed along tempting direct shortcuts. Three Siren emitters broadcast a 62m magenta wave every 7.0s that tints 35% of solid ice pink, hides 40% back in fog, and lights 70% of non-solid decoys in bright pink, forcing players to pause on safe islands and press E to verify white solid geometry before jumping.",
        ],
        widget: "glacier-state-machine",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-02-glacial-ocean.webp",
            alt: "Region 1 Flow & Platform Classification Map: Glacial Ocean showing the Safe Flanking Route vs. Baited Direct Shortcuts",
            caption: "Region 1 Flow & Gating Map (Glacial Ocean): Showing the Safe Flanking Route (blue arrows) across solid/hidden-solid ice vs. the Baited Direct Shortcuts (red dashed arrows) over non-solid Siren decoys.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/glacier-white-echo.webp",
            alt: "Glacial Ocean in-game view of white player echo illuminating ice floes and twin ice spires",
            caption: "White Echo Verification: Player echo revealing solid white stepping stones before the twin spires.",
            width: 1920,
            height: 896,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/glacier-gold-splines.webp",
            alt: "Glacial Ocean completed golden route and acoustic guide spline ribbon",
            caption: "Region 1 Completion State: Interacting with Checkpoint 3 silences the Sirens and lights the route in gold.",
            width: 1920,
            height: 897,
          },
        ],
      },
      {
        eyebrow: "04 / Region 2: Unremembered City",
        title: "3-wing sequential street loop and reset boundary gate",
        body: [
          "In the Unremembered City, each landmark reveals only one architectural layer of the ruined street grid. No single statue restores the city on its own. To unlock the region, the player must navigate a full clockwise loop across all three city wings in strict sequence (0 -> 1 -> 2 -> 3).",
          "Interacting with the center plaza tablet reveals the baseline street grid (Stage 0). Three statues in separate wings layer additional architecture onto the city: The Muse (SW, Stage 1) adds courtyard gardens and trees, The Ruler (SE, Stage 2) adds grand archways and citizen figures, and The Architect (NE, Stage 3 -> 4) adds upper walls and roofs, permanently locking all layers in gold. Activating a statue out of order or crossing the outer boundary before Stage 4 triggers a 45 m/s Reset Wave from the center plaza that wipes unfinished layers back to Stage 0.",
        ],
        widget: "city-sequence",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-03-unremembered-city.webp",
            alt: "Region 2 Street Loop & Reset Boundary Map: Unremembered City showing the 0 -> 1 -> 2 -> 3 street traversal loop",
            caption: "Region 2 Street Loop & Reset Boundary Map (Unremembered City): Showing the required street traversal loop from Center Plaza (0) -> SW Muse Wing (1) -> SE Ruler Wing (2) -> NE Architect Wing (3) and the outer Reset Boundary.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage0-neutral.webp",
            alt: "Stage 0 Neutral Wave revealing baseline street grid and central tablet beacon",
            caption: "Stage 0 (Center Plaza): Baseline street grid and central plaza tablet.",
            width: 1920,
            height: 900,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage1-muse.webp",
            alt: "Stage 1 SW Wing (The Muse) sky-blue wave revealing courtyards, birds, and trees",
            caption: "Stage 1 (SW Muse Wing): Sky-blue fog, courtyard gardens, birds, and trees.",
            width: 1920,
            height: 893,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage2-ruler-arch.webp",
            alt: "Stage 2 SE Wing (The Ruler) crimson wave revealing archway and citizen silhouettes",
            caption: "Stage 2 (SE Ruler Wing): Crimson fog, monumental archway, and citizen silhouettes.",
            width: 1920,
            height: 895,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage3-architect.webp",
            alt: "Stage 3 NE Wing (The Architect) emerald wave restoring upper walls and roofs",
            caption: "Stage 3 (NE Architect Wing): Emerald fog and upper structural walls and roofs.",
            width: 1920,
            height: 891,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage4-gold-panorama.webp",
            alt: "Stage 4 Gold Lock showing all building layers permanently lit across the city",
            caption: "Stage 4 (Gold Completion): All building layers locked simultaneously in warm gold.",
            width: 1920,
            height: 897,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/city-stage4-gold-street.webp",
            alt: "Eye-level street view inside the Unremembered City during Stage 4 Gold Completion",
            caption: "Eye-level street perspective inside the completed golden city.",
            width: 1920,
            height: 892,
          },
        ],
      },
      {
        eyebrow: "05 / Region 3: Illusory Woods",
        title: "Corridor choke-point gates and the 3.0s silence window",
        body: [
          "Across the main junctions leading to the SW Sentinel Tower, 8 pass-through illusory walls sit across the dirt paths. When the player casts a white echo (42m range, 1.4s duration), the pulse lights up these false walls with the exact same white shader as solid corridor trees, making the direct path look like a dead end and funneling impatient players into long detour loops.",
          "If the player casts an echo and then waits 3.0s without pressing E again, the center of the forest answers with a 400m Green Reply Wave that dissolves all false walls for 5.0s so the player can walk straight through. If the wait timer was too short (< 1.5s), players triggered the green reply by accident; if too long (>= 5.0s), players pressed E on habit when the cooldown finished and reset the timer. Setting the wait to 3.0s and adding a 0.35s wave overwrite (where pressing E during the open window visibly cuts off the green wave and snaps the gates shut) raised solve rates from 15% to 90%.",
        ],
        widget: "woods-telemetry-and-cadence",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-04-illusory-woods.webp",
            alt: "Region 3 Choke-Point Gates & Detour Flow Map: Illusory Woods showing the Direct Path through choke gates vs. Detour Loops",
            caption: "Region 3 Choke-Point Gates & Detour Flow Map (Illusory Woods): Showing the Direct Path (green arrows) through pass-through choke-point gates after a 3.0s wait vs. the Winding Detour Loops (red dashed arrows) when spamming E.",
            width: 1600,
            height: 1400,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/woods-shimmer-path.webp",
            alt: "Illusory Woods dirt corridor lit by an echo-activated guide spline",
            caption: "Dirt corridor inside the Illusory Woods lit by an echo-activated guide spline.",
            width: 1920,
            height: 901,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/woods-sentinel-tower.webp",
            alt: "Illusory Woods southwest final clearing, ruined archway, and Sentinel Tower in emerald reply glow",
            caption: "The southwest clearing and Sentinel Tower reached after passing through the dissolved choke-point gates.",
            width: 1920,
            height: 900,
          },
        ],
      },
      {
        eyebrow: "06 / World Layout & Wayfinding",
        title: "Hub-and-spoke routing and 4-layer sightless wayfinding",
        body: [
          "To keep zero HUD markers, minimaps, or loading screens, the entire ~550m x 550m basin is built inside a single continuous scene around the central Stone Monument Hub. After interacting with the hub tablet to light the three guide spline heads, players can tackle the three spokes in any order.",
          "Players orient themselves across four distance bands: 450m golden completion waves and high-altitude sky beacons (150m to 450m), nested outer/inner fog and music crossfade bounds (50m to 150m), echo-activated breadcrumb guide splines (15m to 50m), and permanent faint silhouettes on key checkpoints (0m to 15m).",
        ],
        widget: "world-topology-and-wayfinding",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-01-world-overview.webp",
            alt: "World Hub-and-Spoke Flow & Wayfinding Map (~550m x 550m) showing the Central Hub, 3 spoke routes, and fog bounds",
            caption: "World Hub-and-Spoke Flow & Wayfinding Map (~550m x 550m): Showing the Central Hub (H), the 3 spoke traversal flows (1, 2, 3), secondary inter-regional loops, and nested fog transition bounds.",
            width: 1600,
            height: 1600,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/monument-initial-echo.webp",
            alt: "Stone Monument Hub in initial state with white player echo and glowing prophecy tablet",
            caption: "Hub Initial State (0/3 Beacons): Player echo illuminating the monolith ring and central tablet.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/monument-goldengate.webp",
            alt: "Stone Monument Hub at 3/3 completion with unlocked golden trilithon gate, guide splines, and sky beacons",
            caption: "Hub Finale State (3/3 Beacons): Completing all three regions unlocks the golden trilithon gate and lights the basin's guide splines and sky beacons.",
            width: 1920,
            height: 901,
          },
        ],
      },
      {
        eyebrow: "07 / Retrospective",
        title: "Level design takeaways",
        body: [
          "1. Recontextualizing One Verb by Region: Keeping the player on a single E input meant puzzle variety had to come from level design: platform verification in Region 1, sequential 3-wing routing in Region 2, and timed choke-point gates in Region 3.",
          "2. Visual State Feedback Over Text Hints: In Region 3, tablet hints alone did not stop players from spamming E on cooldown. Adding the 0.35s wave overwrite (where pressing E visibly cuts off the green wave and snaps the gate shut in front of the player) raised solve rates from 15% to 90%.",
          "3. Matching Floorplans to Puzzle Rules: Each region's layout reinforces its mechanic: non-solid decoys placed along tempting direct shortcuts in the ocean, three statues separated across city wings, and pass-through walls placed across main forest choke points.",
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
          "Inventory contents are stored as item identifiers that resolve to shared structured data. The interface creates its item entries dynamically, so the underlying list - not a manually authored screen - determines what appears.",
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
          "Hit reactions use impact information passed through the damage interface. Because overlap events do not provide a usable hit location, the system immediately performs a short trace from the weapon socket - or from a projectile's recorded spawn position - to the affected actor.",
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
