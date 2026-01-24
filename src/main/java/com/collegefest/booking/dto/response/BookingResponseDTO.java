package com.collegefest.booking.dto.response;

import com.collegefest.booking.entity.BookingStatus;
import com.collegefest.booking.entity.PaymentMethod;
import com.collegefest.booking.entity.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private String bookingReference;
    private Long userId;
    private String userEmail;
    private Long eventId;
    private String eventName;
    private String tierName;
    private Integer numTickets;
    private BigDecimal totalAmount;
    private BookingStatus bookingStatus;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private LocalDateTime bookedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime expiresAt;
    private List<String> seatNumbers;
}
