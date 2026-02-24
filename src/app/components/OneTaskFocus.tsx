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
      className="min-h-screen flex flex-col px-5 py-6 sm:px-8 sm:py-10 overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #B9C5FF 0%, #8E9FFF 100%)",
      }}
    >
      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <div className="pt-4 sm:pt-6 pb-4">
          <p className="text-white/80 text-sm mb-2">progress</p>
          <div className="h-2.5 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/85 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center py-6">
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-wide text-white text-center mb-6 px-2">
            {task.name}
          </h1>

          <div className="bg-white/95 backdrop-blur-sm rounded-[28px] p-6 mb-6 shadow-[0_18px_40px_-26px_rgba(35,45,90,0.55)]">
            <p className="text-[13px] text-[#9AA1B5] mb-4 text-center">
              broken down into bite-sized steps
            </p>

            <div className="space-y-3">
              {task.steps?.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[15px] font-semibold text-[#8E9FFF] mt-0.5">
                    {i + 1}.
                  </span>
                  <p className="text-[15px] sm:text-base text-[#1A1D2E] leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {task.brain_benefit && (
              <div className="mt-5 pt-4 border-t border-[#1A1D2E]/10">
                <p className="text-xs text-[#9AA1B5] uppercase mb-1">
                  brain benefit
                </p>
                <p className="text-sm text-[#1A1D2E]/80">
                  {task.brain_benefit}
                </p>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-[28px] overflow-hidden h-40 sm:h-44 bg-gradient-to-br from-indigo-200 via-purple-200 to-sky-200 flex items-center justify-center shadow-[0_18px_40px_-26px_rgba(80,110,220,0.6)]">
            <ImageWithFallback
              src="/illustrations/meditation-illustration.png"
              alt="meditation illustration"
              className="w-full h-full object-contain"
            />
          </div>

          <button
            onClick={onComplete}
            className="w-full max-w-md self-center py-4 rounded-full bg-white text-[#7C8EFF] font-semibold text-base tracking-wide transition-all hover:bg-white/95 active:scale-[0.98] shadow-[0_18px_35px_-20px_rgba(35,45,90,0.5)]"
          >
            done
          </button>
        </div>
      </div>
    </motion.div>
  );
}
