
package com.spa.repository;

import com.spa.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBookingDateBetween(LocalDate startDate, LocalDate endDate);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByStatus(String status);
}
