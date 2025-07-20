const HeroSectionPlaceholder = () => (
  <div className="glow-wrapper">
    <div className="glow-block hero-section bg-[var(--color-navigation-section)] backdrop-blur-xl mt-9 flex p-7 rounded-md animate-pulse">
      {/* Left Side (Country Details) */}
      <div className="countryDetails flex flex-col gap-3 flex-1">
        {/* Country Info (Text + Flag) */}
        <div className="countryInfo flex items-center gap-4">
          <div className="h-24 w-70 bg-pink-900 rounded" /> {/* Placeholder for 'INDIA' */}
          <div className="h-12 w-12 bg-pink-800 rounded" /> {/* Flag placeholder */}
        </div>

        {/* Radio station count */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-pink-800 rounded" /> {/* Radio icon placeholder */}
          <div className="h-4 w-28 bg-pink-900 rounded" /> {/* "468 Stations" */}
        </div>

        {/* CTA Button */}
        <div className="w-60 h-10 bg-pink-950 rounded" />
      </div>

      {/* Right Side (Hero Graphic) */}
      <div className="hidden sm:block">
        <div className="h-40 w-40 bg-pink-800 rounded-md" />
      </div>
    </div>
  </div>
);

export default HeroSectionPlaceholder;
