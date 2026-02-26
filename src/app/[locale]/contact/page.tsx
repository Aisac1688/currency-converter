import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '연락처' : 'Contact',
    alternates: { canonical: `/${locale}/contact`, languages: { ko: '/ko/contact', en: '/en/contact' } },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h1>
      <div className="space-y-4 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>{t('desc')}</p>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('emailTitle')}</h2>
          <p>{t('emailDesc')}</p>
          <a
            href="mailto:contact@currencycalc.com"
            className="mt-3 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white
              transition-colors hover:bg-blue-700"
          >
            contact@currencycalc.com
          </a>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{t('feedbackTitle')}</h2>
          <p>{t('feedbackDesc')}</p>
        </div>
      </div>
    </div>
  );
}
