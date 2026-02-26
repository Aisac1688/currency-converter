import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'hwanyul.com - Currency Converter';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** 로케일별 OG 이미지 생성. */
export default async function OgImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isKo = locale === 'ko';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a, #2563eb, #3b82f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>💱</div>
        <div style={{ fontSize: 64, fontWeight: 700, color: 'white', marginBottom: 8 }}>
          {isKo ? '환율' : 'Hwanyul'}
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.8)' }}>
          hwanyul.com
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 22,
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            gap: 24,
          }}
        >
          <span>{isKo ? '150+ 통화' : '150+ Currencies'}</span>
          <span>|</span>
          <span>{isKo ? '실시간 환율' : 'Real-time Rates'}</span>
          <span>|</span>
          <span>{isKo ? '무료' : 'Free'}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
