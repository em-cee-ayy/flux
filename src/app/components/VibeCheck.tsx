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
      className="min-h-screen flex flex-col px-6 py-8 md:px-8"
      style={{ backgroundColor: "#FAF8F5" }}
    >
      <div className="text-center mb-8">
        <p className="text-xs tracking-widest text-[#A0A0B0] mb-6">flux app</p>
        <h1 className="text-[32px] font-bold tracking-wide text-[#1A1D2E] mb-2">
          how are you feeling right now?
        </h1>
        <p className="text-[13px] text-[#A0A0B0]">
          no right answer. just vibes.
        </p>
      </div>

      <div className="flex-1 mb-6">
        <textarea
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
          placeholder="tired? kinda motivated? super high energy? focused? scattered? tell me what’s going on in there..."
          className="w-full h-40 p-6 rounded-3xl border-2 border-transparent bg-white/80 text-base text-[#1A1D2E] placeholder:text-[#A0A0B0] resize-none focus:border-[#C7C0FF] focus:outline-none transition-all shadow-sm"
        />
      </div>

      <div className="mb-6 rounded-3xl overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
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
            className="flex-1 py-4 rounded-full bg-white/70 text-[#1A1D2E] font-medium text-base tracking-wide transition-all hover:bg-white/90 active:scale-[0.98] shadow-sm"
          >
            back
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={!vibe.trim() || isAnalyzing}
          className="flex-[2] py-4 rounded-full bg-[#8E9FFF] text-white font-medium text-base tracking-wide transition-all hover:bg-[#7F90FF] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
          {isAnalyzing ? "analyzing..." : "check my vibe"}
        </button>
      </div>
    </motion.div>
  );
}
