
package com.spa.repository;

import com.spa.model.BlogCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogCategoryRepository extends JpaRepository<BlogCategory, Long> {
    Optional<BlogCategory> findBySlug(String slug);
    List<BlogCategory> findByIsActive(boolean isActive);
    
    @Query("SELECT c FROM BlogCategory c LEFT JOIN c.posts p GROUP BY c.id ORDER BY COUNT(p.id) DESC")
    List<BlogCategory> findAllOrderByPostCountDesc();
    
    boolean existsBySlug(String slug);
}
