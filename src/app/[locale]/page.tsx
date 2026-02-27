import { setRequestLocale } from 'next-intl/server';
import SearchHero from '@/components/search/SearchHero';
import { fetchRates } from '@/lib/exchange-rates';
import { STOCK_TICKERS } from '@/lib/stock-tickers';
import { fetchStockQuote } from '@/lib/stock-api';
import StructuredData, { buildWebAppSchema } from '@/components/seo/StructuredData';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const rates = await fetchRates();

  // 주식 가격 병렬 fetch
  const stockQuotes = await Promise.all(
    STOCK_TICKERS.map(async s => {
      const q = await fetchStockQuote(s.symbol);
      return { symbol: s.symbol.toLowerCase(), price: q?.current ?? 0 };
    }),
  );
  const stockPrices: Record<string, number> = {};
  for (const sq of stockQuotes) stockPrices[sq.symbol] = sq.price;

  return (
    <div className="min-h-[80vh]">
      <StructuredData data={buildWebAppSchema(locale)} />
      <SearchHero rates={rates} stockPrices={stockPrices} />
    </div>
  );
}
