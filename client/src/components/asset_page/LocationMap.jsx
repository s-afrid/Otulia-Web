import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMaximize, FiHome } from 'react-icons/fi';

// Helper: Auto-center Map
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 14);
  }, [lat, lng, map]);
  return null;
};

const LocationMap = ({ locationName, lat, lng }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState('street');

  useEffect(() => {
    if (lat && lng) {
      setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      return;
    }
    // Fallback to geocoding or default...
    setCoordinates({ lat: 25.2048, lng: 55.2708 }); // Default Dubai
  }, [lat, lng]);

  const handleFullscreen = () => {
    if (!coordinates) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="w-full h-[500px] bg-gray-50 flex items-center justify-center">Locating...</div>;

  return (
    <div className="w-full px-[2%] mb-16">
      <div className="w-full h-[400px] md:h-[500px] relative rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
        
        {/* Fullscreen Toggle (Top Left) */}
        <button 
          onClick={handleFullscreen}
          className="absolute top-6 left-6 z-[1000] p-3 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all text-gray-700"
          title="Open in Google Maps"
        >
          <FiMaximize className="text-lg" />
        </button>

        {/* Zoom Controls are handled by Leaflet in topright */}

        {/* Map Type Toggle (Bottom Right) */}
        <div className="absolute bottom-10 right-10 z-[1000] flex bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
           <button 
             onClick={() => setMapType('street')}
             className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${mapType === 'street' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             Map
           </button>
           <button 
             onClick={() => setMapType('satellite')}
             className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all ${mapType === 'satellite' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
           >
             Satellite
           </button>
        </div>

        <MapContainer 
          center={[coordinates?.lat || 0, coordinates?.lng || 0]} 
          zoom={14} 
          zoomControl={false}
          className="w-full h-full"
        >
          <ZoomControl position="topright" />
          
          {mapType === 'street' ? (
            <TileLayer 
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          ) : (
            <TileLayer 
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
            />
          )}
          
          {/* Custom Center Marker Visual (Overlay) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
             {/* Radius Circle */}
             <div className="w-64 h-64 bg-gray-400/20 rounded-full border-2 border-white/40 flex items-center justify-center">
                {/* Black House Marker */}
                <div className="w-12 h-12 bg-black rounded-full shadow-2xl flex items-center justify-center border-2 border-white">
                   <FiHome className="text-white text-xl" />
                </div>
             </div>
          </div>

          {coordinates && <RecenterMap lat={coordinates.lat} lng={coordinates.lng} />}
        </MapContainer>
      </div>

      <style>{`
        .leaflet-container { background: #f4f4f4 !important; }
        .leaflet-control-zoom { border: none !important; margin: 24px !important; }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out { 
          background-color: white !important; 
          color: #333 !important; 
          border: 1px solid #eee !important;
          width: 44px !important;
          height: 44px !important;
          line-height: 44px !important;
          font-size: 18px !important;
          transition: all 0.2s;
        }
        .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover { background-color: #f9f9f9 !important; }
        .leaflet-control-zoom-in { border-radius: 8px 8px 0 0 !important; }
        .leaflet-control-zoom-out { border-radius: 0 0 8px 8px !important; }
      `}</style>
    </div>
  );
};

export default LocationMap;