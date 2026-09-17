import React, { createContext, useContext, useState, useEffect } from 'react';
import { favoritesApi } from '../api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FavoritesContext = createContext(null);

const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem('mehndi_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('mehndi_guest_id', guestId);
  }
  return guestId;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const guestId = !user ? getOrCreateGuestId() : null;
      const res = await favoritesApi.getMyFavorites(guestId);
      if (res.success) {
        setFavorites(res.data);
        const ids = new Set(res.data.map((item) => (typeof item === 'object' ? item._id : item)));
        setFavoriteIds(ids);
      }
    } catch (err) {
      console.warn('Could not load favorites:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const isFavorite = (designId) => {
    return favoriteIds.has(designId);
  };

  const toggleFavorite = async (design) => {
    const designId = typeof design === 'object' ? design._id : design;
    const guestId = !user ? getOrCreateGuestId() : null;

    // Optimistic UI update
    const wasFavorite = isFavorite(designId);
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) {
        next.delete(designId);
      } else {
        next.add(designId);
      }
      return next;
    });

    if (wasFavorite) {
      setFavorites((prev) => prev.filter((d) => (d._id || d) !== designId));
      toast.info('Removed from favorites', { autoClose: 1800 });
    } else {
      if (typeof design === 'object') {
        setFavorites((prev) => [design, ...prev]);
      }
      toast.success('Saved to your favorites ❤️', { autoClose: 1800 });
    }

    try {
      await favoritesApi.toggle(designId, guestId);
    } catch (err) {
      // Rollback on failure
      fetchFavorites();
      toast.error('Could not update favorite: ' + err.message);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteCount: favoriteIds.size,
        isFavorite,
        toggleFavorite,
        refreshFavorites: fetchFavorites,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
