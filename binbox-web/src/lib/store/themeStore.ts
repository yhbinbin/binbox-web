import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, defaultTheme } from '@/lib/theme/config';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: defaultTheme,
      setTheme: (theme) => {
        // 更新 DOM 属性
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
        set({ theme });
      },
    }),
    {
      name: 'binbox-theme',
      onRehydrateStorage: () => (state) => {
        // 在客户端重新加载时应用主题
        if (state && typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
