'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/components/auth-provider';
import { favoritesService } from '@/lib/favorites';
import debounce from 'lodash/debounce';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const userFavorites = await favoritesService.getFavorites(user);
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const debouncedSync = useCallback(
    debounce(async (newFavorites: number[]) => {
      if (user) {
        try {
          await favoritesService.syncToDb(newFavorites);
        } catch (error) {
          console.error('Error syncing favorites to database:', error);
          // Revert to server state on error
          const serverFavorites = await favoritesService.getFavorites(user);
          setFavorites(serverFavorites);
        }
      }
    }, 500),
    [user]
  );

  const toggleFavorite = useCallback(async (gameId: number) => {
    const isCurrentlyFavorite = favorites.includes(gameId);
    const optimisticFavorites = isCurrentlyFavorite 
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    
    // Update UI immediately
    setFavorites(optimisticFavorites);
    
    // Update localStorage immediately for consistency
    favoritesService.setLocalFavorites(optimisticFavorites);
    
    // Debounce the database sync
    debouncedSync(optimisticFavorites);
    
    return optimisticFavorites;
  }, [favorites, debouncedSync]);

  const addFavorite = useCallback(async (gameId: number) => {
    if (favorites.includes(gameId)) {
      return favorites;
    }
    
    const optimisticFavorites = [...favorites, gameId];
    
    // Update UI immediately
    setFavorites(optimisticFavorites);
    
    // Update localStorage immediately for consistency
    favoritesService.setLocalFavorites(optimisticFavorites);
    
    // Debounce the database sync
    debouncedSync(optimisticFavorites);
    
    return optimisticFavorites;
  }, [favorites, debouncedSync]);

  const removeFavorite = useCallback(async (gameId: number) => {
    const optimisticFavorites = favorites.filter(id => id !== gameId);
    
    // Update UI immediately
    setFavorites(optimisticFavorites);
    
    // Update localStorage immediately for consistency
    favoritesService.setLocalFavorites(optimisticFavorites);
    
    // Debounce the database sync
    debouncedSync(optimisticFavorites);
    
    return optimisticFavorites;
  }, [favorites, debouncedSync]);

  const isFavorite = useCallback((gameId: number) => {
    return favorites.includes(gameId);
  }, [favorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh: loadFavorites,
  };
}