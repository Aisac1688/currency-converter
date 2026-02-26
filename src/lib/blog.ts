import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { categoryNameToSlug, getAllCategorySlugs } from './blog-categories';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  categorySlug: string;
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

/** 특정 로케일의 블로그 글 목록 (날짜 내림차순). */
export function getAllPosts(locale: string): BlogPost[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => getPost(locale, f.replace('.md', '')))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** 특정 블로그 글 조회. */
export function getPost(locale: string, slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, locale, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const category = data.category ?? '';
  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    category,
    categorySlug: categoryNameToSlug(category),
    content,
  };
}

/** 전체 슬러그 목록 (generateStaticParams용). */
export function getAllSlugs(locale: string): string[] {
  const dir = path.join(BLOG_DIR, locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

/** 특정 카테고리의 글 목록 (slug 기준). */
export function getPostsByCategory(locale: string, categorySlug: string): BlogPost[] {
  return getAllPosts(locale).filter(p => p.categorySlug === categorySlug);
}

/** 로케일별 카테고리 + 글 수 (글이 있는 카테고리만). */
export function getAllCategoriesWithCount(locale: string): { slug: string; count: number }[] {
  const posts = getAllPosts(locale);
  const countMap = new Map<string, number>();
  for (const p of posts) {
    countMap.set(p.categorySlug, (countMap.get(p.categorySlug) ?? 0) + 1);
  }
  return getAllCategorySlugs()
    .filter(slug => countMap.has(slug))
    .map(slug => ({ slug, count: countMap.get(slug)! }));
}
