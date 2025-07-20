import PropTypes from 'prop-types';
import { useRef } from 'react';
import Card from './Card';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroContent = ({ title }) => {
  const carouselRef = useRef(null);

  const scroll = direction => {
    const { current } = carouselRef;
    if (!current) return;
    const scrollAmount = 300; // pixels per scroll
    current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="flex flex-col gap-3 relative">
      <div className="section-header flex items-center justify-between">
        <p className="font-semibold text-4xl">{title}</p>
        <p className="text-sm text-[var(--color-text-secondary)] cursor-pointer hover:underline hover:text-[var(--color-text-primary)]">
          Show All
        </p>
      </div>

      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--color-navigation-section)] rounded-full shadow hover:scale-105 transition hidden sm:block text-[var(--color-text-secondary)]"
      >
        <ChevronLeftIcon className="h-6 w-6 hover:text-[var(--color-text-primary)]" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--color-navigation-section)] rounded-full shadow hover:scale-105 transition hidden sm:block text-[var(--color-text-secondary)]"
      >
        <ChevronRightIcon className="h-6 w-6 hover:text-[var(--color-text-primary)]" />
      </button>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="station-carousel grid grid-flow-col auto-cols-max gap-2  overflow-hidden no-scrollbar scroll-smooth snap-x snap-mandatory px-1"
      >
        {[...Array(10)].map((_, idx) => (
          <div key={idx} className="snap-start shrink-0">
            <Card />
          </div>
        ))}
      </div>
    </section>
  );
};

HeroContent.propTypes = {
  title: PropTypes.string.isRequired,
};

export default HeroContent;
