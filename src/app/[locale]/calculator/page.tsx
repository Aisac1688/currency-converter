import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchRates } from '@/lib/exchange-rates';
import { STOCK_TICKERS } from '@/lib/stock-tickers';
import { fetchStockQuote } from '@/lib/stock-api';
import OmniCalculator from '@/components/calculator/OmniCalculator';
import StructuredData, { buildBreadcrumbSchema, buildFaqSchema } from '@/components/seo/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

const FAQ_KO = [
  { question: '어떤 자산을 변환할 수 있나요?', answer: '150개 이상의 법정화폐, 10개 주요 암호화폐(BTC, ETH 등), 16개 글로벌 주식(AAPL, TSLA 등)을 지원합니다.' },
  { question: '주식 가격은 실시간인가요?', answer: '주식 가격은 매일 업데이트됩니다. 실시간 거래가가 아닌 참고용 데이터입니다.' },
  { question: '암호화폐 환율은 정확한가요?', answer: '암호화폐 환율은 매일 업데이트되는 공개 API 데이터를 사용합니다. 실제 거래소 가격과 소폭 차이가 있을 수 있습니다.' },
];

const FAQ_EN = [
  { question: 'What assets can I convert?', answer: 'We support 150+ fiat currencies, 10 major cryptocurrencies (BTC, ETH, etc.), and 16 global stocks (AAPL, TSLA, etc.).' },
  { question: 'Are stock prices real-time?', answer: 'Stock prices are updated daily. They are reference data, not real-time trading prices.' },
  { question: 'How accurate are crypto rates?', answer: 'Crypto rates use daily-updated open API data. There may be slight differences from actual exchange prices.' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';
  const title = isKo ? '통합 자산 계산기 | 환율·암호화폐·주식' : 'Universal Asset Calculator | Currency·Crypto·Stocks';
  const description = isKo
    ? '하나의 계산기로 환율, 비트코인, 주식을 동시에 변환하세요. 150개 통화 + 10개 암호화폐 + 16개 주식.'
    : 'Convert currencies, crypto, and stocks in one calculator. 150+ currencies + 10 crypto + 16 stocks.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/calculator`,
      languages: { ko: '/ko/calculator', en: '/en/calculator', 'x-default': '/ko/calculator' },
    },
    openGraph: { title, description, type: 'website', locale: isKo ? 'ko_KR' : 'en_US', siteName: 'hwanyul.com' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === 'ko';
  const faqItems = isKo ? FAQ_KO : FAQ_EN;

  const rates = await fetchRates();

  // 주식 가격을 병렬로 fetch
  const stockQuotes = await Promise.all(
    STOCK_TICKERS.map(async s => {
      const q = await fetchStockQuote(s.symbol);
      return { symbol: s.symbol.toLowerCase(), price: q?.current ?? 0 };
    }),
  );
  const stockPrices: Record<string, number> = {};
  for (const sq of stockQuotes) stockPrices[sq.symbol] = sq.price;

  const breadcrumb = buildBreadcrumbSchema([
    { name: isKo ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: isKo ? '통합 계산기' : 'Calculator', url: `${SITE_URL}/${locale}/calculator` },
  ]);
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <StructuredData data={breadcrumb} />
      <StructuredData data={faqSchema} />

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {isKo ? '통합 자산 계산기' : 'Universal Asset Calculator'}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {isKo
          ? '환율, 암호화폐, 주식을 하나의 계산기에서 변환하세요.'
          : 'Convert currencies, crypto, and stocks — all in one place.'}
      </p>

      <OmniCalculator rates={rates} stockPrices={stockPrices} />

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {isKo ? '자주 묻는 질문' : 'FAQ'}
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
