import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { userFavorites } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ favorites: [] });
    }

    const favorites = await db
      .select({ gameId: userFavorites.gameId })
      .from(userFavorites)
      .where(eq(userFavorites.userId, user.id));

    return Response.json({ favorites: favorites.map(f => f.gameId) });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return Response.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId } = await request.json();

    if (!gameId || typeof gameId !== 'number') {
      return Response.json({ error: 'Invalid gameId' }, { status: 400 });
    }

    await db
      .insert(userFavorites)
      .values({ userId: user.id, gameId })
      .onConflictDoNothing();

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return Response.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId } = await request.json();

    if (!gameId || typeof gameId !== 'number') {
      return Response.json({ error: 'Invalid gameId' }, { status: 400 });
    }

    await db
      .delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, user.id),
        eq(userFavorites.gameId, gameId)
      ));

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return Response.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}