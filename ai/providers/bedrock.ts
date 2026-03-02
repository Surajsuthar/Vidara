import { bedrock } from "@ai-sdk/amazon-bedrock";
import { generateImage } from "ai";
import { getSize } from "@/lib/utils";
import type { ImageGenOptions, ImageGenResult } from "../types";

export enum ImageStyle {
  AnimatedFamilyFilm3D = "3D_ANIMATED_FAMILY_FILM",
  DesignSketch = "DESIGN_SKETCH",
  FlatVectorIllustration = "FLAT_VECTOR_ILLUSTRATION",
  GraphicNovelIllustration = "GRAPHIC_NOVEL_ILLUSTRATION",
  Maximalism = "MAXIMALISM",
  MidcenturyRetro = "MIDCENTURY_RETRO",
  Photorealism = "PHOTOREALISM",
  SoftDigitalPainting = "SOFT_DIGITAL_PAINTING",
}

export const imageStyleOptions = Object.values(ImageStyle);

export async function generateBedrock(
  opts: ImageGenOptions,
): Promise<ImageGenResult> {
  const start = Date.now();

  const size = opts.size ? getSize(opts.size) : "1024x1024";

  const { images, warnings } = await generateImage({
    model: bedrock.image("amazon.nova-canvas-v1:0"),
    prompt: opts.prompt,
    n: opts.n ?? 1,
    size,
    ...(opts.seed !== undefined ? { seed: opts.seed } : {}),
    providerOptions: {
      bedrock: {
        ...(opts.negativePrompt ? { negativeText: opts.negativePrompt } : {}),
        ...(opts.providerExtras ?? {}),
      },
    },
  });

  return {
    model: opts.model,
    durationMs: Date.now() - start,
    warnings: warnings?.map((w) => String(w)) ?? [],
    images: images.map((img) => ({
      base64: img.base64,
      uint8Array: img.uint8Array,
      mimeType: "image/png",
    })),
  };
}
