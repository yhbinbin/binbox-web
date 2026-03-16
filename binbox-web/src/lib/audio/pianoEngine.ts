import * as Tone from "tone";

let synth: Tone.PolySynth | null = null;
let initialized = false;

async function ensureInit(): Promise<void> {
  if (initialized) return;
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  initialized = true;
}

export function getIsInitialized(): boolean {
  return initialized;
}

export async function initAudio(): Promise<void> {
  await ensureInit();
}

export function playNote(note: string, duration: string | number = "8n"): void {
  if (!initialized || !synth) return;
  synth.triggerAttackRelease(note, duration);
}

export function attackNote(note: string): void {
  if (!initialized || !synth) return;
  synth.triggerAttack(note);
}

export function releaseNote(note: string): void {
  if (!initialized || !synth) return;
  synth.triggerRelease(note);
}

export function playChord(
  notes: string[],
  duration: string | number = "4n"
): void {
  if (!initialized || !synth) return;
  synth.triggerAttackRelease(notes, duration);
}

export function playArpeggio(
  notes: string[],
  noteDuration: string | number = "8n",
  interval: number = 200
): void {
  if (!initialized || !synth) return;
  notes.forEach((note, index) => {
    setTimeout(() => {
      synth?.triggerAttackRelease(note, noteDuration);
    }, index * interval);
  });
}

export function releaseAll(): void {
  if (!initialized || !synth) return;
  synth.releaseAll();
}
