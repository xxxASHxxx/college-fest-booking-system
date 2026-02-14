package com.collegefest.booking.controller;

import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.entity.Booking;
import com.collegefest.booking.entity.User;
import com.collegefest.booking.repository.BookingRepository;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.UserRepository;
import com.collegefest.booking.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Slf4j
public class AdminController {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalEvents", eventRepository.count());
        stats.put("totalBookings", bookingRepository.count());
        stats.put("totalVenues", venueRepository.count());

        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/event/{eventId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByEvent(@PathVariable Long eventId) {
        List<Booking> bookings = bookingRepository.findByEventId(eventId);
        return ResponseEntity.ok(ApiResponse.success("Event bookings retrieved successfully", bookings));
    }
}
