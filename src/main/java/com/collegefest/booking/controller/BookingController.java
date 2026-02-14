package com.collegefest.booking.controller;

import com.collegefest.booking.dto.request.BookingRequestDTO;
import com.collegefest.booking.dto.request.PaymentConfirmationDTO;
import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.BookingResponseDTO;
import com.collegefest.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    private final BookingService bookingService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            Authentication authentication) {

        BookingResponseDTO booking = bookingService.createBooking(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully", booking));
    }

    // Confirm payment for a booking
    @PostMapping("/{bookingId}/confirm-payment")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> confirmPayment(
            @PathVariable Long bookingId,
            @Valid @RequestBody PaymentConfirmationDTO confirmationDTO) {

        BookingResponseDTO booking = bookingService.confirmPayment(bookingId, confirmationDTO);
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed successfully", booking));
    }

    // Get all bookings for current user
    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getMyBookings(Authentication authentication) {
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(authentication);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    // Get booking by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {

        BookingResponseDTO booking = bookingService.getBookingById(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    // Get booking by reference
    @GetMapping("/reference/{reference}")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingByReference(
            @PathVariable String reference) {

        BookingResponseDTO booking = bookingService.getBookingByReference(reference);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    // Cancel booking
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {

        bookingService.cancelBooking(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
    }
}
