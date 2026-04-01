export interface MasonryImageItem {
  id: string | number;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

const DEFAULT_FALLBACK_COUNT = 24;
const DEFAULT_R2_FOLDER = "masonry";

export interface BuildMasonryImageOptions {
  baseUrl?: string;
  folder?: string;
  fallbackCount?: number;
  fallbackSeed?: string;
  extensions?: string[];
  widths?: number[];
  heights?: number[];
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function joinUrl(baseUrl: string, path: string) {
  return `${trimTrailingSlash(baseUrl)}/${path.replace(/^\/+/, "")}`;
}

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) return undefined;
  const normalized = baseUrl.trim();
  return normalized.length > 0 ? trimTrailingSlash(normalized) : undefined;
}

function getDimensionValue(values: number[], index: number, fallback: number) {
  return values[index % values.length] ?? fallback;
}

export function buildMasonryImagesFromKeys(
  keys: string[],
  options: BuildMasonryImageOptions = {},
): MasonryImageItem[] {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  if (!baseUrl || keys.length === 0) {
    return [];
  }

  return keys.map((key, index) => {
    const cleanKey = key.replace(/^\/+/, "");
    const width = getDimensionValue(
      options.widths ?? [900, 900, 900, 900],
      index,
      900,
    );
    const height = getDimensionValue(
      options.heights ?? [1200, 1480, 1320, 1640, 1400, 1560],
      index,
      1400,
    );

    return {
      id: `${cleanKey}-${index}`,
      src: joinUrl(baseUrl, cleanKey),
      alt: `Masonry image ${index + 1}`,
      width,
      height,
    };
  });
}

export function buildMasonryImagesFromIndexes(
  count: number,
  options: BuildMasonryImageOptions = {},
): MasonryImageItem[] {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  if (!baseUrl || count <= 0) {
    return [];
  }

  const folder =
    options.folder?.trim().replace(/^\/+|\/+$/g, "") || DEFAULT_R2_FOLDER;
  const extensions = options.extensions?.length
    ? options.extensions
    : ["webp", "jpg", "jpeg", "png"];
  const widths = options.widths ?? [900, 900, 900, 900];
  const heights = options.heights ?? [1200, 1480, 1320, 1640, 1400, 1560];

  return Array.from({ length: count }, (_, index) => {
    const fileNumber = index + 1;
    const extension = extensions[index % extensions.length] ?? "webp";
    const width = getDimensionValue(widths, index, 900);
    const height = getDimensionValue(heights, index, 1400);
    const key = `${folder}/${fileNumber}.${extension}`;

    return {
      id: `${folder}-${fileNumber}`,
      src: joinUrl(baseUrl, key),
      alt: `Masonry image ${fileNumber}`,
      width,
      height,
    };
  });
}

export function buildFallbackMasonryImages(
  options: BuildMasonryImageOptions = {},
): MasonryImageItem[] {
  const fallbackCount = options.fallbackCount ?? DEFAULT_FALLBACK_COUNT;
  const seed = options.fallbackSeed?.trim() || "vidara-masonry";
  const widths = options.widths ?? [900, 900, 900, 900];
  const heights = options.heights ?? [1200, 1480, 1320, 1640, 1400, 1560];

  return Array.from({ length: fallbackCount }, (_, index) => {
    const imageNumber = index + 1;
    const width = getDimensionValue(widths, index, 900);
    const height = getDimensionValue(heights, index, 1400);

    return {
      id: `fallback-${seed}-${imageNumber}`,
      src: `https://picsum.photos/seed/${seed}-${imageNumber}/${width}/${height}`,
      alt: `Fallback masonry image ${imageNumber}`,
      width,
      height,
    };
  });
}

export function buildMasonryBackgroundImages(
  keys: string[] = [],
  options: BuildMasonryImageOptions = {},
): MasonryImageItem[] {
  const fromKeys = buildMasonryImagesFromKeys(keys, options);

  if (fromKeys.length > 0) {
    return fromKeys;
  }

  const fromIndexes = buildMasonryImagesFromIndexes(
    options.fallbackCount ?? DEFAULT_FALLBACK_COUNT,
    options,
  );

  if (fromIndexes.length > 0) {
    return fromIndexes;
  }

  return buildFallbackMasonryImages(options);
}
