export const galleryTags = [
  "3D",
  "2D",
  "Environment",
  "Realtime",
  "Character",
  "Rigging",
  "Tools",
  "VFX",
  "Animations",
  "Traditional",
  "Props/Vehicles",
] as const;

export type GalleryTag = (typeof galleryTags)[number];

export type SoftwareName =
  | "Maya"
  | "Substance 3D Designer"
  | "Substance 3D Painter"
  | "SpeedTree"
  | "Unreal Engine"
  | "Gaea"
  | "ZBrush"
  | "Photoshop"
  | "Python"
  | "MEL"
  | "Yeti"
  | "Marmoset Toolbag"
  | "Clip Studio Paint"
  | "V-Ray"
  | "Houdini"
  | "Redshift"
  | "Traditional Media";

export type GalleryMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "youtube"; url: string; title: string };

export type GalleryEntry = {
  id: string;
  title: string;
  description: string;
  contribution: string;
  software: SoftwareName[];
  year: string;
  tags: GalleryTag[];
  cover: string;
  coverAlt: string;
  aspect: "portrait" | "landscape" | "square";
  media: GalleryMedia[];
  projectUrl?: string;
  projectLabel?: string;
  pinned?: boolean;
};

export const galleryEntries: GalleryEntry[] = [
  {
    id: "water-blossoms",
    title: "Water Blossoms",
    description: "A realtime character scene featuring a character by Idafaber, developed into a complete environment presentation.",
    contribution: "Set dressing, lighting, vegetation, landscape, and bridge modeling / texturing",
    software: ["Maya", "Substance 3D Designer", "Substance 3D Painter", "SpeedTree", "Unreal Engine", "Gaea"],
    year: "2026",
    tags: ["3D", "Environment", "Realtime"],
    cover: "/gallery/thumbnails/water-blossoms.webp",
    coverAlt: "Water Blossoms environment beauty frame",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=qozSZL4RGJo", title: "Water Blossoms cinematic" },
      { type: "image", src: "/gallery/artstation/water-blossoms/beauty.webp", alt: "Water Blossoms environment beauty frame" },
      { type: "image", src: "/gallery/artstation/water-blossoms/basecolor.webp", alt: "Water Blossoms base color view" },
      { type: "image", src: "/gallery/artstation/water-blossoms/detail-lighting.webp", alt: "Water Blossoms detail lighting view" },
    ],
  },
  {
    id: "stylized-classroom",
    title: "Stylized Classroom — Illustration Match",
    description: "A 3D environment implementation based on an original illustration by ArseniXC, translating its composition, materials, and lighting into a complete scene.",
    contribution: "3D environment implementation, materials, lighting, and final presentation",
    software: ["Maya", "V-Ray", "Substance 3D Painter"],
    year: "2026",
    tags: ["3D", "Environment"],
    cover: "/gallery/thumbnails/stylized-classroom.webp",
    coverAlt: "Finished stylized classroom environment",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "image", src: "/gallery/artstation/stylized-classroom/finished.png", alt: "Finished stylized classroom environment" },
      { type: "image", src: "/gallery/artstation/stylized-classroom/grayscale-implementation.png", alt: "Grayscale 3D implementation view of the classroom scene" },
    ],
  },
  {
    id: "flintlock-pistol",
    title: "Flintlock Pistol",
    description: "A hard-surface prop study presented through finished renders and material breakdowns.",
    contribution: "Modeling, texturing, material development, and presentation",
    software: ["Maya", "Substance 3D Designer", "Substance 3D Painter", "Unreal Engine"],
    year: "2026",
    tags: ["3D", "Props/Vehicles", "Realtime"],
    cover: "/gallery/thumbnails/flintlock-pistol.webp",
    coverAlt: "Flintlock pistol render",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "image", src: "/gallery/artstation/flintlock-pistol/render-01.webp", alt: "Flintlock pistol render one" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/render-02.webp", alt: "Flintlock pistol render two" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/render-03.webp", alt: "Flintlock pistol render three" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/render-04.webp", alt: "Flintlock pistol render four" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/diffuse.webp", alt: "Flintlock pistol diffuse breakdown" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/roughness.webp", alt: "Flintlock pistol roughness breakdown" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/metallic.webp", alt: "Flintlock pistol metallic breakdown" },
      { type: "image", src: "/gallery/artstation/flintlock-pistol/normal.webp", alt: "Flintlock pistol normal breakdown" },
    ],
  },
  {
    id: "cube-burst-vfx",
    title: "Cube Burst VFX",
    description: "A realtime magical cube-burst effect built from a custom Maya rig, layered Niagara systems, and Blueprint-controlled sequencing.",
    contribution: "Effect concept and implementation, cube rigging and animation, Niagara particle systems, materials, and Blueprint timing",
    software: ["Maya", "Unreal Engine"],
    year: "2025",
    tags: ["3D", "Realtime", "VFX", "Rigging", "Animations"],
    cover: "https://i.ytimg.com/vi/AeAxL2h0z40/maxresdefault.jpg",
    coverAlt: "Cube burst realtime VFX preview",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "youtube", url: "https://youtu.be/AeAxL2h0z40", title: "Cube Burst VFX" },
      { type: "image", src: "/gallery/vfx/cube-burst/maya-cube-rig.webp", alt: "Custom cube burst rig in Maya" },
      { type: "image", src: "/gallery/vfx/cube-burst/niagara-energy-sphere.webp", alt: "Energy sphere Niagara system overview" },
      { type: "image", src: "/gallery/vfx/cube-burst/niagara-lightning-attract.webp", alt: "Lightning attraction Niagara system overview" },
      { type: "image", src: "/gallery/vfx/cube-burst/blueprint-timing.webp", alt: "Blueprint timing and orchestration for the cube burst effect" },
    ],
  },
  {
    id: "homing-projectile-vfx",
    title: "Homing Projectile VFX",
    description: "A realtime homing projectile effect built and implemented in Unreal Engine.",
    contribution: "Realtime VFX design and Unreal Engine implementation",
    software: ["Unreal Engine"],
    year: "2025",
    tags: ["3D", "Realtime", "VFX"],
    cover: "https://i.ytimg.com/vi/gDepiNNRg1k/maxresdefault.jpg",
    coverAlt: "Homing projectile realtime VFX preview",
    aspect: "landscape",
    media: [
      { type: "youtube", url: "https://youtu.be/gDepiNNRg1k", title: "Homing Projectile VFX" },
    ],
  },
  {
    id: "castle-town-lighting",
    title: "Castle Town Lighting Study",
    description: "An environment lighting study exploring a cool, fog-heavy exterior with warm architectural accents. The underlying models and textures were provided.",
    contribution: "Set dressing, lighting, rendering, and final presentation; models and textures provided",
    software: ["Maya", "V-Ray"],
    year: "2023",
    tags: ["3D", "Environment"],
    cover: "/gallery/environment/castle-town-lighting/beauty.webp",
    coverAlt: "Foggy castle town environment beauty render",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/environment/castle-town-lighting/beauty.webp", alt: "Final beauty render of the castle town lighting study" },
      { type: "image", src: "/gallery/environment/castle-town-lighting/lighting-only.webp", alt: "Lighting-only render of the castle town environment" },
      { type: "image", src: "/gallery/environment/castle-town-lighting/early-blockout.webp", alt: "Early lighting and set-dressing blockout for the castle town environment" },
    ],
  },
  {
    id: "stylized-shrine",
    title: "Stylized Shrine",
    description: "A game-ready hero prop modeled, sculpted, baked, textured, and assembled with reusable material controls.",
    contribution: "Modeling, sculpting, baking, texturing, shader setup, and presentation",
    software: ["Maya", "ZBrush", "Substance 3D Painter", "Substance 3D Designer", "Photoshop", "Unreal Engine"],
    year: "2024",
    tags: ["3D", "Environment", "Realtime", "Props/Vehicles"],
    cover: "/gallery/thumbnails/stylized-shrine.webp",
    coverAlt: "Stylized shrine hero render",
    aspect: "landscape",
    projectUrl: "/projects/sacred-forest",
    projectLabel: "View environment breakdown",
    pinned: true,
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=mkx379N-2n4", title: "Stylized shrine turntable" },
      { type: "image", src: "/gallery/artstation/stylized-shrine/hero-render.jpg", alt: "Stylized shrine hero render" },
      { type: "image", src: "/gallery/artstation/stylized-shrine/wireframe.jpg", alt: "Stylized shrine low-poly wireframe" },
      { type: "image", src: "/gallery/artstation/stylized-shrine/zbrush-sculpt.jpg", alt: "Stylized shrine high-poly sculpt" },
      { type: "image", src: "/gallery/artstation/stylized-shrine/rgb-mask.jpg", alt: "Stylized shrine RGB mask and UV breakdown" },
      { type: "image", src: "/gallery/artstation/stylized-shrine/shader.jpg", alt: "Stylized shrine material function setup" },
    ],
  },
  {
    id: "sacred-forest",
    title: "Sacred Forest",
    description: "A stylized forest environment based on an original concept by En Moroldo, covering modeling, materials, foliage, lighting, VFX, and engine assembly.",
    contribution: "Modeling, materials, foliage, lighting, VFX, engine assembly, and Python tooling",
    software: ["Maya", "ZBrush", "Substance 3D Designer", "Substance 3D Painter", "Photoshop", "Unreal Engine", "Python"],
    year: "2025",
    tags: ["3D", "Environment", "Realtime", "Tools"],
    cover: "/gallery/thumbnails/sacred-forest.webp",
    coverAlt: "Sacred Forest final environment render",
    aspect: "landscape",
    projectUrl: "/projects/sacred-forest",
    projectLabel: "View full project breakdown",
    pinned: true,
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=XUKIeKSg3Ko", title: "Sacred Forest environment walkthrough" },
      { type: "image", src: "/gallery/artstation/sacred-forest/final-render.jpg", alt: "Sacred Forest final environment render" },
      { type: "image", src: "/gallery/artstation/sacred-forest/lighting-only.webp", alt: "Sacred Forest lighting-only scene view" },
      { type: "image", src: "/gallery/artstation/sacred-forest/bark-material.jpg", alt: "Sacred Forest stylized bark material" },
      { type: "image", src: "/gallery/artstation/sacred-forest/grass-material.jpg", alt: "Sacred Forest stylized grass material" },
      { type: "image", src: "/gallery/artstation/sacred-forest/moss-material.jpg", alt: "Sacred Forest stylized moss material" },
      { type: "image", src: "/gallery/artstation/sacred-forest/stone-material.jpg", alt: "Sacred Forest cracked stone material" },
      { type: "image", src: "/gallery/artstation/sacred-forest/foliage-cards.jpg", alt: "Sacred Forest foliage card assets" },
      { type: "image", src: "/gallery/artstation/sacred-forest/foliage-wireframe.jpg", alt: "Sacred Forest foliage wireframe view" },
      { type: "image", src: "/gallery/artstation/sacred-forest/foliage-atlas.jpg", alt: "Sacred Forest foliage texture atlas" },
    ],
  },
  {
    id: "tenebria-character-rig",
    title: "Tenebria Character & Rig",
    description: "A game-ready character developed through modeling, sculpting, baking, texturing, rigging, and a Yeti workflow for procedurally generated hair cards.",
    contribution: "Modeling, sculpting, baking, texturing, rigging, procedural hair-card generation, and presentation",
    software: ["Maya", "Yeti", "ZBrush", "Substance 3D Painter", "Marmoset Toolbag", "Python"],
    year: "2025",
    tags: ["3D", "Character", "Rigging"],
    cover: "/gallery/thumbnails/tenebria-character-rig.webp",
    coverAlt: "Tenebria character presentation renders",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=B1evXz2PDeI", title: "Tenebria character turntable" },
      { type: "image", src: "/gallery/artstation/tenebria/stills-composite.jpg", alt: "Tenebria character presentation renders" },
      { type: "youtube", url: "https://www.youtube.com/watch?v=BHnwLswAteg", title: "Tenebria rig demonstration" },
      { type: "image", src: "/gallery/artstation/tenebria/yeti-node-setup.avif", alt: "Yeti node graph used to generate Tenebria's hair" },
      { type: "image", src: "/gallery/artstation/tenebria/hair-viewport.avif", alt: "Maya viewport preview of Tenebria's hair-card placement" },
      { type: "image", src: "/gallery/artstation/tenebria/procedural-hair-cards.avif", alt: "Procedurally generated hair-card texture sheet for Tenebria" },
      { type: "image", src: "/gallery/artstation/tenebria/braids-back-render.avif", alt: "Back-view render of Tenebria's braided hairstyle" },
    ],
  },
  {
    id: "abigail-williams-sculpt",
    title: "Abigail Williams Sculpt",
    description: "A character sculpt of Abigail Williams from Fate/Grand Order, developed through a Maya and ZBrush workflow.",
    contribution: "Character sculpting and presentation",
    software: ["Maya", "ZBrush"],
    year: "2025",
    tags: ["3D", "Character"],
    cover: "https://i.ytimg.com/vi/R-CV2KwTSoo/maxresdefault.jpg",
    coverAlt: "Abigail Williams character sculpt",
    aspect: "portrait",
    media: [
      { type: "youtube", url: "https://youtube.com/shorts/R-CV2KwTSoo", title: "Abigail Williams ZBrush sculpt" },
    ],
  },
  {
    id: "zelda-animation-studies",
    title: "Character Animation Studies",
    description: "A combined set of parkour, gymnastics, and seated character animation exercises using a rig by Christoph Schoch.",
    contribution: "Character animation",
    software: ["Maya"],
    year: "2025",
    tags: ["3D", "Character", "Animations"],
    cover: "https://i.ytimg.com/vi/C7mkxqtJXvQ/maxresdefault.jpg",
    coverAlt: "Zelda character animation studies",
    aspect: "landscape",
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=C7mkxqtJXvQ", title: "Zelda animation studies" },
    ],
  },
  {
    id: "mel-clockwork-platform",
    title: "MEL-Driven Clockwork Platform",
    description: "A mechanical clockwork platform rigged and animated entirely through MEL scripting in Maya.",
    contribution: "MEL scripting, mechanical rigging, and procedural animation",
    software: ["Maya", "MEL"],
    year: "2026",
    tags: ["3D", "Rigging", "Tools", "Animations"],
    cover: "https://i.ytimg.com/vi/AF57O_aq47g/maxresdefault.jpg",
    coverAlt: "MEL-driven mechanical clockwork platform animation",
    aspect: "landscape",
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=AF57O_aq47g", title: "MEL-driven clockwork platform animation" },
    ],
  },
  {
    id: "t14-armata",
    title: "T-14 Armata Model",
    description: "A hard-surface vehicle model shown through matcap and wireframe views.",
    contribution: "Hard-surface modeling and topology",
    software: ["Maya"],
    year: "2026",
    tags: ["3D", "Props/Vehicles"],
    cover: "/gallery/thumbnails/t14-armata.webp",
    coverAlt: "T-14 Armata matcap view",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/t14-armata/matcap-01.webp", alt: "T-14 Armata matcap view one" },
      { type: "image", src: "/gallery/artstation/t14-armata/matcap-02.webp", alt: "T-14 Armata matcap view two" },
      { type: "image", src: "/gallery/artstation/t14-armata/wireframe.webp", alt: "T-14 Armata wireframe view" },
    ],
  },
  {
    id: "fantasy-vehicle",
    title: "Fantasy Vehicle Model",
    description: "A stylized vehicle design explored through clean hard-surface modeling and topology views.",
    contribution: "Hard-surface modeling and topology",
    software: ["Maya"],
    year: "2026",
    tags: ["3D", "Props/Vehicles"],
    cover: "/gallery/thumbnails/fantasy-vehicle.webp",
    coverAlt: "Fantasy vehicle matcap view",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/fantasy-vehicle/matcap-01.webp", alt: "Fantasy vehicle matcap view one" },
      { type: "image", src: "/gallery/artstation/fantasy-vehicle/matcap-02.webp", alt: "Fantasy vehicle matcap view two" },
      { type: "image", src: "/gallery/artstation/fantasy-vehicle/wireframe.webp", alt: "Fantasy vehicle wireframe view" },
    ],
  },
  {
    id: "hazy-city",
    title: "Hazy City",
    description: "A digital environment concept developed from thumbnail exploration through linework and atmosphere, then revisited through AI upscaling and experimental Photoshop filter effects.",
    contribution: "Concept development, thumbnails, linework, and digital painting",
    software: ["Clip Studio Paint", "Photoshop"],
    year: "2025",
    tags: ["2D", "Environment"],
    cover: "/gallery/thumbnails/hazy-city.webp",
    coverAlt: "Hazy City environment concept",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/hazy-city/watercolor-detail-2x.avif", alt: "Upscaled Hazy City environment concept with experimental Photoshop filter effects" },
      { type: "image", src: "/gallery/artstation/hazy-city/watercolor.jpg", alt: "Hazy City final environment concept" },
      { type: "image", src: "/gallery/artstation/hazy-city/thumbnails.webp", alt: "Hazy City thumbnail studies" },
      { type: "image", src: "/gallery/artstation/hazy-city/linework.webp", alt: "Hazy City linework" },
    ],
  },
  {
    id: "sketchbook-studies",
    title: "Perspective & Form Studies",
    description: "Pencil construction studies focused on perspective, proportion, and complex hard-surface forms.",
    contribution: "Perspective drawing and form construction",
    software: ["Traditional Media"],
    year: "2025",
    tags: ["2D", "Traditional", "Props/Vehicles"],
    cover: "/gallery/thumbnails/perspective-form-studies.webp",
    coverAlt: "F-16 pencil perspective construction study",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/sketchbook-studies/f16.jpg", alt: "F-16 pencil perspective construction study" },
      { type: "image", src: "/gallery/artstation/sketchbook-studies/pistols.jpg", alt: "Pistol pencil perspective construction studies" },
      { type: "image", src: "/gallery/artstation/sketchbook-studies/suburban-house.jpg", alt: "Suburban house pencil perspective study" },
    ],
  },
  {
    id: "skyward-island-concept",
    title: "Skyward Island Concept",
    description: "A ballpoint environment concept exploring a suspended landscape through dramatic perspective, scale, and organic forms.",
    contribution: "Environment concept design and ballpoint illustration",
    software: ["Traditional Media"],
    year: "2025",
    tags: ["2D", "Traditional", "Environment"],
    cover: "/gallery/thumbnails/sketchbook-studies.webp",
    coverAlt: "Skyward Island ballpoint environment concept",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/sketchbook-studies/skyward-island.jpg", alt: "Skyward Island ballpoint environment concept" },
    ],
  },
  {
    id: "vertex-normals-tool",
    title: "Vertex Normals Transfer Tool",
    description: "A Python tool for smoothing complex foliage assets and reducing repetitive production work.",
    contribution: "Python scripting, workflow design, and Maya implementation",
    software: ["Maya", "Python"],
    year: "2025",
    tags: ["Tools", "3D", "Environment"],
    cover: "/projects/sacred-forest/vertex-normals-tool.jpg",
    coverAlt: "Vertex normals transfer tool demonstration",
    aspect: "landscape",
    projectUrl: "/projects/sacred-forest",
    projectLabel: "See the tool in context",
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=ZX5VJnQhJQ4", title: "Vertex normals transfer tool demonstration" },
    ],
  },
  {
    id: "hotel-room",
    title: "Photomatch Hotel Room",
    description: "A photomatch environment modeled in Maya and rendered in V-Ray.",
    contribution: "Modeling, lighting, look development, and rendering",
    software: ["Maya", "V-Ray"],
    year: "2025",
    tags: ["3D", "Environment"],
    cover: "/gallery/thumbnails/hotel-room.webp",
    coverAlt: "Photomatch hotel room environment",
    aspect: "landscape",
    media: [{ type: "image", src: "/gallery/artstation/hotel-room/final.jpg", alt: "Photomatch hotel room environment" }],
  },
  {
    id: "alien-landscape",
    title: "Alien Landscape",
    description: "An environment built from individually modeled assets, procedurally instanced in Houdini, and rendered in Redshift.",
    contribution: "Asset modeling, procedural instancing, look development, and rendering",
    software: ["Maya", "Houdini", "Redshift"],
    year: "2025",
    tags: ["3D", "Environment"],
    cover: "/gallery/thumbnails/alien-landscape.webp",
    coverAlt: "Alien landscape final render",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/alien-landscape/breakdown.jpg", alt: "Alien landscape final render" },
      { type: "image", src: "/gallery/artstation/alien-landscape/final.jpg", alt: "Alien landscape Houdini viewport breakdown" },
    ],
  },
  {
    id: "antique-tabletop",
    title: "Antique Tabletop",
    description: "A modeling, texturing, lighting, and rendering study composed around a collection of antique props.",
    contribution: "Modeling, texturing, lighting, composition, and rendering",
    software: ["Maya", "Substance 3D Painter", "Photoshop", "Redshift"],
    year: "2024",
    tags: ["3D", "Environment", "Props/Vehicles"],
    cover: "/gallery/thumbnails/antique-tabletop.webp",
    coverAlt: "Antique tabletop still life render",
    aspect: "landscape",
    pinned: true,
    media: [{ type: "image", src: "/gallery/artstation/antique-tabletop/final.jpg", alt: "Antique tabletop still life render" }],
  },
  {
    id: "misty-night",
    title: "Misty Night",
    description: "An antique vehicle lighting and surfacing study built around a provided car model.",
    contribution: "Scene organization, texturing, lighting, rendering, and post-processing",
    software: ["Maya", "Substance 3D Painter", "Photoshop", "Redshift"],
    year: "2023",
    tags: ["3D", "Environment", "Props/Vehicles"],
    cover: "/gallery/thumbnails/misty-night.webp",
    coverAlt: "Antique vehicle in a misty night scene",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "image", src: "/gallery/artstation/misty-night/final.jpg", alt: "Antique vehicle in a misty night scene" },
      { type: "image", src: "/gallery/artstation/misty-night/viewport.webp", alt: "Antique vehicle viewport breakdown" },
      { type: "image", src: "/gallery/artstation/misty-night/diffuse.webp", alt: "Antique vehicle diffuse breakdown" },
      { type: "image", src: "/gallery/artstation/misty-night/roughness.webp", alt: "Antique vehicle roughness breakdown" },
      { type: "image", src: "/gallery/artstation/misty-night/metallic.webp", alt: "Antique vehicle metallic breakdown" },
    ],
  },
  {
    id: "dunes",
    title: "Dunes — City in Sand",
    description: "A surfacing and rendering study built from a provided environment scene.",
    contribution: "Texturing, look development, scene organization, and rendering",
    software: ["Maya", "V-Ray", "Substance 3D Painter", "Photoshop"],
    year: "2023",
    tags: ["3D", "Environment"],
    cover: "/gallery/thumbnails/dunes.webp",
    coverAlt: "City in Sand environment render",
    aspect: "landscape",
    media: [{ type: "image", src: "/gallery/artstation/dunes/final.jpg", alt: "City in Sand environment render" }],
  },
];

export function getYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/")[2];
    if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/")[2];
    return parsed.searchParams.get("v") ?? "";
  } catch {
    return url;
  }
}
