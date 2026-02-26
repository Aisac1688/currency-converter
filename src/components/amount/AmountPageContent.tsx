import { getCurrency } from '@/lib/currencies';
import { type Rates } from '@/lib/exchange-rates';
import { formatDate } from '@/lib/format';
import { pairToSlug } from '@/lib/pairs';
import { generateAmountContent } from '@/lib/amount-content';
import CurrencyConverter from '@/components/converter/CurrencyConverter';
import QuickReferenceTable from './QuickReferenceTable';
import StructuredData, { buildFaqSchema, buildBreadcrumbSchema } from '@/components/seo/StructuredData';
import { Link } from '@/i18n/navigation';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

interface Props {
  locale: string;
  amount: number;
  from: string;
  to: string;
  rates: Rates;
}

/** 금액별 롱테일 SEO 페이지. */
export default function AmountPageContent({ locale, amount, from, to, rates }: Props) {
  const content = generateAmountContent(amount, from, to, rates, locale);
  const fromC = getCurrency(from);
  const toC = getCurrency(to);
  const isKo = locale === 'ko';
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: isKo ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: `${FROM} → ${TO}`, url: `${SITE_URL}/${locale}/${pairToSlug(from, to)}` },
    { name: `${amount.toLocaleString()} ${FROM}`, url: `${SITE_URL}/${locale}/${amount}-${from}-to-${to}` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <StructuredData data={buildFaqSchema(content.faqItems)} />
      <StructuredData data={breadcrumbSchema} />

      {/* 뒤로가기 */}
      <div className="mb-6">
        <Link href={`/${from}-to-${to}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          &larr; {fromC?.flag} {FROM} → {toC?.flag} {TO} {isKo ? '환율 페이지' : 'Exchange Rate'}
        </Link>
      </div>

      {/* Hero */}
      <section className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          {fromC?.flag} {content.heroAnswer} {toC?.flag}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isKo ? '마지막 업데이트' : 'Last updated'}: {formatDate(new Date())}
        </p>
      </section>

      {/* 계산기 */}
      <CurrencyConverter rates={rates} defaultFrom={from} defaultTo={to} defaultAmount={amount.toString()} />

      {/* 마이크로 콘텐츠 */}
      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {isKo ? '이 금액이 의미하는 것' : 'What this amount means'}
        </h2>
        <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">{content.contextParagraph}</p>

        {content.travelTip && (
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            💡 {content.travelTip}
          </p>
        )}

        {content.useCases.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {isKo ? '주요 용도' : 'Common use cases'}:
            </p>
            <div className="flex flex-wrap gap-2">
              {content.useCases.map(uc => (
                <span key={uc} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                  {uc}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 환산표 */}
      {content.quickReference.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {isKo ? '다른 금액 환산표' : 'Quick Reference Table'}
          </h2>
          <QuickReferenceTable items={content.quickReference} from={from} to={to} locale={locale} />
        </section>
      )}

      {/* FAQ */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {isKo ? '자주 묻는 질문' : 'Frequently Asked Questions'}
        </h2>
        <div className="space-y-4">
          {content.faqItems.map((item, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 환율 계산기 CTA */}
      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5 text-center dark:border-blue-900 dark:bg-blue-950/50">
        <p className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-300">
          {isKo ? '다른 금액도 계산해보세요' : 'Try other amounts'}
        </p>
        <Link
          href={`/${from}-to-${to}`}
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {isKo ? `${fromC?.nameKo} → ${toC?.nameKo} 계산기` : `${fromC?.name} to ${toC?.name} Converter`}
        </Link>
      </div>
    </div>
  );
}
