// src/pages/TripFormPage.jsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import TripForm from '../components/trip/TripForm';
import { useTrip } from '../hooks/entityHooks';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function TripFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const isEdit = !!id;
  
  const { 
    loading, 
    error, 
    data: trip 
  } = useTrip(id, isEdit);
  
  if (isEdit && loading) return <Loading message="Loading trip data..." />;
  if (isEdit && error) return <ErrorMessage error={error} />;
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <TripForm trip={trip} isEdit={isEdit} />
    </Container>
  );
}

export default TripFormPage;