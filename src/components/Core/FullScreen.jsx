import {
  ChevronDownIcon,
  MusicalNoteIcon,
  HeartIcon as HeartOutlineIcon,
  PauseIcon,
  PlayIcon,
  LanguageIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline';

import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAudio } from '../../context/AudioPlayer';
import Sidebar from './Sidebar';
import { useEffect, useRef, useState } from 'react';
import { useLikedStations } from '../../hooks/useLikedStations';
import '../../styles/FullScreen.css';

const FullScreen = ({ loading, fullScreenMode }) => {
  const { currentStation, isPlaying, togglePlayPause, setVolume, muteVolume, analyserRef } =
    useAudio();
  const [imgError, setImgError] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const [liked, setLiked] = useState(false);
  const { likeStation, unlikeStation, likedStations } = useLikedStations();

  const [volume, setVolState] = useState(0.5);
  const [muteFeat, setMuteFeat] = useState(false);
  const canvasRef = useRef(null); // [NEW]
  const imageCanvasRef = useRef(null);
  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolState(newVolume);
    setVolume(newVolume);
  };

  const handleMuteVolume = () => {
    setMuteFeat(prev => {
      muteVolume(!prev);
      return !prev;
    });
  };

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

  const nameRef = useRef(null);
  const containerRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (nameRef.current && containerRef.current) {
      const nameWidth = nameRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;
      const scrollNeeded = nameWidth > containerWidth;
      setShouldScroll(scrollNeeded);
    }
  }, [currentStation?.name]);
  useEffect(() => {
    if (!analyserRef?.current || !imageCanvasRef.current) return;

    const canvas = imageCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = Math.min(centerX, centerY) / 2;

      // MAIN CIRCULAR WAVEFORM
      ctx.beginPath();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3; // <== Increased stroke width here

      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * 2 * Math.PI;
        const v = dataArray[i] / 255.0;
        const radius = baseRadius + v * 80;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();

      // OPTIONAL: INNER SPIRAL/MIRRORED LAYER
      ctx.beginPath();
      ctx.strokeStyle = 'green';
      ctx.lineWidth = 2; // Lighter stroke for secondary waveform

      for (let i = 0; i < bufferLength; i++) {
        const angle = (i / bufferLength) * 4 * Math.PI;
        const v = dataArray[i] / 255.0;
        const radius = baseRadius + v * 60;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [analyserRef]);

  useEffect(() => {
    if (!analyserRef?.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sliceWidth = canvas.width / bufferLength;
      const midY = canvas.height / 2;

      // ✅ Styling
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fbff12';

      // === TOP waveform ===
      ctx.beginPath();
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = midY - (v * midY) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();

      // === BOTTOM mirrored waveform ===
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = midY + (v * midY) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [analyserRef]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Main content area */}
      <div
        className="
          flex-grow
          bg-[var(--color-navigation-section)]
          backdrop-blur-xl
          mt-2 md:mt-4
          mx-2 md:mx-6 lg:mx-8
          rounded-sm
          overflow-y-auto
          pt-4 md:pt-6
        "
      >
        <div className="header text-xl mb-4 flex items-center">
          <button onClick={fullScreenMode}>
            <ChevronDownIcon className="h-4" />
          </button>
          <div className="items-center flex gap-2 justify-center pe-[15%] md:pe-0 w-full">
            <span>Now Playing</span> <MusicalNoteIcon className="h-4" />
          </div>
        </div>

        <div className="content flex justify-center md:items-center flex-col">
          <div className="relative flex justify-center items-center h-75 w-full">
            <canvas
              ref={imageCanvasRef}
              className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
            />
            {/* Image on top */}
            <img
              src={imageSrc}
              alt="Station"
              onError={() => setImgError(true)}
              className="rounded-full object-cover bg-gray-100 h-50 w-50 z-10"
            />
          </div>

          <div className="flex items-center gap-2 justify-center pe-3 md:pe-0">
            <button onClick={handleLikeClick} disabled={loading}>
              {liked ? (
                <HeartSolidIcon className="h-6 text-red-500" />
              ) : (
                <HeartOutlineIcon className="h-6" />
              )}
            </button>
            <div className="animate-marquee-wrapper w-full" ref={containerRef}>
              <div
                ref={nameRef}
                className={`stationName font-semibold text-xl md:text-4xl whitespace-nowrap inline-block ${
                  shouldScroll ? 'animate-marquee' : ''
                }`}
              >
                {currentStation.name}
              </div>
            </div>
          </div>
          <div className="flex items-center gap- justify-center">
            <LanguageIcon className="h-4" />
            <span>{currentStation?.language || 'Unknown'}</span>
          </div>

          <div className="hidden md:block w-full px-4 md:px-0 ">
            <canvas ref={canvasRef} className="w-full h-24 md:h-32 " />
          </div>
        </div>

        <div className="footer">
          <div className="flex items-center justify-center px-4  gap-2">
            <button onClick={handleMuteVolume} disabled={loading} className="px-0">
              {muteFeat ? (
                <SpeakerXMarkIcon className="h-6" />
              ) : (
                <SpeakerWaveIcon className="h-6" />
              )}
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
          </div>

          {/* Additional Content Goes Here */}
        </div>

        <div className="flex items-center justify-center">
          <button onClick={togglePlayPause} className="text-[var(--color-bg-1)]" disabled={loading}>
            {isPlaying && !loading ? (
              <PauseIcon className="h-20 bg-[var(--color-text-primary)] rounded-full p-2" />
            ) : (
              <PlayIcon className="h-20 bg-[var(--color-text-primary)] rounded-full p-2" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="fixed bottom-0 left-0 w-full block md:hidden z-40">
        <Sidebar mobile />
      </div>

      {/* Footer (placed above mobile nav bar) */}
      {/* <Footer loading={loading} fullScreenMode={fullScreenMode} isFullScreen={fullScreen} /> */}
    </div>
  );
};

export default FullScreen;
