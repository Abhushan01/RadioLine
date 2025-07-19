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
} from '@heroicons/react/24/outline';
const Footer = () => (
  <footer className="fixed bottom-0 left-0 w-full z-50">
    <div className="bg-[var(--color-navigation-section)] backdrop-blur-xl  rounded-sm flex justify-between mx-6 h-20 mb-6">
      <div className="radioStation flex items-center gap-3">
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
        <BackwardIcon className="h-6 w-6" />
        <PlayCircleIcon className="h-12 w-12" />
        <ForwardIcon className="h-6 w-6" />
        <HeartIcon className="h-6 w-6" />
      </div>

      <div className="secondary-controls flex items-center gap-3 text-[var(--color-text-secondary)]">
        <ArrowsRightLeftIcon className="h-6 w-6" />
        <SpeakerWaveIcon className="w-6 h-6" />
        <SpeakerXMarkIcon className="hidden w-6 h-6" />
        <input type="range" name="" id="" />
        <ArrowsPointingOutIcon className="w-6 h-6" />
      </div>
    </div>
  </footer>
);

export default Footer;
