package com.collegefest.booking.service;

import com.collegefest.booking.dto.request.VenueRequestDTO;
import com.collegefest.booking.dto.response.VenueResponseDTO;
import com.collegefest.booking.entity.Venue;
import com.collegefest.booking.exception.DuplicateResourceException;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VenueService {

    private final VenueRepository venueRepository;

    @Transactional
    public VenueResponseDTO createVenue(VenueRequestDTO request) {
        if (venueRepository.existsByVenueName(request.getVenueName())) {
            throw new DuplicateResourceException("Venue with this name already exists");
        }

        Venue venue = Venue.builder()
                .venueName(request.getVenueName())
                .address(request.getAddress())
                .totalCapacity(request.getTotalCapacity())
                .hasNumberedSeats(request.getHasNumberedSeats())
                .seatingLayoutJson(request.getSeatingLayoutJson())
                .facilities(request.getFacilities())
                .build();

        Venue savedVenue = venueRepository.save(venue);
        return convertToDTO(savedVenue);
    }

    @Transactional(readOnly = true)
    public List<VenueResponseDTO> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VenueResponseDTO getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
        return convertToDTO(venue);
    }

    @Transactional
    public VenueResponseDTO updateVenue(Long id, VenueRequestDTO request) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));

        venue.setVenueName(request.getVenueName());
        venue.setAddress(request.getAddress());
        venue.setTotalCapacity(request.getTotalCapacity());
        venue.setHasNumberedSeats(request.getHasNumberedSeats());
        venue.setSeatingLayoutJson(request.getSeatingLayoutJson());
        venue.setFacilities(request.getFacilities());

        Venue updatedVenue = venueRepository.save(venue);
        return convertToDTO(updatedVenue);
    }

    @Transactional
    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
        venueRepository.delete(venue);
    }

    private VenueResponseDTO convertToDTO(Venue venue) {
        return VenueResponseDTO.builder()
                .id(venue.getId())
                .venueName(venue.getVenueName())
                .address(venue.getAddress())
                .totalCapacity(venue.getTotalCapacity())
                .hasNumberedSeats(venue.getHasNumberedSeats())
                .seatingLayoutJson(venue.getSeatingLayoutJson())
                .facilities(venue.getFacilities())
                .build();
    }
}
