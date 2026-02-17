import * as React from "react";
const { useEffect, useState } = React;
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import type { MatchedTask } from "@/app/lib/ai";

interface OneTaskFocusProps {
  task: MatchedTask;
  onComplete: () => void;
}

export function OneTaskFocus({ task, onComplete }: OneTaskFocusProps) {
  const [progress, setProgress] = useState(0);

  // Gentle “momentum” progress (purely cosmetic for MVP)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #A5B4FF 0%, #8E9FFF 100%)",
      }}
    >
      <div className="px-6 pt-10 pb-4">
        <p className="text-white/80 text-sm mb-2">progress</p>
        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-8">
        <h1 className="text-[32px] font-bold tracking-wide text-white text-center mb-6 px-2">
          {task.name}
        </h1>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl">
          <p className="text-[13px] text-[#A0A0B0] mb-4 text-center">
            broken down into bite-sized steps
          </p>

          <div className="space-y-3">
            {task.steps?.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base font-semibold text-[#8E9FFF] mt-0.5">
                  {i + 1}.
                </span>
                <p className="text-base text-[#1A1D2E] leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {task.brain_benefit && (
            <div className="mt-5 pt-4 border-t border-[#1A1D2E]/10">
              <p className="text-xs text-[#A0A0B0] uppercase mb-1">
                brain benefit
              </p>
              <p className="text-sm text-[#1A1D2E]/80">{task.brain_benefit}</p>
            </div>
          )}
        </div>

        <div className="mb-6 rounded-3xl overflow-hidden h-40 bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
          <ImageWithFallback
            src="/illustrations/meditation-illustration.png"
            alt="meditation illustration"
            className="w-full h-full object-contain"
          />
        </div>

        <button
          onClick={onComplete}
          className="w-full max-w-md self-center py-4 rounded-full bg-white text-[#8E9FFF] font-medium text-base tracking-wide transition-all hover:bg-white/90 active:scale-[0.98] shadow-lg"
        >
          done
        </button>
      </div>
    </motion.div>
  );
}
