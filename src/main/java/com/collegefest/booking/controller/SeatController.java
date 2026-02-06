package com.collegefest.booking.controller;

import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.SeatMapResponse;
import com.collegefest.booking.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<SeatMapResponse>> getSeatMap(@PathVariable Long eventId) {
        SeatMapResponse seatMap = seatService.getSeatMap(eventId);
        return ResponseEntity.ok(ApiResponse.success("Seat map retrieved successfully", seatMap));
    }

    @GetMapping("/event/{eventId}/tier/{priceTierId}")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableSeats(
            @PathVariable Long eventId,
            @PathVariable Long priceTierId) {
        List<String> availableSeats = seatService.getAvailableSeats(eventId, priceTierId);
        return ResponseEntity.ok(ApiResponse.success("Available seats retrieved", availableSeats));
    }

    @GetMapping("/event/{eventId}/check/{seatNumber}")
    public ResponseEntity<ApiResponse<Boolean>> checkSeatAvailability(
            @PathVariable Long eventId,
            @PathVariable String seatNumber) {
        boolean isAvailable = seatService.isSeatAvailable(eventId, seatNumber);
        return ResponseEntity.ok(ApiResponse.success(
                isAvailable ? "Seat is available" : "Seat is not available",
                isAvailable));
    }
}
