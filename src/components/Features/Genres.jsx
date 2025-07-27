import { useStationsByGenre } from '../../hooks/useStationsByGenre';

const Genres = ({ radioStationList, currentStation }) => {
  const stationsByGenre = useStationsByGenre(radioStationList);

  if (!radioStationList || radioStationList.length === 0) {
    return <p>No radioStationList available.</p>;
  }

  const genres = Object.keys(stationsByGenre);

  if (genres.length === 0) {
    return <p>No genre tags found.</p>;
  }

  return (
    <div>
      {genres.map(genre => (
        <section key={genre} style={{ marginBottom: '1.5rem' }}>
          <h2
            style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}
            className="text-red-400"
          >
            {genre}
          </h2>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {stationsByGenre[genre].map(station => (
              <li
                key={station.stationuuid}
                style={{ cursor: 'pointer', padding: '0.25rem 0' }}
                onClick={() => currentStation(station)}
                title={`Play ${station.name}`}
              >
                {station.name}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
};

export default Genres;
