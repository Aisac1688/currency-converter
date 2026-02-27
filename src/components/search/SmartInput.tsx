'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const EXAMPLE_QUERIES_KO = ['100 달러', '1 btc', 'aapl', '50000 엔', '100 usd to krw'];
const EXAMPLE_QUERIES_EN = ['100 usd', '1 btc', 'aapl', '1000 eur', '100 usd to jpy'];

/** Google 스타일 단일 입력 필드. 타이핑 즉시 파싱. */
export default function SmartInput({ value, onChange, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.773 4.773zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-14 pr-5 font-mono text-xl
            text-zinc-900 shadow-sm transition-shadow
            placeholder:font-sans placeholder:text-base placeholder:text-zinc-400
            focus:border-blue-400 focus:shadow-md focus:outline-none
            dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
            dark:placeholder:text-zinc-500 dark:focus:border-blue-500
            sm:h-16 sm:text-2xl"
        />
      </div>
    </div>
  );
}

export { EXAMPLE_QUERIES_KO, EXAMPLE_QUERIES_EN };
