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
    <div className="relative flex min-h-[70vh] flex-col gap-6 pb-24 md:pb-44">
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
          Music Theory Keyboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)] md:text-4xl">
          Scales, Chords, And Fifths
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--text-secondary)] md:text-base">
          Explore harmonic theory with a responsive keyboard, mode explorer, and
          a playable circle of fifths. Tap any sector to hear the harmony.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <KeyboardControls />
        </div>

        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
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
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
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

      <div className="md:sticky md:bottom-6 md:z-20">
        <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)]/95 p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] backdrop-blur">
          <PianoKeyboard defaultOctaves={4} defaultStartOctave={2} centerOctave={3} />
        </div>
      </div>
    </div>
  );
}
