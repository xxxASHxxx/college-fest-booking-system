package com.collegefest.booking.service;

import com.collegefest.booking.dto.request.EventRequestDTO;
import com.collegefest.booking.dto.response.EventResponseDTO;
import com.collegefest.booking.dto.response.PriceTierResponseDTO;
import com.collegefest.booking.dto.response.VenueResponseDTO;
import com.collegefest.booking.entity.*;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.PriceTierRepository;
import com.collegefest.booking.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

        private final EventRepository eventRepository;
        private final VenueRepository venueRepository;
        private final PriceTierRepository priceTierRepository;

        @Transactional
        public EventResponseDTO createEvent(EventRequestDTO request) {
                log.info("Creating new event: {}", request.getEventName());
                Venue venue = venueRepository.findById(request.getVenueId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Venue not found with id: " + request.getVenueId()));

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
                log.info("Event created with ID: {} - {}", savedEvent.getId(), savedEvent.getEventName());

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

                return convertToDTO(savedEvent);
        }

        @Transactional(readOnly = true)
        public List<EventResponseDTO> getAllEvents() {
                return eventRepository.findAll().stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<EventResponseDTO> getPublishedEvents() {
                return eventRepository.findByStatusAndEventDateAfter(EventStatus.BOOKING_OPEN, LocalDateTime.now())
                                .stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public EventResponseDTO getEventById(Long id) {
                Event event = eventRepository.findByIdWithPriceTiers(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
                return convertToDTO(event);
        }

        @Transactional(readOnly = true)
        public List<EventResponseDTO> getEventsByType(EventType eventType) {
                return eventRepository.findByEventTypeAndStatus(eventType, EventStatus.BOOKING_OPEN)
                                .stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Transactional
        public EventResponseDTO updateEvent(Long id, EventRequestDTO request) {
                Event event = eventRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

                Venue venue = venueRepository.findById(request.getVenueId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Venue not found with id: " + request.getVenueId()));

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
                return convertToDTO(updatedEvent);
        }

        @Transactional
        public EventResponseDTO updateEventStatus(Long id, EventStatus status) {
                log.info("Updating event status - ID: {}, New status: {}", id, status);
                Event event = eventRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

                event.setStatus(status);
                Event updatedEvent = eventRepository.save(event);
                return convertToDTO(updatedEvent);
        }

        @Transactional
        public void deleteEvent(Long id) {
                log.info("Deleting event with ID: {}", id);
                Event event = eventRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
                eventRepository.delete(event);
                log.info("Event deleted successfully - ID: {}, Name: {}", id, event.getEventName());
        }

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
