// frontend/src/app/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "心情打卡 - 记录您的每一天",
    template: "%s - 心情打卡"
  },
  description: "追踪情绪变化，发现内心规律，成为更好的自己",
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