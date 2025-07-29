import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  GeoJSON,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/MapView.css';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioIcon } from '@heroicons/react/24/outline';

// Spinner component for loading state
const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-70 z-50 backdrop-blur-xs">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Create custom icon that changes size based on zoom
const createNumberedIcon = (number, theme, zoom = 5) => {
  const baseSize = 32;
  const scale = Math.max(0.5, Math.min(1.5, zoom / 5)); // Clamp between 0.5 and 1.5
  const size = baseSize * scale;

  return new L.DivIcon({
    className: 'custom-numbered-icon',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <img src="${theme === 'light' ? 'map-marker-light.svg' : 'map-marker.svg'}" style="width:${size}px; height:${size}px;" />
        <span style="background-color: var(--color-navigation-surface); border-radius: 4px; padding: 2px; min-width: 20px; font-size: 0.75rem; text-align: center;">${number}</span>
      </div>
    `,
    iconSize: [size, size + 10],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -size],
  });
};

// Component to track map zoom level
const ZoomListener = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: e => {
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
};

// Renders info about each country
const CountryDetails = ({ country }) => (
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
);

const MapView = ({
  countryList = [],
  setPreferredCountry,
  geoJsonData,
  loading,
  error,
  prefCount,
}) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const [zoom, setZoom] = useState(5); // Initial zoom

  // Track theme changes (light/dark)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.dataset.theme || 'dark';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  // Handle country selection
  const handleSelectCountry = useCallback(
    country => {
      if (prefCount?.cca2 === country.cca2) return;
      const selected = { name: country.name, cca2: country.cca2 };
      localStorage.setItem('prefCount', JSON.stringify(selected));
      setPreferredCountry(selected);
      navigate('/');
    },
    [prefCount, setPreferredCountry, navigate]
  );

  // Validate lat/lng data
  const isValidLatLng = latlng =>
    Array.isArray(latlng) &&
    latlng.length === 2 &&
    typeof latlng[0] === 'number' &&
    typeof latlng[1] === 'number' &&
    !isNaN(latlng[0]) &&
    !isNaN(latlng[1]);

  // Default map center
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
        zoom={zoom}
        minZoom={2}
        scrollWheelZoom={true}
        zoomControl={false}
        zoomAnimation={true}
        className="leaflet-container-custom"
        style={{ height: '100vh', width: '100%' }}
      >
        <ZoomListener onZoomChange={setZoom} />

        <TileLayer
          url={`https://{s}.basemaps.cartocdn.com/${theme === 'light' ? 'light_all' : 'dark_all'}/{z}/{x}/{y}{r}.png`}
          attribution="&copy; OpenStreetMap &copy; CARTO"
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
              icon={createNumberedIcon(country.stationCount, theme, zoom)}
              position={country.capitalInfo.latlng}
            >
              <Tooltip permanent={country.name === prefCount?.name}>
                <CountryDetails country={country} />
              </Tooltip>
              <Popup>
                <CountryDetails country={country} />
                <div className="w-full flex justify-end mt-2">
                  {country.name === prefCount?.name ? (
                    ''
                  ) : (
                    <button
                      onClick={() => handleSelectCountry(country)}
                      className="rounded-sm border p-0.5 border-[var(--color-primary)] text-[var(--color-text-primary)] hover:border-transparent hover:bg-[var(--color-primary)] hover:text-white"
                    >
                      Take me there
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
