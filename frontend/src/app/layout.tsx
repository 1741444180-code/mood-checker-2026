import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "心情打卡 - 记录您的每一天",
  description: "追踪情绪变化，发现内心规律，成为更好的自己",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    purple: {
                      50: '#f5f3ff',
                      100: '#ede9fe',
                      200: '#ddd6fe',
                      300: '#c4b5fd',
                      400: '#a78bfa',
                      500: '#8b5cf6',
                      600: '#7c3aed',
                      700: '#6d28d9',
                      800: '#5b21b6',
                      900: '#4c1d95',
                    },
                    indigo: {
                      50: '#eef2ff',
                      100: '#e0e7ff',
                      200: '#c7d2fe',
                      300: '#a5b4fc',
                      400: '#818cf8',
                      500: '#6366f1',
                      600: '#4f46e5',
                      700: '#4338ca',
                      800: '#3730a3',
                      900: '#312e81',
                    },
                    pink: {
                      50: '#fdf2f8',
                      100: '#fce7f3',
                      200: '#fbcfe8',
                      300: '#f9a8d4',
                      400: '#f472b6',
                      500: '#ec4899',
                      600: '#db2777',
                      700: '#be185d',
                      800: '#9d174d',
                      900: '#831843',
                    },
                  },
                },
              },
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
