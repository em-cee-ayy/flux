import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Share2, Save, X, Copy, Instagram, Facebook, Twitter } from "lucide-react";
import * as React from "react";
const { useMemo, useState } = React;
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
  const [showShare, setShowShare] = useState(false);
  const [didSave, setDidSave] = useState(false);

  const encouragingMessages = [
    "you did it!",
    "look at you go!",
    "that’s what i’m talking about!",
    "you’re crushing it!",
    "brilliant work today!",
  ];

  const randomMessage = useMemo(
    () => encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)],
    [],
  );

  const handleSave = () => {
    try {
      const entry = {
        task: task.name,
        why_now: task.why_now ?? "",
        brain_benefit: task.brain_benefit ?? "",
        saved_at: new Date().toISOString(),
      };
      localStorage.setItem("flux:last_journal_entry", JSON.stringify(entry));
      setDidSave(true);
      setTimeout(() => setDidSave(false), 2000);
    } catch {
      setDidSave(true);
      setTimeout(() => setDidSave(false), 2000);
    }
    onSave();
  };

  const handleShare = () => {
    setShowShare(true);
  };

  const handleShareAction = (channel: string) => {
    try {
      const payload = {
        channel,
        task: task.name,
        saved_at: new Date().toISOString(),
      };
      localStorage.setItem("flux:last_share_intent", JSON.stringify(payload));
    } catch {
      // no-op for now
    }
    setShowShare(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-h-screen flex flex-col px-5 py-8 sm:px-8 sm:py-12 overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #FFDDB8 0%, #FFC97E 100%)",
      }}
    >
      <div className="w-full max-w-[560px] mx-auto flex-1 flex flex-col">
        <button
          onClick={onBack}
          className="self-end mb-4 p-2 rounded-full bg-white/40 hover:bg-white/60 transition-all active:scale-90 flex items-center justify-center"
          aria-label="back home"
        >
          <X size={22} className="text-white" />
        </button>
        {/* Encouraging message */}
        <div className="mb-6 rounded-[28px] overflow-hidden h-48 sm:h-52 bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 flex items-center justify-center shadow-[0_18px_40px_-26px_rgba(235,150,70,0.65)]">
          <ImageWithFallback
            src="/illustrations/celebration-illustration.png"
            alt="celebration illustration"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-[30px] sm:text-[34px] font-bold tracking-wide text-white text-center mb-6">
          {randomMessage}
        </h1>

        {/* Entry card */}
        <div className="bg-white/65 backdrop-blur-md rounded-[28px] p-6 mb-5 shadow-[0_16px_35px_-24px_rgba(140,90,40,0.5)]">
          <p className="text-xs tracking-[0.35em] text-[#1A1D2E]/50 mb-2 uppercase">
            completed
          </p>
          <p className="text-[15px] sm:text-base text-[#1A1D2E] font-medium">
            {task.name}
          </p>

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
            onClick={handleSave}
            className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FFA878] via-[#F28F67] to-[#EA7E55] text-white font-semibold text-base tracking-wide transition-all hover:brightness-105 active:scale-[0.98] shadow-[0_18px_35px_-20px_rgba(210,110,60,0.8)] flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {didSave ? "saved!" : "save"}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-4 rounded-full bg-gradient-to-r from-[#FFA878] via-[#F28F67] to-[#EA7E55] text-white font-semibold text-base tracking-wide transition-all hover:brightness-105 active:scale-[0.98] shadow-[0_18px_35px_-20px_rgba(210,110,60,0.8)] flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            share
          </button>
        </div>
      </div>

      {showShare && (
        <div className="absolute inset-0 z-20 flex items-end sm:items-center justify-center bg-[#1A1D2E]/40 backdrop-blur-sm px-4 py-6">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(30,30,40,0.6)]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[#1A1D2E]">
                share your win
              </p>
              <button
                onClick={() => setShowShare(false)}
                className="p-2 rounded-full bg-[#F3F1EE] hover:bg-[#EDE8E3] transition"
                aria-label="close share"
              >
                <X size={16} className="text-[#1A1D2E]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleShareAction("instagram")}
                className="flex items-center gap-2 rounded-2xl border border-[#F2EAE4] bg-[#FFF8F3] px-4 py-3 text-sm font-medium text-[#1A1D2E] hover:bg-[#FFF1E8] transition"
              >
                <Instagram size={18} />
                instagram
              </button>
              <button
                onClick={() => handleShareAction("facebook")}
                className="flex items-center gap-2 rounded-2xl border border-[#F2EAE4] bg-[#FFF8F3] px-4 py-3 text-sm font-medium text-[#1A1D2E] hover:bg-[#FFF1E8] transition"
              >
                <Facebook size={18} />
                facebook
              </button>
              <button
                onClick={() => handleShareAction("x")}
                className="flex items-center gap-2 rounded-2xl border border-[#F2EAE4] bg-[#FFF8F3] px-4 py-3 text-sm font-medium text-[#1A1D2E] hover:bg-[#FFF1E8] transition"
              >
                <Twitter size={18} />
                X
              </button>
              <button
                onClick={() => handleShareAction("copy")}
                className="flex items-center gap-2 rounded-2xl border border-[#F2EAE4] bg-[#FFF8F3] px-4 py-3 text-sm font-medium text-[#1A1D2E] hover:bg-[#FFF1E8] transition"
              >
                <Copy size={18} />
                copy to text
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
