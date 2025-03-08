package com.shadoworacle.travel_advisor.controllers;

import com.shadoworacle.travel_advisor.models.Location;
import com.shadoworacle.travel_advisor.services.LocationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<Location> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable Long id) {
        return locationService.getLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Location> searchLocations(@RequestParam(required = false) String name,
                                         @RequestParam(required = false) String country,
                                         @RequestParam(required = false) String city) {
        if (name != null) {
            return locationService.searchLocationsByName(name);
        } else if (country != null) {
            return locationService.getLocationsByCountry(country);
        } else if (city != null) {
            return locationService.getLocationsByCity(city);
        }
        return locationService.getAllLocations();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Location createLocation(@RequestBody Location location) {
        return locationService.saveLocation(location);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Location> updateLocation(@PathVariable Long id, @RequestBody Location location) {
        return locationService.getLocationById(id)
                .map(existingLocation -> {
                    location.setId(id);
                    return ResponseEntity.ok(locationService.saveLocation(location));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        return locationService.getLocationById(id)
                .map(location -> {
                    locationService.deleteLocation(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}