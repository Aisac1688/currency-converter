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
  const description = locale === 'ko'
    ? 'hwanyul.com은 150개 이상 통화의 실시간 환율 정보를 무료로 제공하는 서비스입니다.'
    : 'hwanyul.com provides free real-time exchange rate information for over 150 currencies.';

  return {
    title: locale === 'ko' ? '소개' : 'About',
    description,
    alternates: { canonical: `/${locale}/about`, languages: { ko: '/ko/about', en: '/en/about', 'x-default': '/ko/about' } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {t('title')}
      </h1>
      <div className="space-y-4 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>{t('p1')}</p>
        <p>{t('p2')}</p>
        <p>{t('p3')}</p>

        <h2 className="pt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{t('featuresTitle')}</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>{t('f1')}</li>
          <li>{t('f2')}</li>
          <li>{t('f3')}</li>
          <li>{t('f4')}</li>
        </ul>

        <h2 className="pt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{t('dataTitle')}</h2>
        <p>{t('dataDesc')}</p>

        <h2 className="pt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{t('contactTitle')}</h2>
        <p>{t('contactDesc')}</p>
      </div>
    </div>
  );
}
