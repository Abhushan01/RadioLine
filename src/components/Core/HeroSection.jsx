import { RadioIcon } from '@heroicons/react/24/outline';

const HeroSection = () => (
  <div className="glow-wrapper">
    <div className="glow-block hero-section bg-[var(--color-navigation-section)] backdrop-blur-xl mt-9 flex p-7 rounded-md">
      <div className="countryDetails flex flex-col gap-3">
        <div className="countryInfo flex items-center gap-4">
          <div className="countryName text-9xl bg-gradient-to-b from-[#FF206E] to-[#1a050c] bg-clip-text text-transparent">
            INDIA
          </div>
          <div className="countryFlag">
            <img src="https://flagsapi.com/IN/flat/64.png" alt="" />
          </div>
        </div>
        <div className="radioStations text-[var(--color-text-secondary)] flex items-center gap-3">
          <RadioIcon className="h-6" />
          <p className=""> 468 Stations</p>
        </div>
        <div className="cta-btn">
          <button className="bg-[var(--color-primary)] w-75 text-[var(--color-bg-1)] text-2xl rounded-2xl hover:bg-[var(--color-primary-hover)]">
            Discover The World
          </button>
        </div>
      </div>

      <div className="hero-graphics">
        <img src="/radio.svg" alt="" />
      </div>
    </div>
  </div>
);

export default HeroSection;
