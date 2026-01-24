package com.collegefest.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class VenueRequestDTO {

    @NotBlank(message = "Venue name is required")
    @Size(max = 150, message = "Venue name cannot exceed 150 characters")
    private String venueName;

    private String address;

    @NotNull(message = "Total capacity is required")
    @Min(value = 1, message = "Total capacity must be at least 1")
    private Integer totalCapacity;

    private Boolean hasNumberedSeats;

    private String seatingLayoutJson;

    private String facilities;
}
