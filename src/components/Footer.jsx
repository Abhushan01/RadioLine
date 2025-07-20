import { useState } from 'react';
import '../styles/Footer.css';
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsRightLeftIcon,
  ForwardIcon,
  BackwardIcon,
  HeartIcon,
  PlayCircleIcon,
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

  return (
    <footer className="fixed bottom-0 left-0 w-full z-50">
      <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl  rounded-sm flex justify-between mx-6 h-20 mb-6">
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

        <div className="controls flex gap-9 items-center text-[var(--color-text-secondary)]">
          <BackwardIcon className="h-6 hover:text-[var(--color-text-primary)] cursor-pointer" />
          <PlayIcon className="h-12 hover:text-[var(--color-primary)]  cursor-pointer bg-[var(--color-text-primary)] text-[var(--color-bg-1)] rounded-full p-2" />
          <PlayCircleIcon className="hidden h-12 hover:text-[var(--color-primary)] text-[var(--color-text-primary)] cursor-pointer" />
          <ForwardIcon className="h-6 hover:text-[var(--color-text-primary)] cursor-pointer" />
          <HeartIcon className="h-6 hover:text-[var(--color-primary)] cursor-pointer" />
        </div>

        <div className="secondary-controls flex items-center gap-3 text-[var(--color-text-secondary)]">
          <ArrowsRightLeftIcon className="h-6 hover:text-[var(--color-text-primary)] cursor-pointer" />
          <SpeakerWaveIcon className="h-6 hover:text-[var(--color-text-primary)] cursor-pointer" />
          <SpeakerXMarkIcon className="hidden h-6 hover:text-[var(--color-text-primary)] cursor-pointer" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-range no-thumb"
            style={{ backgroundSize: `${volume * 100}% 100%` }}
          />
          <ArrowsPointingOutIcon className="h-6 hover:text-[var(--color-text-primary)] cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
