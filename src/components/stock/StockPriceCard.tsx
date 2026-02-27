import type { StockQuote } from '@/lib/stock-api';
import type { StockTicker } from '@/lib/stock-tickers';
import { formatCurrency } from '@/lib/format';

interface Props {
  stock: StockTicker;
  quote: StockQuote;
  locale: string;
}

/** 주가 요약 카드. */
export default function StockPriceCard({ stock, quote, locale }: Props) {
  const isKo = locale === 'ko';
  const isUp = quote.change >= 0;
  const changeColor = isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const arrow = isUp ? '▲' : '▼';

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-zinc-100 px-2.5 py-1 font-mono text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {stock.symbol}
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {isKo ? stock.nameKo : stock.name}
        </span>
        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800">
          {stock.exchange}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          ${formatCurrency(quote.current)}
        </span>
        <span className={`text-sm font-medium ${changeColor}`}>
          {arrow} {Math.abs(quote.change).toFixed(2)} ({Math.abs(quote.changePercent).toFixed(2)}%)
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <span className="text-zinc-500 dark:text-zinc-400">{isKo ? '시가' : 'Open'}</span>
          <p className="font-mono font-medium text-zinc-900 dark:text-zinc-100">${formatCurrency(quote.open)}</p>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400">{isKo ? '전일종가' : 'Prev Close'}</span>
          <p className="font-mono font-medium text-zinc-900 dark:text-zinc-100">${formatCurrency(quote.prevClose)}</p>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400">{isKo ? '고가' : 'High'}</span>
          <p className="font-mono font-medium text-zinc-900 dark:text-zinc-100">${formatCurrency(quote.high)}</p>
        </div>
        <div>
          <span className="text-zinc-500 dark:text-zinc-400">{isKo ? '저가' : 'Low'}</span>
          <p className="font-mono font-medium text-zinc-900 dark:text-zinc-100">${formatCurrency(quote.low)}</p>
        </div>
      </div>
    </div>
  );
}
