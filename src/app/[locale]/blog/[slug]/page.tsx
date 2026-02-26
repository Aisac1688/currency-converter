import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { marked } from 'marked';
import { locales } from '@/i18n/config';
import { getPost, getAllSlugs, getAllPosts } from '@/lib/blog';
import { getCategoryDisplay } from '@/lib/blog-categories';
import { Link } from '@/i18n/navigation';
import StructuredData, { buildBlogPostingSchema, buildBreadcrumbSchema } from '@/components/seo/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of getAllSlugs(locale)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale, slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: { ko: `/ko/blog/${slug}`, en: `/en/blog/${slug}`, 'x-default': `/ko/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      siteName: 'hwanyul.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blog');
  const post = getPost(locale, slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="text-zinc-500">{t('notFound')}</p>
        <Link href="/blog" className="mt-4 inline-block text-blue-600 hover:underline">
          {t('backToList')}
        </Link>
      </div>
    );
  }

  const html = await marked(post.content);
  const postUrl = `${SITE_URL}/${locale}/blog/${slug}`;

  const blogSchema = buildBlogPostingSchema({
    title: post.title,
    description: post.description,
    date: post.date,
    url: postUrl,
    locale,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: locale === 'ko' ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: locale === 'ko' ? '블로그' : 'Blog', url: `${SITE_URL}/${locale}/blog` },
    { name: post.title, url: postUrl },
  ]);

  const allPosts = getAllPosts(locale);
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.categorySlug === post.categorySlug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <StructuredData data={blogSchema} />
      <StructuredData data={breadcrumbSchema} />

      <div className="mb-8">
        <Link href="/blog" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          &larr; {t('backToList')}
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
          <time dateTime={post.date}>{post.date}</time>
          {post.categorySlug && (
            <Link
              href={`/blog/category/${post.categorySlug}`}
              className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-100
                dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
            >
              {getCategoryDisplay(post.categorySlug, locale)}
            </Link>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">{post.description}</p>
      </header>

      <div
        className="prose prose-zinc max-w-none dark:prose-invert
          prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* 환율 계산기 CTA */}
      <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6 text-center dark:border-blue-900 dark:bg-blue-950/50">
        <p className="mb-3 text-sm font-medium text-blue-800 dark:text-blue-300">
          {locale === 'ko' ? '지금 바로 환율을 확인해보세요' : 'Check exchange rates now'}
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {locale === 'ko' ? '환율 계산기 바로가기' : 'Go to Currency Converter'}
        </Link>
      </div>

      {/* 관련 글 */}
      {relatedPosts.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {locale === 'ko' ? '관련 글' : 'Related Articles'}
          </h2>
          <div className="space-y-3">
            {relatedPosts.map(rp => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50
                  dark:border-zinc-800 dark:hover:bg-zinc-900/50"
              >
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{rp.title}</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{rp.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
