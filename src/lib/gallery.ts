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

export type GalleryMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "youtube"; url: string; title: string };

export type GalleryEntry = {
  id: string;
  title: string;
  description: string;
  year: string;
  tags: GalleryTag[];
  cover: string;
  coverAlt: string;
  aspect: "portrait" | "landscape" | "square";
  media: GalleryMedia[];
};

/**
 * Replace these starter entries with portfolio work. Each entry can contain any
 * number of images and YouTube links, and can use multiple filter tags.
 *
 * YouTube example:
 * { type: "youtube", url: "https://www.youtube.com/watch?v=VIDEO_ID", title: "Demo reel" }
 */
export const galleryEntries: GalleryEntry[] = [
  {
    id: "environment-study",
    title: "Environment Study",
    description: "Starter slot for a realtime environment, breakdown, or lighting study.",
    year: "2026",
    tags: ["3D", "Environment", "Realtime"],
    cover: "/gallery/placeholder-01.svg",
    coverAlt: "Abstract environment placeholder",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/placeholder-01.svg", alt: "Environment study placeholder one" },
      { type: "image", src: "/gallery/placeholder-02.svg", alt: "Environment study placeholder two" },
      { type: "image", src: "/gallery/placeholder-03.svg", alt: "Environment study placeholder three" },
    ],
  },
  {
    id: "character-motion",
    title: "Character Motion",
    description: "Starter slot for character, rigging, and animation work.",
    year: "2026",
    tags: ["3D", "Character", "Rigging", "Animations"],
    cover: "/gallery/placeholder-04.svg",
    coverAlt: "Abstract character placeholder",
    aspect: "portrait",
    media: [
      { type: "image", src: "/gallery/placeholder-04.svg", alt: "Character motion placeholder one" },
      { type: "image", src: "/gallery/placeholder-05.svg", alt: "Character motion placeholder two" },
    ],
  },
  {
    id: "prop-exploration",
    title: "Prop Exploration",
    description: "Starter slot for prop, hard-surface, or vehicle work.",
    year: "2026",
    tags: ["3D", "Props/Vehicles", "Digital"],
    cover: "/gallery/placeholder-06.svg",
    coverAlt: "Abstract prop placeholder",
    aspect: "square",
    media: [
      { type: "image", src: "/gallery/placeholder-06.svg", alt: "Prop exploration placeholder one" },
      { type: "image", src: "/gallery/placeholder-02.svg", alt: "Prop exploration placeholder two" },
    ],
  },
  {
    id: "visual-development",
    title: "Visual Development",
    description: "Starter slot for sketches, paintings, concepts, or design sheets.",
    year: "2026",
    tags: ["2D", "Digital", "Traditional"],
    cover: "/gallery/placeholder-03.svg",
    coverAlt: "Abstract visual development placeholder",
    aspect: "landscape",
    media: [
      { type: "image", src: "/gallery/placeholder-03.svg", alt: "Visual development placeholder one" },
      { type: "image", src: "/gallery/placeholder-05.svg", alt: "Visual development placeholder two" },
    ],
  },
  {
    id: "technical-tools",
    title: "Technical Tools",
    description: "Starter slot for tools, procedural systems, or pipeline work.",
    year: "2026",
    tags: ["Tools", "Realtime", "3D"],
    cover: "/gallery/placeholder-02.svg",
    coverAlt: "Abstract tools placeholder",
    aspect: "portrait",
    media: [
      { type: "image", src: "/gallery/placeholder-02.svg", alt: "Technical tools placeholder one" },
      { type: "image", src: "/gallery/placeholder-06.svg", alt: "Technical tools placeholder two" },
    ],
  },
  {
    id: "animation-tests",
    title: "Animation Tests",
    description: "Starter slot for animation clips or a YouTube-hosted reel.",
    year: "2026",
    tags: ["Animations", "Character", "Realtime"],
    cover: "/gallery/placeholder-05.svg",
    coverAlt: "Abstract animation placeholder",
    aspect: "square",
    media: [
      { type: "image", src: "/gallery/placeholder-05.svg", alt: "Animation tests placeholder one" },
      { type: "image", src: "/gallery/placeholder-01.svg", alt: "Animation tests placeholder two" },
    ],
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
