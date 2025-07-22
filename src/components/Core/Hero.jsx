// src/components/Core/Hero.jsx
import '../../styles/Hero.css';
import HeroContent from './HeroContent';
import HeroSection from './HeroSection';
import HeroSectionPlaceholder from '../Placeholder/HeroSectionPlaceholder';

const Hero = ({ loading, sectionDetails: { preferedCountry, radioStationList } }) => {
  const getTopStations = stations => {
    if (!Array.isArray(stations)) return { topClickCount: [], topClickTrend: [] };

    // Helper: safely get value or fallback to 0
    const getSafeValue = (obj, key) => {
      const val = obj?.[key];
      return typeof val === 'number' ? val : 0;
    };

    // Sort by clickcount descending
    const topClickCount = [...stations]
      .sort((a, b) => getSafeValue(b, 'clickcount') - getSafeValue(a, 'clickcount'))
      .slice(0, 10);

    // Sort by clicktrend descending
    const topClickTrend = [...stations]
      .sort((a, b) => getSafeValue(b, 'clicktrend') - getSafeValue(a, 'clicktrend'))
      .slice(0, 10);

    return { topClickCount, topClickTrend };
  };

  const { topClickCount, topClickTrend } = getTopStations(radioStationList);

  console.log(topClickCount[9]);
  const categories = [
    { id: 0, title: 'Top Choices', radioList: topClickTrend },
    { id: 1, title: 'Recommended Stations', radioList: topClickCount },
    { id: 2, title: 'Browse All Stations', radioList: radioStationList },
  ];
  console.log('checking', radioStationList);
  return (
    <main>
      {loading ? <HeroSectionPlaceholder /> : <HeroSection preferedCountry={preferedCountry} />}

      <div className="content mt-4 md:mt-8 flex flex-col gap-5 mb-[10rem]">
        {categories.map(cat => (
          <HeroContent contentMatter={cat} loading={loading} key={cat.id} />
        ))}
      </div>
    </main>
  );
};

export default Hero;
