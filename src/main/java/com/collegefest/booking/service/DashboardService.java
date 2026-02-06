package com.collegefest.booking.service;

import com.collegefest.booking.dto.response.DashboardStatsResponse;
import com.collegefest.booking.entity.BookingStatus;
import com.collegefest.booking.entity.EventStatus;
import com.collegefest.booking.repository.BookingRepository;
import com.collegefest.booking.repository.EventRepository;
import com.collegefest.booking.repository.UserRepository;
import com.collegefest.booking.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalBookings = bookingRepository.count();
        long totalVenues = venueRepository.count();

        // Count active events (upcoming and open for booking)
        long activeEvents = eventRepository.findByStatusAndEventDateAfter(
                EventStatus.BOOKING_OPEN, LocalDateTime.now()).size();

        // Count confirmed bookings
        long confirmedBookings = bookingRepository.countByEventIdAndBookingStatus(null, BookingStatus.CONFIRMED);

        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalEvents(totalEvents)
                .totalBookings(totalBookings)
                .totalVenues(totalVenues)
                .activeEvents(activeEvents)
                .totalRevenue(BigDecimal.ZERO) // Would need to calculate from transactions
                .build();
    }
}
