// src/pages/LocationFormPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import LocationForm from '../components/location/LocationForm';
import { useLocation as useLocationData } from '../hooks/entityHooks';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function LocationFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  
  const { 
    loading, 
    error, 
    data: location 
  } = useLocationData(id, isEdit);
  
  if (isEdit && loading) return <Loading message="Loading location data..." />;
  if (isEdit && error) return <ErrorMessage error={error} />;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <LocationForm location={location} isEdit={isEdit} />
    </Container>
  );
}

export default LocationFormPage;