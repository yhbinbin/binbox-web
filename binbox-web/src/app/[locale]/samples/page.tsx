import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function SamplesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('samples');

  return (
    <Container className="space-y-10 py-16">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 text-sm text-[var(--text-secondary)]">
        <p>{t('placeholder')}</p>
      </div>
    </Container>
  );
}
