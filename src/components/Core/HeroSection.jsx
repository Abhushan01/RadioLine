// src/components/Core/HeroSection.jsx
import { RadioIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ preferedCountry }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/discover');
  };
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
        z-10
      "
      >
        {/* Country Details */}
        <div className="countryDetails flex flex-col gap-3">
          <div className="countryInfo flex items-center gap-3 md:gap-4">
            {/* Title */}
            <div
              className={
                preferedCountry
                  ? 'countryName text-5xl md:text-7xl lg:text-9xlbg-gradient-to-b from-[#FF206E] to-[#1a050c] bg-clip-text text-transparent'
                  : 'text-5xl lg:text-7xl'
              }
            >
              {preferedCountry ?? (
                <>
                  Choose a Country
                  <br />
                  <span className="text-sm">
                    Click below to tune in to Radio Stations across the Globe.
                  </span>
                </>
              )}
            </div>
            {/* Flag */}
            {preferedCountry ? (
              <div className="countryFlag w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16">
                <img
                  src="https://flagsapi.com/IN/flat/64.png"
                  alt="India Flag"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* Stations Count */}
          {preferedCountry ? (
            <div className="radioStations text-[var(--color-text-secondary)] flex items-center gap-2 md:gap-3">
              <RadioIcon className="h-5 md:h-6" />
              <p className="text-sm md:text-base">468 Stations</p>
            </div>
          ) : (
            <></>
          )}

          {/* CTA Button */}
          <button
            className="
            bg-[var(--color-primary)]
            text-[var(--color-bg-1)]
            text-md md:text-xl lg:text-2xl
            w-40 md:w-55 lg:w-75
            py-2 lg:py-3
            rounded-xl
            hover:bg-[var(--color-primary-hover)]
          "
            onClick={handleClick}
          >
            Discover The World
          </button>
        </div>
      </div>

      {/* Overlapping Radio Graphic */}
      <div
        className="
        absolute
        top-7 md:top-8 right-0
        translate-x-1 -translate-y-1/4
        z-20
      "
      >
        <img src="/radio.svg" alt="Radio Illustration" className="h-30 lg:h-75 md:h-45 w-auto" />
      </div>
    </div>
  );
};

export default HeroSection;
