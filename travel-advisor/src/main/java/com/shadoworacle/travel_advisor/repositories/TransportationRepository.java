package com.shadoworacle.travel_advisor.repositories;

import com.shadoworacle.travel_advisor.models.Transportation;
import com.shadoworacle.travel_advisor.models.TransportationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransportationRepository extends JpaRepository<Transportation, Long> {
    
    // Find by transportation type
    List<Transportation> findByType(TransportationType type);
    
    // Find transportation options within a price range
    List<Transportation> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    
    // Find transportation options available at a specific time period
    @Query("SELECT t FROM Transportation t WHERE t.departureTime >= :startTime AND t.arrivalTime <= :endTime")
    List<Transportation> findAvailableBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    // Find transportation options between locations
    @Query("SELECT t FROM Transportation t WHERE t.originLocation.id = :departureId AND t.destinationLocation.id = :arrivalId")
List<Transportation> findByLocations(@Param("departureId") Long departureId, @Param("arrivalId") Long arrivalId);
    
    // Find transportation options by company
    List<Transportation> findByCompanyNameContainingIgnoreCase(String companyName);
    
    // Find transportation options with available seats
    List<Transportation> findByAvailableSeatsGreaterThan(int minSeats);
}