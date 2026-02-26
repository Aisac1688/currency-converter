# Currency Converter

환율 계산기 + 블로그 콘텐츠 사이트. Google 검색 트래픽으로 AdSense 수익 창출.

## Data Flow

```
빌드 타임: fawazahmed0 CDN → exchange-rates.ts → 정적 HTML 생성 (154페이지)
사용자: 정적 HTML 로드 → 금액 입력 → JS 로컬 계산 (API 호출 없음)
매일: GitHub Actions cron → 재빌드 → Vercel 배포 → 환율 갱신
```

## File Roles

| 파일 | 역할 |
|------|------|
| src/app/[locale]/page.tsx | 홈페이지 — 계산기 + 인기 환율 |
| src/app/[locale]/[pair]/page.tsx | 통화쌍 SEO 페이지 (usd-to-krw 등 50+쌍) |
| src/app/[locale]/rates/page.tsx | 전체 환율 테이블 (150+ 통화) |
| src/app/[locale]/blog/page.tsx | 블로그 목록 |
| src/app/[locale]/blog/[slug]/page.tsx | 블로그 글 (ko 10개 + en 10개) |
| src/app/[locale]/about/page.tsx | 소개 (AdSense 필수) |
| src/app/[locale]/privacy/page.tsx | 개인정보처리방침 (AdSense 필수) |
| src/app/[locale]/contact/page.tsx | 연락처 (AdSense 필수) |
| src/app/sitemap.ts | 전체 페이지 사이트맵 자동 생성 |
| src/app/robots.ts | robots.txt |
| src/lib/currencies.ts | 150+ 통화 메타데이터 (코드, 이름, 심볼, 국기) |
| src/lib/exchange-rates.ts | 빌드 타임 환율 fetch + fallback |
| src/lib/pairs.ts | 인기 통화쌍 50+ 정의 + slug 변환 |
| src/lib/blog.ts | MDX 파일 읽기 + frontmatter 파싱 |
| src/lib/format.ts | 숫자/통화 포맷팅 유틸 |
| src/components/converter/ | CurrencyConverter, CurrencySelect, AmountInput |
| src/components/rates/RatesTable.tsx | 검색/정렬 환율 테이블 |
| src/components/ads/AdBanner.tsx | AdSense 래퍼 (env 기반 조건부 렌더링) |
| src/components/layout/ | Header, Footer, LocaleSwitcher, ThemeToggle |
| src/components/seo/StructuredData.tsx | JSON-LD FAQPage 스키마 |
| src/i18n/ | next-intl 라우팅 + 로케일 설정 |
| messages/ko.json, en.json | UI 번역 문자열 |
| content/blog/ko/, en/ | 블로그 마크다운 파일 |
| .github/workflows/daily-rebuild.yml | 매일 환율 갱신 재빌드 |

## Architecture

- **Next.js 16 SSG**: 빌드 타임 정적 생성, 런타임 API 호출 없음
- **i18n**: next-intl, 라우트 기반 로케일 (/ko, /en)
- **스타일**: Tailwind CSS v4 + class 기반 다크모드
- **블로그**: gray-matter + marked (마크다운 → HTML)
- **광고**: AdSense 래퍼 (`NEXT_PUBLIC_ADSENSE_ID` 미설정 시 비활성)
- **호스팅**: Vercel (무료) + GitHub Actions 매일 재빌드

## 수정 시 주의사항

- 통화 추가: `src/lib/currencies.ts`에 메타데이터 추가
- 통화쌍 추가: `src/lib/pairs.ts`의 POPULAR_PAIRS에 추가
- 환율 API 변경: `src/lib/exchange-rates.ts` 수정
- 블로그 추가: `content/blog/{locale}/` 에 .md 파일 추가 (frontmatter 필수)
- 번역 추가: `messages/ko.json`, `messages/en.json` 동시 수정
- 다크모드: `globals.css`의 `@variant dark` + `.dark` 클래스 기반
- 디자인 톤: `design_system.md` 참고
