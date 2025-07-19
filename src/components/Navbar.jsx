import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [theme, setTheme] = useState('light'); // Initial theme

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 ">
      <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl mt-4  p-2 rounded-sm flex justify-between mx-6">
        <div className="flex items-center gap-2">
          <img src="./brand-logo.svg" alt="" />
          <span className="text-2xl bg-[radial-gradient(#ffffff_0%,#403B3B_88%)] bg-clip-text text-transparent">
            RadioLine
          </span>
        </div>

        <div className="bg-[var(--color-navigation-surface)] flex items-center gap-2 rounded-md p-1">
          <MagnifyingGlassIcon className="h-6" />
          <input type="text" name="" id="" placeholder="Search Radio Station" className="w-100" />
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
