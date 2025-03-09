// src/components/trip/TripForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocations } from '../../hooks/entityHooks';
import tripService from '../../services/tripService';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { useJsApiLoader, Autocomplete as GoogleAutocomplete } from '@react-google-maps/api';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Trip name is required'),
  startDate: yup
    .date()
    .nullable()
    .required('Start date is required')
    .typeError('Please enter a valid date'),
  endDate: yup
    .date()
    .nullable()
    .min(yup.ref('startDate'), 'End date must be after start date')
    .required('End date is required')
    .typeError('Please enter a valid date'),
  startLocationId: yup.string().required('Start location is required'),
  endLocationId: yup.string().required('End location is required'),
  status: yup.string().required('Status is required'),
  description: yup.string(),
});

// Trip statuses
const tripStatuses = [
  { value: 'PLANNED', label: 'Planned' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

function TripForm({ trip = null, isEdit = false }) {
  const navigate = useNavigate();
  
  // All hooks need to be called before any conditional returns
  // State hooks
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [startLocation, setStartLocation] = useState(trip?.startLocation || null);
  const [endLocation, setEndLocation] = useState(trip?.endLocation || null);
  
  // Ref hooks
  const startAutocompleteRef = useRef(null);
  const endAutocompleteRef = useRef(null);
  
  // Other hooks
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });
  
  const { 
    loading: locationsLoading, 
    error: locationsError, 
    data: locations = [] 
  } = useLocations();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      startDate: null,
      endDate: null,
      startLocationId: '',
      endLocationId: '',
      status: 'PLANNED',
      description: '',
    },
  });

  // Use effects - still happen before any conditional returns
  useEffect(() => {
    if (trip) {
      reset({
        name: trip.name || '',
        startDate: trip.startDate ? new Date(trip.startDate) : null,
        endDate: trip.endDate ? new Date(trip.endDate) : null,
        startLocationId: trip.startLocation?.id || '',
        endLocationId: trip.endLocation?.id || '',
        status: trip.status || 'PLANNED',
        description: trip.description || '',
      });
      
      // Also set the full location objects
      if (trip.startLocation) {
        setStartLocation(trip.startLocation);
      }
      if (trip.endLocation) {
        setEndLocation(trip.endLocation);
      }
    }
  }, [trip, reset]);

  // Handle place change functions
  const handleStartPlaceChanged = () => {
    if (startAutocompleteRef.current) {
      const place = startAutocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const locationData = {
          id: place.place_id,
          name: place.name || place.formatted_address,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setStartLocation(locationData);
        setValue('startLocationId', place.place_id);
      }
    }
  };

  const handleEndPlaceChanged = () => {
    if (endAutocompleteRef.current) {
      const place = endAutocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const locationData = {
          id: place.place_id,
          name: place.name || place.formatted_address,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setEndLocation(locationData);
        setValue('endLocationId', place.place_id);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      // Trigger validation for location fields
      const isValid = await trigger(['startLocationId', 'endLocationId']);
      if (!isValid) return;
  
      setLoading(true);
      setServerError(null);
  
      // Format dates to ISO format (YYYY-MM-DD) for LocalDate in Java
      const startDateFormatted = data.startDate ? data.startDate.toISOString().split('T')[0] : null;
      const endDateFormatted = data.endDate ? data.endDate.toISOString().split('T')[0] : null;
  
      // Format the location data to match the backend Location model
      const formattedStartLocation = {
        name: startLocation?.name || '',
        // Try to extract city and country from address if available
        city: startLocation?.address ? extractCity(startLocation.address) : '',
        country: startLocation?.address ? extractCountry(startLocation.address) : '',
        latitude: startLocation?.lat || null,
        longitude: startLocation?.lng || null,
        description: '' // Optional field
      };
  
      const formattedEndLocation = {
        name: endLocation?.name || '',
        city: endLocation?.address ? extractCity(endLocation.address) : '',
        country: endLocation?.address ? extractCountry(endLocation.address) : '',
        latitude: endLocation?.lat || null,
        longitude: endLocation?.lng || null,
        description: '' // Optional field
      };
  
      // If we have an ID from the database, include it
      if (startLocation?.id && !isNaN(parseInt(startLocation.id))) {
        formattedStartLocation.id = parseInt(startLocation.id);
      }
      
      if (endLocation?.id && !isNaN(parseInt(endLocation.id))) {
        formattedEndLocation.id = parseInt(endLocation.id);
      }
  
      // Format data for API
      const tripData = {
        name: data.name,
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        startLocation: formattedStartLocation,
        endLocation: formattedEndLocation,
        status: data.status,
        notes: data.description, // Map description to notes field
        budget: 0, // Add a default budget since it's required
      };
  
      console.log('Sending to API:', tripData);
  
      if (isEdit && trip) {
        await tripService.updateTrip(trip.id, tripData);
      } else {
        await tripService.createTrip(tripData);
      }
  
      setSuccess(true);
      setTimeout(() => {
        navigate('/trips');
      }, 1500);
    } catch (error) {
      console.error('Error saving trip:', error);
      setServerError(error.message || 'Error saving trip');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper functions to extract city and country from a formatted address
  const extractCity = (address) => {
    if (!address) return '';
    // This is a simple implementation - you might need to adjust based on your address format
    const addressParts = address.split(',');
    if (addressParts.length > 1) {
      return addressParts[0].trim();
    }
    return '';
  };
  
  const extractCountry = (address) => {
    if (!address) return '';
    // This assumes the country is the last part of the address
    const addressParts = address.split(',');
    if (addressParts.length > 1) {
      return addressParts[addressParts.length - 1].trim();
    }
    return '';
  };

  // Now you can have conditional returns, after all hooks are called
  if (loadError) {
    return <ErrorMessage error={`Error loading Google Maps: ${loadError.message}`} />;
  }
  
  if (locationsLoading) return <Loading message="Loading locations..." />;
  if (locationsError) return <ErrorMessage error={locationsError} />;
  if (!isLoaded) return <Loading message="Loading Google Maps..." />;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Trip' : 'Plan New Trip'}
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Trip Name"
                      variant="outlined"
                      fullWidth
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="startLocationId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.startLocationId}>
                      {/* Remove duplicate InputLabel */}
                      <GoogleAutocomplete
                        onLoad={(autocomplete) => {
                          startAutocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={handleStartPlaceChanged}
                      >
                        <TextField
  {...field}
  value={startLocation?.name || ''}
  onChange={(e) => {
    // Allow typing in the field
    const newValue = e.target.value;
    if (!newValue) {
      setStartLocation(null);
      field.onChange('');
    } else {
      // Update the value being displayed
      setStartLocation({
        ...startLocation,
        name: newValue
      });
      // Don't call field.onChange() yet - let the place selection do that
    }
  }}
  label="Start Location"
  variant="outlined"
  fullWidth
  required
  error={!!errors.startLocationId}
  helperText={errors.startLocationId?.message}
  sx={{ 
    input: { 
      color: 'black',
      backgroundColor: 'white',
      opacity: 1
    }
  }}
/>
                      </GoogleAutocomplete>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="endLocationId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.endLocationId}>
                      {/* Remove duplicate InputLabel */}
                      <GoogleAutocomplete
                        onLoad={(autocomplete) => {
                          endAutocompleteRef.current = autocomplete;
                        }}
                        onPlaceChanged={handleEndPlaceChanged}
                      >
                        <TextField
  {...field}
  value={endLocation?.name || ''}
  onChange={(e) => {
    // Allow typing in the field
    const newValue = e.target.value;
    if (!newValue) {
      setEndLocation(null);
      field.onChange('');
    } else {
      // Update the value being displayed
      setEndLocation({
        ...endLocation,
        name: newValue
      });
      // Don't call field.onChange() yet - let the place selection do that
    }
  }}
  label="End Location"
  variant="outlined"
  fullWidth
  required
  error={!!errors.endLocationId}
  helperText={errors.endLocationId?.message}
  sx={{ 
    input: { 
      color: 'black',
      backgroundColor: 'white',
      opacity: 1
    }
  }}
/>
                      </GoogleAutocomplete>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Start Date"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slots={{
                          textField: TextField
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.startDate,
                            helperText: errors.startDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="End Date"
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        slots={{
                          textField: TextField
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            error: !!errors.endDate,
                            helperText: errors.endDate?.message
                          }
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <FormControl 
                      fullWidth 
                      variant="outlined"
                      error={!!errors.status}
                    >
                      <InputLabel id="trip-status-label">Status</InputLabel>
                      <Select
                        {...field}
                        labelId="trip-status-label"
                        label="Status"
                      >
                        {tripStatuses.map((status) => (
                          <MenuItem key={status.value} value={status.value}>
                            {status.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors.status && (
                        <FormHelperText>{errors.status.message}</FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Grid>

              {serverError && (
                <Grid item xs={12}>
                  <Alert severity="error">{serverError}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/trips')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Success notification */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          {isEdit ? 'Trip updated successfully' : 'Trip created successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TripForm;