package com.collegefest.booking.repository;

import com.collegefest.booking.entity.Event;
import com.collegefest.booking.entity.EventStatus;
import com.collegefest.booking.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatusAndEventDateAfter(EventStatus status, LocalDateTime date);

    List<Event> findByEventTypeAndStatus(EventType eventType, EventStatus status);

    @Query("SELECT e FROM Event e JOIN FETCH e.priceTiers WHERE e.id = :id")
    Optional<Event> findByIdWithPriceTiers(@Param("id") Long id);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND e.eventDate BETWEEN :startDate AND :endDate")
    List<Event> findByStatusAndEventDateBetween(
            @Param("status") EventStatus status,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    List<Event> findByVenueIdAndStatus(Long venueId, EventStatus status);
}
