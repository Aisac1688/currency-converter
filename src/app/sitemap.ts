import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { POPULAR_PAIRS, pairToSlug } from '@/lib/pairs';
import { getAllSlugs } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://currencycalc.com';

/** 전체 페이지 사이트맵 생성. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    });

    entries.push({
      url: `${SITE_URL}/${locale}/rates`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    });

    entries.push({
      url: `${SITE_URL}/${locale}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const page of ['about', 'privacy', 'contact']) {
      entries.push({
        url: `${SITE_URL}/${locale}/${page}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.3,
      });
    }

    for (const [from, to] of POPULAR_PAIRS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${pairToSlug(from, to)}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.7,
      });
    }

    for (const slug of getAllSlugs(locale)) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
