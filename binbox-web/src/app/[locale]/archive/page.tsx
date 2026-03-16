import { getTranslations, setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ArchivePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('archive');

  return (
    <Container className="space-y-10 py-16">
      <SectionHeading
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
      />
      <Alert variant="wip">
        <AlertTitle>{t('wip.title')}</AlertTitle>
        <AlertDescription>{t('wip.description')}</AlertDescription>
      </Alert>
    </Container>
  );
}
