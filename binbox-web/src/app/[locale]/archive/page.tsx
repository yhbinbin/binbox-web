import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import ContentLayout from '@/components/layout/ContentLayout';
import { getArchivePosts } from '@/lib/archive';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ArchivePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('archive');
  const posts = getArchivePosts();

  return (
    <ContentLayout className="space-y-10">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
          {t('eyebrow')}
        </p>
        <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)] md:text-4xl">
          {t('title')}
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          {t('description')}
        </p>
      </header>

      <div className="space-y-6">
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--text-secondary)] md:text-base">
            No entries yet. Drop your first archive note into
            <span className="font-mono text-[var(--accent-secondary)]"> content/archive</span>.
          </p>
        ) : (
          posts.map((post) => (
            <article key={post.slug} className="space-y-2">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] md:text-2xl">
                <Link
                  href={`/archive/${post.slug}`}
                  className="cursor-pointer underline-offset-4 hover:underline"
                >
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {post.frontmatter.date}
              </p>
              <p className="text-sm text-[var(--text-secondary)] md:text-base">
                {post.frontmatter.description}
              </p>
            </article>
          ))
        )}
      </div>
    </ContentLayout>
  );
}
