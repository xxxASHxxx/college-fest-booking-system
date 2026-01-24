package com.collegefest.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "price_tiers",
        uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "tier_name"}),
        indexes = @Index(name = "idx_event_id", columnList = "event_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore
    private Event event;

    @Column(name = "tier_name", nullable = false, length = 50)
    private String tierName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "seat_range_start", length = 10)
    private String seatRangeStart;

    @Column(name = "seat_range_end", length = 10)
    private String seatRangeEnd;

    @Column(name = "color_code", length = 7)
    private String colorCode;

    @OneToMany(mappedBy = "priceTier", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Booking> bookings = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        if (availableSeats == null) {
            availableSeats = totalSeats;
        }
    }
}
