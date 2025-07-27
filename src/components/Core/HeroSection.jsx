import { RadioIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import '../../styles/Footer.css';
import { useEffect, useRef, useState } from 'react';

const HeroSection = ({ preferedCountry, stationCount }) => {
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const flag = `https://flagsapi.com/${preferedCountry?.cca2}/flat/64.png`;

  const handleClick = () => {
    navigate('/discover');
  };

  useEffect(() => {
    const scrollNeeded =
      nameRef.current && nameRef.current.scrollWidth > nameRef.current.clientWidth;
    setShouldScroll(scrollNeeded);
  }, [preferedCountry]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Theme-based illustration
  const radioImageSrc = theme === 'light' ? '/radio-light.svg' : '/radio.svg';

  return (
    <div className="glow-wrapper relative overflow-visible">
      <div
        className="
        glow-block hero-section
        bg-[var(--color-navigation-section)]
        backdrop-blur-xl
        flex flex-col md:flex-row
        p-4 md:p-7
        rounded-md
        relative
        z-10"
      >
        {/* Country Details */}
        <div className="countryDetails flex flex-col gap-3 w-full">
          <div className="countryInfo flex items-center gap-3 md:gap-4 overflow-hidden max-w-full">
            <div
              className={`relative  overflow-hidden ${preferedCountry ? 'max-w-[150px] md:max-w-[380px]' : ''}`}
            >
              <div
                className={
                  preferedCountry
                    ? `whitespace-nowrap text-4xl sm:text-5xl md:text-7xl lg:text-9xl bg-gradient-to-b from-[var(--color-primary)] to-[var(--hero-text-title-gradient-2)] bg-clip-text text-transparent ${
                        shouldScroll ? 'animate-marquee' : ''
                      }`
                    : 'text-5xl lg:text-7xl'
                }
                ref={nameRef}
              >
                {preferedCountry?.name ?? (
                  <>
                    Choose a Country
                    <br />
                    <span className="text-sm">
                      Click below to tune in to Radio Stations across the Globe.
                    </span>
                  </>
                )}
              </div>
            </div>

            {preferedCountry && (
              <div className="countryFlag w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16">
                <img src={flag} alt="Country Flag" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {preferedCountry && (
            <div className="radioStations text-[var(--color-text-secondary)] flex items-center gap-2 md:gap-3">
              <RadioIcon className="h-5 md:h-6" />
              <p className="text-sm md:text-base">{stationCount} Stations</p>
            </div>
          )}

          <button
            className="
            bg-[var(--color-primary)]
            text-[var(--color-bg-1)]
            text-md md:text-xl lg:text-2xl
            w-40 md:w-55 lg:w-75
            py-2 lg:py-3
            rounded-xl
            hover:bg-[var(--color-primary-hover)]"
            onClick={handleClick}
          >
            Discover The World
          </button>
        </div>
      </div>

      {/* Theme-aware Radio Illustration */}
      <div className="absolute top-7 md:top-8 right-0 translate-x-1 -translate-y-1/4 z-20">
        <img src={radioImageSrc} alt="Radio Illustration" className="h-30 lg:h-75 md:h-45 w-auto" />
      </div>
    </div>
  );
};

export default HeroSection;
