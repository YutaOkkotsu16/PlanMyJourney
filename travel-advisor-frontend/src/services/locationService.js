// src/services/locationService.js
import api from './api';

// Create a service object with methods for each location-related API operation
const locationService = {
  /**
   * Get all locations
   * @returns {Promise} Promise that resolves to an array of locations
   */
  getAllLocations: async () => {
    return api.get('/locations');
  },
  
  /**
   * Get location by ID
   * @param {number} id - The location ID
   * @returns {Promise} Promise that resolves to a location object
   */
  getLocationById: async (id) => {
    return api.get(`/locations/${id}`);
  },
  
  /**
   * Search locations by various criteria
   * @param {Object} searchParams - Object containing search parameters
   * @param {string} [searchParams.name] - Search by location name
   * @param {string} [searchParams.country] - Filter by country
   * @param {string} [searchParams.city] - Filter by city
   * @returns {Promise} Promise that resolves to an array of matching locations
   */
  searchLocations: async (searchParams) => {
    return api.get('/locations/search', { params: searchParams });
  },
  
  /**
   * Create a new location
   * @param {Object} locationData - The location data to save
   * @returns {Promise} Promise that resolves to the created location
   */
  createLocation: async (locationData) => {
    return api.post('/locations', locationData);
  },
  
  /**
   * Update an existing location
   * @param {number} id - The location ID to update
   * @param {Object} locationData - The updated location data
   * @returns {Promise} Promise that resolves to the updated location
   */
  updateLocation: async (id, locationData) => {
    return api.put(`/locations/${id}`, locationData);
  },
  
  /**
   * Delete a location
   * @param {number} id - The location ID to delete
   * @returns {Promise} Promise that resolves when the location is deleted
   */
  deleteLocation: async (id) => {
    return api.delete(`/locations/${id}`);
  }
};

export default locationService;