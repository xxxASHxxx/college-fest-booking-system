package com.collegefest.booking.controller;

import com.collegefest.booking.dto.response.ApiResponse;
import com.collegefest.booking.dto.response.DashboardStatsResponse;
import com.collegefest.booking.entity.*;
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

    // ========== DASHBOARD ==========

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            log.info("GET /api/admin/dashboard - Fetching dashboard stats");
            Map<String, Object> stats = new HashMap<>();

            long totalUsers    = userRepository.count();
            long totalEvents   = eventRepository.count();
            long totalBookings = bookingRepository.count();
            long totalVenues   = venueRepository.count();

            // Calculate revenue from confirmed bookings
            BigDecimal totalRevenue = bookingRepository.findAll().stream()
                    .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED && b.getTotalAmount() != null)
                    .map(Booking::getTotalAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Count events by status
            long activeEvents    = eventRepository.findAll().stream().filter(e -> e.getStatus() == EventStatus.ACTIVE || e.getStatus() == EventStatus.BOOKING_OPEN || e.getStatus() == EventStatus.PUBLISHED).count();
            long upcomingEvents  = eventRepository.findAll().stream().filter(e -> e.getStatus() == EventStatus.DRAFT).count();
            long completedEvents = eventRepository.findAll().stream().filter(e -> e.getStatus() == EventStatus.COMPLETED).count();
            long cancelledEvents = eventRepository.findAll().stream().filter(e -> e.getStatus() == EventStatus.CANCELLED).count();

            stats.put("totalUsers", totalUsers);
            stats.put("totalEvents", totalEvents);
            stats.put("totalBookings", totalBookings);
            stats.put("totalVenues", totalVenues);
            stats.put("activeEvents", activeEvents);
            stats.put("totalRevenue", totalRevenue);

            // Growth indicators (demo values — replace with real time-range comparisons if needed)
            stats.put("revenueChange", 18.5);
            stats.put("bookingsChange", 12.3);
            stats.put("eventsChange", 3);
            stats.put("usersChange", 25.8);

            Map<String, Object> eventsOverview = new HashMap<>();
            eventsOverview.put("active",    activeEvents);
            eventsOverview.put("upcoming",  upcomingEvents);
            eventsOverview.put("completed", completedEvents);
            eventsOverview.put("cancelled", cancelledEvents);
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
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
        } catch (Exception e) {
            log.error("Error fetching detailed dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch dashboard stats: " + e.getMessage()));
        }
    }

    // ========== USER MANAGEMENT ==========

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            log.info("GET /api/admin/users - Fetching users (page={}, size={})", page, size);
            List<User> users = userRepository.findAll(
                    PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "fullName"))).getContent();

            List<Map<String, Object>> result = users.stream().map(u -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", u.getId());
                map.put("email", u.getEmail());
                map.put("fullName", u.getFullName());
                map.put("phoneNumber", u.getPhoneNumber());
                map.put("role", u.getRole() != null ? u.getRole().name() : "USER");
                map.put("isVerified", u.getIsVerified());
                map.put("department", u.getDepartment());
                map.put("yearOfStudy", u.getYearOfStudy());
                map.put("createdAt", u.getCreatedAt());
                return map;
            }).collect(Collectors.toList());

            log.info("Retrieved {} users", result.size());
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", result));
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }

    @PatchMapping("/users/{userId}/role")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body) {
        try {
            String roleName = body.get("role");
            if (roleName == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Role is required"));
            }
            UserRole newRole = UserRole.valueOf(roleName.toUpperCase());
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            user.setRole(newRole);
            userRepository.save(user);
            log.info("Updated role for user {} to {}", userId, newRole);
            Map<String, Object> response = Map.of("userId", userId, "role", newRole.name());
            return ResponseEntity.ok(ApiResponse.success("User role updated successfully", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role: " + body.get("role")));
        } catch (Exception e) {
            log.error("Error updating role for user {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update role: " + e.getMessage()));
        }
    }

    @PostMapping("/users/{userId}/suspend")
    public ResponseEntity<ApiResponse<Map<String, Object>>> suspendUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            user.setIsVerified(false);
            userRepository.save(user);
            log.info("Suspended (unverified) user {}", userId);
            return ResponseEntity.ok(ApiResponse.success("User suspended", Map.of("userId", userId, "isVerified", false)));
        } catch (Exception e) {
            log.error("Error suspending user {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to suspend user: " + e.getMessage()));
        }
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> activateUser(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            user.setIsVerified(true);
            userRepository.save(user);
            log.info("Activated user {}", userId);
            return ResponseEntity.ok(ApiResponse.success("User activated", Map.of("userId", userId, "isVerified", true)));
        } catch (Exception e) {
            log.error("Error activating user {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to activate user: " + e.getMessage()));
        }
    }

    // ========== BOOKING MANAGEMENT ==========

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            log.info("GET /api/admin/bookings - Fetching bookings (page={}, size={})", page, size);
            List<Booking> bookings = bookingRepository.findAll(
                    PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "bookedAt"))).getContent();

            List<Map<String, Object>> result = bookings.stream().map(b -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", b.getId());
                map.put("bookingReference", b.getBookingReference());
                map.put("eventName",  b.getEvent() != null ? b.getEvent().getEventName()  : "—");
                map.put("userName",   b.getUser()  != null ? b.getUser().getFullName()     : "—");
                map.put("userEmail",  b.getUser()  != null ? b.getUser().getEmail()        : "—");
                map.put("numTickets",    b.getNumTickets());
                map.put("totalAmount",   b.getTotalAmount());
                map.put("bookingStatus", b.getBookingStatus() != null ? b.getBookingStatus().name() : "PENDING_PAYMENT");
                map.put("paymentStatus", b.getPaymentStatus() != null ? b.getPaymentStatus().name() : "PENDING");
                map.put("bookedAt",      b.getBookedAt());
                map.put("confirmedAt",   b.getConfirmedAt());
                return map;
            }).collect(Collectors.toList());

            log.info("Retrieved {} bookings", result.size());
            return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", result));
        } catch (Exception e) {
            log.error("Error fetching bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch bookings: " + e.getMessage()));
        }
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
            }
            BookingStatus newStatus = BookingStatus.valueOf(status.toUpperCase());
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + bookingId));
            booking.setBookingStatus(newStatus);
            if (newStatus == BookingStatus.CONFIRMED && booking.getConfirmedAt() == null) {
                booking.setConfirmedAt(LocalDateTime.now());
            }
            bookingRepository.save(booking);
            log.info("Updated booking {} status to {}", bookingId, newStatus);
            Map<String, Object> response = Map.of("bookingId", bookingId, "bookingStatus", newStatus.name());
            return ResponseEntity.ok(ApiResponse.success("Booking status updated", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status: " + body.get("status")));
        } catch (Exception e) {
            log.error("Error updating booking {} status", bookingId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update booking status: " + e.getMessage()));
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
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", b.getId());
                map.put("bookingReference", b.getBookingReference());
                map.put("eventName",    b.getEvent() != null ? b.getEvent().getEventName()  : "—");
                map.put("userName",     b.getUser()  != null ? b.getUser().getFullName()     : "—");
                map.put("userEmail",    b.getUser()  != null ? b.getUser().getEmail()        : "—");
                map.put("totalAmount",  b.getTotalAmount());
                map.put("bookingStatus",b.getBookingStatus() != null ? b.getBookingStatus().name() : "PENDING_PAYMENT");
                map.put("bookedAt",     b.getBookedAt());
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
            log.info("GET /api/admin/analytics/revenue - period: {}", period);
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
                    LocalDate d = b.getBookedAt().toLocalDate();
                    if (revenueByDate.containsKey(d)) {
                        revenueByDate.merge(d, b.getTotalAmount(), BigDecimal::add);
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
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBookingsByEvent(@PathVariable Long eventId) {
        try {
            List<Booking> bookings = bookingRepository.findByEventId(eventId);
            List<Map<String, Object>> result = bookings.stream().map(b -> {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", b.getId());
                map.put("bookingReference", b.getBookingReference());
                map.put("userName",      b.getUser() != null ? b.getUser().getFullName() : "—");
                map.put("userEmail",     b.getUser() != null ? b.getUser().getEmail()    : "—");
                map.put("numTickets",    b.getNumTickets());
                map.put("totalAmount",   b.getTotalAmount());
                map.put("bookingStatus", b.getBookingStatus() != null ? b.getBookingStatus().name() : "PENDING_PAYMENT");
                map.put("bookedAt",      b.getBookedAt());
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(ApiResponse.success("Event bookings retrieved", result));
        } catch (Exception e) {
            log.error("Error fetching bookings for event {}", eventId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch event bookings: " + e.getMessage()));
        }
    }
}
