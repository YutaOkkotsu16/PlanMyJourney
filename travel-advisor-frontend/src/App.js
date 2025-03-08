// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Dashboard from './pages/Dashboard';
import TripsPage from './pages/TripsPage';
import TripDetailsPage from './pages/TripDetailsPage';
import TripFormPage from './pages/TripFormPage';
import LocationsPage from './pages/LocationsPage';
import LocationFormPage from './pages/LocationFormPage';
import TransportationPage from './pages/TransportationPage';
import RouteOptimizationPage from './pages/RouteOptimizationPage';
import NotFoundPage from './pages/NotFoundPage';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
    },
    h2: {
      fontSize: '2rem',
    },
    h3: {
      fontSize: '1.75rem',
    },
    h4: {
      fontSize: '1.5rem',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh'
        }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              
              {/* Trip Routes */}
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/new" element={<TripFormPage />} />
              <Route path="/trips/:id" element={<TripDetailsPage />} />
              <Route path="/trips/:id/edit" element={<TripFormPage />} />
              
              {/* Location Routes */}
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="/locations/new" element={<LocationFormPage />} />
              <Route path="/locations/:id/edit" element={<LocationFormPage />} />
              
              {/* Transportation Routes */}
              <Route path="/transportation" element={<TransportationPage />} />
              
              {/* Route Optimization Routes */}
              <Route path="/route-optimizations" element={<RouteOptimizationPage />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;