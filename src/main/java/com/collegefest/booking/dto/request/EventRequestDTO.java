package com.collegefest.booking.dto.request;

import com.collegefest.booking.entity.EventType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EventRequestDTO {

    @NotBlank(message = "Event name is required")
    @Size(max = 200, message = "Event name cannot exceed 200 characters")
    private String eventName;

    private String description;

    @NotNull(message = "Event type is required")
    private EventType eventType;

    @NotNull(message = "Venue ID is required")
    private Long venueId;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDateTime eventDate;

    @Min(value = 30, message = "Duration must be at least 30 minutes")
    private Integer durationMinutes;

    private String bannerImageUrl;

    private String organizerName;

    @NotNull(message = "Max capacity is required")
    @Min(value = 1, message = "Max capacity must be at least 1")
    private Integer maxCapacity;

    @NotNull(message = "Booking opens at is required")
    private LocalDateTime bookingOpensAt;

    @NotNull(message = "Booking closes at is required")
    private LocalDateTime bookingClosesAt;

    private List<PriceTierRequestDTO> priceTiers;
}
