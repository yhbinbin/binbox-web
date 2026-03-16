'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/music', label: t('music') },
    { href: '/lab', label: t('lab') },
    { href: '/tutorials', label: t('tutorials') },
    { href: '/samples', label: t('samples') },
    { href: '/archive', label: t('archive') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/70 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center px-6 py-4">
        <Link
          href="/"
          className="cursor-pointer text-lg font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]"
        >
          {tCommon('siteName')}
        </Link>
        <div className="ml-8 flex flex-wrap items-center gap-4 text-sm uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-pointer transition hover:text-[var(--accent-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeSwitcher />
          <span className="text-[var(--text-muted)]/40">|</span>
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
}
