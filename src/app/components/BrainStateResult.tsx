import { motion } from "motion/react";
import { Sun, Cloud, CloudFog, ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
const { useMemo, useState } = React;
import type { AiReasoning, BrainState } from "@/app/lib/ai";

interface BrainStateResultProps {
  brainState: BrainState;
  reasoning?: AiReasoning;
  onNext: () => void;
}

export function BrainStateResult({
  brainState,
  reasoning,
  onNext,
}: BrainStateResultProps) {
  const [showReasoning, setShowReasoning] = useState(false);

  const config = useMemo(() => {
    const energy = brainState.energy_level;
    if (energy === "high") {
      return {
        icon: Sun,
        iconColor: "#FFC97E",
        gradient: "linear-gradient(135deg, #FFF5E6 0%, #FFE9C5 100%)",
      };
    }
    if (energy === "low") {
      return {
        icon: CloudFog,
        iconColor: "#A5B4FF",
        gradient: "linear-gradient(135deg, #E8EBFF 0%, #D4D9FF 100%)",
      };
    }
    return {
      icon: Cloud,
      iconColor: "#BEE7D2",
      gradient: "linear-gradient(135deg, #E6F5ED 0%, #D0EBE0 100%)",
    };
  }, [brainState.energy_level]);

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col px-5 py-8 sm:px-8 sm:py-12 overflow-y-auto"
      style={{ background: config.gradient }}
    >
      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 12 }}
            className="w-36 h-36 sm:w-40 sm:h-40 rounded-[40px] flex items-center justify-center shadow-[0_20px_45px_-25px_rgba(40,40,70,0.35)]"
            style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
          >
            <Icon size={88} color={config.iconColor} />
          </motion.div>
        </div>

        <h1 className="text-[30px] sm:text-[34px] font-bold tracking-wide text-[#1A1D2E] text-center mb-4">
          {brainState.state_label}
        </h1>

        <p className="text-[15px] sm:text-base text-[#1A1D2E]/80 text-center mb-6 leading-relaxed px-4">
          {brainState.description}
        </p>

        <div className="bg-white/65 backdrop-blur-sm rounded-[28px] p-5 mb-4 shadow-[0_12px_30px_-20px_rgba(60,60,90,0.35)]">
          <p className="text-[13px] text-[#1A1D2E] text-center leading-relaxed">
            i matched your energy to tasks that should feel doable right now.
          </p>
        </div>

        {reasoning && (
          <button
            onClick={() => setShowReasoning((s) => !s)}
            className="text-sm text-[#1A1D2E]/70 text-center mb-6 hover:text-[#1A1D2E] transition-colors flex items-center justify-center gap-2"
          >
            {showReasoning ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            {showReasoning
              ? "hide how i analyzed this"
              : "show how i analyzed this"}
          </button>
        )}

        {showReasoning && reasoning && (
          <div className="bg-white/70 backdrop-blur-sm rounded-[28px] p-6 mb-6 space-y-4 shadow-[0_16px_35px_-24px_rgba(60,60,90,0.35)]">
            <div>
              <p className="text-xs font-semibold text-[#A0A0B0] uppercase mb-1">
                what i noticed
              </p>
              <p className="text-sm text-[#1A1D2E]">
                {reasoning.what_i_noticed}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#A0A0B0] uppercase mb-1">
                my matching strategy
              </p>
              <p className="text-sm text-[#1A1D2E]">
                {reasoning.matching_strategy}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#A0A0B0] uppercase mb-1">
                encouragement
              </p>
              <p className="text-sm text-[#1A1D2E] italic">
                {reasoning.encouragement}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1" />

        <button
          onClick={onNext}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFB38A] via-[#F8A07D] to-[#F38D74] text-white font-semibold text-base tracking-wide transition-all hover:brightness-105 active:scale-[0.98] shadow-[0_18px_35px_-20px_rgba(240,135,110,0.8)]"
        >
          show me what i can handle
        </button>
      </div>
    </motion.div>
  );
}
