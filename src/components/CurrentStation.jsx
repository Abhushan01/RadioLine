import { GlobeAltIcon, LanguageIcon, MusicalNoteIcon, StarIcon } from '@heroicons/react/24/outline';
import { CursorArrowRaysIcon } from '@heroicons/react/24/solid';

const CurrentStation = () => (
  <aside className="bg-[var(--color-navigation-section)] backdrop-blur-xl p-4 rounded-sm fixed w-65 z-50 h-full">
    <div className="">
      <p className="text-md mb-2 font-semibold">Lorem1233</p>
      <img src="/fallback-image.svg" alt="" className="rounded-md" />
      <div className="flex items-baseline gap-2">
        <p className="mt-2 font-semibold text-3xl">lorem1233</p>
        <GlobeAltIcon className="h-6 text-[var(--color-primary)]" />
      </div>

      <hr className="border-[var(--color-border)] mt-3" />
      <div className="stationDetails mt-2 text-[var(--color-text-secondary)]">
        <div className="flex items-center gap-2">
          <LanguageIcon className="h-4" />
          <span>Language</span>
        </div>
        <div className="flex items-center gap-2">
          <MusicalNoteIcon className="h-4" />
          <span>Genre</span>
        </div>
        <div className="flex items-center gap-2">
          <CursorArrowRaysIcon className="h-4" />
          <span>Clicks</span>
        </div>
        <div className="flex items-center gap-2">
          <StarIcon className="h-4" />
          <span>Votes</span>
        </div>
      </div>
    </div>
  </aside>
);

export default CurrentStation;
