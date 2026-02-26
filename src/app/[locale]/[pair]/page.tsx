import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { POPULAR_PAIRS, pairToSlug, slugToPair } from '@/lib/pairs';
import { fetchRates, getRate } from '@/lib/exchange-rates';
import { getCurrency } from '@/lib/currencies';
import { formatCurrency, formatDate } from '@/lib/format';
import CurrencyConverter from '@/components/converter/CurrencyConverter';
import RateChart from '@/components/converter/RateChart';
import StructuredData from '@/components/seo/StructuredData';
import { Link } from '@/i18n/navigation';

export function generateStaticParams() {
  const params: { locale: string; pair: string }[] = [];
  for (const locale of locales) {
    for (const [from, to] of POPULAR_PAIRS) {
      params.push({ locale, pair: pairToSlug(from, to) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}): Promise<Metadata> {
  const { locale, pair } = await params;
  const parsed = slugToPair(pair);
  if (!parsed) return {};
  const [from, to] = parsed;
  const rates = await fetchRates();
  const rate = getRate(from, to, rates);
  const fromC = getCurrency(from);
  const toC = getCurrency(to);

  const title = locale === 'ko'
    ? `${fromC?.nameKo} → ${toC?.nameKo} 환율 계산기 | 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}`
    : `${fromC?.name} to ${toC?.name} | 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}`;

  const description = locale === 'ko'
    ? `${fromC?.nameKo}을(를) ${toC?.nameKo}(으)로 변환. 최신 환율: 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}.`
    : `Convert ${fromC?.name} to ${toC?.name}. Latest rate: 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/${pair}`,
      languages: { ko: `/ko/${pair}`, en: `/en/${pair}` },
    },
  };
}

export default async function PairPage({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}) {
  const { locale, pair } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pair');
  const parsed = slugToPair(pair);
  if (!parsed) return <div>Invalid currency pair</div>;

  const [from, to] = parsed;
  const rates = await fetchRates();
  const rate = getRate(from, to, rates);
  const fromC = getCurrency(from);
  const toC = getCurrency(to);

  const faqItems = [
    {
      question: t('faq.q1', { fromCode: from.toUpperCase(), toCode: to.toUpperCase() }),
      answer: t('faq.a1', { fromCode: from.toUpperCase(), toCode: to.toUpperCase(), rate: formatCurrency(rate) }),
    },
    {
      question: t('faq.q2', { fromName: fromC?.name ?? from, toName: toC?.name ?? to }),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3', { fromCode: from.toUpperCase(), toCode: to.toUpperCase() }),
      answer: t('faq.a3'),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <StructuredData type="faq" faqItems={faqItems} />

      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {fromC?.flag} {from.toUpperCase()} → {toC?.flag} {to.toUpperCase()}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {t('currentRate')}: <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
          1 {from.toUpperCase()} = {formatCurrency(rate)} {to.toUpperCase()}
        </span>
        <span className="ml-2 text-sm">({t('updated')}: {formatDate(new Date())})</span>
      </p>

      <CurrencyConverter rates={rates} defaultFrom={from} defaultTo={to} />

      {/* Rate Chart */}
      <section className="mt-8">
        <RateChart from={from} to={to} />
      </section>

      {/* Related Pairs */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {locale === 'ko' ? '관련 환율' : 'Related Rates'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_PAIRS
            .filter(([f, t]) => (f === from || t === from || f === to || t === to) && !(f === from && t === to))
            .slice(0, 8)
            .map(([f, t]) => (
              <Link
                key={`${f}-${t}`}
                href={`/${f}-to-${t}`}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                {getCurrency(f)?.flag} {f.toUpperCase()} → {getCurrency(t)?.flag} {t.toUpperCase()}
              </Link>
            ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {t('faq.title')}
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
