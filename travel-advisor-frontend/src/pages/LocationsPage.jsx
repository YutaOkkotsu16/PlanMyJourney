// src/pages/LocationsPage.jsx
import React from 'react';
import Container from '@mui/material/Container';
import LocationList from '../components/location/LocationList';

function LocationsPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <LocationList />
    </Container>
  );
}

export default LocationsPage;