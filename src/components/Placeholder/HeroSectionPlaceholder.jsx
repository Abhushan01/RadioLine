import { useEffect, useState } from 'react';

const HeroSectionPlaceholder = () => {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.dataset.theme || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, [theme]);

  return (
    <div className="glow-wrapper">
      <div className="glow-block hero-section bg-[var(--color-navigation-section)] backdrop-blur-xl mt-9 flex p-7 rounded-md animate-pulse">
        {/* Left Side (Country Details) */}
        <div className="countryDetails flex flex-col gap-3 flex-1">
          {/* Country Info (Text + Flag) */}
          <div className="countryInfo flex items-center gap-4">
            <div
              className={`h-24 w-50 md:w-70 ${theme === 'light' ? 'bg-gray-500' : 'bg-pink-900'} rounded`}
            />{' '}
            {/* Placeholder for 'INDIA' */}
            <div
              className={`h-12 w-12 ${theme === 'light' ? 'bg-gray-400' : 'bg-pink-800'} rounded`}
            />{' '}
            {/* Flag placeholder */}
          </div>

          {/* Radio station count */}
          <div className="flex items-center gap-3">
            <div
              className={`h-6 w-6 ${theme === 'light' ? 'bg-gray-400' : 'bg-pink-800'} rounded`}
            />{' '}
            {/* Radio icon placeholder */}
            <div
              className={`h-4 w-28 ${theme === 'light' ? 'bg-gray-500' : 'bg-pink-900'} rounded`}
            />{' '}
            {/* "468 Stations" */}
          </div>

          {/* CTA Button */}
          <div
            className={`w-60 h-10 ${theme === 'light' ? 'bg-gray-600' : 'bg-pink-950'} rounded`}
          />
        </div>

        {/* Right Side (Hero Graphic) */}
        <div className="hidden sm:block">
          <div
            className={`h-40 w-40 ${theme === 'light' ? 'bg-gray-400' : 'bg-pink-800'} rounded-md`}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSectionPlaceholder;
