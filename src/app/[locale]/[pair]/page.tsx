import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/config';
import { POPULAR_PAIRS, pairToSlug, parseSlug, amountPairToSlug } from '@/lib/pairs';
import { getAllAmountSlugs } from '@/lib/amount-pairs';
import { fetchRates, convert, getRate } from '@/lib/exchange-rates';
import { getCurrency } from '@/lib/currencies';
import { formatCurrency } from '@/lib/format';
import PairPageContent from '@/components/pair/PairPageContent';
import AmountPageContent from '@/components/amount/AmountPageContent';

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { locale: string; pair: string }[] = [];
  for (const locale of locales) {
    for (const [from, to] of POPULAR_PAIRS) {
      params.push({ locale, pair: pairToSlug(from, to) });
    }
    for (const { from, to, amount } of getAllAmountSlugs()) {
      params.push({ locale, pair: amountPairToSlug(amount, from, to) });
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
  const parsed = parseSlug(pair);
  if (!parsed) return {};

  const rates = await fetchRates();
  const { from, to } = parsed;
  const fromC = getCurrency(from);
  const toC = getCurrency(to);

  if (parsed.type === 'amount') {
    const result = convert(parsed.amount, from, to, rates);
    const fmtAmt = parsed.amount.toLocaleString();
    const fmtResult = formatCurrency(result);
    const title = locale === 'ko'
      ? `${fmtAmt} ${from.toUpperCase()} = ${fmtResult} ${to.toUpperCase()} | ${fromC?.nameKo} → ${toC?.nameKo}`
      : `${fmtAmt} ${from.toUpperCase()} to ${to.toUpperCase()} = ${fmtResult} | Convert Now`;
    const description = locale === 'ko'
      ? `${fmtAmt} ${fromC?.nameKo}(${from.toUpperCase()})는 ${toC?.nameKo}(${to.toUpperCase()})로 약 ${fmtResult}입니다. 실시간 환율 계산기.`
      : `${fmtAmt} ${fromC?.name} equals ${fmtResult} ${to.toUpperCase()}. Free real-time currency converter.`;
    return {
      title, description,
      alternates: {
        canonical: `/${locale}/${pair}`,
        languages: { ko: `/ko/${pair}`, en: `/en/${pair}`, 'x-default': `/ko/${pair}` },
      },
    };
  }

  const rate = getRate(from, to, rates);
  const title = locale === 'ko'
    ? `${fromC?.nameKo} → ${toC?.nameKo} 환율 계산기 | 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}`
    : `${fromC?.name} to ${toC?.name} | 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}`;
  const description = locale === 'ko'
    ? `${fromC?.nameKo}을(를) ${toC?.nameKo}(으)로 변환. 최신 환율: 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}.`
    : `Convert ${fromC?.name} to ${toC?.name}. Latest rate: 1 ${from.toUpperCase()} = ${formatCurrency(rate)} ${to.toUpperCase()}.`;
  return {
    title, description,
    alternates: {
      canonical: `/${locale}/${pair}`,
      languages: { ko: `/ko/${pair}`, en: `/en/${pair}`, 'x-default': `/ko/${pair}` },
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
  const parsed = parseSlug(pair);
  if (!parsed) return <div className="mx-auto max-w-3xl px-4 py-12 text-center text-zinc-500">Invalid currency pair</div>;

  const rates = await fetchRates();

  if (parsed.type === 'amount') {
    return <AmountPageContent locale={locale} amount={parsed.amount} from={parsed.from} to={parsed.to} rates={rates} />;
  }

  return <PairPageContent locale={locale} from={parsed.from} to={parsed.to} rates={rates} />;
}
