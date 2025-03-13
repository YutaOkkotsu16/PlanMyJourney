// src/pages/TripsPage.jsx
import React from 'react';
import Container from '@mui/material/Container';
import TripList from '../components/trip/TripList';

function TripsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <TripList />
    </Container>
  );
}

export default TripsPage;