import type { Metadata } from "next";
import { Inter, Press_Start_2P, VT323 } from "next/font/google";
import "@/styles/globals.css";
import { CustomCursor } from "@/components/ui/custom-cursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pixelFont = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt323",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMPLOD System.OS",
  description: "AI Employee Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pixelFont.variable} ${vt323.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full bg-slate-50 text-slate-900 overflow-hidden relative font-sans">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
