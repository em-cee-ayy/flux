import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Share2, Save, X } from "lucide-react";
import type { MatchedTask } from "@/app/lib/ai";

interface JournalEntryProps {
  task: MatchedTask;
  onSave: () => void;
  onShare: () => void;
  onBack: () => void;
}

export function JournalEntry({
  task,
  onSave,
  onShare,
  onBack,
}: JournalEntryProps) {
  const encouragingMessages = [
    "you did it!",
    "look at you go!",
    "that’s what i’m talking about!",
    "you’re crushing it!",
    "brilliant work today!",
  ];

  const randomMessage =
    encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-h-screen flex flex-col px-6 py-12"
      style={{
        background: "linear-gradient(180deg, #FFD4A3 0%, #FFC97E 100%)",
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/30 hover:bg-white/50 transition-all active:scale-90 flex items-center justify-center"
        aria-label="back home"
      >
        <X size={24} className="text-white" />
      </button>
      {/* Encouraging message */}
      <div className="mb-6 rounded-3xl overflow-hidden h-52 bg-gradient-to-br from-yellow-200 to-orange-200 flex items-center justify-center">
        <ImageWithFallback
          src="/illustrations/celebration-illustration.png"
          alt="celebration illustration"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="text-[34px] font-bold tracking-wide text-white text-center mb-6">
        {randomMessage}
      </h1>

      {/* Entry card */}
      <div className="bg-white/55 backdrop-blur-md rounded-3xl p-6 mb-5">
        <p className="text-xs tracking-widest text-[#1A1D2E]/50 mb-2 uppercase">
          completed
        </p>
        <p className="text-base text-[#1A1D2E] font-medium">{task.name}</p>

        {task.why_now && (
          <p className="text-sm text-[#1A1D2E]/70 mt-3 leading-relaxed">
            {task.why_now}
          </p>
        )}

        {task.brain_benefit && (
          <p className="text-sm text-[#1A1D2E]/70 mt-3 leading-relaxed">
            <span className="font-semibold">brain benefit:</span>{" "}
            {task.brain_benefit}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-auto">
        <button
          onClick={onSave}
          className="flex-1 py-4 rounded-full bg-[#F28F67] text-white font-medium text-base tracking-wide transition-all hover:bg-[#EA7E55] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          <Save size={18} />
          save
        </button>
        <button
          onClick={onShare}
          className="flex-1 py-4 rounded-full bg-[#F28F67] text-white font-medium text-base tracking-wide transition-all hover:bg-[#EA7E55] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          share
        </button>
      </div>
    </motion.div>
  );
}
