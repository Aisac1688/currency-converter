import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { POPULAR_PAIRS, pairToSlug, amountPairToSlug } from '@/lib/pairs';
import { getAllAmountSlugs } from '@/lib/amount-pairs';
import { getAllSlugs } from '@/lib/blog';
import { getAllCategorySlugs } from '@/lib/blog-categories';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';

/** 전체 페이지 사이트맵 생성 (hreflang alternates 포함). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    // 홈
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: { languages: { ko: `${SITE_URL}/ko`, en: `${SITE_URL}/en` } },
    });

    // 환율표
    entries.push({
      url: `${SITE_URL}/${locale}/rates`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: { languages: { ko: `${SITE_URL}/ko/rates`, en: `${SITE_URL}/en/rates` } },
    });

    // 블로그 목록
    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { ko: `${SITE_URL}/ko/blog`, en: `${SITE_URL}/en/blog` } },
    });

    // 법적 페이지
    for (const page of ['about', 'privacy', 'contact']) {
      entries.push({
        url: `${SITE_URL}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.3,
        alternates: { languages: { ko: `${SITE_URL}/ko/${page}`, en: `${SITE_URL}/en/${page}` } },
      });
    }

    // 통화쌍 페이지
    for (const [from, to] of POPULAR_PAIRS) {
      const slug = pairToSlug(from, to);
      entries.push({
        url: `${SITE_URL}/${locale}/${slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: { languages: { ko: `${SITE_URL}/ko/${slug}`, en: `${SITE_URL}/en/${slug}` } },
      });
    }

    // 금액별 페이지
    for (const { from, to, amount } of getAllAmountSlugs()) {
      const slug = amountPairToSlug(amount, from, to);
      entries.push({
        url: `${SITE_URL}/${locale}/${slug}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.6,
        alternates: { languages: { ko: `${SITE_URL}/ko/${slug}`, en: `${SITE_URL}/en/${slug}` } },
      });
    }

    // 블로그 카테고리
    for (const cat of getAllCategorySlugs()) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/category/${cat}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: { languages: { ko: `${SITE_URL}/ko/blog/category/${cat}`, en: `${SITE_URL}/en/blog/category/${cat}` } },
      });
    }

    // 블로그 글
    for (const slug of getAllSlugs(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: { ko: `${SITE_URL}/ko/blog/${slug}`, en: `${SITE_URL}/en/blog/${slug}` } },
      });
    }
  }

  return entries;
}
