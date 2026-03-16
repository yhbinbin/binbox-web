import * as Tone from "tone";
import { DrumKitId, getDrumKit } from "@/lib/audio/drumKits";

export type StepState = {
  kick: boolean;
  snare: boolean;
  hat: boolean;
};

export type BreakbeatPattern = StepState[];

export type BreakbeatEngineOptions = {
  // Report the currently playing step so the UI can highlight it.
  onStep?: (stepIndex: number) => void;
};

type Samplers = {
  kick: Tone.Sampler;
  snare: Tone.Sampler;
  hat: Tone.Sampler;
};

export type BreakbeatEngine = {
  init: () => Promise<void>;
  start: () => void;
  stop: () => void;
  setTempo: (bpm: number) => void;
  setSwing: (amount: number) => void;
  setHumanize: (enabled: boolean) => void;
  setKit: (id: DrumKitId) => Promise<void>;
  setPattern: (pattern: BreakbeatPattern) => void;
  generatePattern: () => BreakbeatPattern;
  getPattern: () => BreakbeatPattern;
  dispose: () => void;
};

const TOTAL_STEPS = 16;

const createEmptyPattern = (): BreakbeatPattern =>
  Array.from({ length: TOTAL_STEPS }, () => ({
    kick: false,
    snare: false,
    hat: false,
  }));

const generateJunglePattern = (): BreakbeatPattern => {
  const pattern = createEmptyPattern();

  pattern[0].kick = true;
  pattern[8].kick = true;
  pattern[4].snare = true;
  pattern[12].snare = true;

  for (let i = 0; i < TOTAL_STEPS; i += 1) {
    const hatProbability = i % 2 === 0 ? 0.7 : 0.4;
    pattern[i].hat = Math.random() < hatProbability;
  }

  [2, 6, 10, 14].forEach((index) => {
    if (Math.random() < 0.4) {
      pattern[index].kick = true;
    }
    if (Math.random() < 0.35) {
      pattern[index].snare = true;
    }
  });

  if (Math.random() < 0.45) {
    pattern[15].snare = true;
  }

  return pattern;
};

const NOTE_MAP = {
  kick: "C1",
  snare: "D1",
  hat: "F#1",
} as const;

const createSamplers = (kitId: DrumKitId): Samplers => {
  const kit = getDrumKit(kitId);

  const kick = new Tone.Sampler({
    urls: { [NOTE_MAP.kick]: kit.samples.kick },
    volume: -2,
  }).toDestination();
  const snare = new Tone.Sampler({
    urls: { [NOTE_MAP.snare]: kit.samples.snare },
    volume: -4,
  }).toDestination();
  const hat = new Tone.Sampler({
    urls: { [NOTE_MAP.hat]: kit.samples.hat },
    volume: -10,
  }).toDestination();

  return { kick, snare, hat };
};

const randomVelocity = (base: number, spread: number) => {
  const swing = (Math.random() * 2 - 1) * spread;
  return Math.min(1, Math.max(0.2, base + swing));
};

export const createBreakbeatEngine = (
  options: BreakbeatEngineOptions = {}
): BreakbeatEngine => {
  let samplers: Samplers | null = null;
  let sequence: Tone.Sequence<number> | null = null;
  let pattern = generateJunglePattern();
  let kitId: DrumKitId = "classic-909";
  let humanize = false;
  let samplersReady = false;

  const init = async () => {
    if (samplers && sequence) return;

    samplers = createSamplers(kitId);
    await Promise.all([samplers.kick.loaded, samplers.snare.loaded, samplers.hat.loaded]);
    samplersReady = true;

    sequence = new Tone.Sequence(
      (time, stepIndex) => {
        // 安全检查：确保采样器已加载
        if (!samplers || !samplersReady) return;
        
        const step = pattern[stepIndex];
        const offset = humanize ? (Math.random() * 0.02 - 0.01) : 0;
        const playTime = time + offset;

        try {
          if (step.kick && samplers.kick.loaded) {
            samplers.kick.triggerAttackRelease(
              NOTE_MAP.kick,
              "16n",
              playTime,
              humanize ? randomVelocity(0.9, 0.15) : 0.9
            );
          }
          if (step.snare && samplers.snare.loaded) {
            samplers.snare.triggerAttackRelease(
              NOTE_MAP.snare,
              "16n",
              playTime,
              humanize ? randomVelocity(0.8, 0.12) : 0.8
            );
          }
          if (step.hat && samplers.hat.loaded) {
            samplers.hat.triggerAttackRelease(
              NOTE_MAP.hat,
              "32n",
              playTime,
              humanize ? randomVelocity(0.6, 0.18) : 0.6
            );
          }
        } catch {
          // 静默处理采样器未就绪的情况
        }

        options.onStep?.(stepIndex);
      },
      Array.from({ length: TOTAL_STEPS }, (_, index) => index),
      "16n"
    );

    sequence.loop = true;
    sequence.start(0);

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = "1m";
    Tone.Transport.swingSubdivision = "16n";
  };

  const start = () => {
    Tone.Transport.start();
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.position = "0:0:0";
  };

  const setTempo = (bpm: number) => {
    // 使用 rampTo 平滑过渡 BPM，避免节奏突变
    // 过渡时间 0.1 秒足以消除突跳感，同时保持响应性
    Tone.Transport.bpm.rampTo(bpm, 0.1);
  };

  const setSwing = (amount: number) => {
    Tone.Transport.swing = amount;
  };

  const setHumanize = (enabled: boolean) => {
    humanize = enabled;
  };

  const setKit = async (nextKitId: DrumKitId) => {
    // 标记采样器未就绪，防止回调在加载期间触发
    samplersReady = false;
    kitId = nextKitId;
    
    // 清理旧采样器
    samplers?.kick.dispose();
    samplers?.snare.dispose();
    samplers?.hat.dispose();
    
    // 创建并等待新采样器加载完成
    samplers = createSamplers(kitId);
    await Promise.all([samplers.kick.loaded, samplers.snare.loaded, samplers.hat.loaded]);
    samplersReady = true;
  };

  const setPattern = (nextPattern: BreakbeatPattern) => {
    pattern = nextPattern;
  };

  const generatePattern = () => generateJunglePattern();

  const dispose = () => {
    stop();
    sequence?.dispose();
    samplers?.kick.dispose();
    samplers?.snare.dispose();
    samplers?.hat.dispose();
    sequence = null;
    samplers = null;
  };

  return {
    init,
    start,
    stop,
    setTempo,
    setSwing,
    setHumanize,
    setKit,
    setPattern,
    generatePattern,
    getPattern: () => pattern,
    dispose,
  };
};
