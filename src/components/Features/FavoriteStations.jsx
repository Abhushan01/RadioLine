import { useEffect } from 'react';
import { useLikedStations } from '../../hooks/useLikedStations';
import { useAudio } from '../../context/AudioPlayer';
import { likedStationBus } from '../../hooks/likedStationBus';

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

  const { playStation, currentStation } = useAudio();

  useEffect(() => {
    refreshStations();
  }, [refreshStations]);

  const handlePlay = station => {
    playStation(station);
  };

  const handleUnlike = async stationuuid => {
    await unlikeStation(stationuuid);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all liked stations?')) {
      clearLikedStations();
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Liked Stations</h2>
        {likedStations.length > 0 && (
          <button
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={handleClearAll}
          >
            Remove All Likes
          </button>
        )}
      </div>

      {likedStations.length === 0 ? (
        <p className="text-sm text-gray-400">No stations liked yet.</p>
      ) : (
        <ul className="space-y-4">
          {likedStations.map(station => (
            <li
              key={station.stationuuid}
              className={`flex items-center justify-between p-3 rounded-md border ${
                currentStation?.stationuuid === station.stationuuid
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              <div>
                <p className="text-lg font-medium">{station.name}</p>
                <p className="text-sm text-gray-500">{station.language || 'Unknown'}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                  onClick={() => handlePlay(station)}
                >
                  Play
                </button>
                <button
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                  onClick={() => handleUnlike(station.stationuuid)}
                >
                  Unlike
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteStations;
