package com.collegefest.booking.repository;

import com.collegefest.booking.entity.Waitlist;
import com.collegefest.booking.entity.WaitlistStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {

    List<Waitlist> findByEventIdAndStatus(Long eventId, WaitlistStatus status);

    Optional<Waitlist> findByEventIdAndUserId(Long eventId, Long userId);

    Long countByEventIdAndStatus(Long eventId, WaitlistStatus status);

    boolean existsByEventIdAndUserIdAndStatus(Long eventId, Long userId, WaitlistStatus status);
}
