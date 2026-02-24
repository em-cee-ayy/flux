import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import type { MatchedTask, EnergyLevel } from "@/app/lib/ai";

interface DopamineMenuProps {
  matchedTasks: {
    starters: MatchedTask[];
    mains: MatchedTask[];
  };
  energyLevel: EnergyLevel;
  onSelectTask: (task: MatchedTask) => void;
}

export function DopamineMenu({
  matchedTasks,
  energyLevel,
  onSelectTask,
}: DopamineMenuProps) {
  const showMains =
    energyLevel !== "low" && (matchedTasks.mains?.length ?? 0) > 0;

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
        <div className="mb-6 rounded-[28px] overflow-hidden h-40 sm:h-48 bg-gradient-to-br from-emerald-100 via-teal-100 to-lime-100 flex items-center justify-center shadow-[0_18px_40px_-26px_rgba(90,180,140,0.7)]">
          <ImageWithFallback
            src="/illustrations/mountain_climber.png"
            alt="mountain climber"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-wide text-[#1A1D2E] mb-1">
            today’s dopamine menu
          </h1>
          <p className="text-[13px] text-[#9A9390]">
            filtered from your brain dump
          </p>
        </div>

        {(matchedTasks.starters?.length ?? 0) > 0 && (
          <div className="mb-4 rounded-[28px] p-5 bg-[#D0EBE0]/70 shadow-[0_16px_35px_-24px_rgba(80,150,120,0.5)]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A1D2E] mb-4 tracking-wide">
              starters
            </h2>
            <div className="space-y-3">
              {matchedTasks.starters.map((task, i) => (
                <button
                  key={`${task.name}-${i}`}
                  onClick={() => onSelectTask(task)}
                  className="w-full flex flex-col p-4 rounded-[22px] bg-white/80 hover:bg-white transition-all hover:shadow-md active:scale-[0.98] text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[15px] sm:text-base text-[#1A1D2E]">
                        {task.name}
                      </span>
                    </div>
                    <span className="text-[13px] text-[#A0A0B0]">
                      {task.minutes} min
                    </span>
                  </div>
                  {task.why_now && (
                    <p className="text-xs text-[#1A1D2E]/70 ml-5">
                      {task.why_now}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {showMains && (
          <div className="mb-6 rounded-[28px] p-5 bg-[#E8EBFF]/70 shadow-[0_16px_35px_-24px_rgba(110,120,220,0.5)]">
            <h2 className="text-lg sm:text-xl font-semibold text-[#1A1D2E] mb-4 tracking-wide">
              mains
            </h2>
            <div className="space-y-3">
              {matchedTasks.mains.map((task, i) => (
                <button
                  key={`${task.name}-${i}`}
                  onClick={() => onSelectTask(task)}
                  className="w-full flex flex-col p-4 rounded-[22px] bg-white/80 hover:bg-white transition-all hover:shadow-md active:scale-[0.98] text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8E9FFF]" />
                      <span className="text-[15px] sm:text-base text-[#1A1D2E]">
                        {task.name}
                      </span>
                    </div>
                    <span className="text-[13px] text-[#A0A0B0]">
                      {task.minutes} min
                    </span>
                  </div>
                  {task.why_now && (
                    <p className="text-xs text-[#1A1D2E]/70 ml-5">
                      {task.why_now}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {!showMains && energyLevel === "low" && (
          <div className="rounded-[28px] p-5 bg-white/70 shadow-[0_12px_30px_-22px_rgba(120,120,120,0.4)]">
            <p className="text-[13px] text-[#1A1D2E]/80 text-center">
              we’re keeping it gentle today. starters only.
            </p>
          </div>
        )}

        <p className="text-[13px] text-[#1A1D2E] text-center mt-6">
          choose one that feels doable right now
        </p>
      </div>
    </motion.div>
  );
}
