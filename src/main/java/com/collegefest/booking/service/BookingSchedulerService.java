package com.collegefest.booking.service;

import com.collegefest.booking.entity.Booking;
import com.collegefest.booking.entity.BookingStatus;
import com.collegefest.booking.entity.PriceTier;
import com.collegefest.booking.entity.ReservationStatus;
import com.collegefest.booking.repository.BookingRepository;
import com.collegefest.booking.repository.PriceTierRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingSchedulerService {

    private final BookingRepository bookingRepository;
    private final PriceTierRepository priceTierRepository;

    /**
     * Runs every minute to cancel expired bookings
     */
    @Scheduled(fixedRate = 60000) // Run every 60 seconds
    @Transactional
    public void cancelExpiredBookings() {
        log.info("Running scheduled task to cancel expired bookings...");

        List<Booking> expiredBookings = bookingRepository.findByBookingStatusAndExpiresAtBefore(
                BookingStatus.PENDING_PAYMENT,
                LocalDateTime.now()
        );

        if (expiredBookings.isEmpty()) {
            log.info("No expired bookings found");
            return;
        }

        log.info("Found {} expired bookings", expiredBookings.size());

        for (Booking booking : expiredBookings) {
            try {
                // Change status to EXPIRED
                booking.setBookingStatus(BookingStatus.EXPIRED);

                // Release seats back to price tier
                PriceTier priceTier = booking.getPriceTier();
                priceTier.setAvailableSeats(priceTier.getAvailableSeats() + booking.getNumTickets());
                priceTierRepository.save(priceTier);

                // Release seat reservations
                booking.getSeatReservations().forEach(reservation ->
                        reservation.setReservationStatus(ReservationStatus.RELEASED)
                );

                bookingRepository.save(booking);

                log.info("Cancelled expired booking: {}", booking.getBookingReference());
            } catch (Exception e) {
                log.error("Error cancelling booking {}: {}", booking.getBookingReference(), e.getMessage());
            }
        }

        log.info("Completed cancelling {} expired bookings", expiredBookings.size());
    }
}
