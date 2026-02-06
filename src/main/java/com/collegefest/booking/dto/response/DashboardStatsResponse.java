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
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalEvents;
    private long totalBookings;
    private long totalVenues;
    private long activeEvents;
    private long confirmedBookings;
    private long pendingBookings;
    private BigDecimal totalRevenue;
}
