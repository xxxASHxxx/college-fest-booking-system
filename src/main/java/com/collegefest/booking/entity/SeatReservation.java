package com.collegefest.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "seat_reservations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "seat_number"}),
        indexes = @Index(name = "idx_event_seat", columnList = "event_id, seat_number")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "price_tier_id", nullable = false)
    private PriceTier priceTier;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "row_number", length = 5)
    private String rowNumber;

    @Column(length = 20)
    private String section;

    @Enumerated(EnumType.STRING)
    @Column(name = "reservation_status", nullable = false, length = 50)
    @Builder.Default
    private ReservationStatus reservationStatus = ReservationStatus.RESERVED;

    @CreationTimestamp
    @Column(name = "reserved_at", nullable = false, updatable = false)
    private LocalDateTime reservedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;
}
