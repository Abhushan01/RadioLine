// src/App.jsx
import './App.css';
import Footer from './components/Core/Footer';
import Hero from './components/Core/Hero';
import Navbar from './components/Core/Navbar';
import Sidebar from './components/Core/Sidebar';
import CurrentStation from './components/Core/CurrentStation';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DiscoverGlobe from './components/Features/DiscoverGlobe';
import Search from './components/Features/Search';
import { useEffect, useState } from 'react';
import CurrentStationPlaceholder from './components/Placeholder/CurrentStationPlaceholder';
import { useAudio } from './context/AudioPlayer';

// timeout helper
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
  const [preferedCountry] = useState('IN'); // Can be pulled from localStorage
  const { currentStation } = useAudio();
  const isAudioPlaying = useAudio().loading;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(null);

  const handleDataFromChild = data => {
    setSearchQuery(data);
  };

  // Fetch available radio servers
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
      }
    };

    fetchRadioServers();
  }, []);

  // Fetch stations for the preferred country
  useEffect(() => {
    const fetchRadioStations = async () => {
      if (!preferedCountry) {
        navigate('/discover');
        return;
      }

      if (!server) return;

      setLoading(true);

      try {
        const radioURL = `https://${server}/json/stations/bycountrycodeexact/${preferedCountry}`;
        const response = await fetchWithTimeout(radioURL, {}, 120000);
        if (!response.ok) throw new Error('Failed to fetch radio stations');

        const result = await response.json();
        setRadioStationList(result);
        console.log('Fetched stations:', result);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar radioStationList={radioStationList} userInput={handleDataFromChild} />

      <main className="flex-1 pt-[2.7rem] px-4 md:pt-[5.5rem] lg:pt-[6.1rem] md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <section
            className={
              !preferedCountry || !currentStation ? 'md:col-span-4 mt-9' : 'md:col-span-3 mt-9'
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
              <Route path="/discover" element={<DiscoverGlobe />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </section>

          {/* Desktop current station */}
          {!preferedCountry || !currentStation ? (
            <></>
          ) : (
            <div className="hidden md:block">
              {isAudioPlaying ? <CurrentStationPlaceholder /> : <CurrentStation />}
            </div>
          )}
        </div>
      </main>

      {/* Mobile: Sidebar icons fixed at bottom */}
      <div className="fixed bottom-0 left-0 w-full block md:hidden z-50">
        <Sidebar mobile />
      </div>

      {/* Footer */}
      <Footer loading={loading} />
    </div>
  );
};

export default App;
