import { useEffect, useState } from 'react';

const CardPlaceHolder = () => {
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
    <div>
      <div className="card h-50 bg-[var(--card-hover-background)] rounded-md p-2 group relative  w-40">
        {/* Card body placeholder */}
        <div className="relative">
          <div
            className={`${theme === 'light' ? 'bg-gray-200' : 'bg-pink-800'} h-35 w-full rounded-md animate-pulse`}
          />

          {/* Circular play button placeholder */}
          <div
            className={`h-10 w-10 ${theme === 'light' ? 'bg-gray-600' : 'bg-pink-950'} rounded-full absolute bottom-2 right-2 animate-pulse`}
          />
        </div>

        {/* Footer text placeholder */}
        <div className="mt-2 space-y-1">
          <div
            className={`h-3 ${theme === 'light' ? 'bg-gray-400' : 'bg-pink-800'} rounded w-3/4 animate-pulse`}
          />

          <div
            className={`h-3 ${theme === 'light' ? 'bg-gray-300' : 'bg-pink-900'} rounded w-1/2 animate-pulse`}
          />
        </div>
      </div>
    </div>
  );
};

export default CardPlaceHolder;
