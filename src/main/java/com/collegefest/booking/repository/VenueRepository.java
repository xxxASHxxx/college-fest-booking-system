package com.collegefest.booking.repository;

import com.collegefest.booking.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    Optional<Venue> findByVenueName(String venueName);
    Boolean existsByVenueName(String venueName);
}
