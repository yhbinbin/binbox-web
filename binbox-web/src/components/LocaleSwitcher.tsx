'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeNames, Locale } from '@/i18n/config';

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((l, index) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => handleChange(l)}
            className={`cursor-pointer px-1.5 py-0.5 text-xs uppercase tracking-wider transition hover:text-[var(--accent-primary)] ${
              locale === l
                ? 'text-[var(--accent-primary)] font-medium'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {localeNames[l]}
          </button>
          {index < locales.length - 1 && (
            <span className="text-[var(--text-muted)]/50 text-xs">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
