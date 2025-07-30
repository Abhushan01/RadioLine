import { useEffect, useState } from 'react';
import { useStationsByGenre } from '../../hooks/useStationsByGenre';
import Card from '../Core/Card';

const Genres = ({ radioStationList, loading }) => {
  const stationsByGenre = useStationsByGenre(radioStationList);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const [selectedGenre, setSelectedGenre] = useState(null); // null = show all genres

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

  const genres = Object.keys(stationsByGenre);

  const backgroundColors = [
    'bg-rose-900',
    'bg-pink-800',
    'bg-purple-800',
    'bg-indigo-800',
    'bg-blue-800',
    'bg-green-800',
    'bg-yellow-700',
    'bg-orange-700',
  ];

  const fallbackImage = theme === 'light' ? 'fallback-image-light.svg' : 'fallback-image.svg';

  const renderGenrePlaceholders = (count = 8) =>
    Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse h-28 w-full ${theme === 'light' ? 'bg-gray-700' : 'bg-pink-900'} rounded-sm`}
      />
    ));

  const renderStationPlaceholders = (count = 6) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse h-24 bg-gray-700 rounded" />
    ));

  return (
    <div
      className={
        selectedGenre
          ? 'p-4 bg-[var(--color-navigation-section)] backdrop-blur-xl rounded-sm mb-[8rem]'
          : 'mb-[9rem] md:mb-[6rem]'
      }
    >
      {/* Back button */}
      {selectedGenre && !loading && (
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-2xl sm:text-4xl capitalize">{selectedGenre}</p>
          <button
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
            onClick={() => setSelectedGenre(null)}
          >
            Back
          </button>
        </div>
      )}

      {/* Loading placeholder */}
      {loading ? (
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] 
                  md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] 
                  gap-2"
        >
          {selectedGenre ? renderStationPlaceholders(10) : renderGenrePlaceholders(8)}
        </div>
      ) : selectedGenre ? (
        // Actual station list
        <div className="space-y-3">
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] 
                      md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] 
                      gap-2"
          >
            {stationsByGenre[selectedGenre].map(station => (
              <Card stationInfo={station} key={station.stationuuid} />
            ))}
          </div>
        </div>
      ) : (
        // Show genre buttons
        <div
          className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] 
                      md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] 
                      gap-2"
        >
          {genres.map((genre, index) => {
            const bgColor = backgroundColors[index % backgroundColors.length];
            const imageId = (index * 23) % 1084;

            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`relative h-28 w-full ${bgColor} 
                          flex justify-between gap-4 
                          hover:brightness-110 
                          px-4 rounded-sm overflow-hidden 
                          transition-transform transform hover:scale-105`}
              >
                <p className="uppercase text-left z-10 max-w-[5rem] text-white">{genre}</p>
                <img
                  src={`https://picsum.photos/id/${imageId}/100`}
                  alt=""
                  className="absolute top-0 right-0 w-20 h-20 object-cover 
                            rounded translate-x-[10%] translate-y-[20%] 
                            rotate-12 z-0 pointer-events-none drop-shadow-2xl"
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Genres;
