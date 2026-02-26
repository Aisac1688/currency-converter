'use client';

import { useState, useMemo } from 'react';
import { CURRENCIES } from '@/lib/currencies';
import { formatCurrency } from '@/lib/format';
import type { Rates } from '@/lib/exchange-rates';
import { useTranslations } from 'next-intl';

interface Props {
  rates: Rates;
  locale: string;
}

type SortKey = 'code' | 'name' | 'rate';

/** 검색/정렬 가능한 환율 테이블. */
export default function RatesTable({ rates, locale }: Props) {
  const t = useTranslations('rates');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('code');
  const [sortAsc, setSortAsc] = useState(true);

  const items = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = CURRENCIES
      .map(c => ({ ...c, rate: rates[c.code] ?? 0 }))
      .filter(c => c.rate > 0)
      .filter(c =>
        c.code.includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.nameKo.includes(q) ||
        c.symbol.toLowerCase().includes(q)
      );

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'code') cmp = a.code.localeCompare(b.code);
      else if (sortKey === 'name') {
        const aName = locale === 'ko' ? a.nameKo : a.name;
        const bName = locale === 'ko' ? b.nameKo : b.name;
        cmp = aName.localeCompare(bName);
      } else cmp = a.rate - b.rate;
      return sortAsc ? cmp : -cmp;
    });

    return filtered;
  }, [search, sortKey, sortAsc, rates, locale]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortAsc ? ' ↑' : ' ↓') : '';

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('search')}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm
            outline-none transition-colors placeholder:text-zinc-400
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
            dark:placeholder:text-zinc-500 dark:focus:border-blue-400 sm:max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <th
                onClick={() => handleSort('code')}
                className="cursor-pointer px-4 py-3 text-left font-semibold text-zinc-600 transition-colors
                  hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {t('code')}{arrow('code')}
              </th>
              <th
                onClick={() => handleSort('name')}
                className="cursor-pointer px-4 py-3 text-left font-semibold text-zinc-600 transition-colors
                  hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {t('currency')}{arrow('name')}
              </th>
              <th
                onClick={() => handleSort('rate')}
                className="cursor-pointer px-4 py-3 text-right font-semibold text-zinc-600 transition-colors
                  hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                1 USD ={arrow('rate')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map(c => (
              <tr key={c.code} className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="mr-2">{c.flag}</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                    {c.code.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {locale === 'ko' ? c.nameKo : c.name}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(c.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
        {t('showing', { count: items.length })}
      </p>
    </div>
  );
}
