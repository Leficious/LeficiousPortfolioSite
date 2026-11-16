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
  references?: Array<{ url: string; label: string }>;
  responsibilities: string[];
  media: MediaItem[];
  snippets: CodeSnippet[];
  sections?: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "still-life",
    title: "Still Life",
    role: "Solo Game & Level Designer",
    year: "2026",
    summary:
      "A surrealist first-person puzzle game where animals stand still and silent as counterweights, bridges, and gear wedges while household appliances shiver, flee, and lean into your hand for warmth.",
    tags: ["Unity 6", "Game Design", "Level Design", "3D Modeling & Rigging"],
    cover: "/projects/still-life/card-cover.webp",
    heroImage: "/projects/still-life/hero-poster.webp",
    coverWidth: 1920,
    coverHeight: 1080,
    designGoal:
      "Build a five-room puzzle progression that trains players to treat motionless animals as physical puzzle tools while escorting a skittish Desk Lamp companion toward a silent reversal in Room 4.",
    ownership:
      "Solo game design, multi-floor puzzle and level design, Maya 3D companion modeling and 18-joint rigging, floor indicator line wayfinding, world assembly, and AI-assisted C# prototyping.",
    scope:
      "Solo project in Unity 6 developed for USC Professor Peter Brinson's course around [Situated Player Role 4: The Dreamer, World as Enigma](https://peterbrinson.github.io/teach/PBOH/Design/Storytelling/Situated-Player-Role-4---The-Dreamer,-World-as-Enigma).",
    outcomes: [
      "Designed a 4-stage, 235 kg multi-floor puzzle room (Room 2) where unlocking each new animal requires allocating 100% of your currently unlocked weight pool across elevators, bridges, focus stands, and gates with 0 kg left over.",
      "Modeled and rigged an 18-joint Desk Lamp companion in Maya 2026 and designed its 5-state behavior flow (startled flee, cornered shivering, petting recovery, hopping follow, and hazard stops) across 5 rooms.",
    ],
    relatedGalleryIds: ["still-life"],
    overview:
      "Inside a monochrome gallery and foundry, the behavioral cues of animals and household objects are swapped. Animals stand still and silent on pedestals, so players carry them around as pressure-plate weights, gap bridges, and gear wedges, while a Desk Lamp shivers in the dark, flees when startled, and warms up when petted.",
    authorNote:
      "I built Still Life for Peter Brinson's class at USC to test whether level design could make a thematic point through habit formation alone. Across the first three rooms, every pressure plate, floor gap, and crusher rewards treating silent animals as weight numbers and the Desk Lamp as a companion, so when Room 4's shredder rejects the Dog as a 'Living Organism,' the player has already enacted the premise with their own hands.",
    externalLink: {
      url: "https://leficious.itch.io/still-life",
      label: "Play on itch.io",
    },
    downloads: [
      {
        url: "/projects/still-life/Still_Life_GDD.pdf",
        label: "Download GDD (PDF)",
      },
      {
        url: "/projects/still-life/Still_Life_1Page_Pitch.pdf",
        label: "Download 1-Page Pitch (PDF)",
      },
    ],
    references: [
      {
        url: "https://peterbrinson.github.io/teach/PBOH/Design/Storytelling/Situated-Player-Role-4---The-Dreamer,-World-as-Enigma",
        label: "Peter Brinson: The Dreamer, World as Enigma",
      },
    ],
    responsibilities: [
      "Designed the role-inversion premise, 9-item counterweight roster (5 kg to 100 kg), and 3-step core puzzle loop.",
      "Built the 200m linear facility across 5 rooms and 3 connecting hallways, including Room 2's 4-stage 235 kg weight progression and Room 3's vent-powering tile layout.",
      "Modeled and rigged the 18-joint Desk Lamp companion in Maya 2026, designed Chest Mimic and Cold Vent soft gates, and laid out color-coded floor indicator lines across all 5 rooms.",
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
        eyebrow: "01 / Premise, Audio Prompt & Core Loop",
        title: "Role inversion, the soundtrack prompt, and the three-step puzzle loop",
        body: [
          "Still Life was designed around USC Professor Peter Brinson's environmental storytelling concept of [Situated Player Role 4: The Dreamer, World as Enigma](https://peterbrinson.github.io/teach/PBOH/Design/Storytelling/Situated-Player-Role-4---The-Dreamer,-World-as-Enigma). In his four-role course framework, a standard puzzle game asks what the world's rules permit, whereas a Dreamer game runs on surreal dream logic where mechanics double as metaphors and the player's own puzzle solutions enact what the world expresses (alongside touchstones like Lewis Carroll's Alice's Adventures in Wonderland, Papo & Yo, and Satoshi Kon's Paprika). Combining that brief with Rene Magritte's object paradoxes, Still Life swaps the behavioral cues of living creatures and household hardware.",
          "Built for thatgamejam #02, the facility was paced around the jam's 66-second soundtrack prompt composed by Jason Grace. Its three sonic shifts shaped the progression of Rooms 1 through 5: the opening switch clicks and sparse winding music-box melody in the dark (0:00 to 0:21) inspired Room 1's startled Desk Lamp fleeing through a silent room of motionless animals; the steady clockwork percussion loop beneath warm strings (0:21 to 0:53) drove the core loop of hauling silent animals as 15 kg to 80 kg counterweights while protecting the Lamp from hazards in Rooms 2 and 3; and the abrupt mechanical cutoff (0:53 to 1:06) inspired Room 4's Industrial Shredder reversal and Room 5's silent white awakening.",
          "Every room runs on a three-step loop: collect and place motionless animals onto brass pressure plates, across 4.2m floor gaps, and into crusher gears; clear route hazards (using Gold Focus Stands to pin Chest Mimics and shutting off cold air vents); and escort the Desk Lamp to the room's optical socket to open the exit.",
        ],
        widget: "still-life-inversion-matrix",
        media: [
          {
            type: "image",
            src: "/projects/still-life/banner-diorama.webp",
            alt: "Still Life key visual banner (POSE // PULSE) showing the Horse and Tiger on calibration pedestals",
            caption: "Key visual banner (POSE // PULSE): the Horse (100 kg) and Tiger (80 kg) staged on upper-archive calibration pedestals.",
            width: 1920,
            height: 480,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "youtube",
            id: "z71a6UtZ6GY",
            caption: "thatgamejam #02 soundtrack prompt composed by Jason Grace (0:00 to 0:21 switch click & music box -> Room 1; 0:21 to 0:53 clockwork pulse & strings -> Rooms 2 & 3; 0:53 to 1:06 abrupt cutoff -> Rooms 4 & 5).",
          },
          {
            type: "image",
            src: "/projects/still-life/map-01-overview.webp",
            alt: "Master Facility Plan of Still Life (Z = -12m to +188m) showing Rooms 1 through 5 and Hallways 1 through 3",
            caption: "Master Facility Plan (Z = -12m to +188m): orthographic floorplan and gating overview across Rooms 1 to 5 and Hallways 1 to 3.",
            width: 1600,
            height: 1200,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-01-title-diorama.webp",
            alt: "Still Life 3D cutaway title screen (POSE // PULSE) showing the gallery shelves, living Desk Lamp, and motionless animals",
            caption: "3D cutaway title screen (POSE // PULSE) introducing the gallery rooms, Desk Lamp, and motionless animals.",
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
          {
            type: "image",
            src: "/projects/still-life/lamp-maya-model.webp",
            alt: "Custom 3D Desk Lamp companion mesh in Autodesk Maya 2026 (Lamp.mb)",
            caption: "Custom 3D Desk Lamp companion mesh in Autodesk Maya 2026 (Lamp.mb: 2,665 vertices across 16 hardware sub-meshes).",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/lamp-maya-rig.webp",
            alt: "Maya 18-joint skeleton hierarchy and procedural rig bindings for the Desk Lamp companion",
            caption: "Maya 18-joint skeleton hierarchy (Root_Jnt, Base_Jnt, Neck_01..08_Jnt, Head_Jnt, Switch_Jnt, Tail_01..06_Jnt) bound to DeskLampProceduralRig.cs.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "02 / Counterweight Roster",
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
          "Room 1 (The Study & The Horse) teaches both halves of the core loop without tutorial text. Approaching the Desk Lamp startles it: the lamp flashes brightly, leaps off the desk, and flees around the dark perimeter. Fifteen seconds into the chase, a central floor hatch opens and the Horse rises on a hydraulic lift, physically blocking the loop and cornering the Lamp so the player can hold and drag LMB across its shade to calm it down.",
          "Once comforted, the Lamp hops behind the player and mounts the optical socket while the Horse weighs down the 100 kg brass plate to open the exit. In Hallway 1, the Lamp stops and shivers outside the reach of a lunging Chest Mimic until the player places the Cat onto a 10 kg Gold Plate, powering a Focus Stand whose golden spotlight levitates and pins the Mimic in mid-air.",
        ],
        widget: "still-life-lamp-ai-fsm",
        media: [
          {
            type: "image",
            src: "/projects/still-life/shot-03-room1-horse.webp",
            alt: "Room 1 Horse rising from the central floor hatch",
            caption: "Room 1: The Horse rises from the central floor hatch to block the loop and corner the startled Desk Lamp.",
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
            height: 1200,
            fullWidth: true,
            naturalAspect: true,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-06-room2-atrium.webp",
            alt: "Wide Room 2 view across the three-story archive with floating alchemy bottles, fluttering books, Chicken, and Chest Mimic",
            caption: "Room 2 ('Bridge the Gaps.'): Wide view across the three-story archive showing floating alchemy bottles, fluttering books, the Chicken, Chest Mimic, and elevator frame.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-08-room2-giraffe-bridge.webp",
            alt: "Tipping the Giraffe across the 2F 4.2m gap as a walkable bridge",
            caption: "Multi-use prop: tipping the 60 kg Giraffe across the 4.2m 2F floor gap to reach the SwitchBox and latch the elevator.",
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
          "Room 3 (The Cryo-Foundry) reverses standard pressure-plate behavior with vent-powering tiles. Pre-placed animals sit on floor tiles that actively keep the room's cold jets running. Picking an animal up off its tile shuts off the cold air stream (clearing a safe path for the Desk Lamp) and adds that animal to your inventory so you can wedge the heavy animals directly into the three gear intakes of the Central Crusher.",
        ],
        widget: "still-life-room3-foundry-system",
        media: [
          {
            type: "image",
            src: "/projects/still-life/map-03-cryo-foundry.webp",
            alt: "Hallway 2 & Room 3 Architectural Map: The Cryo-Foundry, Vent-Powering Tiles, and 3-Jammer Central Crusher",
            caption: "Hallway 2 & Room 3 Flow & Gating Map: Cold air vent streams, vent-powering tiles, and the 3 green indicator lines feeding the Central Crusher.",
            width: 1600,
            height: 1200,
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
            alt: "Room 3 Cryo-Foundry catwalk view showing the Penguin and 3 glowing intakes on the Central Crusher",
            caption: "Room 3 ('Keep it warm.'): Catwalk view past the Penguin toward the three glowing intakes of the Central Crusher.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-11-room3-tiger-jam.webp",
            alt: "Jamming the Central Crusher gears with the Tiger",
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
          "Trained by three rooms of using animals as puzzle hardware, players instinctively grab the Dog and drop it into the chute, only for the shredder to blare 'BZZZT! SAFETY MECHANISM ACTIVATED: LIVING ORGANISM DETECTED!' and eject the Dog unharmed. With no other loose props in the room, the realization lands without a word of dialogue: the silent animals were alive all along, and the Desk Lamp is the only object the sensor will accept. Sacrificing the Lamp opens the portal into Room 5's pure white space, where the ink outlines dissolve and the Dog wakes up: breathing, perking its ears, tilting its head, and wagging its tail.",
        ],
        widget: "still-life-subversion-arc",
        media: [
          {
            type: "image",
            src: "/projects/still-life/map-04-shredder-finale.webp",
            alt: "Hallway 3, Room 4 & Room 5 Architectural Map: 4-Directional Repeating Lattice, Industrial Shredder, and Pure White Finale",
            caption: "Hallway 3, Room 4 & Room 5 Flow & Gating Map: The 4-directional steel grating platform, the Industrial Shredder gate reversal, and the Room 5 Pure White Finale.",
            width: 1600,
            height: 1200,
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
            alt: "Industrial Shredder flashing SAFETY MECHANISM ACTIVATED: LIVING ORGANISM DETECTED while holding the Dog",
            caption: "Dog Rejected ('LIVING ORGANISM DETECTED!'): Dropping the Dog into the chute triggers the red safety alarm and ejects it unharmed.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-15-room4-lamp-sacrifice.webp",
            alt: "Holding the shivering Desk Lamp in front of the Industrial Shredder hopper",
            caption: "Room 4 Shredder Gate: After the Shredder rejects the Dog as a living organism, the shivering Desk Lamp is the only inanimate object the sensor accepts.",
            width: 1920,
            height: 1080,
          },
          {
            type: "image",
            src: "/projects/still-life/shot-16-room5-living-dog.webp",
            alt: "Room 5 Pure White Finale where the awakened Dog breathes, tilts its head, and wags its tail",
            caption: "Room 5 (Pure White Finale): Outside the gallery's monochrome ink filter, the Dog wakes up, breathes, tilts its head, and wags its tail.",
            width: 1920,
            height: 1080,
          },
        ],
      },
      {
        eyebrow: "07 / Presentation & Retrospective",
        title: "Visual contrast, floor indicator lines, and level design takeaways",
        body: [
          "The visual direction was chosen to reinforce the puzzle habit before Room 4 flips it. Animals use flat monochrome cross-hatching and zero idle motion so they read like archival hardware, whereas the Desk Lamp and Chest Mimics use 7 FPS boiling outlines, shivering motion, and warm light falloff.",
          "Inside the multi-story rooms, every pressure plate, focus stand, elevator, and crusher connects to its target through right-angle floor and wall indicator lines (Cyan for gates and lifts, Gold for Focus Stands, and Green for Crusher jammers). That kept three-story cause and effect readable without floating UI icons.",
          "In playtesting Room 2, requiring 100% of the player's unlocked animal weight pool at each stage (55 kg -> 115 kg -> 195 kg -> 235 kg) solved sequence breaking cleanly: every animal had to be reclaimed and re-routed at each tier, so nothing could be left behind as spare weight.",
        ],
        widget: "still-life-shader-telemetry",
      },
    ],
  },
  {
    slug: "an-echo-has-no-shape",
    title: "An Echo Has No Shape",
    role: "Solo Game & Level Designer",
    year: "2026",
    summary:
      "A 4-week first-person acoustic exploration and puzzle game built around a single, unchanging echolocation input across three regions that change how the environment responds.",
    tags: ["Unity 6", "Game Design", "Level Design", "Spatial Wayfinding"],
    cover: "/projects/an-echo-has-no-shape/cover.webp",
    heroImage: "/projects/an-echo-has-no-shape/hero-poster.webp",
    coverWidth: 1920,
    coverHeight: 1080,
    designGoal:
      "Sustain a multi-region first-person exploration game on a single primary action (Press E to Emit Echo) without ability unlocks, combat, or HUD markers.",
    ownership:
      "Solo game design, level layout and gating, 4-layer sightless wayfinding, world assembly, 6-cohort playtesting, and AI-assisted C# prototyping.",
    scope:
      "4-week solo project in Unity 6 developed for USC Professor Peter Brinson's course around [Situated Player Role 2: The Traveler, World as Presence](https://peterbrinson.github.io/teach/PBOH/Design/Storytelling/Situated-Player-Role-2---The-Traveler,-World-as-Presence).",
    outcomes: [
      "Built a continuous ~550m x 550m fog-covered basin connecting a central hub and three spoke regions with zero HUD markers, minimaps, or loading screens.",
      "Designed three distinct regional puzzle rules around the same E input: platform verification against decoy signals (Glacial Ocean), a 3-wing sequential street loop (Unremembered City), and a 3.0s pause-and-reply gate (Illusory Woods).",
    ],
    relatedGalleryIds: ["an-echo-has-no-shape"],
    overview:
      "I built An Echo Has No Shape over four weeks to test how far level layout and regional rule changes could sustain a single, unchanging action (Emit Echo on E, plus Interact on F) across a continuous ~550m x 550m fog basin.",
    authorNote:
      "Most echolocation prototypes I played treated sound like a flashlight in the dark: once a pulse outlines the room, the relationship between player input and spatial information never changes. For Peter Brinson's class at USC, I wanted each region to change what pressing E actually does for navigation: verifying solid ice against decoy traps, completing a 3-wing city loop in sequence, and pausing long enough for the forest to open choke-point gates.",
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
    references: [
      {
        url: "https://peterbrinson.github.io/teach/PBOH/Design/Storytelling/Situated-Player-Role-2---The-Traveler,-World-as-Presence",
        label: "Peter Brinson: The Traveler, World as Presence",
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
          "An Echo Has No Shape was built around USC Professor Peter Brinson's concept of [Situated Player Role 2: The Traveler, World as Presence](https://peterbrinson.github.io/teach/PBOH/Design/Storytelling/Situated-Player-Role-2---The-Traveler,-World-as-Presence). In his environmental storytelling framework, where an Investigator game asks players to reconstruct a past plot from text logs and clues, the Traveler experiences a continuous world in the present tense through movement and attention: where you walk, when you pause, and what you stop to hear determine what the world reveals. In this basin, that idea becomes the core puzzle mechanic, since where you stand when casting an echo and when you wait in silence control which paths open.",
          "The player's move set never expands: Emit Echo (E, 42m range, 5.0s cooldown) and Interact (F at stone tablets). Leaving out combat, inventory, and ability upgrades meant every regional puzzle had to come from level layout and signal behavior.",
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
          "Each spoke isolates a specific habit the player forms around pressing E and changes how the environment answers.",
        ],
        widget: "rule-of-three-matrix",
      },
      {
        eyebrow: "03 / Region 1: Glacial Ocean",
        title: "Flanking safe routes vs. baited decoy shortcuts",
        body: [
          "First-person platforming over water gets repetitive if every visible platform is safe, and frustrating if jumps demand tight execution. The Glacial Ocean puts the challenge on pre-jump route verification.",
          "Between Checkpoints 1 -> 2 -> 3, platforms are split into permanent anchor islands, hidden solid stepping stones along the flanking arc (revealed in white by the player's E pulse), and non-solid decoy floes placed along direct shortcuts. Three Siren emitters broadcast a 62m magenta wave every 7.0s that tints 35% of solid ice pink, hides 40% back in fog, and lights 70% of non-solid decoys in pink. Players have to pause on safe islands and press E to confirm solid white geometry before jumping.",
        ],
        widget: "glacier-state-machine",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-02-glacial-ocean.webp",
            alt: "Region 1 Flow & Platform Classification Map: Glacial Ocean showing the Safe Flanking Route vs. Baited Direct Shortcuts",
            caption: "Region 1 Flow & Gating Map (Glacial Ocean): Showing the Safe Flanking Route (blue arrows) across solid/hidden-solid ice vs. the Baited Direct Shortcuts (red dashed arrows) over non-solid Siren decoys.",
            width: 1600,
            height: 1200,
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
          "Interacting with the center plaza tablet reveals the baseline street grid (Stage 0). Three statues in separate wings layer additional architecture onto the city: The Muse (SW, Stage 1) adds courtyard gardens and trees, The Ruler (SE, Stage 2) adds archways and citizen figures, and The Architect (NE, Stage 3 -> 4) adds upper walls and roofs to lock all layers in gold. Activating a statue out of order or crossing the outer boundary before Stage 4 triggers a 45 m/s Reset Wave from the center plaza that wipes unfinished layers back to Stage 0.",
        ],
        widget: "city-sequence",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-03-unremembered-city.webp",
            alt: "Region 2 Street Loop & Reset Boundary Map: Unremembered City showing the 0 -> 1 -> 2 -> 3 street traversal loop",
            caption: "Region 2 Street Loop & Reset Boundary Map (Unremembered City): Showing the required street traversal loop from Center Plaza (0) -> SW Muse Wing (1) -> SE Ruler Wing (2) -> NE Architect Wing (3) and the outer Reset Boundary.",
            width: 1600,
            height: 1200,
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
            caption: "Stage 2 (SE Ruler Wing): Crimson fog, stone archway, and citizen silhouettes.",
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
          "Across the main junctions leading to the SW Sentinel Tower, 8 pass-through illusory walls sit across the dirt paths. When the player casts a white echo (42m range, 1.4s duration), the pulse lights up these false walls with the exact same white outline as solid corridor trees, so the direct route looks like a dead end and impatient players detour into long corridor loops.",
          "If the player casts an echo and waits 3.0s without pressing E again, the center of the forest answers with a 400m Green Reply Wave that dissolves all false walls for 5.0s so the player can walk straight through. In early playtests, a short wait (< 1.5s) caused players to trigger the green reply by accident, while a long wait (>= 5.0s) meant players pressed E out of habit as soon as the cooldown finished. Tuning the pause to 3.0s and adding a visible 0.35s wave clash (where pressing E during the open window cuts off the green wave and snaps the gates shut) raised solve rates from 15% to 90%.",
        ],
        widget: "woods-telemetry-and-cadence",
        media: [
          {
            type: "image",
            src: "/projects/an-echo-has-no-shape/map-04-illusory-woods.webp",
            alt: "Region 3 Choke-Point Gates & Detour Flow Map: Illusory Woods showing the Direct Path through choke gates vs. Detour Loops",
            caption: "Region 3 Choke-Point Gates & Detour Flow Map (Illusory Woods): Showing the Direct Path (green arrows) through pass-through choke-point gates after a 3.0s wait vs. the Winding Detour Loops (red dashed arrows) when spamming E.",
            width: 1600,
            height: 1200,
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
            caption: "World Hub-and-Spoke Flow & Wayfinding Map (~550m x 550m): Showing the Central Hub (H), the 3 spoke traversal flows (1, 2, 3), secondary inter-regional loops, and regional fog transition bounds.",
            width: 1600,
            height: 1200,
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
          "Tuning the player pulse to fade after 1.4s on a 5.0s cooldown left a 3.6s dark window between casts. That gap gave both the Siren waves (every 7.0s) and the Forest Reply (at 3.0s) clear room to register against the terrain.",
          "In the Illusory Woods, poetic tablet hints alone did not stop players from pressing E on cooldown. Making an early E press visibly cut off the green wave and snap the choke-point gate shut in front of the player taught the rule far more reliably, raising intentional solve rates from 15% to 90%.",
          "Across the ~550m basin, pairing high-altitude sky beacons with 40m fog and music transition zones, echo-lit guide trails, and faint checkpoint outlines kept players oriented between spokes without HUD markers or a minimap.",
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
          "The character moves in two primary states: standard locomotion and a faster flight mode. Flight begins with a double-tap forward input and ends when the input is released or interrupted, so the transition stays responsive without another toggle key.",
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
          "Inventory contents are stored as item identifiers that resolve to shared structured data. The interface builds its item entries dynamically from that underlying list rather than a fixed hand-placed layout.",
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
          "Each entry's grid coordinates are calculated from its list index, so the interface lays out consistent grids for inventories of different sizes without manual placement.",
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
          "One reusable pickup actor configures itself from a data table instead of using separate Blueprints per item. Table rows define each pickup's mesh, rarity color, and optional overrides.",
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
          "The player switches between an unarmed state and two weapons: spear and bow. An enumerated weapon state selects the locomotion state machine and maps each attack input to the corresponding montage, so one character setup supports distinct movesets.",
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
          "Health, stamina, and mana share one pattern for value changes, UI updates, and regeneration. Stamina and mana begin recovering two seconds after their most recent use, which sets a clear pace between spending resources and resetting.",
          "Damage is routed through a Blueprint interface that filters trace results and passes hit information to downstream combat systems. Weapon colliders sit on mesh sockets and turn on only inside animation-notify windows so active hitboxes match the attack swing.",
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
          "A separate lock-on input searches along the camera's forward direction and keeps the controller oriented toward the selected actor. Entering bow aim temporarily overrides lock-on rotation so the player can aim freely within the same controller setup.",
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
          "Hit reactions use impact information passed through the damage interface. Because overlap events do not provide a usable hit location, the system immediately performs a short trace from the weapon socket (or from a projectile's recorded spawn position) to the affected actor.",
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
    designGoal: "Translate a stylized concept into a playable realtime environment with consistent materials, foliage, lighting, and effects.",
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
          "Foliage was assembled from lightweight cards using a hand-painted texture atlas. In Unreal Engine, Runtime Virtual Texture data samples the landscape color and feeds it into the foliage material so plants blend into the terrain where they meet the ground.",
          "Bushes and other fuller forms use vertex normals transferred from a sphere for softer lighting across the canopy. I wrote a Python utility in Maya to batch that transfer step across selected foliage meshes.",
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
