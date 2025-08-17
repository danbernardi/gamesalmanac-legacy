import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { userFavorites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { favorites } = await request.json();

    if (!Array.isArray(favorites)) {
      return Response.json({ error: 'Invalid favorites array' }, { status: 400 });
    }

    // Clear existing favorites for this user
    await db.delete(userFavorites).where(eq(userFavorites.userId, user.id));

    // Insert new favorites if any
    if (favorites.length > 0) {
      const values = favorites.map((gameId: number) => ({ 
        userId: user.id, 
        gameId 
      }));
      
      await db
        .insert(userFavorites)
        .values(values);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error syncing favorites:', error);
    return Response.json({ error: 'Failed to sync favorites' }, { status: 500 });
  }
}