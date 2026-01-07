'use client';

import { useEffect, useState } from 'react';
import { wishlistsApi, itemsApi, claimingApi, type Wishlist, type Item } from '@/lib/api';
import Header from '@/components/header';
import Footer from '@/components/footer';
import PasswordLockGuard from '@/components/password-lock-guard';

interface PublicWishlistProps {
    slug: string;
    showBackLink?: boolean;
}

export default function PublicWishlist({ slug, showBackLink = true }: PublicWishlistProps) {
    const [wishlist, setWishlist] = useState<Wishlist | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [showClaimed, setShowClaimed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Claim form state
    const [claimingItemId, setClaimingItemId] = useState<string | null>(null);
    const [claimName, setClaimName] = useState('');
    const [isClaiming, setIsClaiming] = useState(false);
    const [claimError, setClaimError] = useState('');
    const [justClaimedItemId, setJustClaimedItemId] = useState<string | null>(null);

    // Unclaim state
    const [unclaimingItemId, setUnclaimingItemId] = useState<string | null>(null);
    const [unclaimName, setUnclaimName] = useState('');
    const [isUnclaiming, setIsUnclaiming] = useState(false);
    const [unclaimError, setUnclaimError] = useState('');

    useEffect(() => {
        fetchWishlist();
    }, [slug]);

    const fetchWishlist = async () => {
        if (!slug) return;

        try {
            const wishlistData = await wishlistsApi.getBySlug(slug);
            setWishlist(wishlistData);

            const itemsData = await itemsApi.getAll(wishlistData.id);
            setItems(itemsData.sort((a, b) => a.sortOrder - b.sortOrder));
        } catch (err: any) {
            setError(err.message || 'Wunschliste nicht gefunden');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaimItem = (itemId: string) => {
        setClaimingItemId(itemId);
        setClaimError('');
        setClaimName('');
        setJustClaimedItemId(null);
        setUnclaimingItemId(null);
    };

    const handleUnclaimClick = (itemId: string) => {
        setUnclaimingItemId(itemId);
        setUnclaimError('');
        setUnclaimName('');
        setClaimingItemId(null);
    };

    const handleSubmitClaim = async (e: React.FormEvent, itemId: string) => {
        e.preventDefault();

        if (!claimName.trim()) {
            setClaimError('Bitte gib deinen Namen ein');
            return;
        }

        setIsClaiming(true);
        setClaimError('');

        try {
            await claimingApi.claim(itemId, claimName);

            setJustClaimedItemId(itemId);
            setClaimingItemId(null);
            setClaimName('');
            fetchWishlist();

            // Clear the "Item Claimed!" success message after 3 seconds
            setTimeout(() => {
                setJustClaimedItemId(null);
            }, 3000);
        } catch (err: any) {
            setClaimError(err.message || 'Fehler beim Reservieren des Wunsches');
        } finally {
            setIsClaiming(false);
        }
    };

    const handleUnclaimSubmit = async (e: React.FormEvent, itemId: string) => {
        e.preventDefault();

        if (!unclaimName.trim()) {
            setUnclaimError('Bitte gib deinen Namen ein');
            return;
        }

        setIsUnclaiming(true);
        setUnclaimError('');

        try {
            await claimingApi.unclaim(itemId, unclaimName);
            setUnclaimingItemId(null);
            setUnclaimName('');
            fetchWishlist();
        } catch (err: any) {
            setUnclaimError(err.message || 'Fehler beim Freigeben des Wunsches');
        } finally {
            setIsUnclaiming(false);
        }
    };

    const filteredItems = showClaimed
        ? items
        : items.filter((item) => !item.claimedDate || item.id === justClaimedItemId);

    const formatPrice = (price: number | null, currency: string) => {
        if (!price) return null;
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: currency || process.env.DEFAULT_CURRENCY || 'USD',
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Laden...</p>
            </div>
        );
    }

    if (error || !wishlist) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Wunschliste nicht gefunden</h1>
                    <p className="text-gray-600 dark:text-gray-400">{error || 'Diese Wunschliste existiert nicht oder ist nicht öffentlich.'}</p>
                </div>
            </div>
        );
    }

    return (
        <PasswordLockGuard>
            <div className="min-h-screen">
                <Header
                    title={wishlist.name}
                    subtitle={wishlist.description || undefined}
                    imageUrl={wishlist.imageUrl || undefined}
                    maxWidth="max-w-5xl"
                />

                {/* Main Content */}
                <div className="max-w-5xl mx-auto py-12 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0">
                        {showBackLink && (
                            <a
                                href="/overview"
                                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6 transition-colors cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Back to Overview
                            </a>
                        )}



                        {/* Controls Toolbar */}
                        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                            {/* Left Spacer (for centering the middle element) */}
                            <div className="hidden sm:block"></div>

                            {/* Center: Items Count */}
                            <div className="text-center order-1 sm:order-2">
                                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full">
                                    {filteredItems.length} von {items.length} Wünschen
                                </span>
                            </div>

                            {/* Right: Show Claimed Toggle */}
                            <div className="flex justify-center sm:justify-end order-2 sm:order-3">
                                <label className="flex items-center cursor-pointer bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={showClaimed}
                                        onChange={(e) => setShowClaimed(e.target.checked)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">Bereits reservierte Wünsche anzeigen</span>
                                </label>
                            </div>
                        </div>

                        {/* Items List */}
                        {filteredItems.length === 0 ? (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                                <p className="text-gray-500 dark:text-gray-400">
                                    {showClaimed ? 'Noch keine Wünsche in dieser Wunschliste' : 'Alle Wünsche sind bereits vergeben!'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Left: Image */}
                                            {item.imageUrl && (
                                                <div className={`md:w-40 md:flex-shrink-0 ${item.claimedDate ? 'opacity-40' : ''}`}>
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-full h-40 md:h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Middle: Item Details */}
                                            <div className={`flex-1 p-4 ${item.claimedDate ? 'opacity-40' : ''}`}>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {item.name}
                                                </h3>
                                                {item.description && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Right: Action Area */}
                                            <div className="md:w-72 md:flex-shrink-0 p-4 bg-gray-50 dark:bg-gray-900/50 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 flex flex-col">
                                                <div className={`mb-3 ${item.claimedDate ? 'opacity-40' : ''}`}>
                                                    {item.purchaseUrls && item.purchaseUrls.length > 0 && (
                                                        <div className="space-y-2">
                                                            {item.purchaseUrls.map((url, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={url.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center justify-between text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                                                                >
                                                                    <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium truncate mr-2">
                                                                        {url.label}
                                                                    </span>
                                                                    <span className="text-gray-900 dark:text-white font-bold">
                                                                        {item.price && formatPrice(item.price, item.currency)}
                                                                    </span>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Claimed Badge, Success Message, or Claim Button/Form */}
                                                <div className="mt-auto">
                                                    {justClaimedItemId === item.id ? (
                                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                                            <div className="flex items-center justify-center mb-2">
                                                                <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-600 rounded-full flex items-center justify-center">
                                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <p className="text-center text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                                Wunsch reserviert!
                                                            </p>
                                                        </div>
                                                    ) : item.claimedDate ? (
                                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded p-3">
                                                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                                                Bereits reserviert!
                                                            </p>
                                                            {showClaimed && (
                                                                unclaimingItemId === item.id ? (
                                                                    <div className="mt-3 bg-rose-50 dark:bg-rose-900/10 p-3 rounded-md border border-rose-100 dark:border-rose-900/30">
                                                                        <form onSubmit={(e) => handleUnclaimSubmit(e, item.id)} className="space-y-3">
                                                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Name zur Bestätigung eingeben:</p>
                                                                            {unclaimError && (
                                                                                <div className="text-xs text-rose-600 dark:text-rose-400">
                                                                                    {unclaimError}
                                                                                </div>
                                                                            )}
                                                                            <input
                                                                                type="text"
                                                                                placeholder="Dein Name"
                                                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-gray-700 dark:text-white"
                                                                                value={unclaimName}
                                                                                onChange={(e) => setUnclaimName(e.target.value)}
                                                                                required
                                                                            />
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => setUnclaimingItemId(null)}
                                                                                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors cursor-pointer"
                                                                                >
                                                                                    Abbrechen
                                                                                </button>
                                                                                <button
                                                                                    type="submit"
                                                                                    disabled={isUnclaiming}
                                                                                    className="flex-1 px-3 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 rounded-md text-sm hover:bg-rose-200 dark:hover:bg-rose-900/50 font-medium disabled:opacity-50 transition-colors cursor-pointer"
                                                                                >
                                                                                    {isUnclaiming ? '...' : 'Reservierung aufheben'}
                                                                                </button>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleUnclaimClick(item.id)}
                                                                        className="mt-3 w-full px-4 py-2 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 rounded-md hover:bg-rose-200 dark:hover:bg-rose-900/50 font-medium disabled:opacity-50 transition-colors cursor-pointer text-sm"
                                                                    >
                                                                        Reservierung aufheben
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : claimingItemId === item.id ? (
                                                        <div className="space-y-3">
                                                            <form onSubmit={(e) => handleSubmitClaim(e, item.id)} className="space-y-3">
                                                                {claimError && (
                                                                    <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-400 rounded text-xs">
                                                                        {claimError}
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <label htmlFor={`claim-name-${item.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                        Dein Name <span className="text-rose-500">*</span>:
                                                                    </label>
                                                                    <input
                                                                        id={`claim-name-${item.id}`}
                                                                        type="text"
                                                                        required
                                                                        placeholder="Name eingeben"
                                                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                                                                        value={claimName}
                                                                        onChange={(e) => setClaimName(e.target.value)}
                                                                    />
                                                                </div>

                                                                <button
                                                                    type="submit"
                                                                    disabled={isClaiming}
                                                                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium disabled:opacity-50 transition-colors cursor-pointer"
                                                                >
                                                                    {isClaiming ? 'Speichert...' : 'Bestätigen'}
                                                                </button>
                                                            </form>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleClaimItem(item.id)}
                                                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors cursor-pointer"
                                                        >
                                                            Wunsch reservieren
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </PasswordLockGuard >
    );
}
