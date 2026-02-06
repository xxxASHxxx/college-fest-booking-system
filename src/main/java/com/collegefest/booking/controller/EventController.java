package com.collegefest.booking.controller;

import com.collegefest.booking.dto.request.EventRequestDTO;
import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.EventResponseDTO;
import com.collegefest.booking.dto.response.PriceTierResponseDTO;
import com.collegefest.booking.dto.response.VenueResponseDTO;
import com.collegefest.booking.entity.*;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.PriceTierRepository;
import com.collegefest.booking.repository.VenueRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;
    private final PriceTierRepository priceTierRepository;

    // GET all events (Public)
    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getAllEvents(
            @RequestParam(required = false) EventType eventType,
            @RequestParam(required = false) EventStatus status) {

        List<Event> events;

        if (eventType != null && status != null) {
            events = eventRepository.findByEventTypeAndStatus(eventType, status);
        } else if (status != null) {
            events = eventRepository.findByStatusAndEventDateAfter(status, LocalDateTime.now());
        } else {
            events = eventRepository.findAll();
        }

        List<EventResponseDTO> eventDTOs = events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Events retrieved successfully", eventDTOs));
    }

    // GET upcoming events (Public)
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<EventResponseDTO>>> getUpcomingEvents() {
        List<Event> events = eventRepository.findByStatusAndEventDateAfter(
                EventStatus.BOOKING_OPEN, LocalDateTime.now());

        List<EventResponseDTO> eventDTOs = events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success("Upcoming events retrieved successfully", eventDTOs));
    }

    // GET single event by ID (Public)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponseDTO>> getEventById(@PathVariable Long id) {
        Event event = eventRepository.findByIdWithPriceTiers(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        return ResponseEntity.ok(ApiResponse.success("Event retrieved successfully", convertToDTO(event)));
    }

    // CREATE event (Admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> createEvent(@Valid @RequestBody EventRequestDTO request) {
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.getVenueId()));

        Event event = Event.builder()
                .eventName(request.getEventName())
                .description(request.getDescription())
                .eventType(request.getEventType())
                .venue(venue)
                .eventDate(request.getEventDate())
                .durationMinutes(request.getDurationMinutes())
                .bannerImageUrl(request.getBannerImageUrl())
                .organizerName(request.getOrganizerName())
                .maxCapacity(request.getMaxCapacity())
                .bookingOpensAt(request.getBookingOpensAt())
                .bookingClosesAt(request.getBookingClosesAt())
                .status(EventStatus.DRAFT)
                .build();

        Event savedEvent = eventRepository.save(event);

        // Create price tiers if provided
        if (request.getPriceTiers() != null && !request.getPriceTiers().isEmpty()) {
            request.getPriceTiers().forEach(tierDTO -> {
                PriceTier priceTier = PriceTier.builder()
                        .event(savedEvent)
                        .tierName(tierDTO.getTierName())
                        .price(tierDTO.getPrice())
                        .totalSeats(tierDTO.getTotalSeats())
                        .availableSeats(tierDTO.getTotalSeats())
                        .colorCode(tierDTO.getColorCode())
                        .build();
                priceTierRepository.save(priceTier);
            });
        }

        Event eventWithTiers = eventRepository.findByIdWithPriceTiers(savedEvent.getId())
                .orElse(savedEvent);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", convertToDTO(eventWithTiers)));
    }

    // UPDATE event (Admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequestDTO request) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + request.getVenueId()));

        event.setEventName(request.getEventName());
        event.setDescription(request.getDescription());
        event.setEventType(request.getEventType());
        event.setVenue(venue);
        event.setEventDate(request.getEventDate());
        event.setDurationMinutes(request.getDurationMinutes());
        event.setBannerImageUrl(request.getBannerImageUrl());
        event.setOrganizerName(request.getOrganizerName());
        event.setMaxCapacity(request.getMaxCapacity());
        event.setBookingOpensAt(request.getBookingOpensAt());
        event.setBookingClosesAt(request.getBookingClosesAt());

        Event updatedEvent = eventRepository.save(event);

        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", convertToDTO(updatedEvent)));
    }

    // UPDATE event status (Admin only)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponseDTO>> updateEventStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setStatus(status);
        Event updatedEvent = eventRepository.save(event);

        return ResponseEntity.ok(ApiResponse.success("Event status updated successfully", convertToDTO(updatedEvent)));
    }

    // DELETE event (Admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        eventRepository.delete(event);

        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }

    // Helper method to convert Event entity to DTO
    private EventResponseDTO convertToDTO(Event event) {
        VenueResponseDTO venueDTO = VenueResponseDTO.builder()
                .id(event.getVenue().getId())
                .venueName(event.getVenue().getVenueName())
                .address(event.getVenue().getAddress())
                .totalCapacity(event.getVenue().getTotalCapacity())
                .hasNumberedSeats(event.getVenue().getHasNumberedSeats())
                .facilities(event.getVenue().getFacilities())
                .build();

        List<PriceTierResponseDTO> priceTierDTOs = event.getPriceTiers().stream()
                .map(tier -> PriceTierResponseDTO.builder()
                        .id(tier.getId())
                        .tierName(tier.getTierName())
                        .price(tier.getPrice())
                        .totalSeats(tier.getTotalSeats())
                        .availableSeats(tier.getAvailableSeats())
                        .colorCode(tier.getColorCode())
                        .build())
                .collect(Collectors.toList());

        return EventResponseDTO.builder()
                .id(event.getId())
                .eventName(event.getEventName())
                .description(event.getDescription())
                .eventType(event.getEventType())
                .venue(venueDTO)
                .eventDate(event.getEventDate())
                .durationMinutes(event.getDurationMinutes())
                .bannerImageUrl(event.getBannerImageUrl())
                .organizerName(event.getOrganizerName())
                .maxCapacity(event.getMaxCapacity())
                .bookingOpensAt(event.getBookingOpensAt())
                .bookingClosesAt(event.getBookingClosesAt())
                .status(event.getStatus())
                .priceTiers(priceTierDTOs)
                .createdAt(event.getCreatedAt())
                .build();
    }
}
