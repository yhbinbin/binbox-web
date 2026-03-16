// 支持的语言列表
export const locales = ['zh', 'en'] as const;

// 未来可能添加的语言: 'es' (西班牙语), 'fr' (法语), 'ja' (日语), 'ko' (韩语)

export type Locale = (typeof locales)[number];

// 默认语言
export const defaultLocale: Locale = 'zh';

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  zh: '简体中文',
  en: 'English',
};
