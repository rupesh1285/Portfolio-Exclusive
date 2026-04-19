import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rupesh Agarwal — Full-Stack Engineer",
  description: "Portfolio of Rupesh Agarwal — specialised in high-performance web architecture, real-time systems, and cinematic web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The suppressHydrationWarning stops browser extensions from crashing your Next.js app
    <html lang="en" suppressHydrationWarning> 
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}