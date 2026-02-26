'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

/** 한국어/영어 전환 토글. */
export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const next = locale === 'ko' ? 'en' : 'ko';
    router.replace(pathname, { locale: next });
  }

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm font-medium
        text-zinc-600 transition-colors hover:bg-zinc-50
        dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
      aria-label="Switch language"
    >
      {locale === 'ko' ? '🇺🇸 EN' : '🇰🇷 KO'}
    </button>
  );
}
