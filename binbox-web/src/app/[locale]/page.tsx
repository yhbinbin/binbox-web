import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('home');

  const highlights = [
    {
      title: t('highlights.breakbeatLab.title'),
      description: t('highlights.breakbeatLab.description'),
      href: '/lab/breakbeat-generator',
    },
    {
      title: t('highlights.tapeArchive.title'),
      description: t('highlights.tapeArchive.description'),
      href: '/archive',
    },
    {
      title: t('highlights.samples.title'),
      description: t('highlights.samples.description'),
      href: '/samples',
    },
  ];

  return (
    <Container className="space-y-16 py-16">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.5em] text-[var(--accent-secondary)]">
          {t('hero.eyebrow')}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold uppercase tracking-[0.15em] text-[var(--accent-primary)] md:text-5xl">
          {t('hero.title')}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
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

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group cursor-pointer rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 transition hover:-translate-y-1 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
              {t('highlights.featured')}
            </p>
            <h3 className="mt-3 text-xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.description}
            </p>
            <span className="mt-6 inline-flex text-xs uppercase tracking-[0.3em] text-[var(--accent-tertiary)]">
              {t('highlights.open')}
            </span>
          </Link>
        ))}
      </section>

      <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <SectionHeading
          eyebrow={t('mission.eyebrow')}
          title={t('mission.title')}
          description={t('mission.description')}
        />
        <div className="space-y-4 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
            {t('currentFocus.title')}
          </p>
          <ul className="list-disc space-y-3 pl-5 text-sm text-[var(--text-secondary)]">
            <li>{t('currentFocus.items.webAudio')}</li>
            <li>{t('currentFocus.items.streaming')}</li>
            <li>{t('currentFocus.items.archiving')}</li>
          </ul>
        </div>
      </section>
    </Container>
  );
}
