// src/services/tripService.js
import api from './api';

// Create a service object with methods for each trip-related API operation
const tripService = {
  /**
   * Get all trips
   * @returns {Promise} Promise that resolves to an array of trips
   */
  getAllTrips: async () => {
    return api.get('/trips');
  },
  
  /**
   * Get trip by ID
   * @param {number} id - The trip ID
   * @returns {Promise} Promise that resolves to a trip object
   */
  getTripById: async (id) => {
    return api.get(`/trips/${id}`);
  },
  
  /**
   * Create a new trip
   * @param {Object} tripData - The trip data to save
   * @returns {Promise} Promise that resolves to the created trip
   */
  createTrip: async (tripData) => {
    return api.post('/trips', tripData);
  },
  
  /**
   * Update an existing trip
   * @param {number} id - The trip ID to update
   * @param {Object} tripData - The updated trip data
   * @returns {Promise} Promise that resolves to the updated trip
   */
  updateTrip: async (id, tripData) => {
    return api.put(`/trips/${id}`, tripData);
  },
  
  /**
   * Update trip status
   * @param {number} id - The trip ID
   * @param {string} status - The new status
   * @returns {Promise} Promise that resolves to the updated trip
   */
  updateTripStatus: async (id, status) => {
    return api.put(`/trips/${id}/status`, { status });
  },
  
  /**
   * Delete a trip
   * @param {number} id - The trip ID to delete
   * @returns {Promise} Promise that resolves when the trip is deleted
   */
  deleteTrip: async (id) => {
    return api.delete(`/trips/${id}`);
  },
  
  /**
   * Calculate trip cost
   * @param {number} id - The trip ID
   * @returns {Promise} Promise that resolves to the cost calculation
   */
  calculateTripCost: async (id) => {
    return api.get(`/trips/${id}/cost`);
  },
  
  /**
   * Calculate trip duration
   * @param {number} id - The trip ID
   * @returns {Promise} Promise that resolves to the duration calculation
   */
  calculateTripDuration: async (id) => {
    return api.get(`/trips/${id}/duration`);
  }
};

export default tripService;