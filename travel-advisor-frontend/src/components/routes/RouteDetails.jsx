// src/components/routes/RouteDetails.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StraightenIcon from '@mui/icons-material/Straighten';
import SpeedIcon from '@mui/icons-material/Speed';
import RouteMap from './RouteMap';

// Helper function to format time
const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  
  return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} min`;
};

// Helper function to format distance
const formatDistance = (kilometers) => {
  return `${kilometers.toFixed(1)} km`;
};

function RouteDetails({ routeOptimization }) {
  if (!routeOptimization) {
    return null;
  }

  // Parse route data (if stored as JSON string)
  let routeData = {};
  try {
    if (typeof routeOptimization.routeData === 'string') {
      routeData = JSON.parse(routeOptimization.routeData);
    } else if (routeOptimization.routeData) {
      routeData = routeOptimization.routeData;
    }
  } catch (error) {
    console.error('Error parsing route data:', error);
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Map View */}
        <Grid item xs={12}>
          <RouteMap 
            routeOptimization={routeOptimization} 
            routeData={routeData} 
            height={400} 
          />
        </Grid>
        
        {/* Route Stats */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Route Stats
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <StraightenIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Distance"
                    secondary={formatDistance(routeOptimization.totalDistanceInKm)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Travel Time"
                    secondary={formatTime(routeOptimization.totalTravelTimeInMinutes)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SpeedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Average Speed"
                    secondary={`${(routeOptimization.totalDistanceInKm / (routeOptimization.totalTravelTimeInMinutes / 60)).toFixed(1)} km/h`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Optimization Info */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optimization Details
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" component="span" sx={{ mr: 1 }}>
                  Optimization Type:
                </Typography>
                <Chip 
                  label={routeOptimization.optimizationType || 'Standard'} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" component="span" sx={{ mr: 1 }}>
                  Criteria:
                </Typography>
                <Chip 
                  label={routeOptimization.optimizationCriteria || 'Distance'} 
                  color="secondary" 
                  size="small" 
                />
              </Box>
              
              {routeData.waypoints && routeData.waypoints.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Waypoints
                  </Typography>
                  <List dense>
                    {routeData.waypoints.map((waypoint, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={waypoint.name || `Waypoint ${index + 1}`}
                          secondary={waypoint.description || null}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RouteDetails;