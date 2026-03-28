'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navigation() {
  const t = useTranslations('navigation');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/music', label: t('music') },
    { href: '/lab', label: t('lab') },
    { href: '/archive', label: t('archive') },
    { href: '/store', label: t('store') },
    { href: '/about', label: t('about') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/70 backdrop-blur">
      <nav className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center justify-between sm:justify-start sm:gap-6">
            <Link
              href="/"
              className="cursor-pointer text-lg font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]"
            >
              {tCommon('siteName')}
            </Link>
            <div className="flex items-center gap-3 sm:hidden">
              <ThemeSwitcher />
              <span className="text-[var(--text-muted)]/40">|</span>
              <LocaleSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto text-sm uppercase tracking-[0.18em] text-[var(--text-secondary)] sm:ml-6 sm:flex-1 sm:overflow-visible">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`cursor-pointer whitespace-nowrap transition hover:text-[var(--accent-primary)] ${
                    isActive
                      ? 'text-[var(--accent-primary)] underline decoration-[var(--accent-primary)] decoration-2 underline-offset-8'
                      : ''
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="ml-auto hidden items-center gap-3 sm:flex">
            <ThemeSwitcher />
            <span className="text-[var(--text-muted)]/40">|</span>
            <LocaleSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
}
