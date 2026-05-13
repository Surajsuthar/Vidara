import {
  Clapperboard,
  Film,
  Gauge,
  ImageIcon,
  Layers3,
  Scissors,
  Sparkles,
  Wand2,
} from "lucide-react";

export const heroStats = [
  { label: "Short-form outputs", value: "9:16" },
  { label: "Prompt to first draft", value: "60s" },
  { label: "Image + video models", value: "Multi" },
];

export const creationSteps = [
  {
    icon: Wand2,
    title: "Prompt the visual",
    description:
      "Start with a product shot, scene idea, or trend hook and turn it into production-ready creative.",
  },
  {
    icon: Layers3,
    title: "Direct the model",
    description:
      "Choose image or video models, aspect ratios, quality, seed control, and style parameters.",
  },
  {
    icon: Scissors,
    title: "Ship social cuts",
    description:
      "Create shorts, reels, TikTok-style clips, thumbnails, and visual variants for fast testing.",
  },
];

export const formatCards = [
  {
    icon: Film,
    title: "Reels",
    detail: "Vertical video concepts with motion-first framing.",
  },
  {
    icon: Clapperboard,
    title: "Shorts",
    detail: "Fast narrative beats for YouTube and campaign teasers.",
  },
  {
    icon: ImageIcon,
    title: "Images",
    detail: "Hero frames, thumbnails, product shots, and art directions.",
  },
  {
    icon: Sparkles,
    title: "Variants",
    detail: "Parallel generations for style, hook, and platform testing.",
  },
];

export const productHighlights = [
  {
    icon: Gauge,
    label: "Fast iteration",
    copy: "Move from idea to visual options without waiting on a production queue.",
  },
  {
    icon: ImageIcon,
    label: "Media library",
    copy: "Keep generated images and clips organized for campaigns and reuse.",
  },
  {
    icon: Sparkles,
    label: "Model choice",
    copy: "Use the best image and video providers from a single creation surface.",
  },
];

export const showcaseTiles = [
  {
    alt: "AI generated fashion reel frame",
    className:
      "row-span-2 bg-[url('https://picsum.photos/seed/vidara-fashion/640/960')]",
    label: "Style reel",
  },
  {
    alt: "AI generated product image",
    className: "bg-[url('https://picsum.photos/seed/vidara-product/640/640')]",
    label: "Product shot",
  },
  {
    alt: "AI generated food short frame",
    className: "bg-[url('https://picsum.photos/seed/vidara-food/640/780')]",
    label: "Shorts frame",
  },
  {
    alt: "AI generated cinematic image",
    className:
      "col-span-2 bg-[url('https://picsum.photos/seed/vidara-cinema/960/540')]",
    label: "Cinematic cover",
  },
];
