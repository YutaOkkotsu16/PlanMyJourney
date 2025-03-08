// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import AddIcon from '@mui/icons-material/Add';
import { useTrips, useLocations } from '../hooks/entityHooks';
import LocationMap from '../components/location/LocationMap';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

// Helper function to get status color
const getStatusColor = (status) => {
  const statusColors = {
    PLANNED: 'primary',
    CONFIRMED: 'success',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    CANCELLED: 'error'
  };
  
  return statusColors[status] || 'default';
};

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    totalLocations: 0
  });
  
  // Fetch trips
  const { 
    loading: tripsLoading, 
    error: tripsError, 
    data: trips = [] 
  } = useTrips();
  
  // Fetch locations
  const { 
    loading: locationsLoading, 
    error: locationsError, 
    data: locations = [] 
  } = useLocations();
  
  // Calculate stats
  useEffect(() => {
    if (trips && locations) {
      const now = new Date();
      
      const upcomingTrips = trips.filter(trip => {
        const startDate = new Date(trip.startDate);
        return startDate > now && trip.status !== 'CANCELLED';
      });
      
      const completedTrips = trips.filter(trip => 
        trip.status === 'COMPLETED'
      );
      
      setStats({
        totalTrips: trips.length,
        upcomingTrips: upcomingTrips.length,
        completedTrips: completedTrips.length,
        totalLocations: locations.length
      });
    }
  }, [trips, locations]);

  // Get upcoming trips
  const upcomingTrips = trips
    ? trips.filter(trip => {
        const startDate = new Date(trip.startDate);
        const now = new Date();
        return startDate > now && trip.status !== 'CANCELLED';
      }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 5)
    : [];

  // Get recent locations
  const recentLocations = locations
    ? [...locations].sort((a, b) => b.id - a.id).slice(0, 8)
    : [];

  const isLoading = tripsLoading || locationsLoading;
  const hasError = tripsError || locationsError;

  if (isLoading) return <Loading message="Loading dashboard..." />;
  if (hasError) return <ErrorMessage error={tripsError || locationsError} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Total Trips
              </Typography>
              <Typography variant="h3" component="div">
                {stats.totalTrips}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'info.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Upcoming Trips
              </Typography>
              <Typography variant="h3" component="div">
                {stats.upcomingTrips}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Completed Trips
              </Typography>
              <Typography variant="h3" component="div">
                {stats.completedTrips}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: 'secondary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Locations
              </Typography>
              <Typography variant="h3" component="div">
                {stats.totalLocations}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Grid container spacing={4}>
        {/* Upcoming Trips */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Upcoming Trips
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/trips/new')}
                >
                  New Trip
                </Button>
              </Box>
              
              <Divider />
              
              {upcomingTrips.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <FlightTakeoffIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No upcoming trips
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/trips/new')}
                  >
                    Plan a Trip
                  </Button>
                </Box>
              ) : (
                <List>
                  {upcomingTrips.map((trip) => (
                    <React.Fragment key={trip.id}>
                      <ListItem
                        button
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        <ListItemText
                          primary={trip.name}
                          secondary={`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`}
                        />
                        <Chip 
                          label={trip.status} 
                          size="small"
                          color={getStatusColor(trip.status)}
                          sx={{ mr: 1 }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton 
                            edge="end" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/trips/${trip.id}`);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
              
              {upcomingTrips.length > 0 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    onClick={() => navigate('/trips')}
                    endIcon={<DirectionsIcon />}
                  >
                    View All Trips
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Locations Map */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Your Locations
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/locations/new')}
                >
                  Add Location
                </Button>
              </Box>
              
              {recentLocations.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <LocationOnIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    No locations added yet
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/locations/new')}
                  >
                    Add Location
                  </Button>
                </Box>
              ) : (
                <>
                  <LocationMap 
                    locations={recentLocations} 
                    height={300}
                    onMarkerClick={(location) => navigate(`/locations/${location.id}`)}
                  />
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button 
                      onClick={() => navigate('/locations')}
                      endIcon={<LocationOnIcon />}
                    >
                      View All Locations
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;