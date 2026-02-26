export interface CategoryInfo {
  slug: string;
  ko: string;
  en: string;
}

/** 블로그 카테고리 정의 (slug ↔ 한/영 표시명). */
const CATEGORIES: CategoryInfo[] = [
  { slug: 'basics', ko: '환율 기초', en: 'Basics' },
  { slug: 'travel', ko: '여행', en: 'Travel' },
  { slug: 'tips', ko: '팁', en: 'Tips' },
  { slug: 'guides', ko: '가이드', en: 'Guides' },
  { slug: 'business', ko: '비즈니스', en: 'Business' },
  { slug: 'education', ko: '교육', en: 'Education' },
  { slug: 'investment', ko: '투자', en: 'Investment' },
  { slug: 'analysis', ko: '분석', en: 'Analysis' },
  { slug: 'comparison', ko: '비교', en: 'Comparison' },
  { slug: 'exchange-guide', ko: '환전 가이드', en: 'Exchange Guide' },
];

/** 카테고리 이름(frontmatter) → slug 역방향 맵. */
const NAME_TO_SLUG: Record<string, string> = {};
for (const c of CATEGORIES) {
  NAME_TO_SLUG[c.ko] = c.slug;
  NAME_TO_SLUG[c.en] = c.slug;
  // "Guide" → "Guides" 통합
  NAME_TO_SLUG['Guide'] = 'guides';
}

/** frontmatter의 category 문자열을 slug로 정규화. */
export function categoryNameToSlug(name: string): string {
  return NAME_TO_SLUG[name] ?? name.toLowerCase().replace(/\s+/g, '-');
}

/** slug로 카테고리 정보 조회. */
export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

/** 카테고리 표시명 반환. */
export function getCategoryDisplay(slug: string, locale: string): string {
  const cat = getCategoryBySlug(slug);
  if (!cat) return slug;
  return locale === 'ko' ? cat.ko : cat.en;
}

/** 전체 카테고리 slug 목록. */
export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map(c => c.slug);
}

export { CATEGORIES };
