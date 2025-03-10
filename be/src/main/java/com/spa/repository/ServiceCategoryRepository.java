
package com.spa.repository;

import com.spa.model.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    // Add a method to get categories with service counts
    @Query("SELECT sc, COUNT(s) FROM ServiceCategory sc LEFT JOIN sc.services s GROUP BY sc.id")
    List<Object[]> findAllWithServiceCount();
}
