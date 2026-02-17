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
      className="min-h-screen flex flex-col px-6 py-8 md:px-8"
      style={{ backgroundColor: "#FAF8F5" }}
    >
      <div className="text-center mb-8">
        <p className="text-xs tracking-widest text-[#A0A0B0] mb-6">flux app</p>
        <h1 className="text-[32px] font-bold tracking-wide text-[#1A1D2E] mb-2">
          brain dump your tasks
        </h1>
        <p className="text-[13px] text-[#A0A0B0]">
          everything on your mind. no order needed.
        </p>
      </div>

      <div className="flex-1 mb-6">
        <textarea
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          placeholder={`• reply to mom's text\n• finish that report\n• walk the dog\n• grocery shopping\n• water plants\n• whatever's floating around up there`}
          className="w-full h-48 p-6 rounded-3xl border-2 border-transparent bg-white/80 text-base text-[#1A1D2E] placeholder:text-[#A0A0B0] resize-none focus:border-[#C7C0FF] focus:outline-none transition-all shadow-sm"
        />
      </div>

      <div className="mb-6 rounded-3xl overflow-hidden h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
        <ImageWithFallback
          src="/illustrations/brain-dump-illustration.png"
          alt="brain dump illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <button
        onClick={handleNext}
        disabled={!tasks.trim()}
        className="w-full py-4 rounded-full bg-[#F8A07D] text-white font-medium text-base tracking-wide transition-all hover:bg-[#F28F67] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
      >
        next: vibe check
      </button>
    </motion.div>
  );
}
