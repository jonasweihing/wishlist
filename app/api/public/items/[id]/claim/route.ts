import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, wishlistItems, wishlists } from '@/lib/db';
import { createId } from '@paralleldrive/cuid2';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    // Get the item
    const item = await db
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.id, id))
      .limit(1);

    if (item.length === 0) {
      return NextResponse.json(
        { error: 'Wunsch nicht gefunden' },
        { status: 404 }
      );
    }

    // Check if item is already claimed
    if (item[0].claimedToken) {
      return NextResponse.json(
        { error: 'Wunsch ist bereits vergeben' },
        { status: 409 }
      );
    }

    // Check if wishlist is public
    const wishlist = await db
      .select()
      .from(wishlists)
      .where(eq(wishlists.id, item[0].wishlistId))
      .limit(1);

    if (wishlist.length === 0) {
      return NextResponse.json(
        { error: 'Wunschliste nicht gefunden' },
        { status: 404 }
      );
    }

    if (!wishlist[0].isPublic) {
      return NextResponse.json(
        { error: 'Diese Wunschliste ist privat' },
        { status: 403 }
      );
    }

    // Generate unique claim token
    const claimToken = createId();

    // Update item with claim information
    const updatedItem = await db
      .update(wishlistItems)
      .set({
        claimedName: name || null,
        claimedToken: claimToken,
        claimedDate: new Date(),
        updatedDate: new Date(),
      })
      .where(eq(wishlistItems.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        claimToken,
        item: updatedItem[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error claiming item:', error);
    return NextResponse.json(
      { error: 'Fehler beim Reservieren des Wunsches' },
      { status: 500 }
    );
  }
}
