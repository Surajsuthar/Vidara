"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MODEL_REGISTRY } from "@/../ai/factory";
import type { ImageModel } from "@/../ai/types";
import { Modeltab } from "./model-tab";

const DEFAULT_MODEL: ImageModel = "xai/grok-2-image";

export default function ChatInterface() {
  const [value, setValue] = useState("");
  const [selectedModel, setSelectedModel] = useState<ImageModel>(DEFAULT_MODEL);
  const [showModels, setShowModels] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const textareaRef = useRef(null);
  const modelRef = useRef(null);
  const attachRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [value]);

  useEffect(() => {
    function handle(e) {
      if (modelRef.current && !modelRef.current.contains(e.target))
        setShowModels(false);
      if (attachRef.current && !attachRef.current.contains(e.target))
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
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl space-y-5  bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
        <div className="bg-[#1a1a1a] rounded-none px-4 pt-4 pb-3 ring-1 ring-white/5 shadow-2xl transition-all duration-200 focus-within:ring-white/10">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            // onKeyDown={handleKeyDown}
            placeholder="Enter Prompt"
            rows={1}
            className="w-full bg-transparent resize-none outline-none text-[#c8c5be] placeholder-[#3d3d3d] text-[15px] leading-relaxed font-light min-h-[65px] max-h-[180px] overflow-y-auto"
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
                  <div className="absolute bottom-8 right-0 bg-[#1e1e1e] border border-white/10 rounded-xl p-2 shadow-2xl min-w-[260px] max-w-[320px] max-h-[400px] overflow-hidden flex flex-col z-50">
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
            </div>
            {/* Left — Attach */}
            <div className="relative" ref={attachRef}>
              <button
                type="button"
                onClick={() => setShowAttach((p) => !p)}
                className="w-8 h-8 rounded-full bg-[#2a2a2a] hover:bg-[#333] flex items-center justify-center text-[#888] hover:text-[#bbb] transition-colors"
              >
                <Plus size={16} />
              </button>

              {showAttach && (
                <div className="absolute bottom-10 left-0 bg-[#222] border border-white/10 rounded-xl p-1 shadow-xl min-w-[130px] z-50">
                  {["Image", "File", "Link"].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setShowAttach(false)}
                      className="w-full text-left px-3 py-2 text-sm text-[#aaa] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
