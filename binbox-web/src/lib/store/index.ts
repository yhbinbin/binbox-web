/**
 * binbox 全局状态管理
 * 使用 Zustand 管理应用全局状态
 * 
 * Stores:
 * - themeStore: 主题状态（持久化到 localStorage）
 * - audioStore: 音频播放状态和偏好设置
 * - userStore: 用户认证和偏好设置（预留待开发）
 */

// 主题状态
export { useThemeStore } from './themeStore';

// 音频状态
export { useAudioStore } from './audioStore';
export type { AudioSourceType, AudioPlaybackInfo } from './audioStore';

// 用户状态（预留）
export { useUserStore } from './userStore';
export type { User, UserRole, UserPreferences, AuthStatus } from './userStore';
