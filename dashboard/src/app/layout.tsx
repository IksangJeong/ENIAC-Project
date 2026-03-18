import type { Metadata } from "next";
import { Share_Tech_Mono, Orbitron } from "next/font/google";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-tech",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ENIAC Dashboard",
  description: "ENIAC Club Real-time Dashboard - Cyberpunk Style",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${shareTechMono.variable} ${orbitron.variable} antialiased`}
        style={{ fontFamily: "var(--font-share-tech), monospace" }}
      >
        {children}
      </body>
    </html>
  );
}
