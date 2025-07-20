import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/outline';
import '../../styles/Hero.css';

const Card = () => {
  const [pressed, setPressed] = useState(false);

  // simulate hover on touch
  const handlePressStart = () => setPressed(true);
  const handlePressEnd = () => setPressed(false);

  return (
    <div className="snap-start shrink-0 w-full">
      <div
        className={`
          card
          rounded-md
          p-2 md:p-2
          cursor-pointer
          text-[var(--color-text-secondary)]
          relative group
          hover:bg-[#0D0206]
          hover:text-[var(--color-text-primary)]
          ${pressed ? 'bg-[#0D0206] text-[var(--color-text-primary)]' : ''}
        `}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
      >
        {/* Image + Play overlay */}
        <div className="relative">
          <img
            src="/fallback-image.svg"
            alt="Station"
            className="rounded-md w-full h-35 md:h-40 object-cover"
          />
          <PlayIcon
            className={`
              h-10 w-10
              text-[var(--color-bg-1)]
              bg-[var(--color-accent)]
              rounded-full p-2
              absolute bottom-2 right-2
              transition-opacity duration-300
              ${pressed ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
              hover:bg-[var(--color-accent-hover)] hover:text-black
            `}
          />
        </div>

        {/* Station Name */}
        <div className="card-footer mt-2 text-sm">Radio Station Name</div>
      </div>
    </div>
  );
};

export default Card;
