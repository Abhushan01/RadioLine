// src/App.jsx
import './App.css';
import Footer from './components/Core/Footer';
import Hero from './components/Core/Hero';
import Navbar from './components/Core/Navbar';
import Sidebar from './components/Core/Sidebar';
import CurrentStation from './components/Core/CurrentStation';
import { Route, Routes } from 'react-router-dom';
import DiscoverGlobe from './components/Features/DiscoverGlobe';
import Search from './components/Features/Search';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-[2.7rem] px-4 md:pt-[5.5rem] lg:pt-[6.1rem] md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          {/* Desktop sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <section className="md:col-span-3 mt-9">
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/discover" element={<DiscoverGlobe />} />
              <Route path="/search" element={<Search />} />
            </Routes>
          </section>

          {/* Desktop current station */}
          <div className="hidden md:block">
            <CurrentStation />
          </div>
        </div>
      </main>

      {/* Mobile: Sidebar icons fixed at very bottom */}
      <div className="fixed bottom-0 left-0 w-full block md:hidden z-50">
        <Sidebar mobile />
      </div>

      {/* Footer: sits above mobile sidebar; on desktop, fixed at bottom-0 */}
      <Footer />
    </div>
  );
}

export default App;
