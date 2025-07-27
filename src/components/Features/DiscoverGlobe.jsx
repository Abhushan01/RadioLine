import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DiscoverGlobe = ({ countryList, loading, error, setPreferredCountry, searchQuery }) => {
  const [prefCount, setPrefCount] = useState(() => {
    const saved = localStorage.getItem('prefCount');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (prefCount) {
      localStorage.setItem('prefCount', JSON.stringify(prefCount));
      setPreferredCountry(prefCount); // Notify parent App.jsx
    }
  }, [prefCount, setPreferredCountry]);

  const handleSelectCountry = country => {
    setPrefCount({ name: country.name, cca2: country.cca2 });
    navigate('/');
  };

  if (searchQuery) {
    const queriedStation = countryList.filter(country =>
      country.name
        .toLowerCase()
        .replace(/\s+/g, '')
        .includes(searchQuery.toLowerCase().replace(/\s+/g, ''))
    );
    console.log('SEARCHING', queriedStation);
    return (
      <>
        <p className="text-xl">
          Search Results for{' '}
          <span className="uppercase text-[var(--color-primary)]">{searchQuery}</span>
        </p>
        {queriedStation.length === 0 ? (
          <div className="text-[var(--color-text-secondary)] mt-2">Search Not Found</div>
        ) : (
          <div
            className=" grid 
          grid-cols-4
          overflow-x-auto overflow-y-hidden
          no-scrollbar
          snap-x snap-mandatory
          px-4"
          >
            {queriedStation &&
              queriedStation.map(country => (
                <div
                  className="
        bg-[var(--color-navigation-section)] p-4 rounded shadow-sm flex flex-col items-center text-center cursor-pointer"
                  onClick={() => handleSelectCountry(country)}
                >
                  {country.flag && (
                    <img
                      src={country.flag}
                      alt={country.name}
                      className="w-12 h-8 object-contain mb-2"
                    />
                  )}
                  <p className="font-semibold text-lg">{country.name}</p>
                  <p className="text-sm text-gray-500">Capital: {country.capital}</p>
                  <p className="text-sm text-gray-600">Stations: {country.stationCount}</p>
                </div>
              ))}
          </div>
        )}
      </>
    );
  }

  const renderCountryList = () => {
    if (!countryList.length) return <p>No countries with radio stations found.</p>;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {countryList.map((country, index) => (
          <div
            key={index}
            className="
        bg-[var(--color-navigation-section)] p-4 rounded shadow-sm flex flex-col items-center text-center cursor-pointer"
            onClick={() => handleSelectCountry(country)}
          >
            {country.flag && (
              <img src={country.flag} alt={country.name} className="w-12 h-8 object-contain mb-2" />
            )}
            <p className="font-semibold text-lg">{country.name}</p>
            <p className="text-sm text-gray-500">Capital: {country.capital}</p>
            <p className="text-sm text-gray-600">Stations: {country.stationCount}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      {loading && <p>Fetching country details...</p>}
      {error && <p className="text-red-500">Error loading countries. Please try again later.</p>}
      {!loading && !error && renderCountryList()}
    </div>
  );
};

export default DiscoverGlobe;
