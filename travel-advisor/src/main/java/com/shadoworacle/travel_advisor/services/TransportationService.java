package com.shadoworacle.travel_advisor.services;

// import com.shadoworacle.travel_advisor.models.Location;
import com.shadoworacle.travel_advisor.models.Transportation;
import com.shadoworacle.travel_advisor.models.TransportationType;
import com.shadoworacle.travel_advisor.repositories.TransportationRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransportationService {

    private final TransportationRepository transportationRepository;

    @Autowired
    public TransportationService(TransportationRepository transportationRepository) {
        this.transportationRepository = transportationRepository;
    }

    public List<Transportation> getAllTransportation() {
        return transportationRepository.findAll();
    }

    public Transportation getTransportationById(Long id) {
        return transportationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Transportation not found with id: " + id));
    }

    public List<Transportation> getTransportationByType(TransportationType type) {
        return transportationRepository.findByType(type);
    }

    public List<Transportation> findTransportationInPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return transportationRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<Transportation> findTransportationBetweenLocations(Long departureLocationId, Long arrivalLocationId) {
        return transportationRepository.findByLocations(departureLocationId, arrivalLocationId);
    }

    public List<Transportation> findAvailableTransportation(LocalDateTime startTime, LocalDateTime endTime) {
        return transportationRepository.findAvailableBetween(startTime, endTime);
    }

    public List<Transportation> findTransportationByCompany(String companyName) {
        return transportationRepository.findByCompanyNameContainingIgnoreCase(companyName);
    }

    public List<Transportation> findTransportationWithAvailableSeats(int minSeats) {
        return transportationRepository.findByAvailableSeatsGreaterThan(minSeats);
    }

    public Transportation createTransportation(Transportation transportation) {
        validateTransportation(transportation);
        return transportationRepository.save(transportation);
    }

    public Transportation updateTransportation(Long id, Transportation transportation) {
        // Check if transportation exists
        Transportation existingTransportation = getTransportationById(id);
        
        // Set the ID to ensure we're updating the existing record
        transportation.setId(id);
        
        validateTransportation(transportation);
        return transportationRepository.save(transportation);
    }

    public void deleteTransportation(Long id) {
        // Check if transportation exists
        getTransportationById(id);
        transportationRepository.deleteById(id);
    }

    public long calculateTravelDuration(Long id) {
        Transportation transportation = getTransportationById(id);
        Duration duration = Duration.between(transportation.getDepartureTime(), transportation.getArrivalTime());
        return duration.toMinutes();
    }

    public BigDecimal calculateTotalCost(Long id, int passengers) {
        Transportation transportation = getTransportationById(id);
        return transportation.getPrice().multiply(BigDecimal.valueOf(passengers));
    }

    private void validateTransportation(Transportation transportation) {
        // Departure time must be before arrival time
        if (transportation.getDepartureTime() != null && transportation.getArrivalTime() != null && 
            transportation.getDepartureTime().isAfter(transportation.getArrivalTime())) {
            throw new IllegalArgumentException("Departure time cannot be after arrival time");
        }
        
        // Price must be positive
        if (transportation.getPrice() != null && transportation.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        
        // Available seats must be non-negative
        if (transportation.getAvailableSeats() < 0) {
            throw new IllegalArgumentException("Available seats cannot be negative");
        }
        
        // Other validations as needed
    }
}