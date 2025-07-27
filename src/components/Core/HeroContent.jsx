// src/components/Core/HeroContent.jsx
import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import Card from './Card';
import CardPlaceHolder from '../Placeholder/CardPlaceHolder';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const HeroContent = ({ loading, contentMatter, showAllFlag }) => {
  const { title = 'Untitled', radioList = [] } = contentMatter || {};
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hasStations = Array.isArray(radioList) && radioList.length > 0;

  const updateScrollButtons = () => {
    const c = carouselRef.current;
    if (c && hasStations) {
      setCanScrollLeft(c.scrollLeft > 0);
      setCanScrollRight(c.scrollLeft + c.clientWidth < c.scrollWidth);
    }
  };

  const scroll = dir => {
    const c = carouselRef.current;
    if (!c) return;
    const amt = c.offsetWidth / 2;
    c.scrollBy({ left: dir === 'left' ? -amt : amt, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!hasStations) return;
    updateScrollButtons();
    const c = carouselRef.current;
    if (!c) return;
    const handleScroll = () => updateScrollButtons();
    c.addEventListener('scroll', handleScroll);
    return () => c.removeEventListener('scroll', handleScroll);
  }, [radioList, hasStations]);

  const handleShowAllClick = () => {
    showAllFlag({ showAllFlag: true, title, radioList });
  };

  return (
    <section className="relative flex flex-col gap-3">
      <div className="section-header flex items-center justify-between">
        <p className="font-semibold text-2xl sm:text-4xl">{title}</p>
        {hasStations && (
          <button
            className="bg-transparent text-sm text-[var(--color-text-secondary)] hover:underline hover:text-[var(--color-text-primary)]"
            onClick={handleShowAllClick}
          >
            Show All
          </button>
        )}
      </div>

      {hasStations && (
        <>
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--color-navigation-section)] rounded-full shadow hover:scale-105 transition text-[var(--color-text-secondary)] ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-[var(--color-navigation-section)] rounded-full shadow hover:scale-105 transition text-[var(--color-text-secondary)] ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      <div
        ref={carouselRef}
        className="station-carousel grid grid-flow-col auto-cols-[50%] sm:auto-cols-max overflow-x-auto overflow-y-hidden no-scrollbar snap-x snap-mandatory px-4 gap-1"
        style={{ touchAction: 'pan-x' }}
      >
        {loading ? (
          [...Array(10)].map((_, i) => (
            <div key={i} className="snap-start shrink-0 w-full">
              <CardPlaceHolder />
            </div>
          ))
        ) : hasStations ? (
          radioList.map(station => (
            <div
              key={station?.stationuuid || `station-${Math.random()}`}
              className="snap-start shrink-0 w-full"
            >
              <Card stationInfo={station} />
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 col-span-full w-full py-10">
            No stations available.
          </div>
        )}
      </div>
    </section>
  );
};

HeroContent.propTypes = {
  loading: PropTypes.bool.isRequired,
  contentMatter: PropTypes.shape({
    title: PropTypes.string,
    radioList: PropTypes.arrayOf(PropTypes.object),
  }),
  showAllFlag: PropTypes.func.isRequired,
};

export default HeroContent;
