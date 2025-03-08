package com.shadoworacle.travel_advisor.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transportation represents a way to travel between two locations.
 * It includes details like type (flight, train, etc.), cost, and duration.
 */
@Entity
@Table(name = "transportation")
public class Transportation {
    
    // Primary key - unique identifier for each transportation option
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // The type of transportation (e.g., FLIGHT, TRAIN, BUS)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransportationType type;
    
    // The starting location of this transportation option
    @ManyToOne
    @JoinColumn(name = "origin_location_id", nullable = false)
    private Location originLocation;
    
    // The destination location of this transportation option
    @ManyToOne
    @JoinColumn(name = "destination_location_id", nullable = false)
    private Location destinationLocation;
    
    // The cost of this transportation option
    @Column(nullable = false)
    private BigDecimal price;

    // The number of available seats for this transportation option
    @Column(nullable = false)
    private int availableSeats;
    
    // How long it takes to travel (in minutes)
    @Column(nullable = false)
    private Integer durationInMinutes;
    
    // The distance between the origin and destination (in kilometers)
    private Double distance;

    // The departure time of the transportation option
    @Column(nullable = false)
    private LocalDateTime departureTime;

    // The arrival time of the transportation option
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    private String companyName;
    // Default constructor - required by JPA
    public Transportation() {
    }
    
    // Convenience constructor for creating a new transportation option
    public Transportation(TransportationType type, Location originLocation, Location destinationLocation, 
                          BigDecimal cost, Integer durationInMinutes, Double distance) {
        this.type = type;
        this.originLocation = originLocation;
        this.destinationLocation = destinationLocation;
        this.price = price;
        this.durationInMinutes = durationInMinutes;
        this.distance = distance;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransportationType getType() {
        return type;
    }

    public void setType(TransportationType type) {
        this.type = type;
    }

    public Location getOriginLocation() {
        return originLocation;
    }

    public void setOriginLocation(Location originLocation) {
        this.originLocation = originLocation;
    }

    public Location getDestinationLocation() {
        return destinationLocation;
    }

    public void setDestinationLocation(Location destinationLocation) {
        this.destinationLocation = destinationLocation;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationInMinutes() {
        return durationInMinutes;
    }

    public void setDurationInMinutes(Integer durationInMinutes) {
        this.durationInMinutes = durationInMinutes;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
    @Override
    public String toString() {
        return "Transportation{" +
                "id=" + id +
                ", type=" + type +
                ", origin=" + originLocation.getName() +
                ", destination=" + destinationLocation.getName() +
                ", price=" + price +
                ", duration=" + durationInMinutes + " minutes" +
                ", departureTime=" + departureTime +
                ", arrivalTime=" + arrivalTime +
                '}';
    }
}