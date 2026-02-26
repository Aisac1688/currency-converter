import { setRequestLocale, getTranslations } from 'next-intl/server';
import CurrencyConverter from '@/components/converter/CurrencyConverter';
import Favorites from '@/components/converter/Favorites';
import { fetchRates, getRate } from '@/lib/exchange-rates';
import { getCurrency } from '@/lib/currencies';
import { formatCurrency } from '@/lib/format';
import { HOME_PAIRS, pairToSlug } from '@/lib/pairs';
import { Link } from '@/i18n/navigation';
import StructuredData, { buildWebAppSchema } from '@/components/seo/StructuredData';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const rates = await fetchRates();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <StructuredData data={buildWebAppSchema(locale)} />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          {t('converter.title')}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {t('converter.subtitle')}
        </p>
      </div>

      <CurrencyConverter rates={rates} />

      <section className="mt-8">
        <Favorites rates={rates} />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t('popular.title')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_PAIRS.map(([from, to]) => {
            const rate = getRate(from, to, rates);
            const fromC = getCurrency(from);
            const toC = getCurrency(to);
            return (
              <Link
                key={`${from}-${to}`}
                href={`/${pairToSlug(from, to)}`}
                className="rounded-xl border border-zinc-200 bg-white p-4 transition-shadow hover:shadow-md
                  dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>{fromC?.flag}</span>
                  <span>{from.toUpperCase()}</span>
                  <span>→</span>
                  <span>{toC?.flag}</span>
                  <span>{to.toUpperCase()}</span>
                </div>
                <div className="mt-1 font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(rate)}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
