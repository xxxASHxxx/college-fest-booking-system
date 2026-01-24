package com.collegefest.booking.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PriceTierRequestDTO {

    @NotBlank(message = "Tier name is required")
    @Size(max = 50, message = "Tier name cannot exceed 50 characters")
    private String tierName;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be at least 1")
    private Integer totalSeats;

    private String seatRangeStart;

    private String seatRangeEnd;

    private String colorCode;
}
