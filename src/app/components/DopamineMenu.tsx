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
      className="min-h-screen flex flex-col px-6 py-8"
      style={{ backgroundColor: "#FAF8F5" }}
    >
      <div className="mb-6 rounded-3xl overflow-hidden h-40 bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center">
        <ImageWithFallback
          src="/illustrations/mountain_climber.png"
          alt="mountain climber"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-[32px] font-bold tracking-wide text-[#1A1D2E] mb-1">
          today’s dopamine menu
        </h1>
        <p className="text-[13px] text-[#A0A0B0]">
          filtered from your brain dump
        </p>
      </div>

      {(matchedTasks.starters?.length ?? 0) > 0 && (
        <div className="mb-4 rounded-3xl p-5 bg-[#D0EBE0]/60">
          <h2 className="text-xl font-semibold text-[#1A1D2E] mb-4 tracking-wide">
            starters
          </h2>
          <div className="space-y-3">
            {matchedTasks.starters.map((task, i) => (
              <button
                key={`${task.name}-${i}`}
                onClick={() => onSelectTask(task)}
                className="w-full flex flex-col p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all hover:shadow-md active:scale-[0.98] text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-base text-[#1A1D2E]">
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
        <div className="mb-6 rounded-3xl p-5 bg-[#E8EBFF]/60">
          <h2 className="text-xl font-semibold text-[#1A1D2E] mb-4 tracking-wide">
            mains
          </h2>
          <div className="space-y-3">
            {matchedTasks.mains.map((task, i) => (
              <button
                key={`${task.name}-${i}`}
                onClick={() => onSelectTask(task)}
                className="w-full flex flex-col p-4 rounded-2xl bg-white/70 hover:bg-white/90 transition-all hover:shadow-md active:scale-[0.98] text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#8E9FFF]" />
                    <span className="text-base text-[#1A1D2E]">
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
        <div className="rounded-3xl p-5 bg-white/60">
          <p className="text-[13px] text-[#1A1D2E]/80 text-center">
            we’re keeping it gentle today. starters only. 💛
          </p>
        </div>
      )}

      <p className="text-[13px] text-[#1A1D2E] text-center mt-6">
        choose one that feels doable right now
      </p>
    </motion.div>
  );
}
