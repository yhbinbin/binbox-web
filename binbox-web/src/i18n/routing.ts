import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // 默认语言不在 URL 中显示前缀
  localePrefix: 'as-needed',
});
