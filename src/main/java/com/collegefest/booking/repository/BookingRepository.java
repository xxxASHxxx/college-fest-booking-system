package com.collegefest.booking.repository;

import com.collegefest.booking.entity.Booking;
import com.collegefest.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingReference(String bookingReference);

    // Find all bookings by user ID, ordered by booking date (most recent first)
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId ORDER BY b.bookedAt DESC")
    List<Booking> findByUserIdOrderByBookedAtDesc(@Param("userId") Long userId);

    List<Booking> findByEventId(Long eventId);

    List<Booking> findByBookingStatusAndExpiresAtBefore(BookingStatus status, LocalDateTime dateTime);

    @Query("SELECT b FROM Booking b JOIN FETCH b.event JOIN FETCH b.priceTier WHERE b.user.id = :userId")
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);

    Long countByEventIdAndBookingStatus(Long eventId, BookingStatus status);
}
