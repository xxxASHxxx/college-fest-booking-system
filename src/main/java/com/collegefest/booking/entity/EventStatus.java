package com.collegefest.booking.entity;

public enum EventStatus {
    DRAFT, // Not visible to public
    ACTIVE, // Live and bookable (alias for PUBLISHED/BOOKING_OPEN)
    PUBLISHED, // Legacy - kept for compatibility
    BOOKING_OPEN, // Legacy - kept for compatibility
    INACTIVE, // Temporarily hidden
    SOLD_OUT, // Capacity reached
    BOOKING_CLOSED,
    COMPLETED,
    CANCELLED
}
