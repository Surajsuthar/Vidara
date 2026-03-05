"use client";

import { ChevronDown, CircleChevronUp, Image } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getModelMeta, MODEL_REGISTRY } from "@/ai/factory";
import type { ImageModel } from "@/ai/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ImageConfig from "./model-config";
import { Modeltab } from "./model-tab";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const DEFAULT_MODEL: ImageModel = "xai/grok-2-image";

export default function ChatInterface() {
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<ImageModel>(DEFAULT_MODEL);
  const [showModels, setShowModels] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showImageConfig, setShowImageConfig] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const attachRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelMetaData = getModelMeta(selectedModel);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, []);

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

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     if (value.trim()) setValue("");
  //   }
  // };

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
          <div className="flex items-center justify-between mt-3">
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
                    config={{
                      aspectRatio: "1:1",
                      size: "1024x1024",
                      quality: "standard",
                      outputFormat: "png",
                      seed: 1234567890,
                      n: 1,
                    }}
                    onChange={(updated) => {
                      console.log(updated);
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
                    const file = e.target?.files?.[0];
                    // handle your file here
                    console.log("file", file);
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
          </div>
        </div>
      </div>
    </div>
  );
}
