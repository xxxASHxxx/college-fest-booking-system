package com.collegefest.booking.controller;

import com.collegefest.booking.dto.request.BookingRequestDTO;
import com.collegefest.booking.dto.request.PaymentConfirmationDTO;
import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.BookingResponseDTO;
import com.collegefest.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponseDTO>> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            Authentication authentication) {
        BookingResponseDTO booking = bookingService.createBooking(request, authentication);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking created successfully. Please complete payment within 10 minutes.", booking));
    }

    @PostMapping("/{id}/confirm-payment")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> confirmPayment(
            @PathVariable Long id,
            @Valid @RequestBody PaymentConfirmationDTO confirmationDTO) {
        BookingResponseDTO booking = bookingService.confirmPayment(id, confirmationDTO);
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed successfully", booking));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponseDTO>>> getUserBookings(Authentication authentication) {
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(authentication);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingById(
            @PathVariable Long id,
            Authentication authentication) {
        BookingResponseDTO booking = bookingService.getBookingById(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @GetMapping("/reference/{reference}")
    public ResponseEntity<ApiResponse<BookingResponseDTO>> getBookingByReference(@PathVariable String reference) {
        BookingResponseDTO booking = bookingService.getBookingByReference(reference);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        bookingService.cancelBooking(id, authentication);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
    }
}
