package com.collegefest.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "venue_name", nullable = false, unique = true, length = 150)
    private String venueName;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "total_capacity", nullable = false)
    private Integer totalCapacity;

    @Column(name = "has_numbered_seats")
    @Builder.Default
    private Boolean hasNumberedSeats = true;

    @Column(name = "seating_layout_json", columnDefinition = "TEXT")
    private String seatingLayoutJson;

    @Column(columnDefinition = "TEXT")
    private String facilities;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "venue", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Event> events = new ArrayList<>();
}
