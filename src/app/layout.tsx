import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mama Mind - Comprehensive Maternity Care",
  description: "AI-powered maternity care platform for expecting mothers and healthcare providers. Track vitals, get personalized insights, and ensure the health of mother and baby.",
  keywords: ["maternity care", "pregnancy tracking", "AI healthcare", "prenatal care", "maternal health"],
  authors: [{ name: "Mama Mind Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-inter antialiased bg-background text-foreground">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
