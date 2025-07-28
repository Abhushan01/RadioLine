// src/components/Core/Hero.jsx
import '../../styles/Hero.css';
import HeroContent from './HeroContent';
import HeroSection from './HeroSection';
import HeroSectionPlaceholder from '../Placeholder/HeroSectionPlaceholder';
import Card from './Card';
import { useState } from 'react';

const Hero = ({ loading, sectionDetails: { preferedCountry, radioStationList, searchQuery } }) => {
  const [showAllData, setShowAllData] = useState(null);
  const getTopStations = stations => {
    if (!Array.isArray(stations)) return { topClickCount: [], topClickTrend: [] };

    const getSafeValue = (obj, key) => (typeof obj?.[key] === 'number' ? obj[key] : 0);

    const topClickCount = [...stations]
      .sort((a, b) => getSafeValue(b, 'clickcount') - getSafeValue(a, 'clickcount'))
      .slice(0, 10);

    const topClickTrend = [...stations]
      .sort((a, b) => getSafeValue(b, 'clicktrend') - getSafeValue(a, 'clicktrend'))
      .slice(0, 10);

    return { topClickCount, topClickTrend };
  };

  const { topClickCount, topClickTrend } = getTopStations(radioStationList);

  const categories = [
    { id: 0, title: 'Top Choices', radioList: topClickTrend },
    { id: 1, title: 'Recommended Stations', radioList: topClickCount },
    { id: 2, title: 'Browse All Stations', radioList: radioStationList },
  ];

  // Search Query UI
  if (searchQuery) {
    const queriedStation = radioStationList.filter(station =>
      station.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
    );
    return (
      <>
        <p className="text-xl">
          Search Results for{' '}
          <span className="uppercase text-[var(--color-primary)]">{searchQuery}</span>
        </p>
        {queriedStation.length === 0 ? (
          <div className="text-[var(--color-text-secondary)] mt-2">Station Not Found</div>
        ) : (
          <div
            className="grid 
              grid-cols-[repeat(auto-fit,minmax(120px,1fr))]
              sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]
              md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
              lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
              px-4 gap-2"
          >
            {queriedStation.map(station => (
              <Card key={station?.stationuuid} stationInfo={station} />
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <main className="mt-0 md:mt-9">
      {showAllData?.showAllFlag ? (
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold">{showAllData?.title} Stations</h2>
            <button
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
              onClick={() => setShowAllData(null)}
            >
              Back
            </button>
          </div>
          <div
            className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))]
              md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2 mb-[6rem]"
          >
            {showAllData.radioList.map(station => (
              <Card key={station?.stationuuid} stationInfo={station} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <HeroSectionPlaceholder />
          ) : (
            <HeroSection preferedCountry={preferedCountry} stationCount={radioStationList.length} />
          )}
          <div className="content mt-4 md:mt-8 flex flex-col gap-5 mb-[6rem]">
            {categories.map(cat => (
              <HeroContent
                key={cat.id}
                contentMatter={cat}
                loading={loading}
                showAllFlag={setShowAllData}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default Hero;
