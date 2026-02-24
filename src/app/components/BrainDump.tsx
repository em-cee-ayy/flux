import * as React from "react";
const { useEffect, useState } = React;
import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface BrainDumpProps {
  onNext: (tasks: string) => void;
  defaultValue?: string;
}

export function BrainDump({ onNext, defaultValue = "" }: BrainDumpProps) {
  const [tasks, setTasks] = useState(defaultValue);

  useEffect(() => {
    setTasks(defaultValue);
  }, [defaultValue]);

  const handleNext = () => {
    if (tasks.trim()) onNext(tasks);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
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
            brain dump your tasks
          </h1>
          <p className="text-[13px] text-[#9A9390]">
            everything on your mind. no order needed.
          </p>
        </div>

        <div className="flex-1 mb-6">
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder={`• reply to mom's text\n• finish that report\n• walk the dog\n• grocery shopping\n• water plants\n• whatever's floating around up there`}
            className="w-full h-44 sm:h-56 p-5 sm:p-6 rounded-[28px] border border-white/80 bg-white/90 text-[15px] sm:text-base text-[#1A1D2E] placeholder:text-[#B0A8A3] resize-none focus:border-[#E8D8FF] focus:ring-4 focus:ring-[#E8D8FF]/30 focus:outline-none transition-all shadow-[0_12px_30px_-18px_rgba(70,40,120,0.45)]"
          />
        </div>

        <div className="mb-6 rounded-[28px] overflow-hidden h-44 sm:h-52 bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100 flex items-center justify-center shadow-[0_18px_40px_-26px_rgba(235,120,90,0.6)]">
          <ImageWithFallback
            src="/illustrations/brain-dump-illustration.png"
            alt="brain dump illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={handleNext}
          disabled={!tasks.trim()}
          className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFB38A] via-[#F8A07D] to-[#F38D74] text-white font-semibold text-base tracking-wide transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_18px_35px_-20px_rgba(240,135,110,0.8)]"
        >
          next: vibe check
        </button>
      </div>
    </motion.div>
  );
}
