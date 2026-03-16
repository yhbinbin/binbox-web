"use client";

import { useMemo, useState } from "react";
import {
  getRootNotes,
  deriveTriads,
  deriveSeventhChords,
} from "@/lib/music-theory/chordUtils";
import { deriveModes } from "@/lib/music-theory/modeUtils";
import {
  initAudio,
  getIsInitialized,
  playChord,
  playArpeggio,
} from "@/lib/audio/pianoEngine";
import { useKeyboardStore } from "@/store/keyboardStore";

interface KeyboardControlsProps {
  defaultRootOctave?: number;
}

export default function KeyboardControls({ defaultRootOctave = 3 }: KeyboardControlsProps) {
  const rootNotes = useMemo(() => getRootNotes(defaultRootOctave), [defaultRootOctave]);
  const [selectedRoot, setSelectedRoot] = useState(rootNotes[0]);
  const { pressKeys, releaseAllKeys } = useKeyboardStore();

  const triads = useMemo(() => deriveTriads(selectedRoot), [selectedRoot]);
  const seventhChords = useMemo(() => deriveSeventhChords(selectedRoot), [selectedRoot]);
  const modes = useMemo(() => deriveModes(selectedRoot), [selectedRoot]);
  const westernModes = modes.filter((m) => m.category === "western");
  const chineseModes = modes.filter((m) => m.category === "chinese");

  const ensureAudio = async () => {
    if (!getIsInitialized()) {
      await initAudio();
    }
  };

  const handlePlayChord = async (notes: string[], duration: string | number = "2n") => {
    await ensureAudio();
    pressKeys(notes);
    playChord(notes, duration);
    setTimeout(() => {
      releaseAllKeys();
    }, 1000);
  };

  const handlePlayArpeggio = async (notes: string[]) => {
    await ensureAudio();
    const interval = 250;
    notes.forEach((note, index) => {
      setTimeout(() => {
        pressKeys([note]);
      }, index * interval);
    });
    playArpeggio(notes, "8n", interval);
    setTimeout(() => {
      releaseAllKeys();
    }, notes.length * interval + 300);
  };

  const getNotesWithHighOctave = (notes: string[]) => {
    if (notes.length === 0) return notes;
    const rootNote = notes[0];
    const noteName = rootNote.replace(/\d+$/, "");
    const octave = parseInt(rootNote.match(/\d+$/)?.[0] || "3");
    const highOctaveRoot = `${noteName}${octave + 1}`;
    return [...notes, highOctaveRoot];
  };

  const handlePlayMode = async (notes: string[], descending = false) => {
    await ensureAudio();
    const playNotes = getNotesWithHighOctave(notes);
    const seq = descending ? [...playNotes].reverse() : playNotes;
    const interval = 220;
    seq.forEach((note, index) => {
      setTimeout(() => {
        pressKeys([note]);
      }, index * interval);
    });
    playArpeggio(seq, "8n", interval);
    setTimeout(() => {
      releaseAllKeys();
    }, seq.length * interval + 300);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          根音选择
        </div>
        <div className="grid grid-cols-6 gap-2">
          {rootNotes.map((note) => (
            <button
              key={note}
              onClick={() => setSelectedRoot(note)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
                selectedRoot === note
                  ? "border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                  : "border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              {note.replace(/\d+$/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          三和弦
        </div>
        <div className="flex flex-col gap-2">
          {triads.map((chord) => (
            <div key={chord.name} className="flex items-center justify-between gap-2 text-xs">
              <div className="text-[var(--text-primary)]">{chord.symbol}</div>
              <div className="font-mono text-[var(--text-muted)]">{chord.notes.join(" - ")}</div>
              <div className="flex gap-1">
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayChord(chord.notesWithOctave)}
                >
                  齐奏
                </button>
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayArpeggio(chord.notesWithOctave)}
                >
                  分解
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          七和弦
        </div>
        <div className="flex flex-col gap-2">
          {seventhChords.map((chord) => (
            <div key={chord.name} className="flex items-center justify-between gap-2 text-xs">
              <div className="text-[var(--text-primary)]">{chord.symbol}</div>
              <div className="font-mono text-[var(--text-muted)]">{chord.notes.join(" - ")}</div>
              <div className="flex gap-1">
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayChord(chord.notesWithOctave)}
                >
                  齐奏
                </button>
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayArpeggio(chord.notesWithOctave)}
                >
                  分解
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          七大中古调式
        </div>
        <div className="flex flex-col gap-2">
          {westernModes.map((mode) => (
            <div key={mode.symbol} className="flex items-center justify-between gap-2 text-xs">
              <div className="text-[var(--text-primary)]">{mode.modeName}</div>
              <div className="font-mono text-[var(--text-muted)]">{mode.notes.join(" - ")}</div>
              <div className="flex gap-1">
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayMode(mode.notesWithOctave, false)}
                >
                  升序
                </button>
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayMode(mode.notesWithOctave, true)}
                >
                  降序
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
        <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          中国传统五声调式
        </div>
        <div className="flex flex-col gap-2">
          {chineseModes.map((mode) => (
            <div key={mode.symbol} className="flex items-center justify-between gap-2 text-xs">
              <div className="text-[var(--text-primary)]">{mode.modeName}</div>
              <div className="font-mono text-[var(--text-muted)]">{mode.notes.join(" - ")}</div>
              <div className="flex gap-1">
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayMode(mode.notesWithOctave, false)}
                >
                  升序
                </button>
                <button
                  className="rounded-full border border-[var(--border-default)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                  onClick={() => handlePlayMode(mode.notesWithOctave, true)}
                >
                  降序
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
