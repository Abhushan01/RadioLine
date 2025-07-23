import { useEffect, useRef, useState } from 'react';
import { useAudio } from '../../context/AudioPlayer';
import '../../styles/Footer.css';
import {
  SpeakerWaveIcon,
  ArrowsRightLeftIcon,
  ForwardIcon,
  BackwardIcon,
  HeartIcon,
  ArrowsPointingOutIcon,
  PlayIcon,
  PauseIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const { currentStation, isPlaying, togglePlayPause, setVolume, loading } = useAudio();
  const [volume, setVolState] = useState(0.5);
  const nameRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolState(newVolume);
    setVolume(newVolume);
  };

  // Check if the station name overflows its container
  useEffect(() => {
    if (nameRef.current && containerRef.current) {
      const scrollNeeded = nameRef.current.scrollWidth > containerRef.current.offsetWidth;
      setShouldScroll(scrollNeeded);
    }
  }, [currentStation?.name]);

  const renderStationInfo = () => {
    if (loading) {
      return (
        <>
          <div className="h-16 w-16 bg-pink-950 rounded animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="w-32 h-4 bg-pink-900 rounded animate-pulse" />
            <div className="w-20 h-3 bg-pink-900 rounded animate-pulse" />
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

    return (
      <>
        <img
          src={
            !currentStation.favicon ||
            currentStation.favicon === 'null' ||
            currentStation.favicon === ''
              ? '/fallback-image.svg'
              : currentStation.favicon
          }
          alt="Radio Station"
          className="h-16 w-16 object-contain rounded"
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
          <button className="hidden md:inline" disabled={loading}>
            <BackwardIcon className="h-6" />
          </button>

          <button onClick={togglePlayPause} className="text-[var(--color-bg-1)]" disabled={loading}>
            {isPlaying && !loading ? (
              <PauseIcon className="h-12 bg-[var(--color-text-primary)] rounded-full p-2" />
            ) : (
              <PlayIcon className="h-12 bg-[var(--color-text-primary)] rounded-full p-2" />
            )}
          </button>

          <button className="hidden md:inline" disabled={loading}>
            <ForwardIcon className="h-6" />
          </button>

          <button className="hover:text-[var(--color-primary)]" disabled={loading}>
            <HeartIcon className="h-6" />
          </button>
        </div>

        {/* Volume Controls */}
        <div className="hidden md:flex items-center gap-3 text-[var(--color-text-secondary)]">
          <button className="hover:text-[var(--color-text-primary)]" disabled={loading}>
            <ArrowsRightLeftIcon className="h-6" />
          </button>
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
    </footer>
  );
};

export default Footer;
