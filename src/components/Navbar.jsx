import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  // ✅ Initialize theme directly from localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // ✅ Update HTML attribute and save to localStorage on theme change
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50">
      <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl mt-4 p-2 rounded-sm flex justify-between mx-6">
        <div className="flex items-center gap-2 cursor-default">
          <img src="./brand-logo.svg" alt="Brand Logo" />
          <span className="text-2xl bg-[radial-gradient(#ffffff_0%,#403B3B_88%)] bg-clip-text text-transparent">
            RadioLine
          </span>
        </div>

        <div className="bg-[var(--color-navigation-surface)] flex items-center gap-2 rounded-md p-1">
          <MagnifyingGlassIcon className="h-6" />
          <input
            type="text"
            placeholder="Search Radio Station"
            className="w-100 bg-transparent outline-none"
          />
        </div>

        <div>
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
