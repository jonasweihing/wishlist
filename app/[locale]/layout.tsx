import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import "../globals.css"; // Corrected path relative to app/[locale]
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/components/theme-provider";
import { db, settings } from "@/lib/db";
import { eq } from "drizzle-orm";

async function getSettings() {
  try {
    const allSettings = await db.select().from(settings);
    const settingsObj = allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      siteTitle: settingsObj.siteTitle || 'Wishlist',
      homepageSubtext: settingsObj.homepageSubtext || 'Browse and explore available wishlists',
      headerColorLight: settingsObj.headerColorLight || '#ffffff',
      primaryColor: settingsObj.primaryColor || '#4f46e5',
      backgroundColor: settingsObj.backgroundColor || '',
    };
  } catch (error) {
    return {
      siteTitle: 'Wishlist',
      homepageSubtext: 'Browse and explore available wishlists',
      headerColorLight: '#ffffff',
      primaryColor: '#4f46e5',
      backgroundColor: '#f9fafb',
    };
  }
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await getMessages({ locale })) as any;
  const settings = await getSettings();

  return {
    title: settings.siteTitle,
    description: messages.Metadata?.description || "Self-hosted wishlist application for families",
    icons: {
      icon: '/icon.svg',
    },
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'de'].includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const settings = await getSettings();

  return (
    <html lang={locale}>
      <body
        className="font-sans antialiased transition-colors duration-300"
        style={{
          ['--header-bg-light' as any]: settings.headerColorLight,
          ['--primary-color' as any]: settings.primaryColor,
          backgroundColor: settings.backgroundColor || '#f9fafb',
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
