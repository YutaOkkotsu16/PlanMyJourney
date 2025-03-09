package com.shadoworacle.travel_advisor.services;

import com.shadoworacle.travel_advisor.models.Trip;
import com.shadoworacle.travel_advisor.models.Location;
import com.shadoworacle.travel_advisor.repositories.TripRepository;
import com.shadoworacle.travel_advisor.repositories.LocationRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.math.BigDecimal;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final LocationRepository locationRepository;

    @Autowired
    public TripService(TripRepository tripRepository, LocationRepository locationRepository) {
        this.tripRepository = tripRepository;
        this.locationRepository = locationRepository;
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
    }   

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    @Transactional
    public Trip createTrip(Trip trip) {
        // First save the locations if they don't have IDs
        if (trip.getStartLocation() != null && trip.getStartLocation().getId() == null) {
            Location savedStartLocation = locationRepository.save(trip.getStartLocation());
            trip.setStartLocation(savedStartLocation);
        }
        
        if (trip.getEndLocation() != null && trip.getEndLocation().getId() == null) {
            Location savedEndLocation = locationRepository.save(trip.getEndLocation());
            trip.setEndLocation(savedEndLocation);
        }
        
        // Then save the trip
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updateTrip(Trip trip) {
        // Same pattern for update - save locations first if needed
        if (trip.getStartLocation() != null && trip.getStartLocation().getId() == null) {
            Location savedStartLocation = locationRepository.save(trip.getStartLocation());
            trip.setStartLocation(savedStartLocation);
        }
        
        if (trip.getEndLocation() != null && trip.getEndLocation().getId() == null) {
            Location savedEndLocation = locationRepository.save(trip.getEndLocation());
            trip.setEndLocation(savedEndLocation);
        }
        
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
    

    public BigDecimal calculateTripCost(Long id) {
        Trip trip = tripRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Trip not found with id: " + id));
        return calculateCostForTrip(trip);
    }

    private BigDecimal calculateCostForTrip(Trip trip) {
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