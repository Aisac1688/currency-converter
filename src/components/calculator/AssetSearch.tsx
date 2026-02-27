'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { CURRENCIES } from '@/lib/currencies';
import { CRYPTO_CURRENCIES } from '@/lib/crypto-currencies';
import { STOCK_TICKERS } from '@/lib/stock-tickers';

export type AssetType = 'currency' | 'crypto' | 'stock';
export interface Asset {
  type: AssetType;
  code: string;
  name: string;
  nameKo: string;
  icon: string;
}

function buildAssetList(): Asset[] {
  const assets: Asset[] = [];
  for (const c of CURRENCIES) assets.push({ type: 'currency', code: c.code, name: c.name, nameKo: c.nameKo, icon: c.flag });
  for (const c of CRYPTO_CURRENCIES) assets.push({ type: 'crypto', code: c.code, name: c.name, nameKo: c.nameKo, icon: c.flag });
  for (const s of STOCK_TICKERS) assets.push({ type: 'stock', code: s.symbol.toLowerCase(), name: s.name, nameKo: s.nameKo, icon: '📈' });
  return assets;
}

const ALL_ASSETS = buildAssetList();

interface Props {
  value: string;
  onChange: (asset: Asset) => void;
  label: string;
}

/** 통합 자산 검색 드롭다운 (통화 + 크립토 + 주식). */
export default function AssetSearch({ value, onChange, label }: Props) {
  const locale = useLocale();
  const isKo = locale === 'ko';
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = ALL_ASSETS.find(a => a.code === value.toLowerCase());

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = search.toLowerCase();
  const filtered = q
    ? ALL_ASSETS.filter(a => a.code.includes(q) || a.name.toLowerCase().includes(q) || a.nameKo.includes(q)).slice(0, 30)
    : ALL_ASSETS.slice(0, 30);

  const typeLabel = (t: AssetType) => {
    if (t === 'currency') return isKo ? '통화' : 'Currency';
    if (t === 'crypto') return isKo ? '암호화폐' : 'Crypto';
    return isKo ? '주식' : 'Stock';
  };

  return (
    <div className="relative flex flex-col gap-1.5" ref={ref}>
      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</label>
      <button type="button" onClick={() => setOpen(!open)}
        className="flex h-12 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-left transition-colors hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
        <span className="text-xl">{selected?.icon}</span>
        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{selected?.code.toUpperCase() ?? '---'}</span>
        <span className="flex-1 truncate text-sm text-zinc-500 dark:text-zinc-400">{selected ? (isKo ? selected.nameKo : selected.name) : ''}</span>
      </button>

      {open && (
        <div className="absolute top-[4.5rem] z-50 w-full max-w-sm rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="p-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} autoFocus
              placeholder={isKo ? '통화, 암호화폐, 주식 검색...' : 'Search currency, crypto, stock...'}
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100" />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map(a => (
              <button key={`${a.type}-${a.code}`} type="button"
                onClick={() => { onChange(a); setOpen(false); setSearch(''); }}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${a.code === value ? 'bg-blue-50 dark:bg-blue-950' : ''}`}>
                <span className="text-lg">{a.icon}</span>
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{a.code.toUpperCase()}</span>
                <span className="flex-1 truncate text-zinc-500 dark:text-zinc-400">{isKo ? a.nameKo : a.name}</span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-400 dark:bg-zinc-800">{typeLabel(a.type)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
