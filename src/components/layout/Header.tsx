import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';
import ThemeToggle from './ThemeToggle';

/** 사이트 헤더. 로고 + 네비게이션 + 언어/테마 전환. */
export default function Header() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="text-xl">💱</span>
          <span>CurrencyCalc</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
            {t('converter')}
          </Link>
          <Link href="/rates" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
            {t('rates')}
          </Link>
          <Link href="/blog" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
            {t('blog')}
          </Link>
          <ThemeToggle />
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
