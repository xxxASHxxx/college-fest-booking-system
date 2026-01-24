package com.collegefest.booking.service;

import com.collegefest.booking.dto.request.BookingRequestDTO;
import com.collegefest.booking.dto.request.PaymentConfirmationDTO;
import com.collegefest.booking.dto.response.BookingResponseDTO;
import com.collegefest.booking.entity.*;
import com.collegefest.booking.exception.BookingException;
import com.collegefest.booking.exception.InsufficientSeatsException;
import com.collegefest.booking.exception.ResourceNotFoundException;
import com.collegefest.booking.repository.*;
import com.collegefest.booking.security.UserPrincipal;
import com.collegefest.booking.util.BookingReferenceGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PriceTierRepository priceTierRepository;
    private final SeatReservationRepository seatReservationRepository;
    private final TransactionRepository transactionRepository;
    private final BookingReferenceGenerator referenceGenerator;
    private final EmailService emailService;
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public BookingResponseDTO createBooking(BookingRequestDTO request, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // 1. Validate event exists and is open for booking
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));

        if (!event.getStatus().equals(EventStatus.BOOKING_OPEN)) {
            throw new BookingException("Booking is not open for this event");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(event.getBookingOpensAt()) || now.isAfter(event.getBookingClosesAt())) {
            throw new BookingException("Booking is closed for this event");
        }

        // 2. Get price tier with pessimistic lock
        PriceTier priceTier = priceTierRepository.findByIdWithLock(request.getPriceTierId())
                .orElseThrow(() -> new ResourceNotFoundException("Price tier not found with id: " + request.getPriceTierId()));

        // 3. Check seat availability
        if (priceTier.getAvailableSeats() < request.getNumTickets()) {
            throw new InsufficientSeatsException("Only " + priceTier.getAvailableSeats() + " seats available");
        }

        // 4. Calculate total amount
        BigDecimal totalAmount = priceTier.getPrice().multiply(BigDecimal.valueOf(request.getNumTickets()));

        // 5. Create booking with PENDING_PAYMENT status
        Booking booking = Booking.builder()
                .bookingReference(referenceGenerator.generate())
                .user(user)
                .event(event)
                .priceTier(priceTier)
                .numTickets(request.getNumTickets())
                .totalAmount(totalAmount)
                .bookingStatus(BookingStatus.PENDING_PAYMENT)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        // 6. Reserve seats
        if (request.getSeatNumbers() != null && !request.getSeatNumbers().isEmpty()) {
            // Validate seat numbers
            if (request.getSeatNumbers().size() != request.getNumTickets()) {
                throw new BookingException("Number of seat numbers must match number of tickets");
            }

            // Check if seats are already reserved
            for (String seatNumber : request.getSeatNumbers()) {
                boolean isReserved = seatReservationRepository.existsByEventIdAndSeatNumberAndReservationStatus(
                        event.getId(), seatNumber, ReservationStatus.CONFIRMED
                );
                if (isReserved) {
                    throw new BookingException("Seat " + seatNumber + " is already booked");
                }
            }

            // Create seat reservations
            List<SeatReservation> seatReservations = new ArrayList<>();
            for (String seatNumber : request.getSeatNumbers()) {
                SeatReservation reservation = SeatReservation.builder()
                        .booking(booking)
                        .event(event)
                        .priceTier(priceTier)
                        .seatNumber(seatNumber)
                        .reservationStatus(ReservationStatus.RESERVED)
                        .build();
                seatReservations.add(reservation);
            }
            booking.setSeatReservations(seatReservations);
        }

        // 7. Decrease available seats
        priceTier.setAvailableSeats(priceTier.getAvailableSeats() - request.getNumTickets());
        priceTierRepository.save(priceTier);

        // 8. Save booking
        Booking savedBooking = bookingRepository.save(booking);

        // 9. Create transaction record
        Transaction transaction = Transaction.builder()
                .user(user)
                .booking(savedBooking)
                .transactionType(TransactionType.BOOKING)
                .amount(totalAmount)
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(transaction);

        return convertToResponse(savedBooking);
    }

    @Transactional
    public BookingResponseDTO confirmPayment(Long bookingId, PaymentConfirmationDTO confirmationDTO) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Check if booking is still valid
        if (booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
            throw new BookingException("Booking has expired");
        }

        if (!booking.getBookingStatus().equals(BookingStatus.PENDING_PAYMENT)) {
            throw new BookingException("Booking is not pending payment");
        }

        // Confirm payment
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        booking.setPaymentTransactionId(confirmationDTO.getTransactionId());
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setConfirmedAt(LocalDateTime.now());

        // Confirm seat reservations
        for (SeatReservation reservation : booking.getSeatReservations()) {
            reservation.setReservationStatus(ReservationStatus.CONFIRMED);
            reservation.setConfirmedAt(LocalDateTime.now());
        }

        Booking confirmedBooking = bookingRepository.save(booking);

        return convertToResponse(confirmedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getUserBookings(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookedAtDesc(userPrincipal.getId());

        return bookings.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Check if user owns this booking
        if (!booking.getUser().getId().equals(userPrincipal.getId())) {
            throw new BookingException("You are not authorized to view this booking");
        }

        return convertToResponse(booking);
    }

    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        return convertToResponse(booking);
    }

    @Transactional
    public void cancelBooking(Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Check if user owns this booking
        if (!booking.getUser().getId().equals(userPrincipal.getId())) {
            throw new BookingException("You are not authorized to cancel this booking");
        }

        if (!booking.getBookingStatus().equals(BookingStatus.CONFIRMED)) {
            throw new BookingException("Only confirmed bookings can be cancelled");
        }

        // Cancel booking
        booking.setBookingStatus(BookingStatus.CANCELLED);

        // Release seats
        PriceTier priceTier = booking.getPriceTier();
        priceTier.setAvailableSeats(priceTier.getAvailableSeats() + booking.getNumTickets());
        priceTierRepository.save(priceTier);

        // Release seat reservations
        for (SeatReservation reservation : booking.getSeatReservations()) {
            reservation.setReservationStatus(ReservationStatus.RELEASED);
        }

        bookingRepository.save(booking);

        // Create refund transaction
        Transaction refundTransaction = Transaction.builder()
                .user(booking.getUser())
                .booking(booking)
                .transactionType(TransactionType.REFUND)
                .amount(booking.getTotalAmount())
                .status(TransactionStatus.SUCCESS)
                .build();
        transactionRepository.save(refundTransaction);
    }

    private BookingResponseDTO convertToResponse(Booking booking) {
        List<String> seatNumbers = booking.getSeatReservations().stream()
                .map(SeatReservation::getSeatNumber)
                .collect(Collectors.toList());

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .bookingReference(booking.getBookingReference())
                .userId(booking.getUser().getId())
                .userEmail(booking.getUser().getEmail())
                .eventId(booking.getEvent().getId())
                .eventName(booking.getEvent().getEventName())
                .tierName(booking.getPriceTier().getTierName())
                .numTickets(booking.getNumTickets())
                .totalAmount(booking.getTotalAmount())
                .bookingStatus(booking.getBookingStatus())
                .paymentMethod(booking.getPaymentMethod())
                .paymentStatus(booking.getPaymentStatus())
                .bookedAt(booking.getBookedAt())
                .confirmedAt(booking.getConfirmedAt())
                .expiresAt(booking.getExpiresAt())
                .seatNumbers(seatNumbers)
                .build();
    }
}
