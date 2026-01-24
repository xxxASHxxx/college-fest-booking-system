package com.collegefest.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceTierResponseDTO {
    private Long id;
    private String tierName;
    private BigDecimal price;
    private Integer totalSeats;
    private Integer availableSeats;
    private String seatRangeStart;
    private String seatRangeEnd;
    private String colorCode;
    private Double availabilityPercentage;
}
