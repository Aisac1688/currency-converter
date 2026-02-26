import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** 사이트 푸터. 법적 페이지 링크 포함. */
export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <p>{t('source')}</p>
          <nav className="flex gap-4">
            <Link href="/about" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('about')}
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('privacy')}
            </Link>
            <Link href="/contact" className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">
              {t('contact')}
            </Link>
          </nav>
          <p>&copy; {new Date().getFullYear()} 환율. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
