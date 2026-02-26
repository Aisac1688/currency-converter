import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { getPostsByCategory, getAllCategoriesWithCount } from '@/lib/blog';
import { getAllCategorySlugs, getCategoryDisplay } from '@/lib/blog-categories';
import { Link } from '@/i18n/navigation';
import StructuredData, { buildBreadcrumbSchema } from '@/components/seo/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  for (const locale of locales) {
    for (const slug of getAllCategorySlugs()) {
      params.push({ locale, category: slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const displayName = getCategoryDisplay(category, locale);
  const title = locale === 'ko'
    ? `${displayName} — 환율 블로그`
    : `${displayName} — Exchange Rate Blog`;
  const description = locale === 'ko'
    ? `${displayName} 카테고리의 환율, 환전, 해외 송금 관련 글 모음.`
    : `Articles about exchange rates, currency conversion, and international transfers in the ${displayName} category.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog/category/${category}`,
      languages: {
        ko: `/ko/blog/category/${category}`,
        en: `/en/blog/category/${category}`,
        'x-default': `/ko/blog/category/${category}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'hwanyul.com',
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const posts = getPostsByCategory(locale, category);
  const displayName = getCategoryDisplay(category, locale);
  const categories = getAllCategoriesWithCount(locale);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: locale === 'ko' ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: locale === 'ko' ? '블로그' : 'Blog', url: `${SITE_URL}/${locale}/blog` },
    { name: displayName, url: `${SITE_URL}/${locale}/blog/category/${category}` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <StructuredData data={breadcrumbSchema} />
      <Link href="/blog" className="mb-6 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
        &larr; {t('backToList')}
      </Link>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
        {displayName}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {locale === 'ko' ? `${posts.length}개의 글` : `${posts.length} articles`}
      </p>

      {/* 카테고리 pills */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          {locale === 'ko' ? '전체' : 'All'}
        </Link>
        {categories.map(c => (
          <Link
            key={c.slug}
            href={`/blog/category/${c.slug}`}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              c.slug === category
                ? 'bg-blue-600 text-white'
                : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            {getCategoryDisplay(c.slug, locale)} ({c.count})
          </Link>
        ))}
      </div>

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
