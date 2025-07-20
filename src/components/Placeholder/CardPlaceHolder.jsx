const CardPlaceHolder = () => (
  <div>
    <div className="card h-50 bg-[#0D0206] rounded-md p-2 group relative  w-40">
      {/* Card body placeholder */}
      <div className="relative">
        <div className="bg-pink-800 h-35 w-full rounded-md animate-pulse" />

        {/* Circular play button placeholder */}
        <div className="h-10 w-10 bg-pink-950 rounded-full absolute bottom-2 right-2 animate-pulse" />
      </div>

      {/* Footer text placeholder */}
      <div className="mt-2 space-y-1">
        <div className="h-3 bg-pink-800 rounded w-3/4 animate-pulse" />

        <div className="h-3 bg-pink-900 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  </div>
);

export default CardPlaceHolder;
