package com.collegefest.booking.repository;

import com.collegefest.booking.entity.ReservationStatus;
import com.collegefest.booking.entity.SeatReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatReservationRepository extends JpaRepository<SeatReservation, Long> {

    List<SeatReservation> findByEventIdAndReservationStatus(Long eventId, ReservationStatus status);

    Optional<SeatReservation> findByEventIdAndSeatNumber(Long eventId, String seatNumber);

    Boolean existsByEventIdAndSeatNumberAndReservationStatus(
            Long eventId,
            String seatNumber,
            ReservationStatus status
    );

    @Query("SELECT sr FROM SeatReservation sr WHERE sr.event.id = :eventId AND sr.seatNumber IN :seatNumbers")
    List<SeatReservation> findByEventIdAndSeatNumbers(
            @Param("eventId") Long eventId,
            @Param("seatNumbers") List<String> seatNumbers
    );

    List<SeatReservation> findByBookingId(Long bookingId);
}
