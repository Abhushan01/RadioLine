import { useState } from 'react';
import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import '../../styles/Hero.css';
import { useAudio } from '../../context/AudioPlayer';

const Card = ({ stationInfo }) => {
  const [pressed, setPressed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handlePressStart = () => setPressed(true);
  const handlePressEnd = () => setPressed(false);

  const fallbackSrc = '/fallback-image.svg';

  const imageSrc =
    !stationInfo.favicon ||
    stationInfo.favicon === '' ||
    stationInfo.favicon === 'null' ||
    stationInfo.favicon === null ||
    imgError
      ? fallbackSrc
      : stationInfo.favicon;

  const { playStation, isPlaying, currentStation, togglePlayPause } = useAudio();

  return (
    <div className="snap-start shrink-0 w-full">
      <div
        className={`
          card rounded-md p-2 md:p-2 w-[150px] md:w-[170px]
          cursor-pointer text-[var(--color-text-secondary)]
          relative group hover:bg-[#0D0206] hover:text-[var(--color-text-primary)]
          ${pressed ? 'bg-[#0D0206] text-[var(--color-text-primary)]' : ''}
        `}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onClick={() => {
          if (isPlaying && currentStation?.url_resolved === stationInfo.url_resolved) {
            togglePlayPause();
          } else {
            playStation(stationInfo);
          }
        }}
      >
        {/* Image + Play overlay */}
        <div className="relative">
          <img
            src={imageSrc}
            alt="Station"
            onError={() => setImgError(true)}
            className="rounded-md w-full h-35 md:h-40 object-cover"
          />

          {isPlaying && currentStation?.url_resolved === stationInfo.url_resolved ? (
            <PauseIcon
              className="h-10 w-10 text-[var(--color-bg-1)]
              bg-[var(--color-accent)] rounded-full p-2
              absolute bottom-2 right-2"
            />
          ) : (
            <PlayIcon
              className={`
              h-10 w-10 text-[var(--color-bg-1)]
              bg-[var(--color-accent)] rounded-full p-2
              absolute bottom-2 right-2
              transition-opacity duration-300
              ${pressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              hover:bg-[var(--color-accent-hover)] hover:text-black
            `}
            />
          )}
        </div>

        {/* Station Name */}
        <div className="card-footer mt-2 text-sm">{stationInfo.name}</div>
      </div>
    </div>
  );
};

export default Card;
