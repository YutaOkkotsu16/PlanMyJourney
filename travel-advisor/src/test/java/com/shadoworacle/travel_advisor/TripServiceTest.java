package com.shadoworacle.travel_advisor;
import com.shadoworacle.travel_advisor.services.TripService;

import com.shadoworacle.travel_advisor.models.Trip;
import com.shadoworacle.travel_advisor.models.TripStatus;
import com.shadoworacle.travel_advisor.models.Location;
import com.shadoworacle.travel_advisor.repositories.TripRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private TripService tripService;

    private Trip sampleTrip;

    @BeforeEach
    void setUp() {
        // Set up test data
        sampleTrip = new Trip();
        sampleTrip.setId(1L);
        sampleTrip.setName("Test Trip");
        sampleTrip.setStatus(TripStatus.PLANNED);
        sampleTrip.setStartDate(LocalDate.now());
        sampleTrip.setEndDate(LocalDate.now().plusDays(5));
        
        // Set up startLocation
        Location startLocation = new Location();
        startLocation.setId(1L);
        startLocation.setName("Start Location");
        sampleTrip.setStartLocation(startLocation);
        
        // Set up endLocation
        Location endLocation = new Location();
        endLocation.setId(2L);
        endLocation.setName("End Location");
        sampleTrip.setEndLocation(endLocation);
    }

    @Test
    void getTripById_ExistingId_ReturnsTrip() {
        // Arrange
        when(tripRepository.findById(1L)).thenReturn(Optional.of(sampleTrip));

        // Act
        Trip result = tripService.getTripById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(sampleTrip.getId(), result.getId());
        assertEquals(sampleTrip.getName(), result.getName());
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    void getTripById_NonExistingId_ThrowsRuntimeException() {
        // Arrange
        when(tripRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tripService.getTripById(999L);
        });
        
        assertEquals("Trip not found", exception.getMessage());
        verify(tripRepository, times(1)).findById(999L);
    }

    @Test
    void getAllTrips_ReturnsAllTrips() {
        // Arrange
        Trip anotherTrip = new Trip();
        anotherTrip.setId(2L);
        anotherTrip.setName("Another Trip");
        
        List<Trip> trips = Arrays.asList(sampleTrip, anotherTrip);
        when(tripRepository.findAll()).thenReturn(trips);

        // Act
        List<Trip> result = tripService.getAllTrips();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Test Trip", result.get(0).getName());
        assertEquals("Another Trip", result.get(1).getName());
        verify(tripRepository, times(1)).findAll();
    }

    @Test
    void getAllTrips_NoTrips_ReturnsEmptyList() {
        // Arrange
        when(tripRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<Trip> result = tripService.getAllTrips();

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(tripRepository, times(1)).findAll();
    }

    @Test
    void createTrip_ValidTrip_ReturnsSavedTrip() {
        // Arrange
        when(tripRepository.save(any(Trip.class))).thenReturn(sampleTrip);

        // Act
        Trip result = tripService.createTrip(sampleTrip);

        // Assert
        assertNotNull(result);
        assertEquals(sampleTrip.getId(), result.getId());
        assertEquals(sampleTrip.getName(), result.getName());
        verify(tripRepository, times(1)).save(sampleTrip);
    }

    @Test
    void updateTrip_ExistingTrip_ReturnsUpdatedTrip() {
        // Arrange
        Trip updatedTrip = new Trip();
        updatedTrip.setId(1L);
        updatedTrip.setName("Updated Trip Name");

        
        when(tripRepository.save(any(Trip.class))).thenReturn(updatedTrip);

        // Act
        Trip result = tripService.updateTrip(updatedTrip);

        // Assert
        assertNotNull(result);
        assertEquals(updatedTrip.getId(), result.getId());
        assertEquals("Updated Trip Name", result.getName());
        verify(tripRepository, times(1)).save(updatedTrip);
    }

    @Test
    void deleteTrip_ExistingId_CallsRepositoryDeleteById() {
        // Arrange
        doNothing().when(tripRepository).deleteById(anyLong());

        // Act
        tripService.deleteTrip(1L);

        // Assert
        verify(tripRepository, times(1)).deleteById(1L);
    }

    @Test
    void calculateTripCost_ExistingTrip_ReturnsZero() {
        // Arrange
        when(tripRepository.findById(1L)).thenReturn(Optional.of(sampleTrip));

        // Act
        BigDecimal result = tripService.calculateTripCost(1L);

        // Assert
        assertNotNull(result);
        assertEquals(BigDecimal.ZERO, result);  // As per your implementation
        verify(tripRepository, times(1)).findById(1L);
    }

    @Test
    void calculateTripCost_NonExistingTrip_ThrowsEntityNotFoundException() {
        // Arrange
        when(tripRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            tripService.calculateTripCost(999L);
        });
        
        assertEquals("Trip not found with id: 999", exception.getMessage());
        verify(tripRepository, times(1)).findById(999L);
    }

    @Test
    void calculateTripDuration_ExistingTrip_ReturnsDuration() {
        // Arrange
        Trip tripWithDuration = mock(Trip.class);
        // Only keep the stubs that are actually used
        when(tripWithDuration.getDurationInDays()).thenReturn(9);
        when(tripRepository.findById(1L)).thenReturn(Optional.of(tripWithDuration));
    
        // Act
        int result = tripService.calculateTripDuration(1L);
    
        // Assert
        assertEquals(9, result);
        verify(tripRepository, times(1)).findById(1L);
    }
    @Test
    void calculateTripDuration_NonExistingTrip_ThrowsEntityNotFoundException() {
        // Arrange
        when(tripRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            tripService.calculateTripDuration(999L);
        });
        
        assertEquals("Trip not found with id: 999", exception.getMessage());
        verify(tripRepository, times(1)).findById(999L);
    }

    @Test
    void updateTripStatus_ExistingTrip_ReturnsUpdatedTrip() {
        // Arrange
        Trip existingTrip = new Trip();
        existingTrip.setId(1L);
        existingTrip.setName("Existing Trip");
        existingTrip.setStatus(TripStatus.PLANNED);
        
        Trip updatedTripStatus = new Trip();
        updatedTripStatus.setStatus(TripStatus.IN_PROGRESS);
        
        Trip expectedResult = new Trip();
        expectedResult.setId(1L);
        expectedResult.setName("Existing Trip");
        expectedResult.setStatus(TripStatus.IN_PROGRESS);
        
        when(tripRepository.findById(1L)).thenReturn(Optional.of(existingTrip));
        when(tripRepository.save(any(Trip.class))).thenReturn(expectedResult);

        // Act
        Trip result = tripService.updateTripStatus(1L, updatedTripStatus);

        // Assert
        assertNotNull(result);
        assertEquals(TripStatus.IN_PROGRESS, result.getStatus());
        verify(tripRepository, times(1)).findById(1L);
        verify(tripRepository, times(1)).save(existingTrip);
    }

    @Test
    void updateTripStatus_NonExistingTrip_ThrowsEntityNotFoundException() {
        // Arrange
        Trip updatedTripStatus = new Trip();
        updatedTripStatus.setStatus(TripStatus.IN_PROGRESS);
        
        when(tripRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            tripService.updateTripStatus(999L, updatedTripStatus);
        });
        
        assertEquals("Trip not found with id: 999", exception.getMessage());
        verify(tripRepository, times(1)).findById(999L);
        verify(tripRepository, never()).save(any(Trip.class));
    }
}