import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Navbar = ({ radioStationList = [], countryList = [], userInput, isDiscoverRoute }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const sendUserQuery = inputValue => {
    userInput(inputValue);
  };

  const handleMobileSearchClick = () => {
    setMobileSearchActive(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setMobileSearchActive(false);
    }, 100);
  };

  useEffect(() => {
    if (mobileSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mobileSearchActive]);

  // Dynamic logo based on theme
  const brandLogoSrc = theme === 'light' ? 'brand-logo-light.svg' : 'brand-logo.svg';

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div
        className="bg-[var(--color-navigation-section)]
        backdrop-blur-xl
        mt-2 md:mt-4 p-2 rounded-sm
        flex justify-between items-center
        mx-2 md:mx-6 min-h-[3.5rem]"
      >
        {/* Mobile Search View */}
        {mobileSearchActive ? (
          <div className="flex w-full items-center gap-2 bg-[var(--color-navigation-surface)] rounded-md px-2 py-1">
            <MagnifyingGlassIcon className="h-5 shrink-0" />
            <input
              type="text"
              placeholder={isDiscoverRoute ? 'Search Country' : 'Search Radio Station'}
              className="flex-1 bg-transparent outline-none text-sm"
              list="stations-or-countries"
              ref={inputRef}
              onChange={e => sendUserQuery(e.target.value)}
              onBlur={handleBlur}
            />
            <datalist id="stations-or-countries">
              {(isDiscoverRoute ? countryList : radioStationList).map((item, index) => (
                <option key={index} value={item.name} />
              ))}
            </datalist>
          </div>
        ) : (
          <>
            {/* Logo + Title (Hidden in search mode) */}
            <div className="flex items-center gap-2 cursor-default">
              <img src={brandLogoSrc} alt="Brand Logo" className="h-8 md:h-auto w-auto" />
              <span className="text-xl md:text-2xl bg-[radial-gradient(#ffffff_0%,#403B3B_88%)] bg-clip-text text-transparent">
                RadioLine
              </span>
            </div>

            {/* Desktop Search */}
            {!isDiscoverRoute && (
              <div
                className="hidden md:flex bg-[var(--color-navigation-surface)] items-center gap-2
                rounded-md p-1 flex-1 max-w-md"
              >
                <MagnifyingGlassIcon className="h-6" />
                <input
                  type="text"
                  placeholder="Search Radio Station"
                  className="flex-1 bg-transparent outline-none"
                  list="stations"
                  onChange={e => sendUserQuery(e.target.value)}
                />
                <datalist id="stations">
                  {radioStationList.map((c, index) => (
                    <option key={index} value={c.name} />
                  ))}
                </datalist>
              </div>
            )}

            {/* Placeholder for Discover route (desktop only) */}
            {isDiscoverRoute && (
              <div className="hidden md:flex text-[var(--color-text-secondary)] italic select-none px-2">
                Select a country to view stations
              </div>
            )}

            {/* Mobile Icons */}
            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={handleMobileSearchClick}
                className="block md:hidden p-0 bg-transparent"
              >
                <MagnifyingGlassIcon className="h-6 text-[var(--color-text-primary)]" />
              </button>

              <button onClick={toggleTheme} className="bg-transparent">
                {theme === 'light' ? (
                  <SunIcon className="h-6 text-[var(--color-primary)]" />
                ) : (
                  <MoonIcon className="h-6 text-[var(--color-primary)]" />
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
