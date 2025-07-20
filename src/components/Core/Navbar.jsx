// src/components/Core/Navbar.jsx
import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const handleMobileSearch = () => {
    const query = prompt('Search Radio Station');
    if (query) {
      console.log('Searching for:', query);
      // integrate real search logic here
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div
        className="
          bg-[var(--color-navigation-section)]
          backdrop-blur-xl
          mt-2 md:mt-4 p-2 rounded-sm
          flex justify-between items-center
          mx-2 md:mx-6
        "
      >
        {/* Logo + Text */}
        <div className="flex items-center gap-2 cursor-default">
          <img src="./brand-logo.svg" alt="Brand Logo" className="h-8 md:h-auto w-auto" />
          <span className="text-xl md:text-2xl bg-[radial-gradient(#ffffff_0%,#403B3B_88%)] bg-clip-text text-transparent">
            RadioLine
          </span>
        </div>

        {/* Desktop-only Search Input */}
        <div
          className="
            hidden md:flex
            bg-[var(--color-navigation-surface)]
            items-center gap-2
            rounded-md p-1
            flex-1 max-w-md
          "
        >
          <MagnifyingGlassIcon className="h-6" />
          <input
            type="text"
            placeholder="Search Radio Station"
            className="flex-1 bg-transparent outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile-only Magnifier */}
          <button onClick={handleMobileSearch} className="block md:hidden p-0 bg-transparent">
            <MagnifyingGlassIcon className="h-6 text-[var(--color-text-primary)]" />
          </button>

          {/* Theme toggle */}
          <button onClick={toggleTheme} className="bg-transparent">
            {theme === 'light' ? (
              <SunIcon className="h-6 text-[var(--color-primary)]" />
            ) : (
              <MoonIcon className="h-6 text-[var(--color-primary)]" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
