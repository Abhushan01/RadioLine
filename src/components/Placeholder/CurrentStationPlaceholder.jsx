const CurrentStationPlaceholder = () => (
  <aside className="bg-[var(--color-navigation-section)] backdrop-blur-xl p-4 rounded-sm fixed w-65 z-50 h-full animate-pulse">
    <div>
      {/* Station Title Placeholder */}
      <div className="h-4 w-24 bg-pink-900 rounded mb-2" />

      {/* Image Placeholder */}
      <div className="w-full h-60 bg-pink-950 rounded-md" />

      {/* Station Name + Icon Placeholder */}
      <div className="flex items-baseline gap-2 mt-2">
        <div className="h-6 w-28 bg-pink-800 rounded" />
        <div className="h-6 w-6 bg-pink-900 rounded-full" />
      </div>

      <hr className="border-[var(--color-border)] mt-3" />

      {/* Details */}
      <div className="stationDetails mt-2 space-y-3 text-[var(--color-text-secondary)]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 bg-pink-900 rounded" />
            <div className="h-3 w-24 bg-pink-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  </aside>
);

export default CurrentStationPlaceholder;
