import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThinkPick — 막연한 아이디어, 30분이면 사업계획서가 됩니다",
  description:
    "AI가 7개의 맞춤 선택지로 당신의 아이디어를 즉시 실행 가능한 사업계획서로 구체화합니다.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
