import type { ReactNode } from 'react';
import './globals.css';

/** 루트 레이아웃. locale layout이 html/body를 렌더링. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
