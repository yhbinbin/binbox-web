// 音符常量
export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;
export type NoteName = (typeof NOTES)[number];

// 调式类型定义
export interface ModeType {
  name: string;
  symbol: string;
  intervals: number[];
  category: "western" | "chinese";
}

const WESTERN_MODES: ModeType[] = [
  { name: "自然大调", symbol: "Ionian", intervals: [0, 2, 4, 5, 7, 9, 11], category: "western" },
  { name: "自然小调", symbol: "Aeolian", intervals: [0, 2, 3, 5, 7, 8, 10], category: "western" },
  { name: "多利亚调式", symbol: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10], category: "western" },
  { name: "弗里吉亚调式", symbol: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10], category: "western" },
  { name: "利底亚调式", symbol: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11], category: "western" },
  { name: "混合利底亚调式", symbol: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10], category: "western" },
  { name: "洛克里亚调式", symbol: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10], category: "western" },
];

const CHINESE_MODES: ModeType[] = [
  { name: "宫调式", symbol: "Gong", intervals: [0, 2, 4, 7, 9], category: "chinese" },
  { name: "商调式", symbol: "Shang", intervals: [0, 2, 5, 7, 10], category: "chinese" },
  { name: "角调式", symbol: "Jue", intervals: [0, 3, 5, 8, 10], category: "chinese" },
  { name: "徵调式", symbol: "Zhi", intervals: [0, 2, 5, 7, 9], category: "chinese" },
  { name: "羽调式", symbol: "Yu", intervals: [0, 3, 5, 7, 10], category: "chinese" },
];

export const ALL_MODES: ModeType[] = [...WESTERN_MODES, ...CHINESE_MODES];

export interface ModeResult {
  name: string;
  modeName: string;
  symbol: string;
  category: "western" | "chinese";
  notes: string[];
  notesWithOctave: string[];
}

export function getNoteIndex(note: string): number {
  const noteName = note.replace(/\d+$/, "");
  return NOTES.indexOf(noteName as NoteName);
}

export function getNoteByInterval(
  rootIndex: number,
  interval: number,
  octave: number
): string {
  const targetIndex = (rootIndex + interval) % 12;
  const octaveOffset = Math.floor((rootIndex + interval) / 12);
  return `${NOTES[targetIndex]}${octave + octaveOffset}`;
}

export function deriveModes(rootNote: string): ModeResult[] {
  const noteName = rootNote.replace(/\d+$/, "");
  const octave = parseInt(rootNote.match(/\d+$/)?.[0] || "4");
  const rootIndex = getNoteIndex(rootNote);

  if (rootIndex === -1) {
    throw new Error(`Invalid note: ${rootNote}`);
  }

  return ALL_MODES.map((mode) => {
    const notesWithOctave = mode.intervals.map((interval) =>
      getNoteByInterval(rootIndex, interval, octave)
    );
    const notes = notesWithOctave.map((n) => n.replace(/\d+$/, ""));

    return {
      name: `${noteName} ${mode.name}`,
      modeName: mode.name,
      symbol: `${noteName} ${mode.symbol}`,
      category: mode.category,
      notes,
      notesWithOctave,
    };
  });
}

export function getRootNotes(octave: number = 3): string[] {
  return NOTES.map((note) => `${note}${octave}`);
}
