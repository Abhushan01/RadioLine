import { useEffect, useState } from 'react';
import { useLikedStations } from '../../hooks/useLikedStations';
import { useAudio } from '../../context/AudioPlayer';
import { likedStationBus } from '../../hooks/likedStationBus';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/16/solid';
const DB_NAME = 'RadioAppDB';
const STORE_NAME = 'likedStations';

const clearLikedStations = async () => {
  const dbRequest = indexedDB.open(DB_NAME);

  dbRequest.onsuccess = () => {
    const db = dbRequest.result;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    tx.oncomplete = () => {
      likedStationBus.dispatchEvent(new Event('update'));
    };
  };

  dbRequest.onerror = err => {
    console.error('Failed to open DB for clearing:', err);
  };
};

const FavoriteStations = () => {
  const { likedStations, unlikeStation, refreshStations } = useLikedStations();
  const [imgErrors, setImgErrors] = useState({});
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');

  const fallbackSrc = theme === 'light' ? 'fallback-image-light.svg' : 'fallback-image.svg';

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.dataset.theme || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [theme]);

  const { playStation, currentStation, isPlaying } = useAudio();

  useEffect(() => {
    refreshStations();
  }, [refreshStations]);

  const handlePlay = station => playStation(station);
  const handleUnlike = uuid => unlikeStation(uuid);

  const handleImageError = stationuuid => {
    setImgErrors(prev => ({ ...prev, [stationuuid]: true }));
  };

  const imageSrc = station => {
    const isBroken = imgErrors[station.stationuuid];
    const favicon = station.favicon?.trim();
    return !favicon || isBroken ? fallbackSrc : favicon;
  };

  return (
    <div className="p-4 bg-[var(--color-navigation-section)] backdrop-blur-xl rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-2xl sm:text-4xl">Your Favorites</p>
        {likedStations.length > 0 && (
          <button
            className="bg-transparent text-sm text-[var(--color-text-secondary)] hover:underline hover:text-[var(--color-text-primary)]"
            onClick={() => clearLikedStations()}
          >
            Clear Playlist
          </button>
        )}
      </div>

      {likedStations.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">No stations liked yet.</p>
      ) : (
        <div className="space-y-4 flex flex-col">
          {likedStations.map(station => (
            <button
              key={station.stationuuid}
              className={`w-full border-b-1 border-[var(--color-border)] flex justify-between items-center ${isPlaying && currentStation?.stationuuid === station.stationuuid ? 'bg-[var(--sidebar-link-color-1)] rounded-sm' : ''}`}
              onClick={() => handlePlay(station)}
            >
              <div className="flex gap-3 items-center">
                <span
                  className={
                    isPlaying && currentStation?.stationuuid === station.stationuuid
                      ? 'text-[var(--color-bg-1)] bg-[var(--color-accent)] rounded-full p-2'
                      : 'border rounded-full p-2'
                  }
                >
                  {isPlaying && currentStation?.stationuuid === station.stationuuid ? (
                    <PauseIcon className="h-6" />
                  ) : (
                    <PlayIcon className="h-6" />
                  )}
                </span>

                <img
                  src={imageSrc(station)}
                  alt="Station"
                  onError={() => handleImageError(station.stationuuid)}
                  className="rounded-md h-12 object-cover hidden md:block"
                />

                <div
                  className={`text-left flex flex-col ${
                    isPlaying && currentStation?.stationuuid === station.stationuuid
                      ? 'text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)]'
                  }`}
                >
                  <span className="text-lg font-medium">{station.name}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {station.language || 'Unknown'}
                  </span>
                </div>
              </div>

              <span onClick={() => handleUnlike(station.stationuuid)}>
                <HeartIcon className="h-10 text-red-500" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteStations;
