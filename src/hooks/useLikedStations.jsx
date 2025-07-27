// src/hooks/useLikedStations.js
import { useState, useEffect, useCallback } from 'react';
import { likedStationBus } from './likedStationBus';

const DB_NAME = 'RadioAppDB';
const STORE_NAME = 'likedStations';

const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'stationuuid' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const getAllStations = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const useLikedStations = () => {
  const [likedStations, setLikedStations] = useState([]);

  const refreshStations = useCallback(async () => {
    const stations = await getAllStations();
    setLikedStations(stations);
  }, []);

  const likeStation = async station => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(station);
    await tx.complete;
    likedStationBus.dispatchEvent(new Event('update'));
  };

  const unlikeStation = async uuid => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(uuid);
    await tx.complete;
    likedStationBus.dispatchEvent(new Event('update'));
  };

  const isLiked = async uuid => {
    const db = await openDB();
    return new Promise(resolve => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(uuid);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  };

  useEffect(() => {
    refreshStations();

    const handler = () => {
      refreshStations();
    };

    likedStationBus.addEventListener('update', handler);
    return () => likedStationBus.removeEventListener('update', handler);
  }, [refreshStations]);

  return {
    likedStations,
    likeStation,
    unlikeStation,
    isLiked,
    refreshStations,
  };
};
