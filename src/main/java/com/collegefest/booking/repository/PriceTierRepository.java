package com.collegefest.booking.repository;

import com.collegefest.booking.entity.PriceTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceTierRepository extends JpaRepository<PriceTier, Long> {

    List<PriceTier> findByEventId(Long eventId);

    Optional<PriceTier> findByEventIdAndTierName(Long eventId, String tierName);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT pt FROM PriceTier pt WHERE pt.id = :id")
    Optional<PriceTier> findByIdWithLock(@Param("id") Long id);
}
