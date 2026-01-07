import type { Metadata } from "next";
import "./globals.css";
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
      headerColorDark: settingsObj.headerColorDark || '#1f2937',
      primaryColor: settingsObj.primaryColor || '#4f46e5',
    };
  } catch (error) {
    return {
      siteTitle: 'Wishlist',
      homepageSubtext: 'Browse and explore available wishlists',
      headerColorLight: '#ffffff',
      headerColorDark: '#1f2937',
      primaryColor: '#4f46e5',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.siteTitle,
    description: "Self-hosted wishlist application for families",
    icons: {
      icon: '/icon.svg',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body
        className="font-sans antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        style={{
          ['--header-bg-light' as any]: settings.headerColorLight,
          ['--header-bg-dark' as any]: settings.headerColorDark,
          ['--primary-color' as any]: settings.primaryColor,
        }}
      >
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
