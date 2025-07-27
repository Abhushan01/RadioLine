import { useMemo } from 'react';

/**
 * Custom hook to group stations by genre (tags).
 * @param {Array} stations - Array of station objects.
 * @returns {Object} - Object with genres as keys and arrays of stations as values.
 */
export const useStationsByGenre = stations =>
  useMemo(() => {
    if (!Array.isArray(stations)) return {};

    const genreMap = {};

    stations.forEach(station => {
      if (!station.tags) return;

      const tags = station.tags
        .split(',')
        .map(tag => tag.trim().toLowerCase())
        .filter(tag => tag.length > 0);

      tags.forEach(tag => {
        if (!genreMap[tag]) {
          genreMap[tag] = [];
        }
        genreMap[tag].push(station);
      });
    });

    return genreMap;
  }, [stations]);
