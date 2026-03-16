import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 当前播放的音频类型
export type AudioSourceType = 'breakbeat' | 'track' | 'sample' | 'preview' | null;

// 音频播放信息
export interface AudioPlaybackInfo {
  type: AudioSourceType;
  id: string | null;          // 音频资源 ID
  name: string | null;        // 显示名称
  duration: number | null;    // 总时长（秒）
  currentTime: number;        // 当前播放位置（秒）
}

// 音频偏好设置（持久化）
interface AudioPreferences {
  masterVolume: number;       // 主音量 0-1
  defaultTempo: number;       // 默认 BPM
  autoPlay: boolean;          // 自动播放
}

// 音频状态
interface AudioState {
  // 播放状态
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  
  // 当前播放信息
  playback: AudioPlaybackInfo;
  
  // Tone.js 全局设置
  tempo: number;
  swing: number;
  
  // 偏好设置（持久化）
  preferences: AudioPreferences;
  
  // Actions
  setPlaying: (isPlaying: boolean) => void;
  setPaused: (isPaused: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setTempo: (tempo: number) => void;
  setSwing: (swing: number) => void;
  
  // 播放控制
  startPlayback: (info: Omit<AudioPlaybackInfo, 'currentTime'>) => void;
  updatePlaybackTime: (time: number) => void;
  stopPlayback: () => void;
  
  // 偏好设置
  setMasterVolume: (volume: number) => void;
  setDefaultTempo: (tempo: number) => void;
  setAutoPlay: (autoPlay: boolean) => void;
}

const initialPlayback: AudioPlaybackInfo = {
  type: null,
  id: null,
  name: null,
  duration: null,
  currentTime: 0,
};

const initialPreferences: AudioPreferences = {
  masterVolume: 0.8,
  defaultTempo: 150,
  autoPlay: false,
};

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      playback: initialPlayback,
      tempo: 150,
      swing: 0.25,
      preferences: initialPreferences,
      
      // 基础播放状态
      setPlaying: (isPlaying) => set({ isPlaying, isPaused: false }),
      setPaused: (isPaused) => set({ isPaused, isPlaying: !isPaused }),
      setLoading: (isLoading) => set({ isLoading }),
      setTempo: (tempo) => set({ tempo }),
      setSwing: (swing) => set({ swing }),
      
      // 播放控制
      startPlayback: (info) => set({
        isPlaying: true,
        isPaused: false,
        playback: { ...info, currentTime: 0 },
      }),
      
      updatePlaybackTime: (time) => set((state) => ({
        playback: { ...state.playback, currentTime: time },
      })),
      
      stopPlayback: () => set({
        isPlaying: false,
        isPaused: false,
        playback: initialPlayback,
      }),
      
      // 偏好设置
      setMasterVolume: (volume) => set((state) => ({
        preferences: { ...state.preferences, masterVolume: volume },
      })),
      
      setDefaultTempo: (tempo) => set((state) => ({
        preferences: { ...state.preferences, defaultTempo: tempo },
      })),
      
      setAutoPlay: (autoPlay) => set((state) => ({
        preferences: { ...state.preferences, autoPlay },
      })),
    }),
    {
      name: 'binbox-audio',
      // 只持久化偏好设置，不持久化播放状态
      partialize: (state) => ({
        preferences: state.preferences,
        tempo: state.tempo,
        swing: state.swing,
      }),
    }
  )
);
