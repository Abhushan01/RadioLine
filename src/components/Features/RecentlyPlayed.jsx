import { useRecentlyPlayed } from '../../hooks/useRecentlyPlayed';
import Card from '../Core/Card';

const RecentlyPlayed = () => {
  const { recentStations, setRecentStations } = useRecentlyPlayed();

  // Clear all recent stations
  const clearAllHistory = () => {
    localStorage.removeItem('recentlyPlayed');
    setRecentStations([]);
    // Dispatch event to notify other components if needed
    window.dispatchEvent(new Event('recentlyPlayedUpdated'));
  };

  return (
    <div className="p-4 bg-[var(--color-navigation-section)] backdrop-blur-xl rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-2xl sm:text-4xl">Recently Played</p>
        {recentStations.length > 0 && (
          <button
            className="bg-transparent text-sm text-[var(--color-text-secondary)] hover:underline hover:text-[var(--color-text-primary)]"
            onClick={clearAllHistory}
          >
            Clear History
          </button>
        )}
      </div>

      {recentStations.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">Nothing to see here.</p>
      ) : (
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))]
              md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2 mb-[6rem]"
        >
          {recentStations.map(station => (
            <Card stationInfo={station} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyPlayed;
