import { create } from "zustand";

export type Note = string;

interface KeyboardState {
  pressedKeys: Set<Note>;
  highlightedKeys: Set<Note>;
  pressKey: (note: Note) => void;
  releaseKey: (note: Note) => void;
  pressKeys: (notes: Note[]) => void;
  releaseAllKeys: () => void;
  setHighlightedKeys: (notes: Note[]) => void;
  clearHighlightedKeys: () => void;
  isKeyPressed: (note: Note) => boolean;
  isKeyHighlighted: (note: Note) => boolean;
}

export const useKeyboardStore = create<KeyboardState>((set, get) => ({
  pressedKeys: new Set<Note>(),
  highlightedKeys: new Set<Note>(),

  pressKey: (note) =>
    set((state) => ({
      pressedKeys: new Set(state.pressedKeys).add(note),
    })),

  releaseKey: (note) =>
    set((state) => {
      const newKeys = new Set(state.pressedKeys);
      newKeys.delete(note);
      return { pressedKeys: newKeys };
    }),

  pressKeys: (notes) =>
    set(() => ({
      pressedKeys: new Set(notes),
    })),

  releaseAllKeys: () =>
    set(() => ({
      pressedKeys: new Set<Note>(),
    })),

  setHighlightedKeys: (notes) =>
    set(() => ({
      highlightedKeys: new Set(notes),
    })),

  clearHighlightedKeys: () =>
    set(() => ({
      highlightedKeys: new Set<Note>(),
    })),

  isKeyPressed: (note) => get().pressedKeys.has(note),
  isKeyHighlighted: (note) => get().highlightedKeys.has(note),
}));
