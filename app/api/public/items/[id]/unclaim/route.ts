import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, wishlistItems, wishlists } from '@/lib/db';

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

    // Check if item is actually claimed
    if (!item[0].claimedToken) {
      return NextResponse.json(
        { error: 'Wunsch ist nicht vergeben' },
        { status: 400 }
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

    // Verify name
    if (!name || item[0].claimedName?.toLowerCase().trim() !== name.toLowerCase().trim()) {
      return NextResponse.json(
        { error: 'Der Name stimmt nicht mit der Person überein, die diesen Wunsch reserviert hat.' },
        { status: 403 }
      );
    }

    // Remove claim information
    const updatedItem = await db
      .update(wishlistItems)
      .set({
        claimedName: null,
        claimedToken: null,
        claimedDate: null,
        updatedDate: new Date(),
      })
      .where(eq(wishlistItems.id, id))
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'Reservierung erfolgreich aufgehoben',
        item: updatedItem[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unclaiming item:', error);
    return NextResponse.json(
      { error: 'Fehler beim Freigeben des Wunsches' },
      { status: 500 }
    );
  }
}
