package com.collegefest.booking.controller;

import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.entity.ReservationStatus;
import com.collegefest.booking.entity.SeatReservation;
import com.collegefest.booking.repository.SeatReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatReservationRepository seatReservationRepository;

    @GetMapping("/availability/{eventId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSeatAvailability(@PathVariable Long eventId) {
        // Get all confirmed seat reservations for the event
        List<SeatReservation> reservedSeats = seatReservationRepository
                .findByEventIdAndReservationStatus(eventId, ReservationStatus.CONFIRMED);

        List<String> reservedSeatNumbers = reservedSeats.stream()
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        Map<String, Object> availability = new HashMap<>();
        availability.put("eventId", eventId);
        availability.put("reservedSeats", reservedSeatNumbers);
        availability.put("totalReservedSeats", reservedSeatNumbers.size());

        return ResponseEntity.ok(ApiResponse.success("Seat availability retrieved successfully", availability));
    }

    @GetMapping("/event/{eventId}/all")
    public ResponseEntity<ApiResponse<List<SeatReservation>>> getAllSeatsForEvent(@PathVariable Long eventId) {
        List<SeatReservation> seats = seatReservationRepository
                .findByEventIdAndReservationStatus(eventId, ReservationStatus.CONFIRMED);

        return ResponseEntity.ok(ApiResponse.success("All seats retrieved successfully", seats));
    }
}
