// src/pages/TransportationPage.jsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CommuteIcon from '@mui/icons-material/Commute';

function TransportationPage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Transportation
      </Typography>
      
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CommuteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Transportation Management
            </Typography>
            <Typography variant="body1" paragraph>
              This page would contain the transportation management interface.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here you would be able to view, add, edit, and delete transportation options.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default TransportationPage;