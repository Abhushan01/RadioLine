// src/components/Footer/Footer.jsx
import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../context/AudioPlayer';
import { useLikedStations } from '../../hooks/useLikedStations';
import '../../styles/Footer.css';
import {
  SpeakerWaveIcon,
  HeartIcon as HeartOutlineIcon,
  ArrowsPointingOutIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  const { currentStation, isPlaying, togglePlayPause, setVolume, loading } = useAudio();

  const { likeStation, unlikeStation, likedStations } = useLikedStations();

  const [volume, setVolState] = useState(0.5);
  const [imgError, setImgError] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const [liked, setLiked] = useState(false);
  const nameRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolState(newVolume);
    setVolume(newVolume);
  };

  useEffect(() => {
    if (nameRef.current && containerRef.current) {
      const scrollNeeded = nameRef.current.scrollWidth > containerRef.current.offsetWidth;
      setShouldScroll(scrollNeeded);
    }
  }, [currentStation?.name]);

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
  }, []);

  useEffect(() => {
    if (currentStation?.stationuuid) {
      const match = likedStations.some(
        station => station.stationuuid === currentStation.stationuuid
      );
      setLiked(match);
    } else {
      setLiked(false);
    }
  }, [currentStation, likedStations]);

  const handleLikeClick = async () => {
    if (!currentStation) return;

    if (liked) {
      await unlikeStation(currentStation.stationuuid);
    } else {
      await likeStation(currentStation);
    }
  };

  const fallbackSrc = theme === 'light' ? '/fallback-image-light.svg' : '/fallback-image.svg';

  const renderStationInfo = () => {
    if (loading) {
      return (
        <>
          <div
            className={`h-16 w-16 ${theme === 'light' ? 'bg-gray-600' : 'bg-pink-950'} rounded animate-pulse`}
          />
          <div className="flex flex-col gap-2">
            <div
              className={`w-32 h-4 ${theme === 'light' ? 'bg-gray-500' : 'bg-pink-900'} rounded animate-pulse`}
            />
            <div
              className={`w-20 h-3 ${theme === 'light' ? 'bg-gray-400' : 'bg-pink-900'} rounded animate-pulse`}
            />
          </div>
        </>
      );
    }

    if (!currentStation) {
      return (
        <div className="flex items-center px-4 py-2 text-sm text-[var(--color-text-secondary)]">
          No station selected. Please select a station to start playing.
        </div>
      );
    }

    const imageSrc =
      !currentStation.favicon ||
      currentStation.favicon === 'null' ||
      currentStation.favicon === '' ||
      imgError
        ? fallbackSrc
        : currentStation.favicon;

    return (
      <>
        <img
          src={imageSrc}
          alt="Radio Station"
          className="h-16 w-16 object-contain rounded"
          onError={() => setImgError(true)}
        />
        <div
          className="flex flex-col overflow-hidden max-w-[150px] md:max-w-none"
          ref={containerRef}
        >
          <div
            ref={nameRef}
            className={`stationName font-semibold text-lg md:text-2xl whitespace-nowrap overflow-hidden relative ${
              shouldScroll ? 'animate-marquee' : ''
            }`}
          >
            {currentStation.name}
          </div>
          <div className="stationLanguage text-[var(--color-text-secondary)] text-sm font-light">
            {currentStation.language || 'Unknown'}
          </div>
        </div>
      </>
    );
  };

  return (
    <footer className="fixed left-0 w-full z-50 bottom-10 md:bottom-0">
      <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl rounded-sm flex justify-between items-center mx-2 md:mx-6 mb-6">
        {/* Station Info */}
        <div className="radioStation flex items-center gap-3 cursor-default h-16">
          {renderStationInfo()}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4">
          <button onClick={togglePlayPause} className="text-[var(--color-bg-1)]" disabled={loading}>
            {isPlaying && !loading ? (
              <PauseIcon className="h-12 bg-[var(--color-text-primary)] rounded-full p-2" />
            ) : (
              <PlayIcon className="h-12 bg-[var(--color-text-primary)] rounded-full p-2" />
            )}
          </button>
        </div>

        {/* Volume Controls */}
        <div className="mx-2 md:flex items-center gap-3 ">
          <button onClick={handleLikeClick} disabled={loading}>
            {liked ? (
              <HeartSolidIcon className="h-6 text-red-500" />
            ) : (
              <HeartOutlineIcon className="h-6" />
            )}
          </button>
          <div className="hidden md:flex items-center gap-3 text-[var(--color-text-secondary)]">
            <SpeakerWaveIcon className="h-6" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-range no-thumb"
              style={{ backgroundSize: `${volume * 100}% 100%` }}
              disabled={loading}
            />
            <button className="hover:text-[var(--color-text-primary)]" disabled={loading}>
              <ArrowsPointingOutIcon className="h-6" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
