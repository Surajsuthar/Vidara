import type { LucideIcon } from "lucide-react";
import { ImageIcon, Wand2 } from "lucide-react";
import type { Metadata } from "next";

export type StudioItem = {
  label: string;
  href: string;
  description: string;
  slug: string[];
  icon: LucideIcon;
};

export const STUDIO_ITEMS = [
  {
    label: "Image Generate",
    href: "/generate/image",
    description: "Generate stunning images from text prompts using AI",
    slug: ["generate", "image"],
    icon: ImageIcon,
  },
  {
    label: "Edit Images",
    href: "/edit/image",
    description: "Edit and enhance your images with AI-powered tools",
    slug: ["edit", "image"],
    icon: Wand2,
  },
  // {
  //   label: "Video Generate",
  //   href: "/generate/video",
  //   description: "Create compelling videos from text descriptions with AI",
  //   slug: ["generate", "video"],
  // },
] as const satisfies StudioItem[];

export type StudioHref = (typeof STUDIO_ITEMS)[number]["href"];

type PageMeta = {
  title: string;
  description: string;
  keywords: string[];
};

export const STUDIO_PAGE_META: Record<string, PageMeta> = {
  "generate/image": {
    title: "AI Image Generator | Vidara Studio",
    description:
      "Generate stunning, high-quality images from text prompts using state-of-the-art AI models. Bring your imagination to life with Vidara.",
    keywords: [
      "AI image generation",
      "text to image",
      "AI art generator",
      "image AI",
      "Vidara",
    ],
  },
  "edit/image": {
    title: "AI Image Editor | Vidara Studio",
    description:
      "Edit and enhance your images with powerful AI tools. Retouch, transform, and perfect your visuals effortlessly with Vidara.",
    keywords: [
      "AI image editor",
      "image enhancement",
      "AI photo editing",
      "image retouching",
      "Vidara",
    ],
  },
  // "generate/video": {
  //   title: "AI Video Generator | Vidara Studio",
  //   description:
  //     "Create compelling, high-quality videos from text descriptions with AI-powered video generation. Produce professional content in seconds with Vidara.",
  //   keywords: [
  //     "AI video generation",
  //     "text to video",
  //     "AI video creator",
  //     "video AI",
  //     "Vidara",
  //   ],
  // },
};

export function buildStudioMetadata(slugKey: string): Metadata {
  const meta = STUDIO_PAGE_META[slugKey];
  if (!meta) return { title: "Not Found | Vidara" };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function getStudioItemByPath(pathname: string): StudioItem | undefined {
  return STUDIO_ITEMS.find((item) => item.href === pathname);
}

export function isValidStudioSlug(slug: string[]): boolean {
  const key = slug.join("/");
  return key in STUDIO_PAGE_META;
}
