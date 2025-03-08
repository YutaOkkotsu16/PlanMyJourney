// src/components/location/LocationList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useLocations, useLocationSearch } from '../../hooks/entityHooks';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

function LocationList() {
  const navigate = useNavigate();
  const { loading, error, data: locations } = useLocations();
  const locationSearch = useLocationSearch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() === '') {
      setIsSearching(false);
      setFilteredLocations([]);
    }
  };

  // Handle search submission
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);
      setFilteredLocations([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await locationSearch.execute({ name: searchTerm });
      setFilteredLocations(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Handle pressing Enter in the search field
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  // Display locations based on whether we're searching or showing all
  const displayedLocations = isSearching ? filteredLocations : locations || [];

  if (loading && !isSearching) return <Loading message="Loading locations..." />;
  if (error && !isSearching) return <ErrorMessage error={error} />;

  return (
    <div>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Locations
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/locations/new')}
        >
          Add New Location
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search locations by name, city, or country..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button 
                  variant="contained" 
                  onClick={handleSearch}
                  disabled={searchTerm.trim() === ''}
                >
                  Search
                </Button>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {locationSearch.loading && (
        <Loading message="Searching locations..." />
      )}

      {locationSearch.error && (
        <ErrorMessage 
          error={locationSearch.error} 
          title="Search Error" 
          onRetry={handleSearch}
        />
      )}

      {isSearching && filteredLocations.length === 0 && !locationSearch.loading && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">
            No locations found matching "{searchTerm}"
          </Typography>
          <Button 
            sx={{ mt: 2 }}
            onClick={() => {
              setSearchTerm('');
              setIsSearching(false);
            }}
          >
            Show all locations
          </Button>
        </Box>
      )}

      <Grid container spacing={3}>
        {displayedLocations.map(location => (
          <Grid item xs={12} sm={6} md={4} key={location.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {location.name}
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip 
                    label={location.city} 
                    size="small" 
                    sx={{ mr: 1, mb: 1 }} 
                  />
                  <Chip 
                    label={location.country} 
                    size="small"
                    sx={{ mb: 1 }}
                  />
                </Box>
                {location.description && (
                  <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                    {location.description.length > 100 
                      ? `${location.description.substring(0, 100)}...` 
                      : location.description
                    }
                  </Typography>
                )}
                {(location.latitude && location.longitude) && (
                  <Typography variant="body2" color="text.secondary">
                    Coordinates: {location.latitude}, {location.longitude}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/locations/${location.id}`)}
                >
                  View Details
                </Button>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/locations/${location.id}/edit`)}
                >
                  Edit
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {displayedLocations.length === 0 && !loading && !isSearching && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography variant="h6">
                No locations available. Add your first location to get started.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => navigate('/locations/new')}
              >
                Add New Location
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default LocationList;