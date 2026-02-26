import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '환율 - 환율 계산기';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** OG 이미지 자동 생성. */
export default function OgImage() {
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
          환율
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
          <span>150+ 통화</span>
          <span>|</span>
          <span>실시간 환율</span>
          <span>|</span>
          <span>무료</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
