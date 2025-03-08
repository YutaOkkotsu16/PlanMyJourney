// src/components/trip/TripForm.jsx
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
  startLocationId: yup.number().required('Start location is required'),
  endLocationId: yup.number().required('End location is required'),
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
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Fetch locations for dropdowns
  const { 
    loading: locationsLoading, 
    error: locationsError, 
    data: locations = [] 
  } = useLocations();

  // Initialize form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
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

  // Update form with trip data when editing
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
    }
  }, [trip, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError(null);

      // Format data for API
      const tripData = {
        ...data,
        startLocation: { id: data.startLocationId },
        endLocation: { id: data.endLocationId },
      };

      // Remove the IDs that were just for the form
      delete tripData.startLocationId;
      delete tripData.endLocationId;

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

  if (locationsLoading) return <Loading message="Loading locations..." />;
  if (locationsError) return <ErrorMessage error={locationsError} />;

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
                  render={({ field: { onChange, value, ...field } }) => (
                    <Autocomplete
                      options={locations}
                      getOptionLabel={(option) => {
                        // Handle both objects and IDs
                        if (typeof option === 'object') return option.name;
                        const location = locations.find(loc => loc.id === option);
                        return location ? location.name : '';
                      }}
                      value={locations.find(loc => loc.id === value) || null}
                      onChange={(_, newValue) => {
                        onChange(newValue ? newValue.id : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="Start Location"
                          variant="outlined"
                          error={!!errors.startLocationId}
                          helperText={errors.startLocationId?.message}
                          required
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Controller
                  name="endLocationId"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <Autocomplete
                      options={locations}
                      getOptionLabel={(option) => {
                        if (typeof option === 'object') return option.name;
                        const location = locations.find(loc => loc.id === option);
                        return location ? location.name : '';
                      }}
                      value={locations.find(loc => loc.id === value) || null}
                      onChange={(_, newValue) => {
                        onChange(newValue ? newValue.id : '');
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          {...field}
                          label="End Location"
                          variant="outlined"
                          error={!!errors.endLocationId}
                          helperText={errors.endLocationId?.message}
                          required
                        />
                      )}
                    />
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                          />
                        )}
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
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            required
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                          />
                        )}
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