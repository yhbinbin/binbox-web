import { setRequestLocale } from 'next-intl/server';
import Container from '@/components/ui/Container';
import MusicTheoryKeyboard from '@/components/lab/music-theory-keyboard/MusicTheoryKeyboard';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MusicTheoryKeyboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Container className="py-16">
      <MusicTheoryKeyboard />
    </Container>
  );
}
