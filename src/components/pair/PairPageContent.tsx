import { getTranslations } from 'next-intl/server';
import { getCurrency } from '@/lib/currencies';
import { isCryptoCode } from '@/lib/crypto-currencies';
import { CRYPTO_PAIRS } from '@/lib/crypto-pairs';
import { getRate, type Rates } from '@/lib/exchange-rates';
import { formatCurrency, formatDate } from '@/lib/format';
import { POPULAR_PAIRS, pairToSlug } from '@/lib/pairs';
import { getAmountsForPair } from '@/lib/amount-pairs';
import CurrencyConverter from '@/components/converter/CurrencyConverter';
import RateChart from '@/components/converter/RateChart';
import RateSignal from '@/components/pair/RateSignal';
import RateAlertButton from '@/components/alert/RateAlertButton';
import StructuredData, { buildFaqSchema, buildBreadcrumbSchema, buildWebAppSchema } from '@/components/seo/StructuredData';
import { Link } from '@/i18n/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

interface Props {
  locale: string;
  from: string;
  to: string;
  rates: Rates;
}

/** 통화쌍 페이지 콘텐츠. 암호화폐 쌍도 지원. */
export default async function PairPageContent({ locale, from, to, rates }: Props) {
  const t = await getTranslations('pair');
  const rate = getRate(from, to, rates);
  const fromC = getCurrency(from);
  const toC = getCurrency(to);
  const isCrypto = isCryptoCode(from) || isCryptoCode(to);

  let faqItems;
  if (isCrypto) {
    const ct = await getTranslations('cryptoPair');
    faqItems = [
      { question: t('faq.q1', { fromCode: from.toUpperCase(), toCode: to.toUpperCase() }), answer: t('faq.a1', { fromCode: from.toUpperCase(), toCode: to.toUpperCase(), rate: formatCurrency(rate) }) },
      { question: ct('faq.q2', { fromName: fromC?.name ?? from, toName: toC?.name ?? to }), answer: ct('faq.a2') },
      { question: ct('faq.q3', { fromCode: from.toUpperCase(), toCode: to.toUpperCase() }), answer: ct('faq.a3') },
    ];
  } else {
    faqItems = [
      { question: t('faq.q1', { fromCode: from.toUpperCase(), toCode: to.toUpperCase() }), answer: t('faq.a1', { fromCode: from.toUpperCase(), toCode: to.toUpperCase(), rate: formatCurrency(rate) }) },
      { question: t('faq.q2', { fromName: fromC?.name ?? from, toName: toC?.name ?? to }), answer: t('faq.a2') },
      { question: t('faq.q3', { fromCode: from.toUpperCase(), toCode: to.toUpperCase() }), answer: t('faq.a3') },
    ];
  }

  const faqSchema = buildFaqSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: locale === 'ko' ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: `${from.toUpperCase()} → ${to.toUpperCase()}`, url: `${SITE_URL}/${locale}/${pairToSlug(from, to)}` },
  ]);
  const webAppSchema = buildWebAppSchema(locale);

  const amountsForPair = getAmountsForPair(from, to);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <StructuredData data={faqSchema} />
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={webAppSchema} />

      <h1 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {fromC?.flag} {from.toUpperCase()} → {toC?.flag} {to.toUpperCase()}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {t('currentRate')}: <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">1 {from.toUpperCase()} = {formatCurrency(rate)} {to.toUpperCase()}</span>
        <span className="ml-2 text-sm">({t('updated')}: {formatDate(new Date())})</span>
      </p>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <RateSignal from={from} to={to} />
        <RateAlertButton from={from} to={to} currentRate={rate} />
      </div>

      <CurrencyConverter rates={rates} defaultFrom={from} defaultTo={to} />

      <section className="mt-8">
        <RateChart from={from} to={to} />
      </section>

      {/* 인기 금액 변환 */}
      {amountsForPair.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {locale === 'ko' ? '인기 금액 변환' : 'Popular Amount Conversions'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {amountsForPair.slice(0, 8).map(amount => (
              <Link
                key={amount}
                href={`/${amount}-${from}-to-${to}`}
                className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                {amount.toLocaleString()} {from.toUpperCase()} → {to.toUpperCase()}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 관련 환율 */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {locale === 'ko' ? '관련 환율' : 'Related Rates'}
        </h2>
        <div className="flex flex-wrap gap-2">
          {[...POPULAR_PAIRS, ...CRYPTO_PAIRS].filter(([f, t]) => (f === from || t === from || f === to || t === to) && !(f === from && t === to)).slice(0, 8).map(([f, t]) => (
            <Link key={`${f}-${t}`} href={`/${f}-to-${t}`} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800">
              {getCurrency(f)?.flag} {f.toUpperCase()} → {getCurrency(t)?.flag} {t.toUpperCase()}
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{t('faq.title')}</h2>
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
