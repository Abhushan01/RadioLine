// src/components/Core/HeroContent.jsx
import PropTypes from 'prop-types';
import { useRef } from 'react';
import Card from './Card';
import CardPlaceHolder from '../Placeholder/CardPlaceHolder';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroContent = ({ title }) => {
  const carouselRef = useRef(null);
  const showCards = true;

  const scroll = dir => {
    const c = carouselRef.current;
    if (!c) return;
    const amt = c.offsetWidth / 2; // two cards at a time
    c.scrollBy({ left: dir === 'left' ? -amt : amt, behavior: 'smooth' });
  };

  return (
    <section className="relative flex flex-col gap-3">
      <div className="section-header flex items-center justify-between">
        <p className="font-semibold text-2xl sm:text-4xl">{title}</p>
        <p className="text-sm text-[var(--color-text-secondary)] cursor-pointer hover:underline hover:text-[var(--color-text-primary)]">
          Show All
        </p>
      </div>

      {/* Prev/Next always visible */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--color-navigation-section)] rounded-full shadow hover:scale-105 transition text-[var(--color-text-secondary)]"
      >
        <ChevronLeftIcon className="h-6 w-6 hover:text-[var(--color-text-primary)]" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--color-navigation-section)] rounded-full shadow hover:scale-105 transition text-[var(--color-text-secondary)]"
      >
        <ChevronRightIcon className="h-6 w-6 hover:text-[var(--color-text-primary)]" />
      </button>

      {/* Carousel: 50% width → 2 cards on mobile; natural autosize on ≥640px */}
      <div
        ref={carouselRef}
        className="
          station-carousel
          grid grid-flow-col
          auto-cols-[50%] sm:auto-cols-max
          overflow-x-auto overflow-y-hidden
          no-scrollbar
          snap-x snap-mandatory
          px-4
        "
        style={{ touchAction: 'pan-x' }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="snap-start shrink-0 w-full">
            {showCards ? <Card /> : <CardPlaceHolder />}
          </div>
        ))}
      </div>
    </section>
  );
};

HeroContent.propTypes = { title: PropTypes.string.isRequired };
export default HeroContent;
