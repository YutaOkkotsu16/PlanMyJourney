package com.shadoworacle.travel_advisor.services;

import com.shadoworacle.travel_advisor.models.RouteOptimization;
import com.shadoworacle.travel_advisor.models.Trip;
import com.shadoworacle.travel_advisor.repositories.RouteOptimizationRepository;
import com.shadoworacle.travel_advisor.repositories.TripRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RouteOptimizationService {

    private final RouteOptimizationRepository routeOptimizationRepository;
    private final TripRepository tripRepository;
        
    // TODO: Add any additional dependencies for ML integration

    @Autowired
    public RouteOptimizationService(RouteOptimizationRepository routeOptimizationRepository, 
                                    TripRepository tripRepository) {
        this.routeOptimizationRepository = routeOptimizationRepository;
        this.tripRepository = tripRepository;
    }

    public List<RouteOptimization> getAllRouteOptimizations() {
        return routeOptimizationRepository.findAll();
    }

    public RouteOptimization getRouteOptimizationById(Long id) {
        return routeOptimizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Route optimization not found with id: " + id));
    }

    public Optional<RouteOptimization> getRouteOptimizationByTripId(Long tripId) {
        return routeOptimizationRepository.findByTripId(tripId);
    }

    public List<RouteOptimization> getRouteOptimizationsByType(String optimizationType) {
        return routeOptimizationRepository.findByOptimizationType(optimizationType);
    }

    public List<RouteOptimization> getRouteOptimizationsByCriteria(String criteria) {
        return routeOptimizationRepository.findByOptimizationCriteria(criteria);
    }

    public RouteOptimization createRouteOptimization(RouteOptimization routeOptimization) {
        // Verify trip exists
        Long tripId = routeOptimization.getTrip().getId();
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + tripId));
        
        // Check if a route optimization already exists for this trip
        Optional<RouteOptimization> existingOptimization = routeOptimizationRepository.findByTripId(tripId);
        if (existingOptimization.isPresent()) {
            throw new IllegalStateException("A route optimization already exists for trip with id: " + tripId);
        }

        // Set the trip
        routeOptimization.setTrip(trip);
        
        // Call ML model to generate the optimized route
        optimizeRoute(routeOptimization);
        
        return routeOptimizationRepository.save(routeOptimization);
    }

    public RouteOptimization updateRouteOptimization(Long id, RouteOptimization routeOptimization) {
        // Check if route optimization exists
        RouteOptimization existingOptimization = getRouteOptimizationById(id);
        
        // Set ID to ensure we're updating the existing record
        routeOptimization.setId(id);
        
        // Preserve the trip relationship
        routeOptimization.setTrip(existingOptimization.getTrip());
        
        // // Re-run optimization if criteria changed
        // if (!existingOptimization.getOptimizationCriteria().equals(routeOptimization.getOptimizationCriteria()) ||
        //     !existingOptimization.getOptimizationType().equals(routeOptimization.getOptimizationType())) {
        //     optimizeRoute(routeOptimization);
        // }
        
        return routeOptimizationRepository.save(routeOptimization);
    }

    public void deleteRouteOptimization(Long id) {
        // Check if route optimization exists
        getRouteOptimizationById(id);
        routeOptimizationRepository.deleteById(id);
    }

    /**
     * Optimizes a route based on given criteria and constraints.
     * This method integrates with a Python-based ML model.
     */
    private void optimizeRoute(RouteOptimization routeOptimization) {
        // ===== MACHINE LEARNING INTEGRATION POINT =====
        
        // TODO: Implement Python ML model integration using one of the following approaches:
        
        // OPTION 1: Use ProcessBuilder to call a Python script
        /*
        try {
            // Prepare data for the Python script
            String tripData = convertTripToJson(routeOptimization.getTrip());
            String optimizationCriteria = routeOptimization.getOptimizationCriteria();
            
            // Create temporary file with trip data if needed
            // ...
            
            // Execute Python script
            ProcessBuilder processBuilder = new ProcessBuilder("python", 
                "path/to/route_optimizer.py", 
                "--trip-data", tripData,
                "--criteria", optimizationCriteria);
                
            Process process = processBuilder.start();
            
            // Read results from the Python script
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                StringBuilder output = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
                
                // Parse the output and update the RouteOptimization object
                parseAndUpdateOptimizationResults(routeOptimization, output.toString());
            }
            
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Route optimization failed with exit code: " + exitCode);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error running route optimization", e);
        }
        */
        
        // OPTION 2: Use REST API to a separate Python service
        /*
        try {
            // Prepare request data
            String requestBody = convertTripToJson(routeOptimization.getTrip());
            
            // Make HTTP request to Python service
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:5000/optimize-route"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();
                    
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                throw new RuntimeException("Route optimization service returned error code: " + response.statusCode());
            }
            
            // Parse the response and update the RouteOptimization object
            parseAndUpdateOptimizationResults(routeOptimization, response.body());
        } catch (Exception e) {
            throw new RuntimeException("Error calling route optimization service", e);
        }
        */
        
        // For now, use placeholder values
        routeOptimization.setTotalDistance(100.0);
        routeOptimization.setTotalTravelTimeMinutes(120);
        
        // Placeholder route data
        routeOptimization.setRouteJson("{}"); // Store route data as JSON string
    }
    
    /**
     * Parses the output from the ML model and updates the RouteOptimization object.
     */
    private void parseAndUpdateOptimizationResults(RouteOptimization routeOptimization, String mlOutput) {
        // TODO: Implement parsing logic based on your ML model's output format
        
        // Example implementation:
        /*
        try {
            JSONObject json = new JSONObject(mlOutput);
            
            double distance = json.getDouble("total_distance_km");
            int travelTime = json.getInt("total_travel_time_minutes");
            String routeData = json.getJSONArray("route_details").toString();
            
            routeOptimization.setTotalDistanceInKm(distance);
            routeOptimization.setTotalTravelTimeInMinutes(travelTime);
            routeOptimization.setRouteData(routeData);
        } catch (JSONException e) {
            throw new RuntimeException("Error parsing ML model output", e);
        }
        */
    }
}