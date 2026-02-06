package com.collegefest.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_user_id", columnList = "user_id"),
        @Index(name = "idx_event_id", columnList = "event_id"),
        @Index(name = "idx_booking_reference", columnList = "booking_reference")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 20)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "price_tier_id", nullable = false)
    private PriceTier priceTier;

    @Column(name = "num_tickets", nullable = false)
    private Integer numTickets;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 50)
    @Builder.Default
    private BookingStatus bookingStatus = BookingStatus.PENDING_PAYMENT;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 50)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_transaction_id", unique = true, length = 100)
    private String paymentTransactionId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 50)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @CreationTimestamp
    @Column(name = "booked_at", nullable = false, updatable = false)
    private LocalDateTime bookedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "qr_code_data", columnDefinition = "TEXT")
    private String qrCodeData;

    @Version
    @Column(name = "version")
    private Integer version;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @Builder.Default
    private List<SeatReservation> seatReservations = new ArrayList<>();
}
