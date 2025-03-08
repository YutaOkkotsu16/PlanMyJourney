package com.shadoworacle.travel_advisor.models;

import jakarta.persistence.*;


/**
 * Location represents a place that can be visited during a trip.
 * It could be a city, a specific point of interest, or any destination.
 */

@Entity
@Table(name = "locations")
public class Location {
    
    // Primary key - unique identifier for each location
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // The name of the location (e.g., "Eiffel Tower", "New York City")
    @Column(nullable = false)
    private String name;
    
    // The city where this location is situated
    private String city;
    
    // The country of the location
    private String country;
    
    // Geographic coordinates for calculating distances
    private Double latitude;
    private Double longitude;
    
    // A detailed description of the location
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Default constructor - required by JPA
    public Location() {
    }
    
    // Convenience constructor for creating a new location
    public Location(String name, String city, String country, Double latitude, Double longitude, String description) {
        this.name = name;
        this.city = city;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    
    @Override
    public String toString() {
        return "Location{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", city='" + city + '\'' +
                ", country='" + country + '\'' +
                '}';
    }
}
