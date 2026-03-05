import {
  FileImageIcon,
  LayersIcon,
  MonitorIcon,
  RatioIcon,
  RulerIcon,
  SmartphoneIcon,
  SparklesIcon,
  SquareIcon,
  TvIcon,
} from "lucide-react";
import { useCallback } from "react";
import type {
  AspectRatio,
  ImageGenOptions,
  ImageOutputFormat,
  ModelMeta,
  QualityTier,
} from "@/ai/types";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Renders a tiny rectangle that visually represents the aspect ratio,
 * constrained inside a fixed 20×20 bounding box.
 */
function RatioBox({
  ratio,
  className = "",
}: {
  ratio: string;
  className?: string;
}) {
  const [wStr, hStr] = ratio.split(":");
  const w = Number(wStr);
  const h = Number(hStr);
  const BOX = 18; // bounding box size in px

  // Scale so the larger dimension fills the box
  const scale = BOX / Math.max(w, h);
  const rw = Math.round(w * scale);
  const rh = Math.round(h * scale);

  return (
    <svg
      width={BOX}
      height={BOX}
      viewBox={`0 0 ${BOX} ${BOX}`}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      {/* Outer bounding hint */}
      <rect
        x={0}
        y={0}
        width={BOX}
        height={BOX}
        rx={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
        strokeDasharray="2 2"
        opacity={0.2}
      />
      {/* The ratio rectangle, centered */}
      <rect
        x={(BOX - rw) / 2}
        y={(BOX - rh) / 2}
        width={rw}
        height={rh}
        rx={1}
        fill="currentColor"
        opacity={0.15}
        stroke="currentColor"
        strokeWidth={1.2}
      />
    </svg>
  );
}

const QUALITY_BARS: Record<QualityTier, number> = {
  low: 1,
  medium: 2,
  standard: 3,
  hd: 4,
  high: 5,
  ultra: 5,
  premium: 6,
};

function QualityBars({ tier }: { tier: QualityTier }) {
  const filled = QUALITY_BARS[tier];
  return (
    <span className="flex items-end gap-0.5 h-3.5 shrink-0" aria-hidden>
      {[1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-0.75 rounded-sm transition-colors ${
            i <= filled ? "bg-current opacity-90" : "bg-current opacity-20"
          }`}
          style={{ height: `${5 + i * 2}px` }}
        />
      ))}
    </span>
  );
}

function BatchGrid({ n }: { n: number }) {
  // Show up to 4 tiny squares in a 2×2 grid
  const cols = n <= 1 ? 1 : 2;
  const rows = Math.ceil(n / cols);
  const cells = Array.from({ length: n });
  return (
    <span
      className="inline-grid shrink-0"
      style={{
        gridTemplateColumns: `repeat(${cols}, 6px)`,
        gap: "2px",
      }}
      aria-hidden
    >
      {cells.map((_, i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-[1px] bg-current opacity-70"
        />
      ))}
    </span>
  );
}

const FORMAT_COLORS: Record<ImageOutputFormat, string> = {
  png: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  webp: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  jpeg: "bg-orange-500/15 text-orange-600 dark:text-orange-400",
};

function FormatBadge({ format }: { format: ImageOutputFormat }) {
  return (
    <span
      className={`text-[9px] font-bold tracking-wider uppercase px-1 py-px rounded ${FORMAT_COLORS[format]}`}
    >
      {format}
    </span>
  );
}

function ratioIcon(ratio: string) {
  const [wStr, hStr] = ratio.split(":");
  const w = Number(wStr);
  const h = Number(hStr);
  if (w === h)
    return <SquareIcon size={11} strokeWidth={2} className="opacity-50" />;
  if (w > h)
    return <MonitorIcon size={11} strokeWidth={2} className="opacity-50" />;
  return <SmartphoneIcon size={11} strokeWidth={2} className="opacity-50" />;
}

function DimIcon({ w, h }: { w: number; h: number }) {
  if (w === h)
    return <SquareIcon size={13} strokeWidth={1.5} className="opacity-60" />;
  if (w > h)
    return <TvIcon size={13} strokeWidth={1.5} className="opacity-60" />;
  return <SmartphoneIcon size={13} strokeWidth={1.5} className="opacity-60" />;
}

export const ASPECT_RATIO_OPTIONS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "Square" },
  { value: "4:3", label: "Classic Landscape" },
  { value: "3:4", label: "Classic Portrait" },
  { value: "16:9", label: "Widescreen" },
  { value: "9:16", label: "Vertical Widescreen" },
  { value: "3:2", label: "Photo Landscape" },
  { value: "2:3", label: "Photo Portrait" },
  { value: "4:5", label: "Instagram Portrait" },
  { value: "5:4", label: "Large Format Landscape" },
  { value: "9:21", label: "Tall Banner" },
  { value: "21:9", label: "Ultrawide" },
  { value: "2:1", label: "Panorama" },
  { value: "1:2", label: "Tall Portrait" },
  { value: "19.5:9", label: "Mobile Wide (19.5:9)" },
  { value: "9:19.5", label: "Mobile Vertical (19.5:9)" },
  { value: "20:9", label: "Mobile Wide (20:9)" },
  { value: "9:20", label: "Mobile Vertical (20:9)" },
];

const OUTPUT_FORMATS: {
  value: ImageOutputFormat;
  label: string;
}[] = [
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
  { value: "jpeg", label: "JPEG" },
];

const BATCH_SIZES = [1, 2, 4];

type ImageConfigState = Pick<
  ImageGenOptions,
  "aspectRatio" | "size" | "quality" | "outputFormat" | "seed" | "n"
>;

interface ImageConfigProps {
  modelConfig: ModelMeta;
  config: ImageConfigState;
  onChange: (updated: Partial<ImageConfigState>) => void;
}

const is = (val: unknown, target: unknown) => val === target;

export default function ImageConfig({
  modelConfig,
  config,
  onChange,
}: ImageConfigProps) {
  const filteredAspectRatios = ASPECT_RATIO_OPTIONS.filter((option) =>
    modelConfig.supportedAspectRatios?.includes(option.value),
  );

  const activeRatio = filteredAspectRatios.find(
    (r) => r.value === config.aspectRatio,
  );

  const activeQuality = modelConfig.quality?.find((q) => q === config.quality);
  const activeFormat = OUTPUT_FORMATS.find(
    (f) => f.value === config.outputFormat,
  );
  const activeSize = modelConfig.supportedSizes?.find(
    (sz) => sz === config.size,
  );
  const batchN = config.n ?? 1;

  const getSize = useCallback((size: string) => {
    const [width, height] = size.split("x").map(Number);
    return { width, height };
  }, []);

  const activeSizeDimention = getSize(activeSize ?? "");

  console.log("modelConfig.supportedSizes", modelConfig.supportedSizes);

  return (
    <>
      {modelConfig.supportedAspectRatios && (
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-1.5">
            <RatioIcon size={12} className="opacity-60" />
            Aspect Ratio
          </DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center gap-2">
              {activeRatio ? (
                <>
                  <RatioBox ratio={activeRatio.value} />
                  <span>{activeRatio.value}</span>
                  <span className="text-xs opacity-50">
                    · {activeRatio.label}
                  </span>
                </>
              ) : (
                <>
                  <RatioBox ratio="1:1" />
                  <span className="opacity-50">Select ratio</span>
                </>
              )}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="min-w-[210px]">
                {filteredAspectRatios.map(({ value, label }) => (
                  <DropdownMenuItem
                    key={value}
                    onSelect={() => onChange({ aspectRatio: value })}
                    className={`flex items-center gap-2.5 ${is(config.aspectRatio, value) ? "bg-accent" : ""}`}
                  >
                    {ratioIcon(value)}
                    <span
                      className={`font-mono text-xs ${is(config.aspectRatio, value) ? "font-semibold" : ""}`}
                    >
                      {value}
                    </span>
                    <span className="text-xs opacity-50 truncate">{label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      )}

      {modelConfig.supportsSize && (
        <>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-1.5">
              <RulerIcon size={12} className="opacity-60" />
              Dimensions
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-between gap-2">
                {activeSize ? (
                  <>
                    <DimIcon
                      w={activeSizeDimention.width}
                      h={activeSizeDimention.height}
                    />
                    <span className="font-mono text-xs">
                      {activeSizeDimention.width} × {activeSizeDimention.height}
                    </span>
                  </>
                ) : (
                  <>
                    <RulerIcon size={13} className="opacity-40" />
                    <span className="opacity-50">Custom size</span>
                  </>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-[150px]">
                  {modelConfig.supportedSizes?.map((size) => {
                    const { width, height } = getSize(size);
                    return (
                      <DropdownMenuItem
                        key={size}
                        // onSelect={() => {
                        //   onChange({ width: width, height: height });
                        // }}
                        className={`flex items-center gap-2.5 ${activeSize ? "bg-accent" : ""}`}
                      >
                        <DimIcon w={width} h={height} />
                        <span
                          className={`font-mono text-xs ${activeSize ? "font-semibold" : ""}`}
                        >
                          {width} × {height}
                        </span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </>
      )}

      {modelConfig.supportsQuality && (
        <>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-1.5">
              <SparklesIcon size={12} className="opacity-60" />
              Quality
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center justify-around gap-2">
                {activeQuality ? (
                  <>
                    <QualityBars tier={activeQuality} />
                    <span>{activeQuality}</span>
                  </>
                ) : (
                  <>
                    <QualityBars tier="standard" />
                    <span className="opacity-50">Select quality</span>
                  </>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="min-w-[150px]">
                  {modelConfig.quality?.map((value) => (
                    <DropdownMenuItem
                      key={value}
                      onSelect={() => onChange({ quality: value })}
                      className={`flex items-center gap-2.5 ${is(config.quality, value) ? "bg-accent" : ""}`}
                    >
                      <QualityBars tier={value} />
                      <span
                        className={`text-sm ${is(config.quality, value) ? "font-semibold" : ""}`}
                      >
                        {value}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </>
      )}

      <DropdownMenuGroup>
        <DropdownMenuLabel className="flex items-center gap-1.5">
          <FileImageIcon size={12} className="opacity-60" />
          Output Format
        </DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            {activeFormat ? (
              <>
                <FormatBadge format={activeFormat.value} />
                <span>{activeFormat.label}</span>
              </>
            ) : (
              <span className="opacity-50">Select format</span>
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="min-w-[150px]">
              {OUTPUT_FORMATS.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onSelect={() => onChange({ outputFormat: value })}
                  className={`flex items-center gap-2.5 ${is(config.outputFormat, value) ? "bg-accent" : ""}`}
                >
                  <FormatBadge format={value} />
                  <span
                    className={`text-sm ${is(config.outputFormat, value) ? "font-semibold" : ""}`}
                  >
                    {label}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuLabel className="flex items-center gap-1.5">
          <LayersIcon size={12} className="opacity-60" />
          Batch Size
        </DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <BatchGrid n={Math.min(batchN, 4)} />
            <span>
              {batchN} image{batchN !== 1 ? "s" : ""}
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {BATCH_SIZES.map((n) => (
                <DropdownMenuItem
                  key={n}
                  onSelect={() => onChange({ n })}
                  className={`flex items-center gap-2.5 ${is(batchN, n) ? "bg-accent" : ""}`}
                >
                  <BatchGrid n={n} />
                  <span
                    className={`text-sm ${is(batchN, n) ? "font-semibold" : ""}`}
                  >
                    {n} image{n !== 1 ? "s" : ""}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
    </>
  );
}
