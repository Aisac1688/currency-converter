import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import TravelBudgetCalculator from '@/components/travel/TravelBudgetCalculator';
import StructuredData, { buildBreadcrumbSchema, buildFaqSchema } from '@/components/seo/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

const FAQ_KO = [
  { question: '여행 예산은 어떻게 계산되나요?', answer: '각 국가의 평균 숙박비, 식비, 교통비, 관광비를 USD 기준으로 산출한 후, 현재 환율로 원화 환산합니다. 절약/보통/럭셔리 3단계로 구분됩니다.' },
  { question: '표시된 예산은 정확한가요?', answer: '평균적인 여행 경비를 기반으로 한 추정치입니다. 실제 비용은 시즌, 지역, 개인 소비 패턴에 따라 달라질 수 있습니다.' },
  { question: '항공권 비용은 포함되어 있나요?', answer: '항공권은 출발지와 시기에 따라 크게 변동되므로 포함되어 있지 않습니다. 숙박, 식비, 교통, 관광/활동 비용만 계산됩니다.' },
];

const FAQ_EN = [
  { question: 'How is the travel budget calculated?', answer: 'Average daily costs for accommodation, food, transport, and activities are estimated in USD, then converted to KRW at current exchange rates. Three tiers: Budget, Mid-range, and Luxury.' },
  { question: 'How accurate are these estimates?', answer: 'These are estimates based on average travel costs. Actual expenses vary by season, location, and personal spending habits.' },
  { question: 'Are flight costs included?', answer: 'Flights are not included as they vary greatly by origin and timing. Only accommodation, food, transport, and activity costs are calculated.' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';
  const title = isKo ? '여행 예산 계산기' : 'Travel Budget Calculator';
  const description = isKo
    ? '12개국 여행 예산을 현재 환율로 계산하세요. 숙박, 식비, 교통, 관광 항목별 예상 비용.'
    : 'Calculate travel budgets for 12 countries at current exchange rates. Breakdown by accommodation, food, transport, and activities.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/travel-budget`,
      languages: { ko: '/ko/travel-budget', en: '/en/travel-budget', 'x-default': '/ko/travel-budget' },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
      siteName: 'hwanyul.com',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function TravelBudgetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isKo = locale === 'ko';
  const faqItems = isKo ? FAQ_KO : FAQ_EN;

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: isKo ? '홈' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: isKo ? '여행 예산' : 'Travel Budget', url: `${SITE_URL}/${locale}/travel-budget` },
  ]);
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {isKo ? '여행 예산 계산기' : 'Travel Budget Calculator'}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {isKo
          ? '여행 국가, 일수, 스타일을 선택하면 현재 환율 기준 예상 비용을 확인할 수 있습니다.'
          : 'Select your destination, duration, and style to get an estimated budget at current rates.'}
      </p>

      <TravelBudgetCalculator />

      {/* FAQ 섹션 */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {isKo ? '자주 묻는 질문' : 'Frequently Asked Questions'}
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
