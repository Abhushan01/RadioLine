import { useState, useEffect } from 'react';

export const useRecentlyPlayed = () => {
  const [recentStations, setRecentStations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const updated = JSON.parse(localStorage.getItem('recentlyPlayed')) || [];
        setRecentStations(updated);
      } catch {
        setRecentStations([]);
      }
    };

    window.addEventListener('recentlyPlayedUpdated', handler);

    return () => window.removeEventListener('recentlyPlayedUpdated', handler);
  }, []);

  return { recentStations, setRecentStations };
};
