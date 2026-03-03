package com.collegefest.booking.controller;

import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.DashboardStatsResponse;
import com.collegefest.booking.entity.Booking;
import com.collegefest.booking.entity.User;
import com.collegefest.booking.repository.BookingRepository;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.UserRepository;
import com.collegefest.booking.repository.VenueRepository;
import com.collegefest.booking.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            log.info("GET /api/admin/dashboard - Fetching dashboard stats");
            Map<String, Object> stats = new HashMap<>();

            stats.put("totalUsers", userRepository.count());
            stats.put("totalEvents", eventRepository.count());
            stats.put("totalBookings", bookingRepository.count());
            stats.put("totalVenues", venueRepository.count());

            log.info("Dashboard stats retrieved successfully: {} users, {} events, {} bookings, {} venues",
                    stats.get("totalUsers"), stats.get("totalEvents"), stats.get("totalBookings"),
                    stats.get("totalVenues"));

            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDetailedDashboardStats() {
        try {
            log.info("GET /api/admin/dashboard/stats - Fetching detailed dashboard stats");
            DashboardStatsResponse stats = dashboardService.getDashboardStats();
            log.info("Detailed dashboard stats retrieved successfully");
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        } catch (Exception e) {
            log.error("Error fetching detailed dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            log.info("GET /api/admin/users - Fetching all users");
            List<User> users = userRepository.findAll();
            log.info("Retrieved {} users", users.size());
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        try {
            log.info("GET /api/admin/bookings - Fetching all bookings");
            List<Booking> bookings = bookingRepository.findAll();
            log.info("Retrieved {} bookings", bookings.size());
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
        } catch (Exception e) {
            log.error("Error fetching bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/bookings/event/{eventId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByEvent(@PathVariable Long eventId) {
        try {
            log.info("GET /api/admin/bookings/event/{} - Fetching bookings for event", eventId);
            List<Booking> bookings = bookingRepository.findByEventId(eventId);
            log.info("Retrieved {} bookings for event {}", bookings.size(), eventId);
            return ResponseEntity.ok(ApiResponse.success("Event bookings retrieved successfully", bookings));
        } catch (Exception e) {
            log.error("Error fetching bookings for event {}", eventId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch event bookings: " + e.getMessage()));
        }
    }
}
