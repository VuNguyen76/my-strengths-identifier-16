
package com.spa.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogPostDTO {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String featuredImage;
    private LocalDateTime publishedAt;
    private String author;
    private boolean isActive;
    private Long categoryId;
    private String categoryName;
}
