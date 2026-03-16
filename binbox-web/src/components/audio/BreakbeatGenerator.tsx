"use client";

import { useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";
import { useAudioStore } from "@/lib/tone/useAudioStore";

type DrumStep = {
  kick?: boolean;
  snare?: boolean;
  hat?: boolean;
};

type DrumKit = {
  kick: Tone.MembraneSynth;
  snare: Tone.NoiseSynth;
  hat: Tone.MetalSynth;
  sequence: Tone.Sequence<DrumStep>;
};

const steps: DrumStep[] = [
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
  { kick: true, hat: true },
  { hat: true },
  { snare: true, hat: true },
  { hat: true },
];

function createKit(): DrumKit {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.03,
    octaves: 10,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 0.1 },
  }).toDestination();

  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
  }).toDestination();

  const hat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();

  const sequence = new Tone.Sequence(
    (time, step) => {
      if (step.kick) {
        kick.triggerAttackRelease("C1", "8n", time, 0.9);
      }
      if (step.snare) {
        snare.triggerAttackRelease("16n", time, 0.5);
      }
      if (step.hat) {
        hat.triggerAttackRelease("32n", time, 0.25);
      }
    },
    steps,
    "16n"
  );

  return { kick, snare, hat, sequence };
}

export default function BreakbeatGenerator() {
  const kitRef = useRef<DrumKit | null>(null);
  const isPlaying = useAudioStore((state) => state.isPlaying);
  const tempo = useAudioStore((state) => state.tempo);
  const setPlaying = useAudioStore((state) => state.setPlaying);
  const setTempo = useAudioStore((state) => state.setTempo);

  const initialize = useCallback(() => {
    if (kitRef.current) return;

    kitRef.current = createKit();
    kitRef.current.sequence.start(0);
    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = "1m";
    Tone.Transport.swing = 0.18;
  }, []);

  const handleToggle = useCallback(async () => {
    await Tone.start();
    initialize();

    if (isPlaying) {
      Tone.Transport.stop();
      Tone.Transport.position = "0:0:0";
      setPlaying(false);
      return;
    }

    Tone.Transport.start();
    setPlaying(true);
  }, [initialize, isPlaying, setPlaying]);

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.position = "0:0:0";

      if (kitRef.current) {
        kitRef.current.sequence.dispose();
        kitRef.current.kick.dispose();
        kitRef.current.snare.dispose();
        kitRef.current.hat.dispose();
        kitRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[0_0_40px_rgba(var(--accent-secondary-rgb,0,255,255),0.15)]">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
          Demo
        </p>
        <h3 className="text-2xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
          Breakbeat Generator
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          A minimal 90s-inspired pattern sequenced with Tone.js. Hit play and
          twist the tempo.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleToggle}
          className="cursor-pointer rounded-full border border-[var(--accent-primary)] px-6 py-2 text-sm uppercase tracking-[0.2em] text-[var(--accent-primary)] transition hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)]"
        >
          {isPlaying ? "Stop" : "Start"}
        </button>
        <div className="flex items-center gap-3">
          <label className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Tempo
          </label>
          <input
            type="range"
            min={120}
            max={190}
            value={tempo}
            onChange={(event) => setTempo(Number(event.target.value))}
            className="cursor-pointer accent-[var(--accent-secondary)]"
          />
          <span className="text-sm text-[var(--accent-secondary)]">{tempo} BPM</span>
        </div>
      </div>

      <div className="grid gap-3 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)] sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3">
          Kick / MembraneSynth
        </div>
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3">
          Snare / NoiseSynth
        </div>
        <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-3">
          Hat / MetalSynth
        </div>
      </div>
    </div>
  );
}
