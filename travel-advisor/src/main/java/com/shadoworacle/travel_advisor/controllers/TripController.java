package com.shadoworacle.travel_advisor.controllers;

import com.shadoworacle.travel_advisor.models.Trip;
import com.shadoworacle.travel_advisor.services.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {
    private final TripService tripService;

    @Autowired
    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @PostMapping
    public Trip createTrip(@RequestBody Trip trip) {
        return tripService.createTrip(trip);
    }
    
    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

    @PutMapping("/{id}")
    public Trip updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        return tripService.updateTrip(trip);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }

    @GetMapping("/{id}/cost")
    public BigDecimal calculateTripCost(@PathVariable Long id) {
        return tripService.calculateTripCost(id);
    }

    @GetMapping("/{id}/duration")
    public Integer calculateTripDuration(@PathVariable Long id) {
        return tripService.calculateTripDuration(id);
    }

    @PutMapping("/{id}/status")
    public Trip updateTripStatus(@PathVariable Long id, @RequestBody Trip trip) {
        return tripService.updateTripStatus(id, trip);
    }
}

