package com.collegefest.booking.service;

import com.collegefest.booking.dto.response.SeatMapResponse;
import com.collegefest.booking.entity.Event;
import com.collegefest.booking.entity.PriceTier;
import com.collegefest.booking.entity.ReservationStatus;
import com.collegefest.booking.entity.SeatReservation;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.PriceTierRepository;
import com.collegefest.booking.repository.SeatReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final EventRepository eventRepository;
    private final PriceTierRepository priceTierRepository;
    private final SeatReservationRepository seatReservationRepository;

    @Transactional(readOnly = true)
    public SeatMapResponse getSeatMap(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        List<PriceTier> priceTiers = priceTierRepository.findByEventId(eventId);

        List<SeatReservation> reservedSeats = seatReservationRepository
                .findByEventIdAndReservationStatus(eventId, ReservationStatus.CONFIRMED);

        List<String> reservedSeatNumbers = reservedSeats.stream()
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        return SeatMapResponse.builder()
                .eventId(eventId)
                .eventName(event.getEventName())
                .venueLayout(event.getVenue().getSeatingLayoutJson())
                .totalCapacity(event.getMaxCapacity())
                .reservedSeats(reservedSeatNumbers)
                .build();
    }

    @Transactional(readOnly = true)
    public List<String> getAvailableSeats(Long eventId, Long priceTierId) {
        PriceTier priceTier = priceTierRepository.findById(priceTierId)
                .orElseThrow(() -> new ResourceNotFoundException("Price tier not found with id: " + priceTierId));

        List<SeatReservation> reservedSeats = seatReservationRepository
                .findByEventIdAndReservationStatus(eventId, ReservationStatus.CONFIRMED);

        List<String> reservedSeatNumbers = reservedSeats.stream()
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        // Generate available seats based on price tier range
        // This is a simplified implementation
        return List.of(); // Would need proper seat generation logic
    }

    @Transactional(readOnly = true)
    public boolean isSeatAvailable(Long eventId, String seatNumber) {
        return !seatReservationRepository.existsByEventIdAndSeatNumberAndReservationStatus(
                eventId, seatNumber, ReservationStatus.CONFIRMED);
    }
}
