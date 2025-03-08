package com.shadoworacle.travel_advisor.models;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * RouteOptimization stores data about the optimized route for a trip.
 * This is where your route planning algorithm results will be stored.
 */
@Entity
@Table(name = "route_optimization")
public class RouteOptimization {
    
    // Primary key - unique identifier for each route optimization
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // The trip this route is for
    @OneToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;
    
    // The total distance of the optimized route
    private Double totalDistance;
    
    // The total travel time of the optimized route
    private Integer totalTravelTimeMinutes;
    
    // The total cost of transportation for this route
    private BigDecimal totalTravelCost;
    
    // Stores the actual route as JSON data (can include waypoints, routes, etc.)
    @Column(columnDefinition = "TEXT")
    private String routeJson;
    
    // Default constructor - required by JPA
    public RouteOptimization() {
    }
    
    // Convenience constructor for creating a new route optimization
    public RouteOptimization(Trip trip) {
        this.trip = trip;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Double getTotalDistance() {
        return totalDistance;
    }

    public void setTotalDistance(Double totalDistance) {
        this.totalDistance = totalDistance;
    }

    public Integer getTotalTravelTimeMinutes() {
        return totalTravelTimeMinutes;
    }

    public void setTotalTravelTimeMinutes(Integer totalTravelTimeMinutes) {
        this.totalTravelTimeMinutes = totalTravelTimeMinutes;
    }

    public BigDecimal getTotalTravelCost() {
        return totalTravelCost;
    }

    public void setTotalTravelCost(BigDecimal totalTravelCost) {
        this.totalTravelCost = totalTravelCost;
    }

    public String getRouteJson() {
        return routeJson;
    }

    public void setRouteJson(String routeJson) {
        this.routeJson = routeJson;
    }

    public Object getOptimizationCriteria() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getOptimizationCriteria'");
    }

    @Column
    private String optimizationCriteria;

    @Column
    private String optimizationType;

    public String getOptimizationType() {
        return optimizationType;
    }

    public void setOptimizationType(String optimizationType) {
        this.optimizationType = optimizationType;
    }
}
