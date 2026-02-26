import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server';
import { locales } from '@/i18n/config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StructuredData, { buildOrganizationSchema, buildWebSiteSchema } from '@/components/seo/StructuredData';
import AlertChecker from '@/components/alert/AlertChecker';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hwanyul.com';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`;

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    title: { default: t('title'), template: `%s | ${t('title')}` },
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}`,
      languages: { ko: '/ko', en: '/en', 'x-default': '/ko' },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}`,
      siteName: 'hwanyul.com',
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  const orgSchema = buildOrganizationSchema();
  const siteSchema = buildWebSiteSchema(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <meta name="google-site-verification" content="J8oult15t2PHMt7MutBry2Vy5KdYU7lX3kRgw_aISHo" />
        <meta name="naver-site-verification" content="f4baab8fd479994199f03d3cee80d8a47b7c4afa" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        {GA_ID && <link rel="dns-prefetch" href="https://www.googletagmanager.com" />}
        {CLARITY_ID && <link rel="dns-prefetch" href="https://www.clarity.ms" />}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StructuredData data={orgSchema} />
          <StructuredData data={siteSchema} />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <AlertChecker />
        </NextIntlClientProvider>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}')`}
            </Script>
          </>
        )}
        {CLARITY_ID && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}")`}
          </Script>
        )}
      </body>
    </html>
  );
}
