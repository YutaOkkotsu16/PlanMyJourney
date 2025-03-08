package com.shadoworacle.travel_advisor.repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.shadoworacle.travel_advisor.models.Location;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    // Find locations by country
    List<Location> findByCountry(String country);
    
    // Find locations by city
    List<Location> findByCity(String city);
    
    // Find locations by name containing the search term (case insensitive)
    List<Location> findByNameContainingIgnoreCase(String namePart);
}



