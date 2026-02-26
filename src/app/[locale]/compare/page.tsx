import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import FeeComparisonTable from '@/components/compare/FeeComparisonTable';
import StructuredData, { buildBreadcrumbSchema, buildFaqSchema } from '@/components/seo/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

const FAQ_KO = [
  { question: '은행과 핀테크 서비스 환전 수수료 차이는 얼마나 되나요?', answer: '일반 은행은 스프레드 1.5~1.75%를 적용하는 반면, 카카오뱅크(0.2%), 토스(0.4%) 등 핀테크는 훨씬 저렴합니다. 10만원 환전 시 최대 1,500원 이상 차이가 날 수 있습니다.' },
  { question: '환전 수수료를 줄이려면 어떻게 해야 하나요?', answer: '핀테크 서비스를 활용하거나, 은행 환율 우대 쿠폰을 사용하세요. 대량 환전 시에는 와이즈(Wise)같은 해외 송금 서비스도 좋은 선택입니다.' },
  { question: '이 비교 데이터는 실시간인가요?', answer: '스프레드 비율은 각 은행/서비스의 일반 창구 기준 추정치이며, 환율은 실시간 API 데이터를 사용합니다. 실제 환전 시에는 해당 금융기관의 조건을 확인하세요.' },
];

const FAQ_EN = [
  { question: 'How much do exchange fees differ between banks and fintech?', answer: 'Traditional banks apply 1.5-1.75% spreads, while fintech services like Kakao Bank (0.2%) and Toss (0.4%) are much cheaper. For 100,000 KRW, you could save over 1,500 KRW.' },
  { question: 'How can I reduce exchange fees?', answer: 'Use fintech services, bank discount coupons, or international transfer services like Wise for larger amounts.' },
  { question: 'Is this comparison data real-time?', answer: 'Spread rates are estimates based on standard rates. Exchange rates use real-time API data. Check with your financial institution for actual rates.' },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === 'ko';
  const title = isKo ? '환전 수수료 비교' : 'Exchange Fee Comparison';
  const description = isKo
    ? '한국 은행 및 핀테크 서비스의 환전 수수료를 비교하고 가장 유리한 곳을 찾으세요.'
    : 'Compare exchange fees across Korean banks and fintech services to find the best rate.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/compare`,
      languages: { ko: '/ko/compare', en: '/en/compare', 'x-default': '/ko/compare' },
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

export default async function ComparePage({
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
    { name: isKo ? '수수료 비교' : 'Fee Comparison', url: `${SITE_URL}/${locale}/compare` },
  ]);
  const faqSchema = buildFaqSchema(faqItems);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <StructuredData data={breadcrumbSchema} />
      <StructuredData data={faqSchema} />

      <h1 className="mb-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
        {isKo ? '환전 수수료 비교' : 'Exchange Fee Comparison'}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {isKo
          ? '은행과 핀테크 서비스의 환전 수수료를 비교하여 가장 유리한 곳을 찾아보세요.'
          : 'Compare exchange fees across banks and fintech services to find the best deal.'}
      </p>

      <FeeComparisonTable />

      {/* FAQ 섹션 — 구조화 데이터 + 가시적 콘텐츠 */}
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
