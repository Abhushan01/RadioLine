import { PlayIcon } from '@heroicons/react/24/outline';
import '../../styles/Hero.css';

const Card = () => (
  <div>
    <div className="card h-50 hover:bg-[#0D0206] rounded-md p-2 cursor-pointer text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] group relative">
      {/* Card body with image and overlay icon */}
      <div className="relative">
        <img src="/fallback-image.svg" className="rounded-md h-35 w-full object-cover" alt="" />

        {/* Play Icon in bottom-right */}
        <PlayIcon className="h-10 w-10 text-[var(--color-bg-1)] bg-[var(--color-accent)] rounded-full p-2 absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[var(--color-accent-hover)] hover:text-black" />
      </div>

      {/* Footer content */}
      <div className="card-footer mt-2 text-sm">Radio Station Name</div>
    </div>
  </div>
);

export default Card;
