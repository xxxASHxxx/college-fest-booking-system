package com.collegefest.booking.service;

import com.collegefest.booking.entity.Booking;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendBookingConfirmationEmail(Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(booking.getUser().getEmail());
            message.setSubject("Booking Confirmation - " + booking.getEvent().getEventName());

            String emailBody = String.format(
                    "Dear %s,\n\n" +
                            "Your booking has been confirmed!\n\n" +
                            "Booking Reference: %s\n" +
                            "Event: %s\n" +
                            "Date: %s\n" +
                            "Tickets: %d\n" +
                            "Total Amount: ₹%.2f\n\n" +
                            "Please show this booking reference at the venue.\n\n" +
                            "Thank you for booking with us!\n\n" +
                            "Best regards,\n" +
                            "College Fest Team",
                    booking.getUser().getFullName(),
                    booking.getBookingReference(),
                    booking.getEvent().getEventName(),
                    booking.getEvent().getEventDate(),
                    booking.getNumTickets(),
                    booking.getTotalAmount()
            );

            message.setText(emailBody);
            mailSender.send(message);

            log.info("Booking confirmation email sent to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", booking.getUser().getEmail(), e.getMessage());
        }
    }

    @Async
    public void sendBookingCancellationEmail(Booking booking) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(booking.getUser().getEmail());
            message.setSubject("Booking Cancelled - " + booking.getEvent().getEventName());

            String emailBody = String.format(
                    "Dear %s,\n\n" +
                            "Your booking has been cancelled.\n\n" +
                            "Booking Reference: %s\n" +
                            "Event: %s\n" +
                            "Refund Amount: ₹%.2f\n\n" +
                            "The refund will be processed within 5-7 business days.\n\n" +
                            "Best regards,\n" +
                            "College Fest Team",
                    booking.getUser().getFullName(),
                    booking.getBookingReference(),
                    booking.getEvent().getEventName(),
                    booking.getTotalAmount()
            );

            message.setText(emailBody);
            mailSender.send(message);

            log.info("Booking cancellation email sent to: {}", booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send cancellation email to {}: {}", booking.getUser().getEmail(), e.getMessage());
        }
    }
}
