package com.shadoworacle.travel_advisor.controllers;

import com.shadoworacle.travel_advisor.models.RouteOptimization;
import com.shadoworacle.travel_advisor.services.RouteOptimizationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/route-optimizations")
public class RouteOptimizationController {

    private final RouteOptimizationService routeOptimizationService;

    public RouteOptimizationController(RouteOptimizationService routeOptimizationService) {
        this.routeOptimizationService = routeOptimizationService;
    }

    @GetMapping
    public List<RouteOptimization> getAllRouteOptimizations() {
        return routeOptimizationService.getAllRouteOptimizations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteOptimization> getRouteOptimizationById(@PathVariable Long id) {
        try {
            RouteOptimization routeOptimization = routeOptimizationService.getRouteOptimizationById(id);
            return ResponseEntity.ok(routeOptimization);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<RouteOptimization> getRouteOptimizationByTripId(@PathVariable Long tripId) {
        Optional<RouteOptimization> routeOptimization = routeOptimizationService.getRouteOptimizationByTripId(tripId);
        return routeOptimization.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{optimizationType}")
    public List<RouteOptimization> getRouteOptimizationsByType(@PathVariable String optimizationType) {
        return routeOptimizationService.getRouteOptimizationsByType(optimizationType);
    }

    @GetMapping("/criteria/{criteria}")
    public List<RouteOptimization> getRouteOptimizationsByCriteria(@PathVariable String criteria) {
        return routeOptimizationService.getRouteOptimizationsByCriteria(criteria);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createRouteOptimization(@Valid @RequestBody RouteOptimization routeOptimization) {
        try {
            RouteOptimization created = routeOptimizationService.createRouteOptimization(routeOptimization);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // This might catch ML integration errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error optimizing route: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRouteOptimization(
            @PathVariable Long id,
            @Valid @RequestBody RouteOptimization routeOptimization) {
        try {
            RouteOptimization updated = routeOptimizationService.updateRouteOptimization(id, routeOptimization);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            // This might catch ML integration errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error optimizing route: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRouteOptimization(@PathVariable Long id) {
        try {
            routeOptimizationService.deleteRouteOptimization(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint to manually trigger route reoptimization with specific parameters
     */
    @PostMapping("/{id}/reoptimize")
    public ResponseEntity<?> reoptimizeRoute(
            @PathVariable Long id,
            @RequestParam(required = false) String criteria,
            @RequestParam(required = false) String type) {
        
        try {
            RouteOptimization existing = routeOptimizationService.getRouteOptimizationById(id);
            
            // // Update optimization parameters if provided
            // if (criteria != null) {
            //     existing.setOptimizationCriteria(criteria);
            // }
            
            // if (type != null) {
            //     existing.setOptimizationType(type);
            // }
            
            // Reoptimize and save
            RouteOptimization updated = routeOptimizationService.updateRouteOptimization(id, existing);
            
            // Return the updated route optimization with summary
            Map<String, Object> response = new HashMap<>();
            response.put("routeOptimization", updated);
            response.put("summary", new HashMap<String, Object>() {{
                put("distance", updated.getTotalDistance());
                put("travelTime", updated.getTotalTravelTimeMinutes());
                // put("criteria", updated.getOptimizationCriteria());
                // put("type", updated.getOptimizationType());
            }});
            return ResponseEntity.ok(response);
            
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error reoptimizing route: " + e.getMessage()));
        }
    }
    
    /**
     * Endpoint to compare different optimization strategies for a trip
     */
    @GetMapping("/compare")
    public ResponseEntity<?> compareOptimizationStrategies(
            @RequestParam Long tripId,
            @RequestParam(required = false, defaultValue = "DISTANCE,TIME,SCENIC") String strategies) {
        
        try {
            // This is a placeholder for what would be a more complex implementation
            // that integrates with your ML model to compare different optimization approaches
            
            // TODO: Implement Python ML model integration for comparison
            // This would likely create temporary route optimizations with different criteria
            // and return the comparison results
            
            // For now, return a simple message
            return ResponseEntity.ok(Map.of(
                "message", "Route optimization comparison not yet implemented",
                "tripId", tripId,
                "strategies", strategies.split(",")
            ));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error comparing optimization strategies: " + e.getMessage()));
        }
    }
}