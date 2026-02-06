package com.collegefest.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "seat_layouts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatLayout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @Column(name = "layout_name", nullable = false, length = 100)
    private String layoutName;

    @Column(name = "total_rows")
    private Integer totalRows;

    @Column(name = "seats_per_row")
    private Integer seatsPerRow;

    @Column(name = "layout_json", columnDefinition = "TEXT")
    private String layoutJson;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
