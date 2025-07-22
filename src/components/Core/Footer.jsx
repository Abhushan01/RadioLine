// src/components/Core/Footer.jsx
import { useState } from 'react';
import '../../styles/Footer.css';
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsRightLeftIcon,
  ForwardIcon,
  BackwardIcon,
  HeartIcon,
  ArrowsPointingOutIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

const Footer = ({ loading }) => {
  const [volume, setVolume] = useState(0.5);
  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const audio = document.getElementById('audio-player');
    if (audio) audio.volume = newVolume;
  };

  return (
    <footer className="fixed left-0 w-full z-50 bottom-10 md:bottom-0">
      <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl rounded-sm flex justify-between items-center mx-2 md:mx-6 mb-6">
        {/* Station Info */}
        <div className="radioStation flex items-center gap-3 cursor-default">
          {loading ? (
            <>
              <div className="h-16 w-16 bg-pink-950 rounded animate-pulse" />
              <div className="flex flex-col gap-2">
                <div className="w-32 h-4 bg-pink-900 rounded animate-pulse" />
                <div className="w-20 h-3 bg-pink-900 rounded animate-pulse" />
              </div>
            </>
          ) : (
            <>
              <img
                src="/fallback-image.svg"
                alt="Radio Station"
                className="h-16 w-16 object-contain rounded"
              />
              <div className="flex flex-col">
                <div className="stationName font-semibold text-lg md:text-2xl">Lorem3333</div>
                <div className="stationLanguage text-[var(--color-text-secondary)] text-sm font-light">
                  English
                </div>
              </div>
            </>
          )}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4">
          <button
            className="hidden md:inline bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={loading}
          >
            <BackwardIcon className="h-6" />
          </button>

          <button
            className="bg-transparent hover:text-[var(--color-primary)] text-[var(--color-bg-1)]"
            disabled={loading}
          >
            <PlayIcon className="h-12 bg-[var(--color-text-primary)] rounded-full p-2" />
          </button>

          <button
            className="hidden md:inline bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={loading}
          >
            <ForwardIcon className="h-6" />
          </button>

          <button className="bg-transparent hover:text-[var(--color-primary)]" disabled={loading}>
            <HeartIcon className="h-6" />
          </button>
        </div>

        {/* Secondary Controls (desktop only) */}
        <div className="hidden md:flex items-center gap-3 text-[var(--color-text-secondary)]">
          <button
            className="bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={loading}
          >
            <ArrowsRightLeftIcon className="h-6" />
          </button>
          <button
            className="bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={loading}
          >
            <SpeakerWaveIcon className="h-6" />
            <SpeakerXMarkIcon className="hidden h-6" />
          </button>
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
          <button
            className="bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={loading}
          >
            <ArrowsPointingOutIcon className="h-6" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
