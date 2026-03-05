package com.collegefest.booking.controller;

import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.DashboardStatsResponse;
import com.collegefest.booking.entity.Booking;
import com.collegefest.booking.entity.BookingStatus;
import com.collegefest.booking.entity.User;
import com.collegefest.booking.repository.BookingRepository;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.UserRepository;
import com.collegefest.booking.repository.VenueRepository;
import com.collegefest.booking.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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
            stats.put("activeEvents", eventRepository.count());

            // Calculate total revenue from confirmed bookings
            BigDecimal totalRevenue = BigDecimal.ZERO;
            try {
                List<Booking> confirmedBookings = bookingRepository.findAll().stream()
                        .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                        .collect(Collectors.toList());
                for (Booking b : confirmedBookings) {
                    if (b.getTotalAmount() != null) {
                        totalRevenue = totalRevenue.add(b.getTotalAmount());
                    }
                }
            } catch (Exception e) {
                log.warn("Could not calculate revenue: {}", e.getMessage());
            }
            stats.put("totalRevenue", totalRevenue);

            // Growth indicators (placeholder positive values)
            stats.put("revenueChange", 18.5);
            stats.put("bookingsChange", 12.3);
            stats.put("eventsChange", 3);
            stats.put("usersChange", 25.8);

            // Events overview
            Map<String, Object> eventsOverview = new HashMap<>();
            eventsOverview.put("active", eventRepository.count());
            eventsOverview.put("upcoming", 0);
            eventsOverview.put("completed", 0);
            eventsOverview.put("cancelled", 0);
            stats.put("eventsOverview", eventsOverview);

            log.info("Dashboard stats retrieved successfully");
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

    @GetMapping("/bookings/recent")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRecentBookings(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            log.info("GET /api/admin/bookings/recent - Fetching recent bookings (limit: {})", limit);
            List<Booking> bookings = bookingRepository.findAll(
                    PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "bookedAt"))).getContent();

            List<Map<String, Object>> result = bookings.stream().map(b -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", b.getId());
                map.put("bookingReference", b.getBookingReference());
                map.put("eventName", b.getEvent() != null ? b.getEvent().getEventName() : "Unknown");
                map.put("userName", b.getUser() != null ? b.getUser().getFullName() : "Unknown");
                map.put("totalAmount", b.getTotalAmount());
                map.put("bookingStatus", b.getBookingStatus() != null ? b.getBookingStatus().name() : "CONFIRMED");
                map.put("bookedAt", b.getBookedAt());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Recent bookings retrieved", result));
        } catch (Exception e) {
            log.error("Error fetching recent bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch recent bookings: " + e.getMessage()));
        }
    }

    @GetMapping("/analytics/revenue")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRevenueData(
            @RequestParam(defaultValue = "30days") String period) {
        try {
            log.info("GET /api/admin/analytics/revenue - Fetching revenue data (period: {})", period);

            // Get last 7 days revenue grouped by date
            List<Booking> allBookings = bookingRepository.findAll();
            LocalDate now = LocalDate.now();
            int days = period.equals("7days") ? 7 : period.equals("90days") ? 90 : 30;

            Map<LocalDate, BigDecimal> revenueByDate = new LinkedHashMap<>();
            for (int i = days - 1; i >= 0; i--) {
                revenueByDate.put(now.minusDays(i), BigDecimal.ZERO);
            }

            for (Booking b : allBookings) {
                if (b.getBookedAt() != null && b.getTotalAmount() != null
                        && b.getBookingStatus() == BookingStatus.CONFIRMED) {
                    LocalDate bookingDate = b.getBookedAt().toLocalDate();
                    if (revenueByDate.containsKey(bookingDate)) {
                        revenueByDate.merge(bookingDate, b.getTotalAmount(), BigDecimal::add);
                    }
                }
            }

            List<Map<String, Object>> result = revenueByDate.entrySet().stream().map(e -> {
                Map<String, Object> map = new HashMap<>();
                map.put("date", e.getKey().toString());
                map.put("revenue", e.getValue());
                return map;
            }).collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Revenue data retrieved", result));
        } catch (Exception e) {
            log.error("Error fetching revenue data", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch revenue data: " + e.getMessage()));
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
