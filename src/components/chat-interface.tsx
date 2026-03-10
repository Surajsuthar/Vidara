"use client";

import { ChevronDown, CircleChevronUp, Image } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { ImageGenOptions, ImageGenResult, ImageModel } from "@/ai/types";
import { getModelMeta, MODEL_REGISTRY } from "@/ai/factory";
import { useMutationData } from "@/hooks/use-mutate-data";
import { useQueryData } from "@/hooks/use-query-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageConfig, {
  getDefaultImageConfig,
  normalizeImageConfigForModel,
  type ImageConfigState,
} from "./model-config";
import { Modeltab } from "./model-tab";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const DEFAULT_MODEL: ImageModel = "xai/grok-2-image";

type GenerateApiSuccess = {
  success: true;
  data: string;
  remaining?: number;
  requestId?: string;
  status?: "queued";
  result?: ImageGenResult;
};

type GenerateApiStatusSuccess = {
  success: true;
  data: string;
  job: {
    id: string;
    status: "queued" | "processing" | "completed" | "failed";
    prompt: string;
    model: string;
    createdAt: string;
    updatedAt: string;
    result?: ImageGenResult;
    error?: {
      code: string;
      message: string;
      retryable?: boolean;
      timestamp?: string;
    };
  };
};

type GenerateApiError = {
  error: {
    code: string;
    message: string;
    retryable: boolean;
    timestamp: string;
  };
};

type GenerateApiResponse = GenerateApiSuccess | GenerateApiError;
type GenerateStatusApiResponse = GenerateApiStatusSuccess | GenerateApiError;

function getFriendlyErrorMessage(code?: string, fallback?: string) {
  switch (code) {
    case "RATE_LIMITED":
      return "You're generating too fast. Please wait a moment and try again.";
    case "AI_MODEL_UNAVAILABLE":
      return "This AI model is currently unavailable. Please try another model.";
    case "AI_INVALID_PROMPT":
      return "Your prompt is invalid. Please revise it and try again.";
    case "AI_CONTENT_FILTERED":
      return "Your prompt was blocked by safety filters. Please change it and try again.";
    case "AI_QUOTA_EXCEEDED":
      return "The AI provider quota has been exceeded. Please try again later.";
    case "IMAGE_GENERATION_FAILED":
      return "Image generation failed. Please try again.";
    case "VALIDATION":
      return "Your request is invalid. Please review the prompt and settings.";
    case "NOT_FOUND":
      return "The requested generation job could not be found.";
    default:
      return fallback ?? "Something went wrong. Please try again.";
  }
}

export default function ChatInterface() {
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<ImageModel>(DEFAULT_MODEL);
  const [showModels, setShowModels] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showImageConfig, setShowImageConfig] = useState(false);
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [imageConfig, setImageConfig] = useState<ImageConfigState>(() =>
    getDefaultImageConfig(getModelMeta(DEFAULT_MODEL)),
  );
  const [generationResult, setGenerationResult] =
    useState<ImageGenResult | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [hasShownReadyToast, setHasShownReadyToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelMetaData = useMemo(
    () => getModelMeta(selectedModel),
    [selectedModel],
  );

  useEffect(() => {
    setImageConfig((current) =>
      normalizeImageConfigForModel(modelMetaData, current),
    );
  }, [modelMetaData]);

  const generationQuery = useMemo<ImageGenOptions>(
    () => ({
      model: selectedModel,
      prompt: value.trim(),
      images: attachedImage ? [attachedImage.name] : undefined,
      ...normalizeImageConfigForModel(modelMetaData, imageConfig),
    }),
    [attachedImage, imageConfig, modelMetaData, selectedModel, value],
  );

  const {
    data: generationStatus,
    isFetching: isPollingGenerationStatus,
    isError: isGenerationStatusError,
  } = useQueryData<GenerateApiStatusSuccess>(
    ["generate-image-status", activeRequestId],
    async (): Promise<GenerateApiStatusSuccess> => {
      const response = await fetch(
        `/api/generate?requestId=${encodeURIComponent(activeRequestId ?? "")}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const json = (await response.json()) as GenerateStatusApiResponse;

      if (!response.ok) {
        throw new Error(
          "error" in json
            ? getFriendlyErrorMessage(
                json.error.code,
                json.error.message || "Failed to fetch generation status.",
              )
            : "Failed to fetch generation status.",
        );
      }

      return json as GenerateApiStatusSuccess;
    },
    {
      enabled: Boolean(activeRequestId),
      refetchInterval: activeRequestId ? 2000 : false,
      refetchIntervalInBackground: true,
    },
  );

  const { mutate: generateImage, isPending: isGenerating } = useMutationData<
    {
      status: number;
      data: string;
      requestId?: string;
      result?: ImageGenResult;
      error?: { message?: string };
    },
    ImageGenOptions
  >(
    ["generate-image"],
    async (payload) => {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = (await response.json()) as GenerateApiResponse;

      if (!response.ok) {
        throw new Error(
          "error" in json
            ? getFriendlyErrorMessage(
                json.error.code,
                json.error.message || "Image generation request failed.",
              )
            : "Image generation request failed.",
        );
      }

      return {
        status: response.status,
        data:
          "success" in json
            ? json.data
            : "Image generation queued successfully.",
        result:
          "success" in json && "result" in json ? json.result : undefined,
        requestId:
          "success" in json && "requestId" in json ? json.requestId : undefined,
      };
    },
    undefined,
    (data) => {
      setGenerationResult(null);
      setHasShownReadyToast(false);
      if (data.requestId) {
        setActiveRequestId(data.requestId);
      }
      if (data.result) {
        setGenerationResult(data.result);
      }
    },
    () => {
      setActiveRequestId(null);
    },
  );

  useEffect(() => {
    if (isGenerationStatusError) {
      toast.error("Generation status failed", {
        description: getFriendlyErrorMessage(
          undefined,
          "Unable to fetch the latest generation status.",
        ),
      });
      setHasShownReadyToast(true);
      setActiveRequestId(null);
      return;
    }

    if (!generationStatus) return;

    const job = generationStatus.job;

    if (job.status === "completed" && job.result) {
      setGenerationResult(job.result);

      if (!hasShownReadyToast) {
        toast.success("Image is ready", {
          description: "Your generated image is now available.",
        });
        setHasShownReadyToast(true);
      }

      setActiveRequestId(null);
    }

    if (job.status === "failed" && job.error) {
      if (!hasShownReadyToast) {
        toast.error("Generation failed", {
          description: getFriendlyErrorMessage(
            job.error.code,
            job.error.message,
          ),
        });
        setHasShownReadyToast(true);
      }

      setActiveRequestId(null);
    }
  }, [generationStatus, hasShownReadyToast, isGenerationStatusError]);

  const handleGenerate = () => {
    if (!generationQuery.prompt.trim()) return;
    generateImage(generationQuery);
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [value]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (modelRef.current && !modelRef.current.contains(e.target as Node))
        setShowModels(false);
      if (attachRef.current && !attachRef.current.contains(e.target as Node))
        setShowAttach(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end px-4">
      <div className="w-full max-w-3xl rounded-2xl space-y-5  bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="bg-[#1a1a1a] rounded-2xl px-4 pt-4 pb-3 ring-1 ring-white/5 shadow-2xl transition-all duration-200 focus-within:ring-white/10">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            // onKeyDown={handleKeyDown}
            placeholder="Enter Prompt"
            rows={1}
            className="w-full bg-transparent resize-none outline-none text-[#c8c5be] placeholder-[#3d3d3d] text-[15px] leading-relaxed font-light min-h-16.25 max-h-45 overflow-y-auto"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="relative" ref={modelRef}>
                <button
                  type="button"
                  onClick={() => setShowModels((p) => !p)}
                  className="flex items-center gap-1.5 text-[#888] hover:text-[#bbb] transition-colors text-sm font-normal"
                >
                  {/* <span className="text-[#888] font-bold text-xs">𝕏</span> */}
                  <span>
                    {MODEL_REGISTRY[selectedModel]?.displayName ??
                      selectedModel}
                  </span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${showModels ? "rotate-180" : ""}`}
                  />
                </button>

                {showModels && (
                  <div className="absolute bottom-8 right-0 bg-[#1e1e1e] border border-white/10 rounded-xl p-2 shadow-2xl min-w-65 max-w-[320px] max-h-100 overflow-hidden flex flex-col z-50">
                    <Modeltab
                      selectedModel={selectedModel}
                      onSelectModel={(model) => {
                        setSelectedModel(model);
                        setShowModels(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <DropdownMenu
                open={showImageConfig}
                onOpenChange={setShowImageConfig}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-8 h-8 flex ease-in-out items-center justify-center transition-colors"
                  >
                    <CircleChevronUp
                      size={24}
                      className={`text-[#888] hover:text-[#bbb] transition-transform ${showImageConfig ? "rotate-180" : ""}`}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-32.5 bg-[#222] border-white/10"
                  align="start"
                  side="top"
                  sideOffset={8}
                >
                  <ImageConfig
                    modelConfig={modelMetaData}
                    config={imageConfig}
                    onChange={(updated) => {
                      setImageConfig((current) => ({
                        ...current,
                        ...updated,
                      }));
                    }}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="relative" ref={attachRef}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target?.files?.[0] ?? null;
                    setAttachedImage(file);
                  }}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#333] flex items-center justify-center text-[#888] hover:text-[#bbb] transition-colors"
                    >
                      <Image size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach an image</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right text-xs text-[#666]">
                <div>{generationQuery.model}</div>
                {activeRequestId && (
                  <div className="text-[10px] text-[#888]">
                    {isPollingGenerationStatus ? "Checking status..." : "Queued"}
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  isPollingGenerationStatus ||
                  !generationQuery.prompt.trim()
                }
                className="bg-white text-black hover:bg-white/90"
              >
                {isGenerating
                  ? "Queueing..."
                  : isPollingGenerationStatus
                    ? "Processing..."
                    : "Generate"}
              </Button>
            </div>
          </div>

          <input
            type="hidden"
            name="generation-query"
            value={JSON.stringify(generationQuery)}
            readOnly
          />

          {attachedImage && (
            <div className="mt-3 text-xs text-[#888]">
              Attached image: {attachedImage.name}
            </div>
          )}

          {generationResult && (
            <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs text-[#9a9a9a]">
                <span>{generationResult.model}</span>
                <span>{generationResult.durationMs} ms</span>
              </div>

              {generationResult.warnings.length > 0 && (
                <div className="text-xs text-yellow-400">
                  {generationResult.warnings.join(", ")}
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {generationResult.images.map((image, index) => (
                  <div
                    key={`${generationResult.model}-${index}`}
                    className="overflow-hidden rounded-lg border border-white/10 bg-black/30"
                  >
                    <img
                      src={`data:${image.mimeType};base64,${image.base64}`}
                      alt={`Generated result ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
