import { Midi } from "@tonejs/midi";
import type { BreakbeatPattern } from "@/lib/audio/breakbeatEngine";

const MIDI_MAP = {
  kick: 36,
  snare: 38,
  hat: 42,
} as const;

const STEP_BEATS = 0.25; // 16th note

type MidiExportResult = {
  blob: Blob;
  bytes: Uint8Array;
};

const patternToMidi = (pattern: BreakbeatPattern, bpm: number) => {
  const midi = new Midi();
  midi.header.setTempo(bpm);

  const track = midi.addTrack();
  track.name = "Breakbeat";

  const secondsPerBeat = 60 / bpm;
  const stepDuration = STEP_BEATS * secondsPerBeat;

  pattern.forEach((step, index) => {
    const time = index * stepDuration;

    if (step.kick) {
      track.addNote({
        midi: MIDI_MAP.kick,
        time,
        duration: stepDuration,
        velocity: 0.9,
      });
    }

    if (step.snare) {
      track.addNote({
        midi: MIDI_MAP.snare,
        time,
        duration: stepDuration,
        velocity: 0.8,
      });
    }

    if (step.hat) {
      track.addNote({
        midi: MIDI_MAP.hat,
        time,
        duration: stepDuration,
        velocity: 0.6,
      });
    }
  });

  return midi;
};

export const exportPatternToMidi = (
  pattern: BreakbeatPattern,
  bpm: number
): MidiExportResult => {
  const midi = patternToMidi(pattern, bpm);
  const bytes = midi.toArray();
  const blob = new Blob([bytes], { type: "audio/midi" });
  return { blob, bytes };
};

export const downloadMidi = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
