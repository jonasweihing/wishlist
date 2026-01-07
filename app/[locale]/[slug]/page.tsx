'use client';

import { useParams } from 'next/navigation';
import PublicWishlist from '@/components/public-wishlist';

export default function PublicWishlistPage() {
  const params = useParams();

  return <PublicWishlist slug={params.slug as string} />;
}
