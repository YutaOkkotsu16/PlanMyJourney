// src/components/location/LocationMap.jsx
import React, { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';

// Fix for Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to fit map to markers
function MapBounds({ locations }) {
  const map = useMap();
  
  useEffect(() => {
    if (locations && locations.length > 0) {
      const validLocations = locations.filter(
        loc => loc.latitude && loc.longitude
      );
      
      if (validLocations.length > 0) {
        const bounds = L.latLngBounds(
          validLocations.map(loc => [loc.latitude, loc.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [locations, map]);
  
  return null;
}

function LocationMap({ 
  locations = [], 
  height = 400, 
  selectedLocation = null,
  onMarkerClick = null
}) {
  const mapRef = useRef(null);
  
  // Filter locations with valid coordinates
  const validLocations = locations.filter(
    loc => loc && loc.latitude && loc.longitude
  );
  
  // Default center (world view)
  const defaultCenter = [20, 0];
  const defaultZoom = 2;
  
  // Center on selected location if provided
  const center = selectedLocation && selectedLocation.latitude && selectedLocation.longitude
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : defaultCenter;

  const zoom = selectedLocation ? 13 : defaultZoom;
  
  if (validLocations.length === 0) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="info">
            No locations with coordinates available to display on the map.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ height, width: '100%', mb: 3 }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {validLocations.map(location => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(location);
                }
              },
            }}
          >
            <Popup>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {location.name}
              </Typography>
              <Typography variant="body2">
                {location.city}, {location.country}
              </Typography>
              {location.description && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {location.description.substring(0, 200)}
                  {location.description.length > 200 ? '...' : ''}
                </Typography>
              )}
            </Popup>
          </Marker>
        ))}
        
        <MapBounds locations={validLocations} />
      </MapContainer>
    </Box>
  );
}

export default LocationMap;