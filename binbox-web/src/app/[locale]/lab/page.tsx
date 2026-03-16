import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LabPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('lab');

  const experiments = [
    {
      title: t('experiments.breakbeatGenerator.title'),
      description: t('experiments.breakbeatGenerator.description'),
      href: '/lab/breakbeat-generator',
    },
    {
      title: t('experiments.breakSlicer.title'),
      description: t('experiments.breakSlicer.description'),
      href: '/lab/break-slicer',
    },
    {
      title: t('experiments.musicTheoryKeyboard.title'),
      description: t('experiments.musicTheoryKeyboard.description'),
      href: '/lab/music-theory-keyboard',
    },
  ];

  return (
    <Container className="space-y-10 py-16">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <div className="grid gap-6 md:grid-cols-2">
        {experiments.map((experiment, index) => (
          <Link
            key={index}
            href={experiment.href}
            className="cursor-pointer rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 transition hover:-translate-y-1 hover:border-[var(--border-hover)]"
          >
            <h3 className="text-xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
              {experiment.title}
            </h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {experiment.description}
            </p>
            <span className="mt-6 inline-flex text-xs uppercase tracking-[0.3em] text-[var(--accent-tertiary)]">
              {t('launch')}
            </span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
