import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { marked } from 'marked';
import { locales } from '@/i18n/config';
import { getPost, getAllSlugs } from '@/lib/blog';
import { Link } from '@/i18n/navigation';

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
      languages: { ko: `/ko/blog/${slug}`, en: `/en/blog/${slug}` },
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

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Link href="/blog" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          &larr; {t('backToList')}
        </Link>
      </div>

      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3 text-sm text-zinc-400 dark:text-zinc-500">
          <time dateTime={post.date}>{post.date}</time>
          {post.category && (
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600
              dark:bg-blue-950 dark:text-blue-400">
              {post.category}
            </span>
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
    </article>
  );
}
