'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { wishlistsApi, settingsApi, type Wishlist, type Settings } from '@/lib/api';
import PublicWishlist from '@/components/public-wishlist';
import Overview from '@/components/overview';

export default function Home() {
  const translateWishlist = useTranslations('Wishlist');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    fetchWishlists();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const fetchWishlists = async () => {
    try {
      const data = await wishlistsApi.getAllPublic();
      setWishlists(data);
      // Item counts removed - requires authentication
    } catch (error) {
      console.error('Failed to fetch wishlists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">{translateWishlist('loading')}</p>
      </div>
    );
  }

  // If landingPageSlug is explicitly set, try to find that wishlist
  if (settings?.landingPageSlug) {
    const targetWishlist = wishlists.find(w => w.slug === settings.landingPageSlug);
    if (targetWishlist) {
      return <PublicWishlist slug={targetWishlist.slug} showBackLink={false} />;
    }
  }

  // If no landingPageSlug is set (or not found), show Overview
  return <Overview />;
}
