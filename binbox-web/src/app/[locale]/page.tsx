import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ContentLayout from '@/components/layout/ContentLayout';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('home');

  return (
    <ContentLayout className="space-y-12">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--accent-secondary)]">
          {t('hero.eyebrow')}
        </p>
        <h1 className="text-4xl font-semibold uppercase tracking-[0.15em] text-[var(--accent-primary)] md:text-5xl">
          {t('hero.title')}
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          {t('hero.description')}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/lab"
            className="cursor-pointer rounded-full border border-[var(--accent-secondary)] px-6 py-2 text-xs uppercase tracking-[0.3em] text-[var(--accent-secondary)] transition hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)]"
          >
            {t('hero.enterLab')}
          </Link>
          <Link
            href="/music"
            className="cursor-pointer rounded-full border border-[var(--accent-primary)] px-6 py-2 text-xs uppercase tracking-[0.3em] text-[var(--accent-primary)] transition hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)]"
          >
            {t('hero.listen')}
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
          {t('mission.title')}
        </h2>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          {t('mission.description')}
        </p>
        <ul className="list-disc space-y-3 pl-5 text-sm text-[var(--text-secondary)] md:text-base">
          <li>{t('currentFocus.items.webAudio')}</li>
          <li>{t('currentFocus.items.streaming')}</li>
          <li>{t('currentFocus.items.archiving')}</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
          {t('highlights.featured')}
        </h3>
        <div className="space-y-3 text-sm text-[var(--text-secondary)] md:text-base">
          <Link href="/lab/breakbeat-generator" className="block cursor-pointer underline-offset-4 hover:underline">
            {t('highlights.breakbeatLab.title')}
          </Link>
          <Link href="/archive" className="block cursor-pointer underline-offset-4 hover:underline">
            {t('highlights.tapeArchive.title')}
          </Link>
          <Link href="/samples" className="block cursor-pointer underline-offset-4 hover:underline">
            {t('highlights.samples.title')}
          </Link>
        </div>
      </section>
    </ContentLayout>
  );
}
