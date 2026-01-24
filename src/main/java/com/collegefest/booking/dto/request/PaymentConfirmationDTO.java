package com.collegefest.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentConfirmationDTO {

    @NotBlank(message = "Transaction ID is required")
    private String transactionId;

    private String paymentGatewayResponse;
}
