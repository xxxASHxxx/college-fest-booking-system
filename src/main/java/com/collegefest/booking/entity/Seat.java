package com.collegefest.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seats", uniqueConstraints = @UniqueConstraint(columnNames = { "venue_id", "seat_number" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "row_number", length = 5)
    private String rowNumber;

    @Column(length = 20)
    private String section;

    @Column(name = "seat_type", length = 20)
    private String seatType;

    @Column(name = "is_accessible")
    @Builder.Default
    private Boolean isAccessible = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
