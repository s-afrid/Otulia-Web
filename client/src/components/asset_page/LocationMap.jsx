import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// 1. IMPORT CSS: This is mandatory. 
// If your app still looks broken, add this link to your index.html <head>:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- FIX 1: VITE/WEBPACK COMPATIBLE ICONS ---
// Instead of using 'require', we use direct CDN URLs. 
// This works in Vite, Next.js, and Create React App without configuration.
const iconFix = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// --- HELPER: AUTO-CENTER MAP ---
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
};

const LocationMap = ({ locationName }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationName || typeof locationName !== 'string') return;

    const fetchCoords = async (query) => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`;
        
        const response = await fetch(url, {
          headers: {
            'Accept-Language': 'en' // Prefer English results
          }
        });
        
        if (response.status === 429) {
          throw new Error("Too many requests. Please wait.");
        }
        
        if (!response.ok) throw new Error("Map service unavailable");
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            return { lat, lon };
          }
        }
        return null;
      } catch (err) {
        console.error("Geocoding error for query:", query, err);
        throw err;
      }
    };

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        // Attempt 1: Full location name
        let coords = await fetchCoords(locationName);
        
        // Attempt 2: Fallback - if location contains commas, try the last part (e.g. "Miami, FL, USA" -> "Miami, USA")
        if (!coords && locationName.includes(',')) {
          const parts = locationName.split(',').map(p => p.trim());
          if (parts.length > 2) {
            const simplified = `${parts[0]}, ${parts[parts.length - 1]}`;
            coords = await fetchCoords(simplified);
          }
          
          // Attempt 3: Just the first part (e.g. "Miami")
          if (!coords) {
            coords = await fetchCoords(parts[0]);
          }
        }

        if (coords) {
          setCoordinates({ lat: coords.lat, lng: coords.lon });
        } else {
          setError("Location not found on map");
        }
      } catch (err) {
        setError(err.message || "Error loading map");
      } finally {
        setLoading(false);
      }
    };

    // Debounce to prevent API spam
    const timer = setTimeout(() => {
      performSearch();
    }, 800);

    return () => clearTimeout(timer);
  }, [locationName]);

  // --- RENDER ---
  const boxStyle = { 
    height: '400px', 
    width: '90%', 
    background: '#f8f8f8', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: '12px',
    border: '2px solid #ddd',
    color: '#666',
    fontFamily: 'Montserrat, sans-serif'
  };

  if (!locationName) return <div style={boxStyle}>No location provided</div>;
  if (loading) return <div style={boxStyle}><div className="animate-pulse">Locating on map...</div></div>;
  
  if (error) {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    return (
      <div style={{...boxStyle, color: '#444', padding: '20px', textAlign: 'center'}}>
        <div style={{fontSize: '32px', marginBottom: '12px'}}>📍</div>
        <div className="font-bold text-lg mb-2 text-gray-800">{error}</div>
        <p className="text-sm mb-6 text-gray-500 max-w-[280px]">We couldn't pin this specific location on the map, but you can view it directly on Google Maps.</p>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.open(googleMapsUrl, '_blank');
          }}
          className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          Open in Google Maps
        </button>
        <div style={{fontSize: '10px', marginTop: '15px', color: '#bbb', fontStyle: 'italic'}}>Location: {locationName}</div>
      </div>
    );
  }

  if (!coordinates) return null;

  const handleMapClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      onClick={handleMapClick}
      className="transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-95 cursor-pointer group relative"
      style={{ height: '400px', width: '90%', border: '2px solid #ddd', borderRadius: '12px', overflow: 'hidden' }}
    >
      {/* Overlay to show "Click to view on Google Maps" on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-[20] flex items-center justify-center">
        <span className="bg-white/90 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          View on Google Maps
        </span>
      </div>

      <MapContainer 
        key={`${coordinates.lat}-${coordinates.lng}`}
        center={[coordinates.lat, coordinates.lng]} 
        zoom={14} 
        scrollWheelZoom={false} 
        dragging={false} 
        zoomControl={false} 
        style={{ height: '100%', width: '100%' , zIndex: '10' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={[coordinates.lat, coordinates.lng]} icon={iconFix}>
          <Popup>{locationName}</Popup>
        </Marker>
        
        <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;