import * as Tone from "tone";

export type SliceStep = {
  slice: number;
  pitch: number;
};

export type BreakSlicerPattern = SliceStep[];

export type BreakSlicerEngineOptions = {
  onStep?: (stepIndex: number) => void;
  onSliceTriggered?: (sliceIndex: number) => void;
};

type BreakSlicerEngine = {
  init: (sampleUrl: string) => Promise<void>;
  setSample: (sampleUrl: string) => Promise<void>;
  playSlice: (sliceIndex: number, pitch?: number) => void;
  start: () => void;
  stop: () => void;
  setPattern: (pattern: BreakSlicerPattern) => void;
  setTempo: (bpm: number) => void;
  randomizePattern: () => BreakSlicerPattern;
  generateJungleChop: () => BreakSlicerPattern;
  getPattern: () => BreakSlicerPattern;
  dispose: () => void;
};

const TOTAL_STEPS = 16;
const SEMITONE_RANGE = 3;

const createEmptyPattern = (): BreakSlicerPattern =>
  Array.from({ length: TOTAL_STEPS }, (_item, index) => ({
    slice: index,
    pitch: 0,
  }));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toRate = (semitones: number) => Math.pow(2, semitones / 12);

export const createBreakSlicerEngine = (
  options: BreakSlicerEngineOptions = {}
): BreakSlicerEngine => {
  let player: Tone.Player | null = null;
  let sequence: Tone.Sequence<number> | null = null;
  let sliceDuration = 0;
  let pattern = createEmptyPattern();
  let currentSampleUrl: string | null = null;

  const loadSample = async (sampleUrl: string) => {
    if (!sampleUrl) {
      throw new Error("BreakSlicerEngine: sampleUrl is required.");
    }

    if (currentSampleUrl === sampleUrl && player) {
      return;
    }

    player?.dispose();

    player = new Tone.Player({
      url: sampleUrl,
      loop: false,
      fadeIn: 0.005,
      fadeOut: 0.01,
    }).toDestination();

    await player.load(sampleUrl);
    currentSampleUrl = sampleUrl;
    sliceDuration = player.buffer.duration / TOTAL_STEPS;
  };

  const init = async (sampleUrl: string) => {
    if (sequence) {
      await loadSample(sampleUrl);
      return;
    }

    await loadSample(sampleUrl);

    sequence = new Tone.Sequence(
      (time, stepIndex) => {
        const step = pattern[stepIndex];
        if (!player) return;

        const offset = step.slice * sliceDuration;
        const playbackRate = toRate(step.pitch);
        player.playbackRate = playbackRate;
        // 停止之前的播放，避免 "Start time must be strictly greater" 错误
        try {
          player.stop(time);
        } catch {
          // 忽略停止时的错误
        }
        player.start(time + 0.001, offset, sliceDuration);

        options.onStep?.(stepIndex);
        options.onSliceTriggered?.(step.slice);
      },
      Array.from({ length: TOTAL_STEPS }, (_, index) => index),
      "16n"
    );

    sequence.loop = true;
    sequence.start(0);

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = "1m";
  };

  const setSample = async (sampleUrl: string) => {
    await loadSample(sampleUrl);
  };

  const playSlice = (sliceIndex: number, pitch = 0) => {
    if (!player || sliceDuration === 0) return;
    const clampedSlice = clamp(sliceIndex, 0, TOTAL_STEPS - 1);
    const clampedPitch = clamp(pitch, -SEMITONE_RANGE, SEMITONE_RANGE);
    const offset = clampedSlice * sliceDuration;
    player.playbackRate = toRate(clampedPitch);
    // 停止当前播放再开始新的，避免时间冲突
    try {
      player.stop();
    } catch {
      // 忽略停止时的错误
    }
    player.start(Tone.now() + 0.001, offset, sliceDuration);
    options.onSliceTriggered?.(clampedSlice);
  };

  const start = () => {
    Tone.Transport.start();
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.position = "0:0:0";
  };

  const setPattern = (nextPattern: BreakSlicerPattern) => {
    pattern = nextPattern.map((step) => ({
      slice: clamp(step.slice, 0, TOTAL_STEPS - 1),
      pitch: clamp(step.pitch, -SEMITONE_RANGE, SEMITONE_RANGE),
    }));
  };

  const setTempo = (bpm: number) => {
    Tone.Transport.bpm.value = bpm;
  };

  const randomizePattern = () =>
    Array.from({ length: TOTAL_STEPS }, () => ({
      slice: Math.floor(Math.random() * TOTAL_STEPS),
      pitch: 0,
    }));

  const generateJungleChop = () => {
    const anchors = [0, 4, 8, 12];
    const patternSteps = Array.from({ length: TOTAL_STEPS }, (_item, index) => {
      let slice = index;

      if (anchors.includes(index)) {
        slice = anchors[Math.floor(Math.random() * anchors.length)];
      } else if (index % 2 === 1) {
        slice = Math.floor(Math.random() * TOTAL_STEPS);
      } else {
        slice = (index + (Math.random() > 0.7 ? 8 : 0)) % TOTAL_STEPS;
      }

      const pitch = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;

      return { slice, pitch };
    });

    return patternSteps;
  };

  const dispose = () => {
    stop();
    sequence?.dispose();
    player?.dispose();
    sequence = null;
    player = null;
  };

  return {
    init,
    setSample,
    playSlice,
    start,
    stop,
    setPattern,
    setTempo,
    randomizePattern,
    generateJungleChop,
    getPattern: () => pattern,
    dispose,
  };
};
