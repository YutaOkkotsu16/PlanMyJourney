// src/services/routeOptimizationService.js
import api from './api';

// Create a service object with methods for each route optimization API operation
const routeOptimizationService = {
  /**
   * Get all route optimizations
   * @returns {Promise} Promise that resolves to an array of route optimizations
   */
  getAllRouteOptimizations: async () => {
    return api.get('/route-optimizations');
  },
  
  /**
   * Get route optimization by ID
   * @param {number} id - The route optimization ID
   * @returns {Promise} Promise that resolves to a route optimization object
   */
  getRouteOptimizationById: async (id) => {
    return api.get(`/route-optimizations/${id}`);
  },
  
  /**
   * Get route optimization for a specific trip
   * @param {number} tripId - The trip ID
   * @returns {Promise} Promise that resolves to a route optimization object
   */
  getRouteOptimizationByTripId: async (tripId) => {
    return api.get(`/route-optimizations/trip/${tripId}`);
  },
  
  /**
   * Get route optimizations by type
   * @param {string} type - The optimization type
   * @returns {Promise} Promise that resolves to an array of route optimizations
   */
  getRouteOptimizationsByType: async (type) => {
    return api.get(`/route-optimizations/type/${type}`);
  },
  
  /**
   * Get route optimizations by criteria
   * @param {string} criteria - The optimization criteria (e.g., DISTANCE, TIME, SCENIC)
   * @returns {Promise} Promise that resolves to an array of route optimizations
   */
  getRouteOptimizationsByCriteria: async (criteria) => {
    return api.get(`/route-optimizations/criteria/${criteria}`);
  },
  
  /**
   * Create a new route optimization
   * @param {Object} routeOptimizationData - The route optimization data
   * @returns {Promise} Promise that resolves to the created route optimization
   */
  createRouteOptimization: async (routeOptimizationData) => {
    return api.post('/route-optimizations', routeOptimizationData);
  },
  
  /**
   * Update an existing route optimization
   * @param {number} id - The route optimization ID to update
   * @param {Object} routeOptimizationData - The updated route optimization data
   * @returns {Promise} Promise that resolves to the updated route optimization
   */
  updateRouteOptimization: async (id, routeOptimizationData) => {
    return api.put(`/route-optimizations/${id}`, routeOptimizationData);
  },
  
  /**
   * Delete a route optimization
   * @param {number} id - The route optimization ID to delete
   * @returns {Promise} Promise that resolves when the route optimization is deleted
   */
  deleteRouteOptimization: async (id) => {
    return api.delete(`/route-optimizations/${id}`);
  },
  
  /**
   * Reoptimize a route with new parameters
   * @param {number} id - The route optimization ID
   * @param {string} [criteria] - New optimization criteria
   * @param {string} [type] - New optimization type
   * @returns {Promise} Promise that resolves to the reoptimized route
   */
  reoptimizeRoute: async (id, criteria, type) => {
    return api.post(`/route-optimizations/${id}/reoptimize`, null, {
      params: { criteria, type }
    });
  },
  
  /**
   * Compare different optimization strategies for a trip
   * @param {number} tripId - The trip ID
   * @param {string} strategies - Comma-separated list of strategies to compare
   * @returns {Promise} Promise that resolves to the comparison results
   */
  compareOptimizationStrategies: async (tripId, strategies = 'DISTANCE,TIME,SCENIC') => {
    return api.get('/route-optimizations/compare', {
      params: { tripId, strategies }
    });
  }
};

export default routeOptimizationService;