package com.shadoworacle.travel_advisor;

import com.shadoworacle.travel_advisor.controllers.LocationController;
import com.shadoworacle.travel_advisor.models.Location;
import com.shadoworacle.travel_advisor.services.LocationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class LocationControllerTest {

    private MockMvc mockMvc;

    @Mock
    private LocationService locationService;
    
    @BeforeEach
    public void setup() {
        LocationController locationController = new LocationController(locationService);
        mockMvc = MockMvcBuilders.standaloneSetup(locationController).build();
    }

    @Test
    public void testGetLocationById() throws Exception {
        // Arrange
        Location location = new Location();
        location.setId(1L);
        location.setName("Paris");
        location.setCountry("France");
        
        when(locationService.getLocationById(1L)).thenReturn(Optional.of(location));

        // Act & Assert
        mockMvc.perform(get("/api/locations/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Paris"))
                .andExpect(jsonPath("$.country").value("France"));
    }
    
    @Test
    public void testGetAllLocations() throws Exception {
        // Arrange
        Location location1 = new Location();
        location1.setId(1L);
        location1.setName("Paris");
        location1.setCountry("France");
        
        Location location2 = new Location();
        location2.setId(2L);
        location2.setName("London");
        location2.setCountry("UK");
        
        List<Location> locations = Arrays.asList(location1, location2);
        
        when(locationService.getAllLocations()).thenReturn(locations);
        
        // Act & Assert
        mockMvc.perform(get("/api/locations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Paris"))
                .andExpect(jsonPath("$[0].country").value("France"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("London"))
                .andExpect(jsonPath("$[1].country").value("UK"));
    }
    
    @Test
    public void testGetLocationByIdNotFound() throws Exception {
        // Arrange
        when(locationService.getLocationById(999L)).thenReturn(Optional.empty());
        
        // Act & Assert
        mockMvc.perform(get("/api/locations/999"))
                .andExpect(status().isNotFound());
    }
    
    @Test
    public void testSearchLocationsByName() throws Exception {
        // Arrange
        Location location = new Location();
        location.setId(1L);
        location.setName("Paris");
        location.setCountry("France");
        
        when(locationService.searchLocationsByName("Paris")).thenReturn(Arrays.asList(location));
        
        // Act & Assert
        mockMvc.perform(get("/api/locations/search?name=Paris"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Paris"))
                .andExpect(jsonPath("$[0].country").value("France"));
    }
    
    @Test
    public void testSearchLocationsByCountry() throws Exception {
        // Arrange
        Location location = new Location();
        location.setId(1L);
        location.setName("Paris");
        location.setCountry("France");
        
        when(locationService.getLocationsByCountry("France")).thenReturn(Arrays.asList(location));
        
        // Act & Assert
        mockMvc.perform(get("/api/locations/search?country=France"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Paris"))
                .andExpect(jsonPath("$[0].country").value("France"));
    }
}