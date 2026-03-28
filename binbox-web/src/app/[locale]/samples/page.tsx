import { getTranslations, setRequestLocale } from 'next-intl/server';
import ContentLayout from '@/components/layout/ContentLayout';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SamplesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('samples');

  return (
    <ContentLayout className="space-y-8">
      <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
        {t('eyebrow')}
      </p>
      <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)] md:text-4xl">
        {t('title')}
      </h1>
      <p className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
        {t('description')}
      </p>
      <p className="text-sm text-[var(--text-secondary)] md:text-base">
        {t('placeholder')}
      </p>
    </ContentLayout>
  );
}
