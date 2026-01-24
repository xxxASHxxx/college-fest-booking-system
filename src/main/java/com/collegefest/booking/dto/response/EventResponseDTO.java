package com.collegefest.booking.dto.response;

import com.collegefest.booking.entity.EventStatus;
import com.collegefest.booking.entity.EventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDTO {
    private Long id;
    private String eventName;
    private String description;
    private EventType eventType;
    private VenueResponseDTO venue;
    private LocalDateTime eventDate;
    private Integer durationMinutes;
    private String bannerImageUrl;
    private String organizerName;
    private Integer maxCapacity;
    private LocalDateTime bookingOpensAt;
    private LocalDateTime bookingClosesAt;
    private EventStatus status;
    private List<PriceTierResponseDTO> priceTiers;
    private LocalDateTime createdAt;
}
