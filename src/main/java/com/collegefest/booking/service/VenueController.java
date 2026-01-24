package com.collegefest.booking.controller;

import com.collegefest.booking.dto.request.VenueRequestDTO;
import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.VenueResponseDTO;
import com.collegefest.booking.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VenueResponseDTO>> createVenue(@Valid @RequestBody VenueRequestDTO request) {
        VenueResponseDTO venue = venueService.createVenue(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Venue created successfully", venue));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VenueResponseDTO>>> getAllVenues() {
        List<VenueResponseDTO> venues = venueService.getAllVenues();
        return ResponseEntity.ok(ApiResponse.success("Venues retrieved successfully", venues));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VenueResponseDTO>> getVenueById(@PathVariable Long id) {
        VenueResponseDTO venue = venueService.getVenueById(id);
        return ResponseEntity.ok(ApiResponse.success("Venue retrieved successfully", venue));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<VenueResponseDTO>> updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody VenueRequestDTO request) {
        VenueResponseDTO venue = venueService.updateVenue(id, request);
        return ResponseEntity.ok(ApiResponse.success("Venue updated successfully", venue));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteVenue(@PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.ok(ApiResponse.success("Venue deleted successfully", null));
    }
}
