
package com.spa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "blog_posts")
public class BlogPost {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, unique = true)
    private String slug;
    
    private String excerpt;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private String featuredImage;
    
    private LocalDateTime publishedAt;
    
    @Column(nullable = false)
    private String author;
    
    private boolean isActive = true;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private BlogCategory category;
}
