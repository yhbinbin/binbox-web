'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useThemeStore, themes, themeMetadata, Theme } from '@/lib/theme';

export default function ThemeSwitcher() {
  const locale = useLocale();
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 防止 SSR 时的 hydration 不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <button className="flex cursor-pointer items-center gap-1.5 px-1.5 py-0.5 text-xs text-[var(--text-muted)]">
        <span className="text-sm">🎨</span>
      </button>
    );
  }

  const currentMeta = themeMetadata[theme];
  const isZh = locale === 'zh';

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex cursor-pointer items-center gap-1.5 px-1.5 py-0.5 text-xs transition hover:text-[var(--accent-primary)]"
        title={isZh ? '切换主题' : 'Switch theme'}
      >
        <span className="text-sm">{currentMeta.icon}</span>
        <span className="hidden text-[var(--text-muted)] sm:inline">
          {isZh ? currentMeta.name : currentMeta.nameEn}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-secondary)] p-1.5 shadow-xl backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {themes.map((t) => {
            const meta = themeMetadata[t];
            const isActive = theme === t;

            return (
              <button
                key={t}
                onClick={() => {
                  setTheme(t);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isActive
                    ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="text-base">{meta.icon}</span>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {isZh ? meta.name : meta.nameEn}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {isZh ? meta.description : meta.descriptionEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
