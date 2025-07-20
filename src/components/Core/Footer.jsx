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
const Footer = () => {
  const [volume, setVolume] = useState(0.5); // 0 to 1

  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);

    const audio = document.getElementById('audio-player');
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const isLoading = false;
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl  rounded-sm flex justify-between mx-6 h-20 mb-6">
        {isLoading ? (
          <div className="radioStation flex items-center gap-3 px-3">
            <div className="h-16 w-16 bg-pink-950 rounded" />
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 bg-pink-900 rounded" />
              <div className="w-20 h-3 bg-pink-900 rounded" />
            </div>
          </div>
        ) : (
          <div className="radioStation flex items-center gap-3 cursor-default">
            <img
              src="/fallback-image.svg"
              alt="Radio Station"
              className="h-full w-auto object-contain rounded"
            />
            <div className="stationDetails">
              <div className="stationName font-semibold text-2xl">Lorem3333</div>
              <div className="stationLanguage text-[var(--color-text-secondary)] text-sm font-light">
                English
              </div>
            </div>
          </div>
        )}

        <div className="controls flex gap-9 items-center text-[var(--color-text-secondary)]">
          <button
            className="bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={isLoading}
          >
            <BackwardIcon className="h-6 " />
          </button>
          <button
            className="bg-transparent hover:text-[var(--color-primary)] text-[var(--color-bg-1)]"
            disabled={isLoading}
          >
            <PlayIcon className="h-12 bg-[var(--color-text-primary)] rounded-full p-2" />
          </button>
          <button
            className="bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={isLoading}
          >
            <ForwardIcon className="h-6 " />
          </button>
          <button className="bg-transparent hover:text-[var(--color-primary)]" disabled={isLoading}>
            <HeartIcon className="h-6" />
          </button>
        </div>

        <div className="secondary-controls flex items-center gap-3 text-[var(--color-text-secondary)]">
          <button
            className="bg-transparent  hover:text-[var(--color-text-primary)]"
            disabled={isLoading}
          >
            <ArrowsRightLeftIcon className="h-6" />
          </button>
          <button
            className="bg-transparent hover:text-[var(--color-text-primary)]"
            disabled={isLoading}
          >
            <SpeakerWaveIcon className="h-6" />
            <SpeakerXMarkIcon className="hidden h-6 " />
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
            disabled={isLoading}
          />
          <button
            className="bg-transparent  hover:text-[var(--color-text-primary)]"
            disabled={isLoading}
          >
            <ArrowsPointingOutIcon className="h-6" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
