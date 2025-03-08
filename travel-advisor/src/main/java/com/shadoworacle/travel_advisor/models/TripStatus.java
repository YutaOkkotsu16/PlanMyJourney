package com.shadoworacle.travel_advisor.models;

/**
 * Enum representing different statuses a trip can have.
 */
public enum TripStatus {
    PLANNED,    // Trip is created but hasn't started yet
    IN_PROGRESS, // Trip is currently happening
    COMPLETED,   // Trip has finished
    CANCELLED    // Trip was cancelled
}

