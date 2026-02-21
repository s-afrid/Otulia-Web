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

// --- CONSTANTS: STATIC COORDINATE CACHE ---
// Prevents API rate limits for common demo locations
const STATIC_CACHE = {
  "monaco": { lat: 43.7384, lon: 7.4246 },
  "miami": { lat: 25.7617, lon: -80.1918 },
  "miami, fl": { lat: 25.7617, lon: -80.1918 },
  "london": { lat: 51.5074, lon: -0.1278 },
  "london, uk": { lat: 51.5074, lon: -0.1278 },
  "st. tropez": { lat: 43.2677, lon: 6.6407 },
  "ibiza": { lat: 38.9067, lon: 1.4206 },
  "portofino": { lat: 44.3032, lon: 9.2078 },
  "bologna": { lat: 44.4949, lon: 11.3426 },
  "bologna, italy": { lat: 44.4949, lon: 11.3426 },
  "tokyo": { lat: 35.6762, lon: 139.6503 },
  "tokyo, japan": { lat: 35.6762, lon: 139.6503 },
  "munich": { lat: 48.1351, lon: 11.5820 },
  "munich, germany": { lat: 48.1351, lon: 11.5820 },
  "iwata": { lat: 34.7108, lon: 137.8516 },
  "iwata, japan": { lat: 34.7108, lon: 137.8516 },
  "noale": { lat: 45.5484, lon: 12.0722 },
  "noale, italy": { lat: 45.5484, lon: 12.0722 },
  "milwaukee": { lat: 43.0389, lon: -87.9065 },
  "milwaukee, usa": { lat: 43.0389, lon: -87.9065 },
  "mumbai": { lat: 19.0760, lon: 72.8777 },
  "delhi": { lat: 28.6139, lon: 77.2090 },
  "new york": { lat: 40.7128, lon: -74.0060 },
  "new york, ny, usa": { lat: 40.7128, lon: -74.0060 },
  "dubai": { lat: 25.2048, lon: 55.2708 },
  "dubai, uae": { lat: 25.2048, lon: 55.2708 },
  "los angeles": { lat: 34.0522, lon: -118.2437 },
  "beverly hills": { lat: 34.0736, lon: -118.4004 },
  "beverly hills, ca, usa": { lat: 34.0736, lon: -118.4004 },
  "rome": { lat: 41.9028, lon: 12.4964 },
  "rome, italy": { lat: 41.9028, lon: 12.4964 },
  "paris": { lat: 48.8566, lon: 2.3522 },
  "modena": { lat: 44.6471, lon: 10.9252 },
  "modena, italy": { lat: 44.6471, lon: 10.9252 },
  "stuttgart": { lat: 48.7758, lon: 9.1829 },
  "stuttgart, germany": { lat: 48.7758, lon: 9.1829 },
  "angelholm": { lat: 56.2415, lon: 12.8617 },
  "angelholm, sweden": { lat: 56.2415, lon: 12.8617 },
  "las vegas": { lat: 36.1699, lon: -115.1398 },
  "las vegas, nv, usa": { lat: 36.1699, lon: -115.1398 },
  "san francisco": { lat: 37.7749, lon: -122.4194 },
  "san francisco, ca, usa": { lat: 37.7749, lon: -122.4194 },
  "oxfordshire": { lat: 51.7612, lon: -1.2465 },
  "oxfordshire, uk": { lat: 51.7612, lon: -1.2465 },
  "ingolstadt": { lat: 48.7665, lon: 11.4258 },
  "ingolstadt, germany": { lat: 48.7665, lon: 11.4258 },
};

const LocationMap = ({ locationName }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!locationName || typeof locationName !== 'string') return;

    // 0. Check Static Cache First (Instant, No API)
    const lowerName = locationName.toLowerCase().trim();
    if (STATIC_CACHE[lowerName]) {
        console.log("Using static cache for:", locationName);
        setCoordinates({ 
            lat: STATIC_CACHE[lowerName].lat, 
            lng: STATIC_CACHE[lowerName].lon 
        });
        setError(null);
        return;
    }

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
          
          // Try "City, Country" if we have 3 parts "City, State, Country"
          if (parts.length > 2) {
            const simplified = `${parts[0]}, ${parts[parts.length - 1]}`;
            coords = await fetchCoords(simplified);
          }
          
          // Try just the first part (City)
          if (!coords) {
            coords = await fetchCoords(parts[0]);
          }

          // Try just the last part (Country) - Last Resort
          if (!coords) {
             coords = await fetchCoords(parts[parts.length - 1]);
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
  
  // ERROR STATE -> TRANSFORMED TO "VIEW LOCATION" CARD
  if (error) {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
    return (
      <div 
        style={{...boxStyle, cursor: 'pointer', background: '#fff', transition: 'all 0.3s ease'}} 
        className="hover:shadow-xl group"
        onClick={() => window.open(googleMapsUrl, '_blank')}
      >
        <div style={{fontSize: '48px', marginBottom: '16px', opacity: 0.8}}>🗺️</div>
        <div className="font-bold text-xl mb-3 text-black">Explore Location</div>
        <p className="text-sm mb-6 text-gray-500 max-w-[280px] text-center">
            View <strong>{locationName}</strong> directly on Google Maps for the most accurate details.
        </p>
        <button 
          className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] group-hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          Open Map
        </button>
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