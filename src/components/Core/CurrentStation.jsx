import { useState, useEffect } from 'react';
import { GlobeAltIcon, LanguageIcon, MusicalNoteIcon, StarIcon } from '@heroicons/react/24/outline';
import { CursorArrowRaysIcon } from '@heroicons/react/24/solid';
import { useAudio } from '../../context/AudioPlayer';
import '../../styles/CurrentStation.css';

const CurrentStation = () => {
  const { currentStation } = useAudio();
  const [imgError, setImgError] = useState(false);
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

  const fallbackSrc = theme === 'light' ? 'fallback-image-light.svg' : 'fallback-image.svg';

  const imageSrc =
    !currentStation?.favicon ||
    currentStation?.favicon === '' ||
    currentStation?.favicon === 'null' ||
    currentStation?.favicon === null ||
    imgError
      ? fallbackSrc
      : currentStation?.favicon;

  return (
    <aside
      className="
        fixed z-50 
        w-[18.5%]  
        h-full 
        bg-[var(--color-navigation-section)] backdrop-blur-xl 
        p-4 rounded-sm 
      "
    >
      <div className="flex flex-col gap-2">
        <p className="text-md font-semibold leading-tight">
          <span className="text-[var(--color-text-secondary)] text-sm">Now Playing: </span>
          <span>{currentStation?.name}</span>
        </p>

        <img
          src={imageSrc}
          alt="Station"
          onError={() => setImgError(true)}
          className="rounded-md w-full object-cover max-h-48 sm:max-h-60"
        />

        <div className="flex items-baseline gap-2 overflow-hidden">
          <div className="relative w-full overflow-hidden max-w-[180px]">
            <div className="marquee whitespace-nowrap font-semibold text-xl sm:text-2xl">
              {currentStation?.name}
            </div>
          </div>
          {currentStation?.homepage && (
            <a href={currentStation?.homepage} target="_blank" rel="noopener noreferrer">
              <GlobeAltIcon className="h-5 text-[var(--color-primary)]" />
            </a>
          )}
        </div>

        <hr className="border-[var(--color-border)] mt-2" />

        <div className="stationDetails mt-1 text-[var(--color-text-secondary)] text-sm flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <LanguageIcon className="h-4" />
            <span>{currentStation?.language || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-2">
            <MusicalNoteIcon className="h-4" />
            <span className="truncate">{currentStation?.tags || 'NA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CursorArrowRaysIcon className="h-4" />
            <span>{currentStation?.clickcount || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <StarIcon className="h-4" />
            <span>{currentStation?.votes || 0}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CurrentStation;
