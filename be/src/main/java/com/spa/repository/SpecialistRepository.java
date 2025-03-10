
package com.spa.repository;

import com.spa.model.Specialist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialistRepository extends JpaRepository<Specialist, Long> {
    List<Specialist> findByUserEnabled(boolean enabled);
    Optional<Specialist> findByUserId(Long userId);
}
