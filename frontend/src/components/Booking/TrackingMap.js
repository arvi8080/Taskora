import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TrackingMap = ({
  expertLocation,
  userLocation,
  trackingHistory = [],
  eta,
  status,
  className = "h-96 w-full"
}) => {
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090]); // Default to Delhi
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    // Calculate map center based on available locations
    const locations = [];
    if (expertLocation) locations.push([expertLocation.lat, expertLocation.lng]);
    if (userLocation) locations.push([userLocation.lat, userLocation.lng]);

    if (locations.length > 0) {
      const avgLat = locations.reduce((sum, loc) => sum + loc[0], 0) / locations.length;
      const avgLng = locations.reduce((sum, loc) => sum + loc[1], 0) / locations.length;
      setMapCenter([avgLat, avgLng]);
      setZoom(14);
    }
  }, [expertLocation, userLocation]);

  // Create custom icons
  const expertIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#10B981"/>
        <path d="M16 8C12.6863 8 10 10.6863 10 14C10 17.3137 12.6863 20 16 20C19.3137 20 22 17.3137 22 14C22 10.6863 19.3137 8 16 8ZM16 18C13.7909 18 12 16.2091 12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14C20 16.2091 18.2091 18 16 18Z" fill="white"/>
        <path d="M16 6C11.5817 6 8 9.58172 8 14C8 18.4183 11.5817 22 16 22C20.4183 22 24 18.4183 24 14C24 9.58172 20.4183 6 16 6ZM16 20C12.6863 20 10 17.3137 10 14C10 10.6863 12.6863 8 16 8C19.3137 8 22 10.6863 22 14C22 17.3137 19.3137 20 16 20Z" fill="white" opacity="0.3"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#3B82F6"/>
        <path d="M16 8C14.8954 8 14 8.89543 14 10C14 11.1046 14.8954 12 16 12C17.1046 12 18 11.1046 18 10C18 8.89543 17.1046 8 16 8Z" fill="white"/>
        <path d="M20 14H12C10.8954 14 10 14.8954 10 16V18C10 19.1046 10.8954 20 12 20H20C21.1046 20 22 19.1046 22 18V16C22 14.8954 21.1046 14 20 14Z" fill="white"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Create polyline for tracking history
  const polylinePositions = trackingHistory.map(location => [location.lat, location.lng]);

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Expert marker */}
        {expertLocation && (
          <Marker position={[expertLocation.lat, expertLocation.lng]} icon={expertIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-green-600">Expert Location</div>
                <div className="text-sm text-gray-600">
                  {expertLocation.address || `${expertLocation.lat.toFixed(4)}, ${expertLocation.lng.toFixed(4)}`}
                </div>
                {eta && (
                  <div className="text-sm text-blue-600 mt-1">
                    ETA: {eta}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Status: {status || 'En Route'}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* User marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <div className="font-semibold text-blue-600">Your Location</div>
                <div className="text-sm text-gray-600">
                  {userLocation.address || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Tracking history polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            color="green"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Status overlay */}
      {status && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              status === 'en_route' ? 'bg-yellow-500' :
              status === 'arrived' ? 'bg-green-500' :
              status === 'working' ? 'bg-blue-500' : 'bg-gray-500'
            }`} />
            <span className="text-sm font-medium capitalize">
              {status.replace('_', ' ')}
            </span>
          </div>
          {eta && (
            <div className="text-xs text-gray-600 mt-1">
              ETA: {eta}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackingMap;
