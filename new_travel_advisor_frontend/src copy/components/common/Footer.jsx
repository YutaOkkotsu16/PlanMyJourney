// src/components/common/Footer.jsx
import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { Link as RouterLink } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FlightTakeoffIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                TRAVEL ADVISOR
              </Typography>
            </Box>
            <Typography variant="body2">
              Your intelligent travel companion - optimizing routes and enhancing your travel experience.
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link 
              component={RouterLink} 
              to="/" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Dashboard
            </Link>
            <Link 
              component={RouterLink} 
              to="/trips" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Trips
            </Link>
            <Link 
              component={RouterLink} 
              to="/locations" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Locations
            </Link>
            <Link 
              component={RouterLink} 
              to="/transportation" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Transportation
            </Link>
            <Link 
              component={RouterLink} 
              to="/route-optimizations" 
              color="inherit" 
              sx={{ display: 'block', mb: 1 }}
            >
              Route Optimization
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" paragraph>
              Travel Advisor is an advanced application that helps you plan trips, find optimal routes, and manage your travel details efficiently.
            </Typography>
            <Typography variant="body2">
              © {new Date().getFullYear()} Travel Advisor. All rights reserved.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;