package com.collegefest.booking.service;

import com.collegefest.booking.entity.Booking;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.BookingRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketService {

    private final BookingRepository bookingRepository;

    public byte[] generateTicketPDF(Long bookingId) throws IOException {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Create simple text-based ticket (simplified for offline mode)
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        String ticketContent = generateTicketText(booking);
        outputStream.write(ticketContent.getBytes(StandardCharsets.UTF_8));

        return outputStream.toByteArray();
    }

    private String generateTicketText(Booking booking) {
        // Format the event date
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");
        String formattedDate = booking.getEvent().getEventDate().format(formatter);

        return String.format(
                "========================================\n" +
                        "       COLLEGE FEST TICKET\n" +
                        "========================================\n\n" +
                        "Booking Reference: %s\n" +
                        "Event: %s\n" +
                        "Date: %s\n" +
                        "Venue: %s\n" +
                        "Tickets: %d\n" +
                        "Tier: %s\n" +
                        "Amount Paid: ₹%.2f\n\n" +
                        "Passenger: %s\n" +
                        "Email: %s\n\n" +
                        "========================================\n" +
                        "Please present this ticket at the venue\n" +
                        "========================================\n",
                booking.getBookingReference(),
                booking.getEvent().getEventName(),
                formattedDate,
                booking.getEvent().getVenue().getVenueName(),
                booking.getNumTickets(),
                booking.getPriceTier().getTierName(),
                booking.getTotalAmount(),
                booking.getUser().getFullName(),
                booking.getUser().getEmail());
    }
}
