import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, settings } from '@/lib/db';
import { verifyAccessToken } from '@/lib/auth/utils';
import crypto from 'crypto';

// GET /api/settings - Get all settings (public endpoint for reading only)
export async function GET(request: NextRequest) {
  try {
    const allSettings = await db.select().from(settings);

    // Convert to key-value object
    const settingsObj = allSettings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string | boolean>);

    // Set defaults if not found
    if (!settingsObj.siteTitle) {
      settingsObj.siteTitle = 'Wunschliste';
    }
    if (!settingsObj.homepageSubtext) {
      settingsObj.homepageSubtext = 'Durchstöbere verfügbare Wunschlisten';
    }

    // Convert passwordLockEnabled to boolean
    (settingsObj as any).passwordLockEnabled = settingsObj.passwordLockEnabled === 'true';

    return NextResponse.json({
      success: true,
      settings: settingsObj,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Einstellungen' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Ungültiger oder abgelaufener Token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { siteTitle, homepageSubtext, passwordLockEnabled, passwordLock, landingPageSlug } = body;

    // Update or insert siteTitle
    if (siteTitle !== undefined) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'siteTitle'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: siteTitle, updatedDate: new Date() })
          .where(eq(settings.key, 'siteTitle'));
      } else {
        await db.insert(settings).values({
          key: 'siteTitle',
          value: siteTitle,
        });
      }
    }

    // Update or insert homepageSubtext
    if (homepageSubtext !== undefined) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'homepageSubtext'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: homepageSubtext, updatedDate: new Date() })
          .where(eq(settings.key, 'homepageSubtext'));
      } else {
        await db.insert(settings).values({
          key: 'homepageSubtext',
          value: homepageSubtext,
        });
      }
    }

    // Update or insert passwordLockEnabled
    if (passwordLockEnabled !== undefined) {
      const value = passwordLockEnabled ? 'true' : 'false';
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'passwordLockEnabled'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value, updatedDate: new Date() })
          .where(eq(settings.key, 'passwordLockEnabled'));
      } else {
        await db.insert(settings).values({
          key: 'passwordLockEnabled',
          value,
        });
      }
    }

    // Update password hash if provided
    if (passwordLock && passwordLock.trim() !== '') {
      // Hash the password using SHA-256
      const hash = crypto.createHash('sha256').update(passwordLock).digest('hex');

      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'passwordLockHash'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: hash, updatedDate: new Date() })
          .where(eq(settings.key, 'passwordLockHash'));
      } else {
        await db.insert(settings).values({
          key: 'passwordLockHash',
          value: hash,
        });
      }
    }

    // Update or insert landingPageSlug
    if (landingPageSlug !== undefined) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'landingPageSlug'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: landingPageSlug, updatedDate: new Date() })
          .where(eq(settings.key, 'landingPageSlug'));
      } else {
        await db.insert(settings).values({
          key: 'landingPageSlug',
          value: landingPageSlug,
        });
      }
    }

    // Update or insert headerColorLight
    if (body.headerColorLight !== undefined) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'headerColorLight'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: body.headerColorLight, updatedDate: new Date() })
          .where(eq(settings.key, 'headerColorLight'));
      } else {
        await db.insert(settings).values({
          key: 'headerColorLight',
          value: body.headerColorLight,
        });
      }
    }



    // Update or insert primaryColor
    if (body.primaryColor !== undefined) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'primaryColor'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: body.primaryColor, updatedDate: new Date() })
          .where(eq(settings.key, 'primaryColor'));
      } else {
        await db.insert(settings).values({
          key: 'primaryColor',
          value: body.primaryColor,
        });
      }
    }

    // Update or insert backgroundColor
    if (body.backgroundColor !== undefined) {
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, 'backgroundColor'))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: body.backgroundColor, updatedDate: new Date() })
          .where(eq(settings.key, 'backgroundColor'));
      } else {
        await db.insert(settings).values({
          key: 'backgroundColor',
          value: body.backgroundColor,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Einstellungen erfolgreich aktualisiert',
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren der Einstellungen' },
      { status: 500 }
    );
  }
}
