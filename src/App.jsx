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

const App = () => {
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);
  const [radioStationList, setRadioStationList] = useState([]);
  const [preferedCountry] = useState(localStorage.getItem('prefCount') || null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRadioServers = async () => {
      try {
        const response = await fetch('https://all.api.radio-browser.info/json/servers');
        if (!response.ok) {
          throw new Error('Failed to load Data');
        }
        const result = await response.json();
        setServer(result[Math.floor(Math.random() * result.length)]?.name);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioServers();
  }, []);

  useEffect(() => {
    const fetchRadioStations = async () => {
      setLoading(true);
      if (!preferedCountry) {
        navigate('/discover');
        setLoading(false);
      }
      if (!server || !preferedCountry) {
        setLoading(false);
        return;
      }
      try {
        const radioURL = `https://${server}/json/stations/bycountrycodeexact/${preferedCountry}`;
        const response = await fetch(radioURL);
        if (!response.ok) {
          throw new Error('Failed to fetch Stations');
        }
        const result = await response.json();
        if (result.length > 0) {
          setRadioStationList(result);
          setLoading(false);
          console.log('checking', radioStationList);
        }
      } catch (error) {
        setRadioStationList([]);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRadioStations();
  }, [server, preferedCountry]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar radioStationList={radioStationList} />
      {radioStationList &&
        radioStationList.length > 0 &&
        radioStationList.map(radio => {
          <div>{radio.name}</div>;
        })}
      <main className="flex-1 pt-[2.7rem] px-4 md:pt-[5.5rem] lg:pt-[6.1rem] md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <section className={!preferedCountry ? 'md:col-span-4 mt-9' : 'md:col-span-3 mt-9'}>
            <Routes>
              <Route
                path="/"
                element={
                  <Hero
                    loading={loading}
                    sectionDetails={{
                      preferedCountry,
                      radioStationList,
                    }}
                  />
                }
              />
              <Route path="/discover" element={<DiscoverGlobe />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </section>

          {/* Desktop current station */}
          {!preferedCountry ? (
            <></>
          ) : (
            <div className="hidden md:block">
              {loading ? <CurrentStationPlaceholder /> : <CurrentStation />}
            </div>
          )}
        </div>
      </main>
      {/* Mobile: Sidebar icons fixed at very bottom */}
      <div className="fixed bottom-0 left-0 w-full block md:hidden z-50">
        <Sidebar mobile />
      </div>
      {/* Footer: sits above mobile sidebar; on desktop, fixed at bottom-0 */}
      <Footer loading={loading} />
    </div>
  );
};

export default App;
