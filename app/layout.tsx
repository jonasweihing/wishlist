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
      siteTitle: settingsObj.siteTitle || 'Wunschliste',
      homepageSubtext: settingsObj.homepageSubtext || 'Durchstöbere verfügbare Wunschlisten',
      headerColorLight: settingsObj.headerColorLight || '#ffffff',
      primaryColor: settingsObj.primaryColor || '#4f46e5',
      backgroundColor: settingsObj.backgroundColor || '',
    };
  } catch (error) {
    return {
      siteTitle: 'Wunschliste',
      homepageSubtext: 'Durchstöbere verfügbare Wunschlisten',
      headerColorLight: '#ffffff',
      primaryColor: '#4f46e5',
      backgroundColor: '#f9fafb',
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.siteTitle,
    description: "Selbstgehostete Wunschlisten-App",
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
    <html lang="de">
      <body
        className="font-sans antialiased transition-colors duration-300"
        style={{
          ['--header-bg-light' as any]: settings.headerColorLight,
          ['--primary-color' as any]: settings.primaryColor,
          backgroundColor: settings.backgroundColor || '#f9fafb', // Default to gray-50 equivalent
        }}
      >
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
