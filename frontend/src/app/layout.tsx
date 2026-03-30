// frontend/src/app/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "心情打卡网站",
  description: "记录您的每日心情",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}