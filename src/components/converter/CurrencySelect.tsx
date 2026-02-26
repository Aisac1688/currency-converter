'use client';

import { useState, useRef, useEffect } from 'react';
import { CURRENCIES, type Currency } from '@/lib/currencies';

interface CurrencySelectProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
}

/** 통화 선택 드롭다운. 검색 + 국기 표시. */
export default function CurrencySelect({ value, onChange, label }: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const selected = CURRENCIES.find(c => c.code === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = CURRENCIES.filter(c => {
    const q = search.toLowerCase();
    return c.code.includes(q) || c.name.toLowerCase().includes(q) || c.nameKo.includes(q);
  });

  function handleSelect(c: Currency) {
    onChange(c.code);
    setOpen(false);
    setSearch('');
  }

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      <label className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-12 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4
          text-left transition-colors hover:border-zinc-300
          dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
      >
        <span className="text-xl">{selected?.flag}</span>
        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
          {selected?.code.toUpperCase()}
        </span>
        <span className="flex-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
          {selected?.name}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="absolute z-50 mt-[4.5rem] w-full max-w-sm rounded-xl border border-zinc-200 bg-white
          shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search currency..."
              autoFocus
              className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none
                focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleSelect(c)}
                className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors
                  hover:bg-zinc-50 dark:hover:bg-zinc-800
                  ${c.code === value ? 'bg-blue-50 dark:bg-blue-950' : ''}`}
              >
                <span className="text-lg">{c.flag}</span>
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {c.code.toUpperCase()}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
