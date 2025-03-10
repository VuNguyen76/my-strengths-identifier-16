
package com.spa.repository;

import com.spa.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Optional<BlogPost> findBySlug(String slug);
    
    List<BlogPost> findByIsActiveOrderByPublishedAtDesc(boolean isActive);
    
    Page<BlogPost> findByIsActiveOrderByPublishedAtDesc(boolean isActive, Pageable pageable);
    
    Page<BlogPost> findByCategoryIdAndIsActiveOrderByPublishedAtDesc(Long categoryId, boolean isActive, Pageable pageable);
    
    @Query("SELECT b FROM BlogPost b WHERE b.isActive = true ORDER BY b.publishedAt DESC")
    List<BlogPost> findLatestPosts(Pageable pageable);
    
    long countByCategoryId(Long categoryId);
}
