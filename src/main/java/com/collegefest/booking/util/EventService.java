package com.collegefest.booking.service;

import com.collegefest.booking.dto.request.EventRequestDTO;
import com.collegefest.booking.dto.request.PriceTierRequestDTO;
import com.collegefest.booking.dto.response.EventResponseDTO;
import com.collegefest.booking.dto.response.PriceTierResponseDTO;
import com.collegefest.booking.dto.response.VenueResponseDTO;
import com.collegefest.booking.entity.*;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    @Transactional
    public EventResponseDTO createEvent(EventRequestDTO request) {
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

        // Add price tiers
        if (request.getPriceTiers() != null && !request.getPriceTiers().isEmpty()) {
            List<PriceTier> priceTiers = request.getPriceTiers().stream()
                    .map(tierDTO -> createPriceTier(tierDTO, event))
                    .collect(Collectors.toList());
            event.setPriceTiers(priceTiers);
        }

        Event savedEvent = eventRepository.save(event);
        return convertToResponse(savedEvent);
    }

    @Transactional(readOnly = true)
    public List<EventResponseDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponseDTO> getPublishedEvents() {
        return eventRepository.findByStatusAndEventDateAfter(EventStatus.PUBLISHED, LocalDateTime.now())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findByIdWithPriceTiers(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        return convertToResponse(event);
    }

    @Transactional(readOnly = true)
    public List<EventResponseDTO> getEventsByType(EventType eventType) {
        return eventRepository.findByEventTypeAndStatus(eventType, EventStatus.PUBLISHED)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public EventResponseDTO updateEvent(Long id, EventRequestDTO request) {
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
        return convertToResponse(updatedEvent);
    }

    @Transactional
    public EventResponseDTO updateEventStatus(Long id, EventStatus status) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setStatus(status);
        Event updatedEvent = eventRepository.save(event);
        return convertToResponse(updatedEvent);
    }

    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    private PriceTier createPriceTier(PriceTierRequestDTO dto, Event event) {
        return PriceTier.builder()
                .event(event)
                .tierName(dto.getTierName())
                .price(dto.getPrice())
                .totalSeats(dto.getTotalSeats())
                .availableSeats(dto.getTotalSeats())
                .seatRangeStart(dto.getSeatRangeStart())
                .seatRangeEnd(dto.getSeatRangeEnd())
                .colorCode(dto.getColorCode())
                .build();
    }

    private EventResponseDTO convertToResponse(Event event) {
        VenueResponseDTO venueResponse = VenueResponseDTO.builder()
                .id(event.getVenue().getId())
                .venueName(event.getVenue().getVenueName())
                .address(event.getVenue().getAddress())
                .totalCapacity(event.getVenue().getTotalCapacity())
                .hasNumberedSeats(event.getVenue().getHasNumberedSeats())
                .seatingLayoutJson(event.getVenue().getSeatingLayoutJson())
                .facilities(event.getVenue().getFacilities())
                .build();

        List<PriceTierResponseDTO> priceTierResponses = event.getPriceTiers().stream()
                .map(this::convertPriceTierToResponse)
                .collect(Collectors.toList());

        return EventResponseDTO.builder()
                .id(event.getId())
                .eventName(event.getEventName())
                .description(event.getDescription())
                .eventType(event.getEventType())
                .venue(venueResponse)
                .eventDate(event.getEventDate())
                .durationMinutes(event.getDurationMinutes())
                .bannerImageUrl(event.getBannerImageUrl())
                .organizerName(event.getOrganizerName())
                .maxCapacity(event.getMaxCapacity())
                .bookingOpensAt(event.getBookingOpensAt())
                .bookingClosesAt(event.getBookingClosesAt())
                .status(event.getStatus())
                .priceTiers(priceTierResponses)
                .createdAt(event.getCreatedAt())
                .build();
    }

    private PriceTierResponseDTO convertPriceTierToResponse(PriceTier priceTier) {
        double availabilityPercentage = (priceTier.getAvailableSeats() * 100.0) / priceTier.getTotalSeats();

        return PriceTierResponseDTO.builder()
                .id(priceTier.getId())
                .tierName(priceTier.getTierName())
                .price(priceTier.getPrice())
                .totalSeats(priceTier.getTotalSeats())
                .availableSeats(priceTier.getAvailableSeats())
                .seatRangeStart(priceTier.getSeatRangeStart())
                .seatRangeEnd(priceTier.getSeatRangeEnd())
                .colorCode(priceTier.getColorCode())
                .availabilityPercentage(availabilityPercentage)
                .build();
    }
}
