package com.collegefest.booking.dto.request;

import com.collegefest.booking.entity.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class BookingRequestDTO {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Price tier ID is required")
    private Long priceTierId;

    @NotNull(message = "Number of tickets is required")
    @Min(value = 1, message = "Must book at least 1 ticket")
    @Max(value = 10, message = "Cannot book more than 10 tickets at once")
    private Integer numTickets;

    private List<String> seatNumbers;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
}
