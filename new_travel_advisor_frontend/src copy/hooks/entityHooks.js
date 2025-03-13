// src/hooks/entityHooks.js
import useApi from './useApi';
import locationService from '../services/locationService';
import tripService from '../services/tripService';
import transportationService from '../services/transportationService';
import routeOptimizationService from '../services/routeOptimizationService';

/**
 * Custom hook for fetching all locations
 */
export const useLocations = (immediate = true) => {
  return useApi(locationService.getAllLocations, [], immediate);
};

/**
 * Custom hook for fetching a single location by ID
 */
export const useLocation = (id, immediate = true) => {
  return useApi(locationService.getLocationById, [id], immediate, [id]);
};

/**
 * Custom hook for searching locations
 */
export const useLocationSearch = () => {
  return useApi(locationService.searchLocations, [], false);
};

/**
 * Custom hook for fetching all trips
 */
export const useTrips = (immediate = true) => {
  return useApi(tripService.getAllTrips, [], immediate);
};

/**
 * Custom hook for fetching a single trip by ID
 */
export const useTrip = (id, immediate = true) => {
  return useApi(tripService.getTripById, [id], immediate, [id]);
};

/**
 * Custom hook for calculating trip cost
 */
export const useTripCost = (id, immediate = true) => {
  return useApi(tripService.calculateTripCost, [id], immediate, [id]);
};

/**
 * Custom hook for fetching transportation options
 */
export const useTransportationOptions = (immediate = true) => {
  return useApi(transportationService.getAllTransportation, [], immediate);
};

/**
 * Custom hook for fetching transportation by type
 */
export const useTransportationByType = (type, immediate = true) => {
  return useApi(transportationService.getTransportationByType, [type], immediate, [type]);
};

/**
 * Custom hook for finding transportation between locations
 */
export const useTransportationBetweenLocations = () => {
  return useApi(transportationService.findByLocations, [], false);
};

/**
 * Custom hook for fetching route optimization for a trip
 */
export const useRouteOptimization = (tripId, immediate = true) => {
  return useApi(
    routeOptimizationService.getRouteOptimizationByTripId, 
    [tripId], 
    immediate, 
    [tripId]
  );
};

/**
 * Custom hook for comparing optimization strategies
 */
export const useOptimizationComparison = () => {
  return useApi(routeOptimizationService.compareOptimizationStrategies, [], false);
};