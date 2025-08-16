import { eq } from 'drizzle-orm';
import { db } from './db';
import { authTokens } from './db/schema';

export interface TokenData {
  accessToken: string;
  expiresAt: Date;
}

export async function getValidToken(provider: string): Promise<string | null> {
  try {
    const [storedToken] = await db
      .select()
      .from(authTokens)
      .where(eq(authTokens.provider, provider))
      .limit(1);

    if (!storedToken || new Date() >= storedToken.expiresAt) {
      // Token is expired or doesn't exist
      if (provider === 'igdb') {
        const newToken = await refreshIGDBToken();
        if (newToken) {
          await storeToken(provider, newToken);
          return newToken.accessToken;
        }
      }
      return null;
    }

    return storedToken.accessToken;
  } catch (error) {
    console.error('Error getting valid token:', error);
    return null;
  }
}

export async function storeToken(provider: string, tokenData: TokenData): Promise<void> {
  try {
    await db
      .insert(authTokens)
      .values({
        id: provider,
        provider,
        accessToken: tokenData.accessToken,
        expiresAt: tokenData.expiresAt,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: authTokens.id,
        set: {
          accessToken: tokenData.accessToken,
          expiresAt: tokenData.expiresAt,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
}

async function refreshIGDBToken(): Promise<TokenData | null> {
  try {
    const clientId = process.env.IGDB_CLIENT_ID;
    const clientSecret = process.env.IGDB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('IGDB credentials not found in environment variables');
      return null;
    }

    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    if (!response.ok) {
      console.error('Failed to refresh IGDB token:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    // IGDB tokens expire in seconds, convert to milliseconds and create Date
    const expiresAt = new Date(Date.now() + (data.expires_in * 1000));

    return {
      accessToken: data.access_token,
      expiresAt,
    };
  } catch (error) {
    console.error('Error refreshing IGDB token:', error);
    return null;
  }
}