import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SarkariSetu",
    default: "SarkariSetu - Latest Government Jobs, Admit Cards & Results",
  },
  description: "Get the latest government job notifications, admit cards, exam dates, and results on SarkariSetu. Your one-stop portal for all Sarkari recruitment updates.",
  keywords: ["Sarkari Result", "Sarkari Exam", "Government Jobs", "Sarkari Naukri", "Admit Card", "Recruitment"],
  authors: [{ name: "SarkariSetu Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
