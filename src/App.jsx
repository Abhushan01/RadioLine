// src/App.jsx
import './App.css';
import Footer from './components/Core/Footer';
import Hero from './components/Core/Hero';
import Navbar from './components/Core/Navbar';
import Sidebar from './components/Core/Sidebar';
import CurrentStation from './components/Core/CurrentStation';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Search from './components/Features/Search';
import { useEffect, useState } from 'react';
import CurrentStationPlaceholder from './components/Placeholder/CurrentStationPlaceholder';
import FavoriteStations from './components/Features/FavoriteStations';
import RecentlyPlayed from './components/Features/RecentlyPlayed';
import Genres from './components/Features/Genres';
import { useAudio } from './context/AudioPlayer';
import MapView from './components/Features/MapView';

const fetchWithTimeout = (url, options = {}, timeout = 120000) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });

const App = () => {
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);
  const [radioStationList, setRadioStationList] = useState([]);
  const [preferedCountry, setPreferedCountry] = useState(() => {
    const saved = localStorage.getItem('prefCount');
    return saved ? JSON.parse(saved) : null;
  });

  const [countryData, setCountryData] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [countriesError, setCountriesError] = useState(false);

  // GeoJSON state
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [geoJsonLoading, setGeoJsonLoading] = useState(false);
  const [geoJsonError, setGeoJsonError] = useState(null);

  const { currentStation } = useAudio();
  const isAudioPlaying = useAudio().loading;
  const navigate = useNavigate();
  const location = useLocation();
  const isDiscoverRoute = location.pathname === '/discover';
  const [searchQuery, setSearchQuery] = useState(null);

  const handleDataFromChild = data => setSearchQuery(data);

  // Fetch radio servers
  useEffect(() => {
    const fetchRadioServers = async () => {
      setLoading(true);
      try {
        const response = await fetchWithTimeout(
          'https://all.api.radio-browser.info/json/servers',
          {},
          120000
        );
        if (!response.ok) throw new Error('Failed to load radio servers');

        const result = await response.json();
        const randomServer = result[Math.floor(Math.random() * result.length)]?.name;
        setServer(randomServer);
      } catch (err) {
        console.error('Server fetch error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioServers();
  }, []);

  // Fetch and merge countries
  useEffect(() => {
    if (!server || countryData.length > 0) return;

    const fetchCountries = async () => {
      setCountriesLoading(true);
      setCountriesError(false);

      try {
        const [restRes, radioRes] = await Promise.all([
          fetchWithTimeout(
            'https://restcountries.com/v3.1/all?fields=name,cca2,capital,capitalInfo,flags'
          ),
          fetchWithTimeout(`https://${server}/json/countries`, {
            method: 'POST',
            headers: {
              'Content-Type': `application/x-www-form-urlencoded`,
            },
            body: '',
          }),
        ]);

        if (!restRes.ok || !radioRes.ok) {
          throw new Error('Failed to fetch country data');
        }

        const [restData, radioData] = await Promise.all([restRes.json(), radioRes.json()]);

        const radioMap = {};
        radioData.forEach(item => {
          if (item.iso_3166_1) {
            radioMap[item.iso_3166_1.toUpperCase()] = item;
          }
        });

        const combined = restData
          .map(country => {
            const code = country.cca2?.toUpperCase();
            const radio = radioMap[code];
            if (!radio || radio.stationcount === 0) return null;

            return {
              cca2: code,
              name: country.name?.common || 'Unknown',
              capital: country.capital?.[0] || 'Unknown',
              capitalInfo: country.capitalInfo || {},
              flag: country.flags?.svg || '',
              stationCount: radio.stationcount || 0,
              radioName: radio.name || '',
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountryData(combined);
      } catch (err) {
        console.error('Country fetch error:', err.message);
        setCountriesError(true);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, [server, countryData.length]);

  // Fetch stations for preferred country
  useEffect(() => {
    const fetchRadioStations = async () => {
      if (!preferedCountry) {
        navigate('/discover');
        return;
      }

      if (!server) return;

      setLoading(true);

      try {
        const radioURL = `https://${server}/json/stations/bycountrycodeexact/${preferedCountry.cca2}`;
        const response = await fetchWithTimeout(radioURL, {}, 120000);
        if (!response.ok) throw new Error('Failed to fetch radio stations');

        const result = await response.json();
        setRadioStationList(result);
      } catch (err) {
        console.error('Station fetch error:', err.message);
        setRadioStationList([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioStations();
  }, [server, preferedCountry]);

  // Fetch GeoJSON for preferred country boundaries
  useEffect(() => {
    if (!preferedCountry?.name) {
      setGeoJsonData(null);
      return;
    }

    const fetchGeoJson = async () => {
      setGeoJsonLoading(true);
      setGeoJsonError(null);

      try {
        // Nominatim API call for country polygon GeoJSON
        const apiURL = `https://nominatim.openstreetmap.org/search?q=${preferedCountry.name.toLowerCase()}&format=json&polygon_geojson=1`;
        const response = await fetchWithTimeout(apiURL, {}, 120000);
        if (!response.ok) throw new Error('Failed to fetch boundaries');

        const results = await response.json();

        // Filter only Polygon or MultiPolygon geojson types, map to FeatureCollection
        const polygons = results
          .filter(
            item =>
              item.geojson &&
              (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon')
          )
          .map(item => ({
            type: 'Feature',
            properties: {},
            geometry: item.geojson,
          }));

        if (polygons.length === 0) {
          throw new Error('No polygon boundary data found');
        }

        setGeoJsonData({
          type: 'FeatureCollection',
          features: polygons,
        });
      } catch (error) {
        setGeoJsonError(error.message);
        setGeoJsonData(null);
      } finally {
        setGeoJsonLoading(false);
      }
    };

    fetchGeoJson();
  }, [preferedCountry]);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route
          path="/discover"
          element={
            <MapView
              countryList={countryData}
              loading={countriesLoading || geoJsonLoading}
              error={countriesError || geoJsonError}
              setPreferredCountry={setPreferedCountry}
              geoJsonData={geoJsonData}
              searchQuery={searchQuery}
              prefCount={preferedCountry}
            />
          }
        />
      </Routes>
      <Navbar
        radioStationList={isDiscoverRoute ? [] : radioStationList}
        countryList={isDiscoverRoute ? countryData : []}
        userInput={handleDataFromChild}
      />
      <main className="flex-1 pt-[2.7rem] px-4 md:pt-[5.5rem] lg:pt-[6.1rem] md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          <div className="hidden md:block">
            <Sidebar />
          </div>

          <section
            className={
              !preferedCountry || !currentStation
                ? 'md:col-span-4 mt-9 md:mt-0 '
                : 'md:col-span-3 mt-9 md:mt-0'
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <Hero
                    loading={loading}
                    sectionDetails={{
                      preferedCountry,
                      radioStationList,
                      searchQuery,
                    }}
                  />
                }
              />
              <Route path="/search" element={<Search />} />
              <Route path="/favorites" element={<FavoriteStations />} />
              <Route path="/recents" element={<RecentlyPlayed />} />
              <Route
                path="/genres"
                element={
                  <Genres
                    radioStationList={radioStationList}
                    currentStation={currentStation}
                    loading={loading}
                  />
                }
              />
            </Routes>
          </section>

          {!preferedCountry || !currentStation ? null : (
            <div className="hidden md:block">
              {isAudioPlaying ? <CurrentStationPlaceholder /> : <CurrentStation />}
            </div>
          )}
        </div>
      </main>
      <div className="fixed bottom-0 left-0 w-full block md:hidden z-50">
        <Sidebar mobile />
      </div>
      <Footer loading={loading} />
    </div>
  );
};

export default App;
