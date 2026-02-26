interface StructuredDataProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/** JSON-LD 구조화 데이터 삽입. */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** FAQPage 스키마 생성. */
export function buildFaqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** BlogPosting 스키마 생성. */
export function buildBlogPostingSchema(opts: {
  title: string;
  description: string;
  date: string;
  url: string;
  locale: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    datePublished: opts.date,
    dateModified: opts.date,
    author: { '@type': 'Organization', name: 'hwanyul.com', url: 'https://hwanyul.com' },
    publisher: {
      '@type': 'Organization',
      name: 'hwanyul.com',
      url: 'https://hwanyul.com',
      logo: { '@type': 'ImageObject', url: 'https://hwanyul.com/icon.svg' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': opts.url },
    inLanguage: opts.locale === 'ko' ? 'ko-KR' : 'en-US',
  };
}

/** WebApplication 스키마 생성. */
export function buildWebAppSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'ko' ? '환율 계산기' : 'Currency Converter',
    description: locale === 'ko'
      ? '150개 이상 통화의 실시간 환율 계산기'
      : 'Real-time currency converter for 150+ currencies',
    url: 'https://hwanyul.com',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

/** BreadcrumbList 스키마 생성. */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Organization + WebSite 스키마 생성. */
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'hwanyul.com',
    url: 'https://hwanyul.com',
    logo: 'https://hwanyul.com/icon.svg',
    description: '150개 이상 통화의 실시간 환율 계산기',
  };
}

export function buildWebSiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: locale === 'ko' ? '환율 - 환율 계산기' : 'Hwanyul - Currency Converter',
    url: 'https://hwanyul.com',
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `https://hwanyul.com/${locale}/rates?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}
