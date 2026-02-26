import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { getAllPosts } from '@/lib/blog';
import { Link } from '@/i18n/navigation';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko'
    ? '블로그 — 환율과 환전에 관한 유용한 정보'
    : 'Blog — Useful Information About Exchange Rates';
  const description = locale === 'ko'
    ? '환율, 환전, 해외 송금에 관한 최신 정보와 가이드를 확인하세요.'
    : 'Find the latest information and guides about exchange rates, currency conversion, and international transfers.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: { ko: '/ko/blog', en: '/en/blog' },
    },
  };
}

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getAllPosts(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mb-10 text-zinc-500 dark:text-zinc-400">{t('subtitle')}</p>

      {posts.length === 0 ? (
        <p className="text-zinc-400">{t('empty')}</p>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md
                dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="mb-2 flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
                <time dateTime={post.date}>{post.date}</time>
                {post.category && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-medium text-blue-600
                    dark:bg-blue-950 dark:text-blue-400">
                    {post.category}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {post.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
