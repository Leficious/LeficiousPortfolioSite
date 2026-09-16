export const galleryTags = [
  "3D",
  "2D",
  "Environment",
  "Realtime",
  "Character",
  "Rigging",
  "Tools",
  "Animations",
  "Digital",
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
    software: ["Maya"],
    year: "2026",
    tags: ["3D", "Environment", "Digital"],
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
    tags: ["3D", "Props/Vehicles", "Digital"],
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
      { type: "youtube", url: "https://www.youtube.com/watch?v=jdfmAHiv5ro", title: "Sacred Forest environment walkthrough" },
      { type: "image", src: "/gallery/artstation/sacred-forest/final-render.jpg", alt: "Sacred Forest final environment render" },
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
    description: "A game-ready character developed through modeling, sculpting, baking, texturing, presentation, and rigging.",
    contribution: "Modeling, sculpting, baking, texturing, rigging, and presentation",
    software: ["Maya", "ZBrush", "Substance 3D Painter", "Marmoset Toolbag", "Python"],
    year: "2025",
    tags: ["3D", "Character", "Rigging", "Animations"],
    cover: "/gallery/thumbnails/tenebria-character-rig.webp",
    coverAlt: "Tenebria character presentation renders",
    aspect: "landscape",
    pinned: true,
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=B1evXz2PDeI", title: "Tenebria character turntable" },
      { type: "image", src: "/gallery/artstation/tenebria/stills-composite.jpg", alt: "Tenebria character presentation renders" },
      { type: "youtube", url: "https://www.youtube.com/watch?v=BHnwLswAteg", title: "Tenebria rig demonstration" },
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
    pinned: true,
    media: [
      { type: "youtube", url: "https://www.youtube.com/watch?v=C7mkxqtJXvQ", title: "Zelda animation studies" },
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
    description: "A digital environment concept developed from thumbnail exploration through linework and atmosphere.",
    contribution: "Concept development, thumbnails, linework, and digital painting",
    software: ["Clip Studio Paint", "Photoshop"],
    year: "2025",
    tags: ["2D", "Environment", "Digital"],
    cover: "/gallery/thumbnails/hazy-city.webp",
    coverAlt: "Hazy City environment concept",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/artstation/hazy-city/watercolor.jpg", alt: "Hazy City final environment concept" },
      { type: "image", src: "/gallery/artstation/hazy-city/thumbnails.webp", alt: "Hazy City thumbnail studies" },
      { type: "image", src: "/gallery/artstation/hazy-city/linework.webp", alt: "Hazy City linework" },
    ],
  },
  {
    id: "sketchbook-studies",
    title: "Perspective & Form Studies",
    description: "Traditional ballpoint, ink, and graphite studies focused on perspective, structure, and visual ideation.",
    contribution: "Traditional drawing and visual development",
    software: ["Traditional Media"],
    year: "2025",
    tags: ["2D", "Traditional", "Environment", "Props/Vehicles"],
    cover: "/gallery/thumbnails/sketchbook-studies.webp",
    coverAlt: "Skyward Island ballpoint concept sketch",
    aspect: "portrait",
    media: [
      { type: "image", src: "/gallery/artstation/sketchbook-studies/skyward-island.jpg", alt: "Skyward Island ballpoint concept sketch" },
      { type: "image", src: "/gallery/artstation/sketchbook-studies/suburban-house.jpg", alt: "Suburban house ink perspective study" },
      { type: "image", src: "/gallery/artstation/sketchbook-studies/f16.jpg", alt: "F-16 graphite perspective study" },
      { type: "image", src: "/gallery/artstation/sketchbook-studies/pistols.jpg", alt: "Pistol graphite perspective studies" },
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
    cover: "https://i.ytimg.com/vi/ZX5VJnQhJQ4/maxresdefault.jpg",
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
    tags: ["3D", "Environment", "Digital"],
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
    tags: ["3D", "Environment", "Digital"],
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
    tags: ["3D", "Props/Vehicles", "Digital"],
    cover: "/gallery/thumbnails/antique-tabletop.webp",
    coverAlt: "Antique tabletop still life render",
    aspect: "landscape",
    media: [{ type: "image", src: "/gallery/artstation/antique-tabletop/final.jpg", alt: "Antique tabletop still life render" }],
  },
  {
    id: "misty-night",
    title: "Misty Night",
    description: "An antique vehicle lighting and surfacing study built around a provided car model.",
    contribution: "Scene organization, texturing, lighting, rendering, and post-processing",
    software: ["Maya", "Substance 3D Painter", "Photoshop", "Redshift"],
    year: "2023",
    tags: ["3D", "Props/Vehicles", "Digital"],
    cover: "/gallery/thumbnails/misty-night.webp",
    coverAlt: "Antique vehicle in a misty night scene",
    aspect: "landscape",
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
    tags: ["3D", "Environment", "Digital"],
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
