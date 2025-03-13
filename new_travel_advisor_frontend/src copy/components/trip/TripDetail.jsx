// src/components/trip/TripDetail.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsIcon from '@mui/icons-material/Directions';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import LocationMap from '../location/LocationMap';
import RouteDetails from '../routes/RouteDetails';
import { useTrip, useRouteOptimization } from '../../hooks/entityHooks';
import tripService from '../../services/tripService';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

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
    month: 'long', 
    day: 'numeric' 
  });
};

function TripDetail({ tripId }) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // Fetch trip data
  const { 
    loading: tripLoading, 
    error: tripError, 
    data: trip,
    execute: refreshTrip
  } = useTrip(tripId);
  
  // Fetch route optimization if available
  const { 
    loading: routeLoading, 
    error: routeError, 
    data: routeOptimization 
  } = useRouteOptimization(tripId);

  // Handler for deleting a trip
  const handleDeleteTrip = async () => {
    try {
      await tripService.deleteTrip(tripId);
      setDeleteDialogOpen(false);
      setDeleteSuccess(true);
      setTimeout(() => {
        navigate('/trips');
      }, 1500);
    } catch (error) {
      console.error('Error deleting trip:', error);
      setDeleteError(error.message || 'Error deleting trip');
      setDeleteDialogOpen(false);
    }
  };

  if (tripLoading) return <Loading message="Loading trip details..." />;
  if (tripError) return <ErrorMessage error={tripError} onRetry={() => refreshTrip(tripId)} />;
  if (!trip) return <Alert severity="info">Trip not found</Alert>;

  const locations = [];
  if (trip.startLocation) locations.push(trip.startLocation);
  if (trip.endLocation) locations.push(trip.endLocation);

  const hasRouteOptimization = !routeLoading && !routeError && routeOptimization;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {trip.name}
          </Typography>
          <Chip 
            label={trip.status} 
            color={getStatusColor(trip.status)}
            sx={{ mb: 1 }}
          />
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/trips/${tripId}/edit`)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Trip Details */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Trip Details
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date Range"
                    secondary={`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Start Location"
                    secondary={trip.startLocation ? trip.startLocation.name : 'Not specified'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="End Location"
                    secondary={trip.endLocation ? trip.endLocation.name : 'Not specified'}
                  />
                </ListItem>
                {trip.description && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Description
                    </Typography>
                    <Typography variant="body2">
                      {trip.description}
                    </Typography>
                  </>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Map */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Locations
              </Typography>
              {locations.length > 0 ? (
                <LocationMap locations={locations} height={300} />
              ) : (
                <Alert severity="info">
                  No locations specified for this trip.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Route Optimization */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  Route Optimization
                </Typography>
                {!hasRouteOptimization && trip.status === 'PLANNED' && (
                  <Button
                    variant="contained"
                    startIcon={<DirectionsIcon />}
                    onClick={() => navigate(`/route-optimizations/new?tripId=${tripId}`)}
                  >
                    Optimize Route
                  </Button>
                )}
                {hasRouteOptimization && (
                  <Button
                    variant="outlined"
                    startIcon={<MapIcon />}
                    onClick={() => navigate(`/route-optimizations/${routeOptimization.id}`)}
                  >
                    View Full Route
                  </Button>
                )}
              </Box>

              {routeLoading && <Loading message="Loading route optimization..." />}
              
              {routeError && <ErrorMessage error={routeError} />}
              
              {hasRouteOptimization ? (
                <RouteDetails routeOptimization={routeOptimization} />
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    No route optimization available for this trip yet.
                  </Typography>
                  {trip.status === 'PLANNED' && (
                    <Typography variant="body2">
                      Create a route optimization to find the best way to travel between your locations.
                    </Typography>
                  )}
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the trip "{trip.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTrip} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success notification */}
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={2000}
        onClose={() => setDeleteSuccess(false)}
      >
        <Alert severity="success">
          Trip deleted successfully
        </Alert>
      </Snackbar>

      {/* Error notification */}
      {deleteError && (
        <Snackbar
          open={!!deleteError}
          autoHideDuration={4000}
          onClose={() => setDeleteError(null)}
        >
          <Alert severity="error">
            {deleteError}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}

export default TripDetail;