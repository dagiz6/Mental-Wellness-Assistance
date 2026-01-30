import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import AppLayout from "@/components/AppLayout";
// Styles
import "./globals.css";
import Navigation from "@/components/Navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MindMate - Mental Wellness Chat Assistance",
  description: "Your sanctuary for mental clarity and emotional well-being",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <Navigation session={session} />
        <AppLayout session={session}>{children}</AppLayout>
        <Analytics />
      </body>
    </html>
  );
}
