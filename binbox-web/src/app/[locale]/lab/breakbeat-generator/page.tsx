import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import BreakbeatGenerator from '@/components/lab/breakbeat/BreakbeatGenerator';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BreakbeatGeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-16">
      <BreakbeatGenerator />
    </Container>
  );
}
