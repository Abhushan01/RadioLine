import { MapContainer, Marker, TileLayer, Tooltip, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/MapView.css';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioIcon } from '@heroicons/react/24/outline';

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-70 z-50 backdrop-blur-xs">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const createNumberedIcon = number =>
  new L.DivIcon({
    className: 'custom-numbered-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <img src="brand-logo.svg" style="width:32px; height:32px;" />
        <span class="bg-[var(--color-navigation-section)] rounded p-0.5">${number}</span>
      </div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });

const MapView = ({
  countryList = [],
  setPreferredCountry,
  geoJsonData,
  loading,
  error,
  prefCount,
}) => {
  const navigate = useNavigate();

  const handleSelectCountry = useCallback(
    country => {
      if (prefCount?.cca2 === country.cca2) return; // Prevent unnecessary updates

      const selected = { name: country.name, cca2: country.cca2 };
      localStorage.setItem('prefCount', JSON.stringify(selected));
      setPreferredCountry(selected);
      navigate('/');
    },
    [prefCount, setPreferredCountry, navigate]
  );

  const isValidLatLng = latlng =>
    Array.isArray(latlng) &&
    latlng.length === 2 &&
    typeof latlng[0] === 'number' &&
    typeof latlng[1] === 'number' &&
    !isNaN(latlng[0]) &&
    !isNaN(latlng[1]);

  const defaultCenter = () => {
    if (!prefCount || !countryList.length) return [20, 0];
    const country = countryList.find(x => x.cca2 === prefCount.cca2);
    return country?.capitalInfo?.latlng ?? [20, 0];
  };

  if (error) {
    return <div className="p-4 text-center text-red-600">Error loading boundaries: {error}</div>;
  }

  return (
    <div className="map-background">
      {loading && <Spinner />}
      <MapContainer
        center={defaultCenter()}
        zoom={5}
        minZoom={2}
        scrollWheelZoom={true}
        zoomControl={false}
        zoomAnimation={true}
        className="leaflet-container-custom"
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={{ color: 'teal', weight: 2, fillColor: 'lightcyan', fillOpacity: 0.3 }}
          />
        )}

        {countryList.map((country, index) => {
          if (!country.capitalInfo || !isValidLatLng(country.capitalInfo.latlng)) return null;

          return (
            <Marker
              key={`marker-${index}`}
              icon={createNumberedIcon(country.stationCount)}
              position={country.capitalInfo.latlng}
              eventHandlers={{
                click: () => handleSelectCountry(country),
              }}
            >
              <Tooltip permanent={country.name === prefCount?.name}>
                <div className="min-w-[10rem] max-w-[16rem] text-[var(--color-text-primary)]">
                  <p className="text-sm flex justify-between items-center">
                    <span className="font-semibold">{country.name}</span>
                    <span className="flex items-center gap-1">
                      <RadioIcon className="h-4 w-4" />
                      {country?.stationCount}
                    </span>
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs">{country.capital}</span>
                    {country.flag && (
                      <img
                        src={country.flag}
                        alt={`${country.name} flag`}
                        className="w-6 h-auto max-h-4 object-contain"
                      />
                    )}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
