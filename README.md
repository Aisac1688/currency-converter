# CurrencyCalc — 환율 계산기

150개 이상 통화의 환율 계산기 + 블로그 콘텐츠 사이트. Next.js SSG + Vercel 무료 호스팅.

## 기술 스택

- **Next.js 16** (App Router, SSG)
- **Tailwind CSS v4** + @tailwindcss/typography
- **next-intl** (한국어/영어 다국어)
- **fawazahmed0/exchange-api** (무료 환율 API, 빌드 타임 fetch)
- **gray-matter + marked** (블로그 마크다운 파싱)

## 로컬 실행

```bash
# Node.js 20+ 필요
npm install
npm run dev
```

http://localhost:3000 에서 확인.

## 빌드

```bash
npm run build
```

154페이지 정적 생성 (계산기 홈, 환율표, 통화쌍 50+, 블로그 20개, 법적 페이지 등).

## 환경변수

```bash
cp .env.example .env.local
```

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL (사이트맵, OG 태그) | O |
| `NEXT_PUBLIC_ADSENSE_ID` | Google AdSense 퍼블리셔 ID | X |

## 배포 (Vercel)

### 1. Vercel 프로젝트 연결

```bash
npm i -g vercel
vercel login
vercel link
```

Environment Variables에 `NEXT_PUBLIC_SITE_URL`을 실제 도메인으로 설정.

### 2. GitHub Actions 자동 재빌드

매일 UTC 00:00 (KST 09:00)에 환율 데이터를 갱신하며 재빌드.

GitHub Repository > Settings > Secrets에 추가:

| Secret | 값 |
|--------|-----|
| `VERCEL_TOKEN` | Vercel > Settings > Tokens에서 생성 |
| `VERCEL_ORG_ID` | `.vercel/project.json`의 orgId |
| `VERCEL_PROJECT_ID` | `.vercel/project.json`의 projectId |

### 3. SEO 설정

1. **Google Search Console**: 사이트 소유권 인증 → `sitemap.xml` 제출
2. **Naver 웹마스터도구**: 사이트 등록 → 사이트맵 제출
3. **AdSense**: 콘텐츠 충분히 축적 후 (2~4주) 신청

## 프로젝트 구조

```
src/
├── app/
│   ├── [locale]/
│   │   ├── page.tsx            # 홈: 계산기 + 인기 환율
│   │   ├── [pair]/page.tsx     # 통화쌍 페이지
│   │   ├── rates/page.tsx      # 환율표
│   │   ├── blog/               # 블로그 목록 + 글
│   │   ├── about/page.tsx      # 소개
│   │   ├── privacy/page.tsx    # 개인정보처리방침
│   │   └── contact/page.tsx    # 연락처
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── converter/              # 환율 계산기 UI
│   ├── rates/                  # 환율 테이블
│   ├── ads/AdBanner.tsx        # AdSense 래퍼
│   ├── layout/                 # Header, Footer, ThemeToggle
│   └── seo/                    # 구조화 데이터
├── lib/                        # 유틸리티 (환율, 통화, 블로그, 포맷)
└── i18n/                       # 다국어 설정
content/blog/                   # 블로그 마크다운 (ko/, en/)
messages/                       # UI 번역 JSON (ko.json, en.json)
```
