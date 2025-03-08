// src/services/transportationService.js
import api from './api';

// Create a service object with methods for each transportation-related API operation
const transportationService = {
  /**
   * Get all transportation options
   * @returns {Promise} Promise that resolves to an array of transportation options
   */
  getAllTransportation: async () => {
    return api.get('/transportation');
  },
  
  /**
   * Get transportation by ID
   * @param {number} id - The transportation ID
   * @returns {Promise} Promise that resolves to a transportation object
   */
  getTransportationById: async (id) => {
    return api.get(`/transportation/${id}`);
  },
  
  /**
   * Get transportation options by type
   * @param {string} type - The transportation type (e.g., FLIGHT, TRAIN, BUS)
   * @returns {Promise} Promise that resolves to an array of transportation options
   */
  getTransportationByType: async (type) => {
    return api.get(`/transportation/type/${type}`);
  },
  
  /**
   * Find transportation options by price range
   * @param {number} min - Minimum price
   * @param {number} max - Maximum price
   * @returns {Promise} Promise that resolves to an array of transportation options
   */
  findByPriceRange: async (min, max) => {
    return api.get('/transportation/search/price', { params: { min, max } });
  },
  
  /**
   * Find transportation options between locations
   * @param {number} departureId - Departure location ID
   * @param {number} arrivalId - Arrival location ID
   * @returns {Promise} Promise that resolves to an array of transportation options
   */
  findByLocations: async (departureId, arrivalId) => {
    return api.get('/transportation/search/locations', { 
      params: { departureId, arrivalId } 
    });
  },
  
  /**
   * Find available transportation options in a time range
   * @param {string} startTime - ISO date string for start time
   * @param {string} endTime - ISO date string for end time
   * @returns {Promise} Promise that resolves to an array of transportation options
   */
  findAvailableTransportation: async (startTime, endTime) => {
    return api.get('/transportation/search/available', { 
      params: { startTime, endTime } 
    });
  },
  
  /**
   * Create a new transportation option
   * @param {Object} transportationData - The transportation data to save
   * @returns {Promise} Promise that resolves to the created transportation
   */
  createTransportation: async (transportationData) => {
    return api.post('/transportation', transportationData);
  },
  
  /**
   * Update an existing transportation option
   * @param {number} id - The transportation ID to update
   * @param {Object} transportationData - The updated transportation data
   * @returns {Promise} Promise that resolves to the updated transportation
   */
  updateTransportation: async (id, transportationData) => {
    return api.put(`/transportation/${id}`, transportationData);
  },
  
  /**
   * Delete a transportation option
   * @param {number} id - The transportation ID to delete
   * @returns {Promise} Promise that resolves when the transportation is deleted
   */
  deleteTransportation: async (id) => {
    return api.delete(`/transportation/${id}`);
  },
  
  /**
   * Calculate travel duration for a transportation option
   * @param {number} id - The transportation ID
   * @returns {Promise} Promise that resolves to the duration calculation
   */
  calculateTravelDuration: async (id) => {
    return api.get(`/transportation/${id}/duration`);
  },
  
  /**
   * Calculate total cost for a transportation option with passenger count
   * @param {number} id - The transportation ID
   * @param {number} passengers - Number of passengers
   * @returns {Promise} Promise that resolves to the cost calculation
   */
  calculateTotalCost: async (id, passengers) => {
    return api.get(`/transportation/${id}/cost`, { 
      params: { passengers } 
    });
  }
};

export default transportationService;