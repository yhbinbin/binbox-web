import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户角色
export type UserRole = 'guest' | 'user' | 'creator' | 'admin';

// 用户信息
export interface User {
  id: string;
  username: string;
  email: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: string;
}

// 用户偏好设置
export interface UserPreferences {
  locale: 'zh' | 'en';
  notifications: boolean;
  newsletter: boolean;
}

// 认证状态
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface UserState {
  // 用户信息
  user: User | null;
  authStatus: AuthStatus;
  
  // 偏好设置
  preferences: UserPreferences;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  
  // 偏好设置
  setLocale: (locale: 'zh' | 'en') => void;
  setNotifications: (enabled: boolean) => void;
  setNewsletter: (enabled: boolean) => void;
  
  // 认证
  login: (user: User) => void;
  logout: () => void;
  
  // 重置
  reset: () => void;
}

const initialPreferences: UserPreferences = {
  locale: 'zh',
  notifications: true,
  newsletter: false,
};

const initialState = {
  user: null,
  authStatus: 'idle' as AuthStatus,
  preferences: initialPreferences,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,
      
      // 用户信息
      setUser: (user) => set({ user }),
      setAuthStatus: (authStatus) => set({ authStatus }),
      
      // 偏好设置
      setLocale: (locale) => set((state) => ({
        preferences: { ...state.preferences, locale },
      })),
      
      setNotifications: (notifications) => set((state) => ({
        preferences: { ...state.preferences, notifications },
      })),
      
      setNewsletter: (newsletter) => set((state) => ({
        preferences: { ...state.preferences, newsletter },
      })),
      
      // 认证
      login: (user) => set({
        user,
        authStatus: 'authenticated',
      }),
      
      logout: () => set({
        user: null,
        authStatus: 'unauthenticated',
      }),
      
      // 重置
      reset: () => set(initialState),
    }),
    {
      name: 'binbox-user',
      // 持久化用户信息和偏好设置
      partialize: (state) => ({
        user: state.user,
        preferences: state.preferences,
      }),
    }
  )
);
