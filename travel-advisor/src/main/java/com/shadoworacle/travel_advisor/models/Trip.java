package com.shadoworacle.travel_advisor.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Trip represents a complete travel plan for a user.
 * It includes start and end locations, dates, budget, and more.
 */
@Entity
@Table(name = "trips")
public class Trip {
    
    // Primary key - unique identifier for each trip
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // A name for this trip (e.g., "Summer Vacation 2025")
    @Column(nullable = false)
    private String name;
    
    // Where the trip starts
    @ManyToOne
    @JoinColumn(name = "start_location_id", nullable = false)
    private Location startLocation;
    
    // Where the trip ends
    @ManyToOne
    @JoinColumn(name = "end_location_id", nullable = false)
    private Location endLocation;
    
    // When the trip starts
    @Column(nullable = false)
    private LocalDate startDate;
    
    // When the trip ends
    @Column(nullable = false)
    private LocalDate endDate;

    @AssertTrue(message = "Start date must be before end date")
    private boolean isDateRangeValid() {
        return startDate == null || endDate == null || !startDate.isAfter(endDate);
    }
    
    // The total budget for this trip
    @Column(nullable = false)
    private BigDecimal budget;
    
    // Any additional notes about the trip
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    // The current status of the trip
    @Enumerated(EnumType.STRING)
    private TripStatus status;
    
    // Default constructor - required by JPA
    public Trip() {
    }
    
    // Convenience constructor for creating a new trip
    public Trip(String name, Location startLocation, Location endLocation, 
                LocalDate startDate, LocalDate endDate, BigDecimal budget) {
        this.name = name;
        this.startLocation = startLocation;
        this.endLocation = endLocation;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.status = TripStatus.PLANNED; // Default status for a new trip
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

    public Location getStartLocation() {
        return startLocation;
    }

    public void setStartLocation(Location startLocation) {
        this.startLocation = startLocation;
    }

    public Location getEndLocation() {
        return endLocation;
    }

    public void setEndLocation(Location endLocation) {
        this.endLocation = endLocation;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }
    /**
     * Calculate the duration of the trip in days
     */
    public int getDurationInDays() {
        return (int) (endDate.toEpochDay() - startDate.toEpochDay() + 1);
    }
    
    @Override
    public String toString() {
        return "Trip{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", from=" + startLocation.getName() +
                ", to=" + endLocation.getName() +
                ", dates=" + startDate + " to " + endDate +
                ", budget=" + budget +
                ", status=" + status +
                '}';
    }
}

