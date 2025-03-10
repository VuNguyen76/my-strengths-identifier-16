
package com.spa.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogCategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private boolean isActive;
    private int postsCount;
}
