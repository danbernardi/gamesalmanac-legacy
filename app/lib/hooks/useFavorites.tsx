'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import { favoritesService } from '@/lib/favorites';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  console.log(favorites);

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

  const toggleFavorite = useCallback(async (gameId: number) => {
    const previousFavorites = favorites;
    const isCurrentlyFavorite = favorites.includes(gameId);
    const optimisticFavorites = isCurrentlyFavorite 
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    
    setFavorites(optimisticFavorites);
    
    try {
      const newFavorites = await favoritesService.toggleFavorite(gameId, user);
      setFavorites(newFavorites);
      return newFavorites;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorites(previousFavorites);
      return previousFavorites;
    }
  }, [user, favorites]);

  const addFavorite = useCallback(async (gameId: number) => {
    const previousFavorites = favorites;
    
    if (favorites.includes(gameId)) {
      return favorites;
    }
    
    const optimisticFavorites = [...favorites, gameId];
    setFavorites(optimisticFavorites);
    
    try {
      const newFavorites = await favoritesService.addFavorite(gameId, user);
      setFavorites(newFavorites);
      return newFavorites;
    } catch (error) {
      console.error('Error adding favorite:', error);
      setFavorites(previousFavorites);
      return previousFavorites;
    }
  }, [user, favorites]);

  const removeFavorite = useCallback(async (gameId: number) => {
    const previousFavorites = favorites;
    const optimisticFavorites = favorites.filter(id => id !== gameId);
    
    setFavorites(optimisticFavorites);
    
    try {
      const newFavorites = await favoritesService.removeFavorite(gameId, user);
      setFavorites(newFavorites);
      return newFavorites;
    } catch (error) {
      console.error('Error removing favorite:', error);
      setFavorites(previousFavorites);
      return previousFavorites;
    }
  }, [user, favorites]);

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