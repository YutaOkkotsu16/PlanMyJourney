// src/pages/TripDetailsPage.jsx
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import TripDetail from '../components/trip/TripDetail';
import { useTrip } from '../hooks/entityHooks';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function TripDetailsPage() {
  const { id } = useParams();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <TripDetail tripId={id} />
    </Container>
  );
}

export default TripDetailsPage;