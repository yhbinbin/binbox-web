import type { Metadata } from "next";
import { Space_Grotesk, VT323 } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const displayFont = VT323({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "binbox斌盒子 - 数字音乐实验室",
  description:
    "binbox斌盒子是一个数字音乐实验室，融合了90年代的怀旧情怀与现代网页音频实验。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 内联脚本防止主题闪烁 (FOUC)
  const themeScript = `
    (function() {
      try {
        var stored = localStorage.getItem('binbox-theme');
        if (stored) {
          var parsed = JSON.parse(stored);
          if (parsed.state && parsed.state.theme) {
            document.documentElement.setAttribute('data-theme', parsed.state.theme);
          }
        }
      } catch (e) {}
    })();
  `;

  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
