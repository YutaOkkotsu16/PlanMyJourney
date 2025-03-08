package com.shadoworacle.travel_advisor.controllers;

import com.shadoworacle.travel_advisor.models.Transportation;
import com.shadoworacle.travel_advisor.models.TransportationType;
import com.shadoworacle.travel_advisor.services.TransportationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transportation")
public class TransportationController {

    private final TransportationService transportationService;

    @Autowired
    public TransportationController(TransportationService transportationService) {
        this.transportationService = transportationService;
    }

    @GetMapping
    public List<Transportation> getAllTransportation() {
        return transportationService.getAllTransportation();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transportation> getTransportationById(@PathVariable Long id) {
        try {
            Transportation transportation = transportationService.getTransportationById(id);
            return ResponseEntity.ok(transportation);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/type/{type}")
    public List<Transportation> getTransportationByType(@PathVariable TransportationType type) {
        return transportationService.getTransportationByType(type);
    }

    @GetMapping("/search/price")
    public List<Transportation> findByPriceRange(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return transportationService.findTransportationInPriceRange(min, max);
    }

    @GetMapping("/search/locations")
    public List<Transportation> findByLocations(
            @RequestParam Long departureId,
            @RequestParam Long arrivalId) {
        return transportationService.findTransportationBetweenLocations(departureId, arrivalId);
    }

    @GetMapping("/search/available")
    public List<Transportation> findAvailableTransportation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return transportationService.findAvailableTransportation(startTime, endTime);
    }

    @GetMapping("/search/company")
    public List<Transportation> findByCompany(@RequestParam String name) {
        return transportationService.findTransportationByCompany(name);
    }

    @GetMapping("/search/seats")
    public List<Transportation> findWithAvailableSeats(@RequestParam int minSeats) {
        return transportationService.findTransportationWithAvailableSeats(minSeats);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Transportation> createTransportation(@Valid @RequestBody Transportation transportation) {
        try {
            Transportation created = transportationService.createTransportation(transportation);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transportation> updateTransportation(
            @PathVariable Long id,
            @Valid @RequestBody Transportation transportation) {
        try {
            Transportation updated = transportationService.updateTransportation(id, transportation);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransportation(@PathVariable Long id) {
        try {
            transportationService.deleteTransportation(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/duration")
    public ResponseEntity<Map<String, Long>> calculateTravelDuration(@PathVariable Long id) {
        try {
            long durationMinutes = transportationService.calculateTravelDuration(id);
            return ResponseEntity.ok(Map.of("durationMinutes", durationMinutes));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/cost")
    public ResponseEntity<Map<String, BigDecimal>> calculateTotalCost(
            @PathVariable Long id,
            @RequestParam int passengers) {
        try {
            BigDecimal totalCost = transportationService.calculateTotalCost(id, passengers);
            return ResponseEntity.ok(Map.of("totalCost", totalCost));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
