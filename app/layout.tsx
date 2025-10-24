import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// this import works idk why it says cannot find module, just ignore for now
import "./globals.css"
import NavHeader from "./lib/components/NavHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'StudyFlow - AI Study Planner',
  description: 'AI-powered weekly study planner for busy students',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen p-2`}
      >
            <div className="min-h-screen bg-background pb-24">
              <div className="max-w-4xl mx-auto px-5 py-5 grid gap-8">
                <NavHeader/>
                {children}
              </div>
            </div>
      </body>
    </html>
  );
}
