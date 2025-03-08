// src/components/routes/RouteMap.jsx
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

// Component to fit map to route
function MapBounds({ startLocation, endLocation, waypoints }) {
  const map = useMap();
  
  useEffect(() => {
    const points = [];
    
    if (startLocation && startLocation.latitude && startLocation.longitude) {
      points.push([startLocation.latitude, startLocation.longitude]);
    }
    
    if (endLocation && endLocation.latitude && endLocation.longitude) {
      points.push([endLocation.latitude, endLocation.longitude]);
    }
    
    if (waypoints && waypoints.length > 0) {
      waypoints.forEach(waypoint => {
        if (waypoint.lat && waypoint.lng) {
          points.push([waypoint.lat, waypoint.lng]);
        }
      });
    }
    
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, startLocation, endLocation, waypoints]);
  
  return null;
}

function RouteMap({ routeOptimization, routeData = {}, height = 400 }) {
  if (!routeOptimization || !routeOptimization.trip) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            No route data available to display
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const { trip } = routeOptimization;
  const startLocation = trip.startLocation;
  const endLocation = trip.endLocation;
  
  // Extract waypoints from route data
  const waypoints = routeData.waypoints || [];
  
  // Create route path
  const routePath = [];
  
  // Add start location to path
  if (startLocation && startLocation.latitude && startLocation.longitude) {
    routePath.push([startLocation.latitude, startLocation.longitude]);
  }
  
  // Add waypoints to path
  if (waypoints && waypoints.length > 0) {
    waypoints.forEach(waypoint => {
      if (waypoint.lat && waypoint.lng) {
        routePath.push([waypoint.lat, waypoint.lng]);
      }
    });
  }
  
  // Add end location to path
  if (endLocation && endLocation.latitude && endLocation.longitude) {
    routePath.push([endLocation.latitude, endLocation.longitude]);
  }
  
  // Default center (world view)
  const defaultCenter = [20, 0];
  const defaultZoom = 2;
  
  // Check if we have valid locations
  const hasValidLocations = routePath.length > 0;
  
  if (!hasValidLocations) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            No location coordinates available to display the route
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Route Map
        </Typography>
        <Box sx={{ height, width: '100%' }}>
          <MapContainer 
            center={defaultCenter} 
            zoom={defaultZoom} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Start Location Marker */}
            {startLocation && startLocation.latitude && startLocation.longitude && (
              <Marker position={[startLocation.latitude, startLocation.longitude]}>
                <Popup>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Starting Point: {startLocation.name}
                  </Typography>
                  {startLocation.city && startLocation.country && (
                    <Typography variant="body2">
                      {startLocation.city}, {startLocation.country}
                    </Typography>
                  )}
                </Popup>
              </Marker>
            )}
            
            {/* End Location Marker */}
            {endLocation && endLocation.latitude && endLocation.longitude && (
              <Marker position={[endLocation.latitude, endLocation.longitude]}>
                <Popup>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Destination: {endLocation.name}
                  </Typography>
                  {endLocation.city && endLocation.country && (
                    <Typography variant="body2">
                      {endLocation.city}, {endLocation.country}
                    </Typography>
                  )}
                </Popup>
              </Marker>
            )}
            
            {/* Waypoint Markers */}
            {waypoints && waypoints.length > 0 && waypoints.map((waypoint, index) => {
              if (waypoint.lat && waypoint.lng) {
                return (
                  <Marker 
                    key={index} 
                    position={[waypoint.lat, waypoint.lng]}
                  >
                    <Popup>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {waypoint.name || `Waypoint ${index + 1}`}
                      </Typography>
                      {waypoint.description && (
                        <Typography variant="body2">
                          {waypoint.description}
                        </Typography>
                      )}
                    </Popup>
                  </Marker>
                );
              }
              return null;
            })}
            
            {/* Route Path */}
            {routePath.length > 1 && (
              <Polyline 
                positions={routePath} 
                color="#3f51b5"
                weight={4}
                opacity={0.7}
              />
            )}
            
            {/* Fit map to route */}
            <MapBounds 
              startLocation={startLocation} 
              endLocation={endLocation} 
              waypoints={waypoints} 
            />
          </MapContainer>
        </Box>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {routeOptimization.totalDistanceInKm.toFixed(1)} km · Approx. {Math.round(routeOptimization.totalTravelTimeInMinutes / 60)} hours {routeOptimization.totalTravelTimeInMinutes % 60} min
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default RouteMap;