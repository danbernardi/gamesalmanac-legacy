'use client';

import type { User } from '@supabase/supabase-js';

const FAVORITES_KEY = 'favorites';

export class FavoritesService {
  async getFavorites(user: User | null): Promise<number[]> {
    const localFavorites = this.getLocalFavorites();
    
    if (!user) {
      return localFavorites;
    }

    try {
      const dbFavorites = await this.getDbFavorites();
      
      // For authenticated users, database is the source of truth
      // Only migrate localStorage to DB if DB is empty (first login)
      if (dbFavorites.length === 0 && localFavorites.length > 0) {
        await this.syncToDb(localFavorites);
        return localFavorites;
      }
      
      // Always use DB favorites and sync to localStorage
      this.setLocalFavorites(dbFavorites);
      return dbFavorites;
    } catch (error) {
      console.error('Error syncing favorites:', error);
      return localFavorites;
    }
  }

  async addFavorite(gameId: number, user: User | null): Promise<number[]> {
    const currentFavorites = await this.getFavorites(user);
    
    if (currentFavorites.includes(gameId)) {
      return currentFavorites;
    }

    const newFavorites = [...currentFavorites, gameId];
    this.setLocalFavorites(newFavorites);

    if (user) {
      try {
        await this.addDbFavorite(gameId);
      } catch (error) {
        console.error('Error adding favorite to database:', error);
      }
    }

    return newFavorites;
  }

  async removeFavorite(gameId: number, user: User | null): Promise<number[]> {
    const currentFavorites = await this.getFavorites(user);
    const newFavorites = currentFavorites.filter(id => id !== gameId);
    
    this.setLocalFavorites(newFavorites);

    if (user) {
      try {
        await this.removeDbFavorite(gameId);
      } catch (error) {
        console.error('Error removing favorite from database:', error);
      }
    }

    return newFavorites;
  }

  async toggleFavorite(gameId: number, user: User | null): Promise<number[]> {
    const currentFavorites = await this.getFavorites(user);
    
    if (currentFavorites.includes(gameId)) {
      return this.removeFavorite(gameId, user);
    } else {
      return this.addFavorite(gameId, user);
    }
  }

  private getLocalFavorites(): number[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  setLocalFavorites(favorites: number[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  private async getDbFavorites(): Promise<number[]> {
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();
      return data.favorites || [];
    } catch (error) {
      console.error('Error fetching favorites from database:', error);
      return [];
    }
  }

  private async addDbFavorite(gameId: number): Promise<void> {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add favorite');
    }
  }

  private async removeDbFavorite(gameId: number): Promise<void> {
    const response = await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove favorite');
    }
  }

  async syncToDb(favorites: number[]): Promise<void> {
    const response = await fetch('/api/favorites/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorites }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync favorites');
    }
  }

}

export const favoritesService = new FavoritesService();