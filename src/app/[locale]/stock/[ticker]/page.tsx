import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { STOCK_TICKERS, getStock, getAllStockSlugs } from '@/lib/stock-tickers';
import { fetchStockQuote } from '@/lib/stock-api';
import { fetchRates } from '@/lib/exchange-rates';
import { formatCurrency } from '@/lib/format';
import StockPriceCard from '@/components/stock/StockPriceCard';
import StockConverter from '@/components/stock/StockConverter';
import StructuredData, { buildBreadcrumbSchema, buildFaqSchema } from '@/components/seo/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { locale: string; ticker: string }[] = [];
  for (const locale of locales) {
    for (const slug of getAllStockSlugs()) {
      params.push({ locale, ticker: slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; ticker: string }>;
}): Promise<Metadata> {
  const { locale, ticker } = await params;
  const stock = getStock(ticker);
  if (!stock) return {};
  const quote = await fetchStockQuote(stock.symbol);
  const isKo = locale === 'ko';
  const price = quote ? `$${formatCurrency(quote.current)}` : '';

  const title = isKo
    ? `${stock.nameKo}(${stock.symbol}) 주가 환율 변환기 | ${price}`
    : `${stock.name} (${stock.symbol}) Stock Price Converter | ${price}`;
  const description = isKo
    ? `${stock.nameKo} 주식 가격을 원화, 달러, 엔화로 변환하세요. 현재가: ${price}.`
    : `Convert ${stock.name} stock price to KRW, USD, JPY, EUR. Current price: ${price}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/stock/${ticker}`,
      languages: { ko: `/ko/stock/${ticker}`, en: `/en/stock/${ticker}`, 'x-default': `/ko/stock/${ticker}` },
    },
    openGraph: { title, description, type: 'website', locale: isKo ? 'ko_KR' : 'en_US', siteName: 'hwanyul.com' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function StockPage({
  params,
}: {
  params: Promise<{ locale: string; ticker: string }>;
}) {
  const { locale, ticker } = await params;
  setRequestLocale(locale);
  const stock = getStock(ticker);
  if (!stock) return <div className="py-12 text-center text-zinc-500">Stock not found</div>;

  const [quote, rates] = await Promise.all([fetchStockQuote(stock.symbol), fetchRates()]);
  if (!quote) return <div className="py-12 text-center text-zinc-500">Quote unavailable</div>;

  const isKo = locale === 'ko';
  const krwValue = formatCurrency(quote.current * (rates['krw'] ?? 1300));

  const breadcrumb = buildBreadcrumbSchema([
    { name: isKo ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: isKo ? '주식' : 'Stocks', url: `${SITE_URL}/${locale}/stock/${ticker}` },
    { name: stock.symbol, url: `${SITE_URL}/${locale}/stock/${ticker}` },
  ]);

  const faqItems = [
    {
      question: isKo ? `${stock.nameKo} 1주는 한국 원화로 얼마인가요?` : `How much is 1 share of ${stock.name} in KRW?`,
      answer: isKo ? `현재 ${stock.nameKo} 1주는 약 ${krwValue}원입니다.` : `1 share of ${stock.name} is approximately ${krwValue} KRW.`,
    },
    {
      question: isKo ? `${stock.nameKo} 주식은 어디서 구매하나요?` : `Where can I buy ${stock.name} stock?`,
      answer: isKo ? '해외 주식은 키움증권, 미래에셋, 토스증권 등 국내 증권사 해외주식 서비스를 통해 구매할 수 있습니다.' : 'You can buy international stocks through brokerages like Robinhood, Interactive Brokers, or your local securities firm.',
    },
  ];
  const faqSchema = buildFaqSchema(faqItems);

  const relatedStocks = STOCK_TICKERS.filter(s => s.symbol !== stock.symbol && s.sector === stock.sector).slice(0, 4);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <StructuredData data={breadcrumb} />
      <StructuredData data={faqSchema} />

      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {isKo ? `${stock.nameKo} (${stock.symbol})` : `${stock.name} (${stock.symbol})`}
      </h1>
      <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        {stock.exchange} · {isKo ? stock.sectorKo : stock.sector}
      </p>

      <div className="space-y-6">
        <StockPriceCard stock={stock} quote={quote} locale={locale} />
        <StockConverter stockSymbol={stock.symbol} stockName={stock.name} stockNameKo={stock.nameKo} priceUsd={quote.current} rates={rates} />
      </div>

      {/* 관련 종목 */}
      {relatedStocks.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {isKo ? '같은 섹터 종목' : 'Related Stocks'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedStocks.map(s => (
              <a key={s.symbol} href={`/${locale}/stock/${s.symbol.toLowerCase()}`}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
                {s.symbol} — {isKo ? s.nameKo : s.name}
              </a>
            ))}
          </div>
        </section>
      )}

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
