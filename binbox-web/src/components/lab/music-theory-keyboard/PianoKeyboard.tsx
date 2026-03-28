"use client";

import { useState, useRef, useLayoutEffect, useCallback } from "react";
import { useKeyboardStore } from "@/store/keyboardStore";
import {
  initAudio,
  getIsInitialized,
  attackNote,
  releaseNote,
} from "@/lib/audio/pianoEngine";

const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeyPositions = [0, 1, 3, 4, 5];
const blackNotes = ["C#", "D#", "F#", "G#", "A#"];

const flatToSharpMap: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
};

function isNoteInSet(noteSet: Set<string>, note: string): boolean {
  if (noteSet.has(note)) return true;

  const match = note.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return false;

  const [, noteName, octave] = match;

  if (noteName.includes("#")) {
    const sharpToFlat: Record<string, string> = {
      "C#": "Db",
      "D#": "Eb",
      "E": "Fb",
      "F#": "Gb",
      "G#": "Ab",
      "A#": "Bb",
      "B": "Cb",
    };
    const flatName = sharpToFlat[noteName];
    if (flatName && noteSet.has(`${flatName}${octave}`)) return true;
  } else if (noteName.includes("b")) {
    const sharpName = flatToSharpMap[noteName];
    if (sharpName && noteSet.has(`${sharpName}${octave}`)) return true;
  }

  return false;
}

const OCTAVE_WIDTH = 7 * 40;
const WHITE_KEY_WIDTH = 40;

interface PianoKeyboardProps {
  defaultOctaves?: number;
  defaultStartOctave?: number;
  enableSound?: boolean;
  centerOctave?: number;
}

export default function PianoKeyboard({
  defaultOctaves = 4,
  defaultStartOctave = 2,
  enableSound = true,
  centerOctave = 3,
}: PianoKeyboardProps) {
  const { pressedKeys, highlightedKeys, pressKey, releaseKey } =
    useKeyboardStore();

  const [keyboardRange, setKeyboardRange] = useState(() => ({
    startOctave: defaultStartOctave,
    visibleOctaves: defaultOctaves,
  }));
  const containerRef = useRef<HTMLDivElement>(null);

  const { startOctave, visibleOctaves } = keyboardRange;

  const calculateKeyboardRange = useCallback(
    (containerWidth: number) => {
      const availableWidth = Math.max(0, containerWidth - 120);
      const maxOctaves = Math.floor(availableWidth / OCTAVE_WIDTH);
      const octaves = Math.max(1, Math.min(maxOctaves, 7));
      const halfOctaves = Math.floor(octaves / 2);
      const nextStartOctave = Math.max(
        0,
        Math.min(centerOctave - halfOctaves, 7 - octaves)
      );

      return {
        startOctave: nextStartOctave,
        visibleOctaves: octaves,
      };
    },
    [centerOctave]
  );

  useLayoutEffect(() => {
    const updateVisibleOctaves = () => {
      if (!containerRef.current) return;

      const nextRange = calculateKeyboardRange(containerRef.current.clientWidth);
      setKeyboardRange((prevRange) => {
        if (
          prevRange.startOctave === nextRange.startOctave &&
          prevRange.visibleOctaves === nextRange.visibleOctaves
        ) {
          return prevRange;
        }
        return nextRange;
      });
    };

    updateVisibleOctaves();

    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      const observer = new ResizeObserver(updateVisibleOctaves);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateVisibleOctaves);
    return () => window.removeEventListener("resize", updateVisibleOctaves);
  }, [calculateKeyboardRange]);

  const shiftOctave = (delta: number) => {
    const newStartOctave = startOctave + delta;
    if (newStartOctave >= 0 && newStartOctave + visibleOctaves <= 8) {
      setKeyboardRange((prevRange) => ({
        ...prevRange,
        startOctave: newStartOctave,
      }));
    }
  };

  const getWhiteKeyClassName = (note: string) => {
    const isPressed = isNoteInSet(pressedKeys, note);
    const isHighlighted = isNoteInSet(highlightedKeys, note);

    let className =
      "relative h-32 w-10 cursor-pointer rounded-b-md border border-zinc-300 transition-colors flex items-end justify-center pb-1 ";

    if (isPressed) {
      className += "bg-blue-400";
    } else if (isHighlighted) {
      className += "bg-yellow-300";
    } else {
      className += "bg-white hover:bg-zinc-100 active:bg-zinc-200";
    }

    return className;
  };

  const getBlackKeyClassName = (note: string) => {
    const isPressed = isNoteInSet(pressedKeys, note);
    const isHighlighted = isNoteInSet(highlightedKeys, note);

    let className =
      "absolute z-10 h-20 w-6 cursor-pointer rounded-b-md transition-colors ";

    if (isPressed) {
      className += "bg-blue-500";
    } else if (isHighlighted) {
      className += "bg-yellow-500";
    } else {
      className += "bg-zinc-900 hover:bg-zinc-700 active:bg-zinc-600";
    }

    return className;
  };

  const handleKeyDown = async (note: string) => {
    if (enableSound && !getIsInitialized()) {
      await initAudio();
    }
    pressKey(note);
    if (enableSound) {
      attackNote(note);
    }
  };

  const handleKeyUp = (note: string) => {
    releaseKey(note);
    if (enableSound) {
      releaseNote(note);
    }
  };

  const renderOctave = (octave: number) => (
    <div key={octave} className="relative flex">
      {whiteKeys.map((noteName) => {
        const note = `${noteName}${octave}`;
        const isC = noteName === "C";
        return (
          <button
            key={note}
            className={getWhiteKeyClassName(note)}
            title={note}
            onMouseDown={() => handleKeyDown(note)}
            onMouseUp={() => handleKeyUp(note)}
            onMouseLeave={() => handleKeyUp(note)}
            onTouchStart={() => handleKeyDown(note)}
            onTouchEnd={() => handleKeyUp(note)}
          >
            {isC && (
              <span className="text-xs text-zinc-400 font-light select-none">
                C{octave}
              </span>
            )}
          </button>
        );
      })}
      {blackKeyPositions.map((pos, index) => {
        const note = `${blackNotes[index]}${octave}`;
        return (
          <button
            key={note}
            className={getBlackKeyClassName(note)}
            style={{ left: `${pos * WHITE_KEY_WIDTH + 27}px` }}
            title={note}
            onMouseDown={() => handleKeyDown(note)}
            onMouseUp={() => handleKeyUp(note)}
            onMouseLeave={() => handleKeyUp(note)}
            onTouchStart={() => handleKeyDown(note)}
            onTouchEnd={() => handleKeyUp(note)}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full" ref={containerRef}>
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => shiftOctave(-1)}
          className="cursor-pointer rounded-full border border-[var(--border-default)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
        >
          ◀ Oct-
        </button>
        <button
          onClick={() => shiftOctave(1)}
          className="cursor-pointer rounded-full border border-[var(--border-default)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
        >
          Oct+ ▶
        </button>
        <div className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {startOctave} - {startOctave + visibleOctaves - 1}
        </div>
      </div>
      <div className="flex gap-0.5 overflow-hidden">
        {Array.from({ length: visibleOctaves }, (_, i) =>
          renderOctave(startOctave + i)
        )}
      </div>
    </div>
  );
}
