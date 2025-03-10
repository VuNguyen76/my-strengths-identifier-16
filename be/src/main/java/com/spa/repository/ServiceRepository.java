
package com.spa.repository;

import com.spa.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByActiveTrue();
    
    List<Service> findByCategoryId(Long categoryId);
    
    @Query("SELECT s FROM Service s WHERE s.active = true ORDER BY RAND() LIMIT 4")
    List<Service> findFeaturedServices();
    
    long countByCategoryId(Long categoryId);
}
