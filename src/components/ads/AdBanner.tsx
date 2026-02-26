'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

/** Google AdSense 배너 래퍼. NEXT_PUBLIC_ADSENSE_ID 미설정 시 렌더링 안 함. */
export default function AdBanner({ slot, format = 'auto', responsive = true }: AdBannerProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!publisherId) return;
    try {
      ((window as unknown as Record<string, unknown[]>).adsbygoogle ||= []).push({});
    } catch {
      // AdSense not loaded
    }
  }, [publisherId]);

  if (!publisherId) return null;

  return (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
