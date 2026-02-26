import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { fetchRates } from '@/lib/exchange-rates';
import { formatDate } from '@/lib/format';
import RatesTable from '@/components/rates/RatesTable';

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
    ? '환율표 — 150개 이상 통화 실시간 환율 | CurrencyCalc'
    : 'Exchange Rates — 150+ Currencies Live Rates | CurrencyCalc';
  const description = locale === 'ko'
    ? '150개 이상 세계 통화의 최신 환율을 한눈에 확인하세요. 검색 및 정렬 지원.'
    : 'View the latest exchange rates for 150+ world currencies. Search and sort supported.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/rates`,
      languages: { ko: '/ko/rates', en: '/en/rates' },
    },
  };
}

export default async function RatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('rates');
  const rates = await fetchRates();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {t('subtitle')} <span className="text-sm">({t('updated')}: {formatDate(new Date())})</span>
        </p>
      </div>

      <RatesTable rates={rates} locale={locale} />
    </div>
  );
}
