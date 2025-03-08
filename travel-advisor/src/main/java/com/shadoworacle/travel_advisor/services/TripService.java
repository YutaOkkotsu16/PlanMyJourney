package com.shadoworacle.travel_advisor.services;

import com.shadoworacle.travel_advisor.models.Trip;
import com.shadoworacle.travel_advisor.repositories.TripRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;
@Service
public class TripService {
    private final TripRepository tripRepository;

    @Autowired
    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }   

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip createTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public Trip updateTrip(Trip trip) {
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
    
    public BigDecimal calculateTripCost(Long id) {
        // First, retrieve the Trip entity using the ID
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + id));
        
        // Then calculate cost based on the retrieved Trip
        // This might involve complex calculation logic
        return calculateCostForTrip(trip);
    }

    private BigDecimal calculateCostForTrip(Trip trip) {
        // Implement the logic to calculate the cost for the trip
        // This might involve summing up costs for transportation, accommodation, food, etc.
        return BigDecimal.ZERO; // Placeholder return value
    }

    public int calculateTripDuration(Long id) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + id));
        return trip.getDurationInDays();
    }
    
    public Trip updateTripStatus(Long id, Trip trip) {
        Trip existingTrip = tripRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + id));
        existingTrip.setStatus(trip.getStatus());
        return tripRepository.save(existingTrip);
    }
}