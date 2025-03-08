package com.shadoworacle.travel_advisor.repositories;

import com.shadoworacle.travel_advisor.models.RouteOptimization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteOptimizationRepository extends JpaRepository<RouteOptimization, Long> {
    
    // Find route optimization by trip id
    Optional<RouteOptimization> findByTripId(Long tripId);
    
    // Find route optimizations by optimization type
    List<RouteOptimization> findByOptimizationType(String optimizationType);
    
    // Find routes optimized for specific criteria (e.g., COST, TIME, SCENIC)
    @Query("SELECT r FROM RouteOptimization r WHERE r.optimizationCriteria = :criteria")
    List<RouteOptimization> findByOptimizationCriteria(@Param("criteria") String criteria);
    
    // Find routes with travel time less than a specific duration (in minutes)
    List<RouteOptimization> findByTotalTravelTimeMinutesLessThan(int minutes);
    
    // Find routes with distance less than a specific value
    List<RouteOptimization> findByTotalDistanceLessThan(double distance);
}