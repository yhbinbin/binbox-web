"use client";

import { useState } from "react";
import PianoKeyboard from "@/components/lab/music-theory-keyboard/PianoKeyboard";
import CircleOfFifths, {
  PlayMode,
} from "@/components/lab/music-theory-keyboard/CircleOfFifths";
import KeyboardControls from "@/components/lab/music-theory-keyboard/KeyboardControls";

export default function MusicTheoryKeyboard() {
  const [playMode, setPlayMode] = useState<PlayMode>("root");

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <PianoKeyboard defaultOctaves={4} defaultStartOctave={2} centerOctave={3} />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-1/2">
          <KeyboardControls />
        </div>

        <div className="md:w-1/2 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { value: "root", label: "根音" },
              { value: "triad", label: "齐奏三和弦" },
              { value: "triad-arpeggio", label: "分解三和弦" },
              { value: "seventh", label: "齐奏七和弦" },
              { value: "seventh-arpeggio", label: "分解七和弦" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setPlayMode(option.value as PlayMode)}
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
                  playMode === option.value
                    ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <CircleOfFifths playMode={playMode} />
        </div>
      </div>
    </div>
  );
}
