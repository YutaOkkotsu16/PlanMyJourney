package com.shadoworacle.travel_advisor.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.shadoworacle.travel_advisor.models.Trip;
import java.util.List;
import com.shadoworacle.travel_advisor.models.TripStatus;
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByStartLocation(Trip startLocation);
    List<Trip> findByEndLocation(Trip endLocation);
    List<Trip> findByStartDateBetween(Trip startDate, Trip endDate);
    List<Trip> findByName(Trip name);
}
