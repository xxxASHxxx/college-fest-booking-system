package com.collegefest.booking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatMapResponse {
    private Long eventId;
    private String eventName;
    private String venueLayout;
    private Integer totalCapacity;
    private List<String> reservedSeats;
    private List<String> availableSeats;
}
