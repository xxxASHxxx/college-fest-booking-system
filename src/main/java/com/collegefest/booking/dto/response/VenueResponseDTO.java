package com.collegefest.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponseDTO {
    private Long id;
    private String venueName;
    private String address;
    private Integer totalCapacity;
    private Boolean hasNumberedSeats;
    private String seatingLayoutJson;
    private String facilities;
}
