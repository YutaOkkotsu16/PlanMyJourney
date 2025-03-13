// src/components/trip/TripList.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useTrips } from '../../hooks/entityHooks';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { useLocation } from 'react-router-dom';


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
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

function TripList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, data: trips, execute: refreshTrips } = useTrips();

  // Add this useEffect to refresh when the component mounts or URL changes
  React.useEffect(() => {
    console.log("TripList component mounted or URL changed - refreshing trips");
    refreshTrips();
  }, [location.search, refreshTrips]);

  
  if (loading) return <Loading message="Loading trips..." />;
  if (error) return <ErrorMessage error={error} onRetry={refreshTrips} />;

  
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Trips
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<TravelExploreIcon />}
          onClick={() => navigate('/trips/new')}
        >
          Plan New Trip
        </Button>
      </Box>

      {!trips || trips.length === 0 ? (
        <Box sx={{ textAlign: 'center', my: 8 }}>
          <TravelExploreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No trips found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start planning your first adventure now!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/trips/new')}
          >
            Plan New Trip
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {trips.map((trip) => (
            <Grid item xs={12} md={6} key={trip.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h5" component="h2">
                      {trip.name}
                    </Typography>
                    <Chip 
                      label={trip.status} 
                      color={getStatusColor(trip.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlightTakeoffIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      From: {trip.startLocation ? trip.startLocation.name : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FlightLandIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      To: {trip.endLocation ? trip.endLocation.name : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </Typography>
                  </Box>
                  
                  {trip.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {trip.description.length > 120 
                        ? `${trip.description.substring(0, 120)}...` 
                        : trip.description
                      }
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    onClick={() => navigate(`/trips/${trip.id}/edit`)}
                  >
                    Edit
                  </Button>
                  {trip.status === 'PLANNED' && (
                    <Button 
                      size="small"
                      color="primary"
                      onClick={() => navigate(`/route-optimizations/new?tripId=${trip.id}`)}
                    >
                      Optimize Route
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default TripList;