import * as React from "react";
const { useState } = React;
import { AnimatePresence } from "motion/react";

import { BrainDump } from "@/app/components/BrainDump";
import { VibeCheck } from "@/app/components/VibeCheck";
import { BrainStateResult } from "@/app/components/BrainStateResult";
import { DopamineMenu } from "@/app/components/DopamineMenu";
import { OneTaskFocus } from "@/app/components/OneTaskFocus";
import { JournalEntry } from "@/app/components/JournalEntry";

import type { AiResponse, MatchedTask } from "@/app/lib/ai";
import { analyzeEverything } from "@/app/lib/ai";

type Screen =
  | "brainDump"
  | "vibeCheck"
  | "brainStateResult"
  | "dopamineMenu"
  | "oneTaskFocus"
  | "journalEntry";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("brainDump");

  const [tasksText, setTasksText] = useState("");
  const [vibeText, setVibeText] = useState("");

  const [ai, setAi] = useState<AiResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [selectedTask, setSelectedTask] = useState<MatchedTask | null>(null);

  const handleBrainDumpNext = (userTasks: string) => {
    setTasksText(userTasks);
    setCurrentScreen("vibeCheck");
  };

  const handleVibeSubmit = async (userVibe: string) => {
    setVibeText(userVibe);
    setIsAnalyzing(true);

    try {
      const result = await analyzeEverything(tasksText, userVibe);
      setAi(result);
      setCurrentScreen("brainStateResult");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBrainStateNext = () => {
    setCurrentScreen("dopamineMenu");
  };

  const handleTaskSelect = (task: MatchedTask) => {
    setSelectedTask(task);
    setCurrentScreen("oneTaskFocus");
  };

  const handleTaskComplete = () => {
    setCurrentScreen("journalEntry");
  };

  const handleSaveOrShare = () => {
    // Reset to beginning (MVP)
    setCurrentScreen("brainDump");
    setTasksText("");
    setVibeText("");
    setAi(null);
    setSelectedTask(null);
    setIsAnalyzing(false);
  };

  return (
    <div
      className="min-h-screen w-full overflow-hidden"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      <AnimatePresence mode="wait">
        {currentScreen === "brainDump" && (
          <BrainDump
            key="brainDump"
            onNext={handleBrainDumpNext}
            defaultValue={tasksText}
          />
        )}

        {currentScreen === "vibeCheck" && (
          <VibeCheck
            key="vibeCheck"
            onSubmit={handleVibeSubmit}
            defaultValue={vibeText}
            isAnalyzing={isAnalyzing}
            onBack={() => setCurrentScreen("brainDump")}
          />
        )}

        {currentScreen === "brainStateResult" && ai && (
          <BrainStateResult
            key="brainStateResult"
            brainState={ai.brain_state}
            reasoning={ai.ai_reasoning}
            onNext={handleBrainStateNext}
          />
        )}

        {currentScreen === "dopamineMenu" && ai && (
          <DopamineMenu
            key="dopamineMenu"
            matchedTasks={ai.matched_tasks}
            energyLevel={ai.brain_state.energy_level}
            onSelectTask={handleTaskSelect}
          />
        )}

        {currentScreen === "oneTaskFocus" && selectedTask && (
          <OneTaskFocus
            key="oneTaskFocus"
            task={selectedTask}
            onComplete={handleTaskComplete}
          />
        )}

        {currentScreen === "journalEntry" && selectedTask && (
          <JournalEntry
            key="journalEntry"
            task={selectedTask}
            onSave={handleSaveOrShare}
            onShare={handleSaveOrShare}
            onBack={handleSaveOrShare}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
