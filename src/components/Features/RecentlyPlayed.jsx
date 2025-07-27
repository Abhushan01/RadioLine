import { useRecentlyPlayed } from '../../hooks/useRecentlyPlayed';
import { useAudio } from '../../context/AudioPlayer';

const RecentlyPlayed = () => {
  const { recentStations, setRecentStations } = useRecentlyPlayed();
  const { playStation, currentStation } = useAudio();

  // Clear all recent stations
  const clearAllHistory = () => {
    localStorage.removeItem('recentlyPlayed');
    setRecentStations([]);
    // Dispatch event to notify other components if needed
    window.dispatchEvent(new Event('recentlyPlayedUpdated'));
  };

  if (recentStations.length === 0) {
    return <p className="text-gray-500 italic">No recently played stations.</p>;
  }

  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Recently Played</h3>
        <button
          onClick={clearAllHistory}
          className="text-sm text-red-600 hover:text-red-800 focus:outline-none"
          title="Clear all history"
          aria-label="Clear all recently played stations"
        >
          Clear All
        </button>
      </div>
      <ul className="space-y-2 max-h-48 overflow-auto">
        {recentStations.map(station => (
          <li
            key={station.stationuuid}
            onClick={() => playStation(station)}
            className={`cursor-pointer p-2 rounded ${
              currentStation?.stationuuid === station.stationuuid
                ? 'bg-blue-200 font-bold'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={`Play ${station.name}`}
          >
            {station.name} {station.language ? `(${station.language})` : ''}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentlyPlayed;
