import * as React from "react";
const { useEffect, useState } = React;
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface VibeCheckProps {
  onSubmit: (vibe: string) => void;
  defaultValue?: string;
  isAnalyzing?: boolean;
  onBack?: () => void;
}

export function VibeCheck({
  onSubmit,
  defaultValue = "",
  isAnalyzing = false,
  onBack,
}: VibeCheckProps) {
  const [vibe, setVibe] = useState(defaultValue);

  useEffect(() => {
    setVibe(defaultValue);
  }, [defaultValue]);

  const handleSubmit = () => {
    if (!vibe.trim() || isAnalyzing) return;
    onSubmit(vibe);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex flex-col px-5 py-6 sm:px-8 sm:py-10 overflow-y-auto"
      style={{ backgroundColor: "#FBF7F2" }}
    >
      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <div className="text-center mb-7 sm:mb-10">
          <p className="text-xs tracking-[0.25em] text-[#B0A8A3] mb-5">
            flux app
          </p>
          <h1 className="text-[28px] sm:text-[34px] font-bold tracking-wide text-[#1A1D2E] mb-2">
            how are you feeling right now?
          </h1>
          <p className="text-[13px] text-[#9A9390]">
            no right answer. just vibes.
          </p>
        </div>

        <div className="flex-1 mb-6">
          <textarea
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            placeholder="tired? kinda motivated? super high energy? focused? scattered? tell me what’s going on in there..."
            className="w-full h-40 sm:h-52 p-5 sm:p-6 rounded-[28px] border border-white/80 bg-white/90 text-[15px] sm:text-base text-[#1A1D2E] placeholder:text-[#B0A8A3] resize-none focus:border-[#D7E3FF] focus:ring-4 focus:ring-[#D7E3FF]/30 focus:outline-none transition-all shadow-[0_12px_30px_-18px_rgba(70,90,160,0.45)]"
          />
        </div>

        <div className="mb-6 rounded-[28px] overflow-hidden h-44 sm:h-52 bg-gradient-to-br from-sky-100 via-indigo-100 to-violet-100 flex items-center justify-center shadow-[0_18px_40px_-26px_rgba(120,130,240,0.6)]">
          <ImageWithFallback
            src="/illustrations/vibe-check-illustration.png"
            alt="vibe check illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex-1 py-4 rounded-full bg-white/80 text-[#1A1D2E] font-semibold text-base tracking-wide transition-all hover:bg-white active:scale-[0.98] shadow-[0_12px_25px_-18px_rgba(120,120,120,0.5)]"
            >
              back
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!vibe.trim() || isAnalyzing}
            className="flex-[2] py-4 rounded-full bg-gradient-to-r from-[#9DB4FF] via-[#8E9FFF] to-[#7F90FF] text-white font-semibold text-base tracking-wide transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_18px_35px_-20px_rgba(120,140,255,0.8)]"
          >
            {isAnalyzing ? "analyzing..." : "check my vibe"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
