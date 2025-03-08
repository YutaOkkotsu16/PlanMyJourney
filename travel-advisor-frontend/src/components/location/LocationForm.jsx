// src/components/location/LocationForm.jsx
import React, { useState, useEffect } from 'react';
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
import InputAdornment from '@mui/material/InputAdornment';
import LocationMap from './LocationMap';
import locationService from '../../services/locationService';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Location name is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  latitude: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .typeError('Latitude must be a number'),
  longitude: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .typeError('Longitude must be a number'),
  description: yup.string(),
});

function LocationForm({ location = null, isEdit = false }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Initialize form
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      city: '',
      country: '',
      latitude: '',
      longitude: '',
      description: '',
    },
  });

  // Update form with location data when editing
  useEffect(() => {
    if (location) {
      reset({
        name: location.name || '',
        city: location.city || '',
        country: location.country || '',
        latitude: location.latitude || '',
        longitude: location.longitude || '',
        description: location.description || '',
      });
    }
  }, [location, reset]);

  // Watch latitude and longitude for map preview
  const watchedLatitude = watch('latitude');
  const watchedLongitude = watch('longitude');

  // Generate preview location for map
  const previewLocation = {
    id: location?.id || 'preview',
    name: watch('name') || 'New Location',
    city: watch('city') || '',
    country: watch('country') || '',
    latitude: parseFloat(watchedLatitude) || null,
    longitude: parseFloat(watchedLongitude) || null,
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError(null);

      // Convert string values to appropriate types
      const locationData = {
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      };

      if (isEdit && location) {
        await locationService.updateLocation(location.id, locationData);
      } else {
        await locationService.createLocation(locationData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/locations');
      }, 1500);
    } catch (error) {
      console.error('Error saving location:', error);
      setServerError(error.message || 'Error saving location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Location' : 'Add New Location'}
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
                      label="Location Name"
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
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="City"
                      variant="outlined"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Country"
                      variant="outlined"
                      fullWidth
                      error={!!errors.country}
                      helperText={errors.country?.message}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="latitude"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Latitude"
                      variant="outlined"
                      fullWidth
                      type="number"
                      inputProps={{ step: 'any' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">°</InputAdornment>,
                      }}
                      error={!!errors.latitude}
                      helperText={errors.latitude?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="longitude"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Longitude"
                      variant="outlined"
                      fullWidth
                      type="number"
                      inputProps={{ step: 'any' }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">°</InputAdornment>,
                      }}
                      error={!!errors.longitude}
                      helperText={errors.longitude?.message}
                    />
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

              {/* Map preview */}
              {watchedLatitude && watchedLongitude && !isNaN(parseFloat(watchedLatitude)) && !isNaN(parseFloat(watchedLongitude)) && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Location Preview
                  </Typography>
                  <LocationMap
                    locations={[previewLocation]}
                    selectedLocation={previewLocation}
                    height={300}
                  />
                </Grid>
              )}

              {serverError && (
                <Grid item xs={12}>
                  <Alert severity="error">{serverError}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/locations')}
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
                    {loading ? 'Saving...' : isEdit ? 'Update Location' : 'Add Location'}
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
          {isEdit ? 'Location updated successfully' : 'Location added successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LocationForm;