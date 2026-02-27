'use client';

import { useState, useCallback } from 'react';
import { useLocale } from 'next-intl';
import AssetSearch, { type Asset } from './AssetSearch';
import ConversionResult from './ConversionResult';
import { convert, type Rates } from '@/lib/exchange-rates';
import { STOCK_TICKERS } from '@/lib/stock-tickers';
import { Link } from '@/i18n/navigation';

interface Props {
  rates: Rates;
  stockPrices: Record<string, number>;
}

const TARGET_CURRENCIES = [
  { code: 'krw', flag: '🇰🇷' },
  { code: 'usd', flag: '🇺🇸' },
  { code: 'jpy', flag: '🇯🇵' },
  { code: 'eur', flag: '🇪🇺' },
];

const QUICK_LINKS_KO = [
  { label: 'BTC → KRW', href: '/btc-to-krw' },
  { label: 'ETH → KRW', href: '/eth-to-krw' },
  { label: 'USD → KRW', href: '/usd-to-krw' },
  { label: 'JPY → KRW', href: '/jpy-to-krw' },
  { label: 'AAPL 주가', href: '/stock/aapl' },
  { label: 'TSLA 주가', href: '/stock/tsla' },
  { label: 'NVDA 주가', href: '/stock/nvda' },
  { label: 'EUR → KRW', href: '/eur-to-krw' },
];

const QUICK_LINKS_EN = [
  { label: 'BTC → USD', href: '/btc-to-usd' },
  { label: 'ETH → USD', href: '/eth-to-usd' },
  { label: 'USD → KRW', href: '/usd-to-krw' },
  { label: 'EUR → USD', href: '/eur-to-usd' },
  { label: 'AAPL Price', href: '/stock/aapl' },
  { label: 'TSLA Price', href: '/stock/tsla' },
  { label: 'NVDA Price', href: '/stock/nvda' },
  { label: 'GBP → USD', href: '/gbp-to-usd' },
];

/** 통합 자산 변환 계산기. 통화 + 크립토 + 주식 동시 변환. */
export default function OmniCalculator({ rates, stockPrices }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [amount, setAmount] = useState(1);
  const [asset, setAsset] = useState<Asset>({ type: 'currency', code: 'usd', name: 'US Dollar', nameKo: '미국 달러', icon: '🇺🇸' });

  const computeResults = useCallback(() => {
    if (!amount || amount <= 0) return [];

    let amountInUsd = 0;

    if (asset.type === 'stock') {
      const price = stockPrices[asset.code.toLowerCase()] ?? 0;
      amountInUsd = amount * price;
    } else {
      // currency 또는 crypto — rates에서 USD 기준으로 변환
      const fromRate = rates[asset.code.toLowerCase()];
      if (!fromRate) return [];
      amountInUsd = amount / fromRate;
    }

    return TARGET_CURRENCIES.map(t => ({
      code: t.code,
      flag: t.flag,
      value: amountInUsd * (rates[t.code] ?? 1),
    }));
  }, [amount, asset, rates, stockPrices]);

  const results = computeResults();
  const quickLinks = isKo ? QUICK_LINKS_KO : QUICK_LINKS_EN;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              {isKo ? '수량' : 'Amount'}
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="h-12 rounded-xl border border-zinc-200 bg-white px-4 font-mono text-lg
                focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </div>
          <AssetSearch
            value={asset.code}
            onChange={setAsset}
            label={isKo ? '자산 선택' : 'Select Asset'}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {isKo ? '변환 결과' : 'Conversion Results'}
        </h2>
        <ConversionResult results={results} sourceAmount={amount} sourceCode={asset.code} />
      </div>

      {/* 인기 변환 바로가기 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {isKo ? '인기 변환' : 'Popular Conversions'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
