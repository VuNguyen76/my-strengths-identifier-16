
package com.spa.service;

import com.spa.dto.BlogCategoryDTO;
import com.spa.dto.BlogPostDTO;
import com.spa.exception.ResourceNotFoundException;
import com.spa.model.BlogCategory;
import com.spa.model.BlogPost;
import com.spa.repository.BlogCategoryRepository;
import com.spa.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

    @Autowired
    private BlogPostRepository blogPostRepository;
    
    @Autowired
    private BlogCategoryRepository blogCategoryRepository;
    
    // Convert BlogPost to BlogPostDTO
    private BlogPostDTO convertToDTO(BlogPost blogPost) {
        BlogPostDTO dto = new BlogPostDTO();
        dto.setId(blogPost.getId());
        dto.setTitle(blogPost.getTitle());
        dto.setSlug(blogPost.getSlug());
        dto.setExcerpt(blogPost.getExcerpt());
        dto.setContent(blogPost.getContent());
        dto.setFeaturedImage(blogPost.getFeaturedImage());
        dto.setPublishedAt(blogPost.getPublishedAt());
        dto.setAuthor(blogPost.getAuthor());
        dto.setActive(blogPost.isActive());
        
        if (blogPost.getCategory() != null) {
            dto.setCategoryId(blogPost.getCategory().getId());
            dto.setCategoryName(blogPost.getCategory().getName());
        }
        
        return dto;
    }
    
    // Convert BlogCategory to BlogCategoryDTO
    private BlogCategoryDTO convertToDTO(BlogCategory blogCategory) {
        BlogCategoryDTO dto = new BlogCategoryDTO();
        dto.setId(blogCategory.getId());
        dto.setName(blogCategory.getName());
        dto.setSlug(blogCategory.getSlug());
        dto.setDescription(blogCategory.getDescription());
        dto.setActive(blogCategory.isActive());
        
        // Count posts for this category
        int postsCount = 0;
        if (blogCategory.getPosts() != null) {
            postsCount = blogCategory.getPosts().size();
        }
        dto.setPostsCount(postsCount);
        
        return dto;
    }
    
    // Get all blogs (public API)
    public List<BlogPostDTO> getAllBlogs(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (categoryId != null) {
            return blogPostRepository.findByCategoryIdAndIsActiveOrderByPublishedAtDesc(categoryId, true, pageable)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            return blogPostRepository.findByIsActiveOrderByPublishedAtDesc(true, pageable)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
    }
    
    // Get featured blogs
    public List<BlogPostDTO> getFeaturedBlogs() {
        Pageable pageable = PageRequest.of(0, 4); // Get top 4 latest
        return blogPostRepository.findLatestPosts(pageable)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get blog by ID
    public BlogPostDTO getBlogById(Long id) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        
        return convertToDTO(blogPost);
    }
    
    // Get all categories
    public List<BlogCategoryDTO> getAllCategories() {
        return blogCategoryRepository.findByIsActive(true)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Admin: Get all blogs (with non-active)
    public List<BlogPostDTO> getAllBlogsAdmin() {
        return blogPostRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Admin: Create a blog post
    @Transactional
    public BlogPostDTO createBlog(BlogPostDTO blogDTO) {
        BlogPost blogPost = new BlogPost();
        blogPost.setTitle(blogDTO.getTitle());
        blogPost.setSlug(blogDTO.getSlug());
        blogPost.setExcerpt(blogDTO.getExcerpt());
        blogPost.setContent(blogDTO.getContent());
        blogPost.setFeaturedImage(blogDTO.getFeaturedImage());
        blogPost.setActive(blogDTO.isActive());
        blogPost.setAuthor(blogDTO.getAuthor());
        
        if (blogPost.getPublishedAt() == null && blogPost.isActive()) {
            blogPost.setPublishedAt(LocalDateTime.now());
        } else {
            blogPost.setPublishedAt(blogDTO.getPublishedAt());
        }
        
        if (blogDTO.getCategoryId() != null) {
            BlogCategory category = blogCategoryRepository.findById(blogDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + blogDTO.getCategoryId()));
            blogPost.setCategory(category);
        }
        
        blogPost = blogPostRepository.save(blogPost);
        return convertToDTO(blogPost);
    }
    
    // Admin: Update a blog post
    @Transactional
    public BlogPostDTO updateBlog(Long id, BlogPostDTO blogDTO) {
        BlogPost blogPost = blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog post not found with id: " + id));
        
        blogPost.setTitle(blogDTO.getTitle());
        blogPost.setSlug(blogDTO.getSlug());
        blogPost.setExcerpt(blogDTO.getExcerpt());
        blogPost.setContent(blogDTO.getContent());
        blogPost.setFeaturedImage(blogDTO.getFeaturedImage());
        blogPost.setActive(blogDTO.isActive());
        blogPost.setAuthor(blogDTO.getAuthor());
        
        // If post is becoming active and has no publish date
        if (blogPost.getPublishedAt() == null && blogPost.isActive()) {
            blogPost.setPublishedAt(LocalDateTime.now());
        } else {
            blogPost.setPublishedAt(blogDTO.getPublishedAt());
        }
        
        if (blogDTO.getCategoryId() != null) {
            BlogCategory category = blogCategoryRepository.findById(blogDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + blogDTO.getCategoryId()));
            blogPost.setCategory(category);
        } else {
            blogPost.setCategory(null);
        }
        
        blogPost = blogPostRepository.save(blogPost);
        return convertToDTO(blogPost);
    }
    
    // Admin: Delete a blog post
    @Transactional
    public void deleteBlog(Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new ResourceNotFoundException("Blog post not found with id: " + id);
        }
        blogPostRepository.deleteById(id);
    }
    
    // Admin: Get all categories with stats
    public List<BlogCategoryDTO> getAllCategoriesWithStats() {
        return blogCategoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Admin: Create a category
    @Transactional
    public BlogCategoryDTO createCategory(BlogCategoryDTO categoryDTO) {
        if (blogCategoryRepository.existsBySlug(categoryDTO.getSlug())) {
            throw new RuntimeException("A category with this slug already exists");
        }
        
        BlogCategory category = new BlogCategory();
        category.setName(categoryDTO.getName());
        category.setSlug(categoryDTO.getSlug());
        category.setDescription(categoryDTO.getDescription());
        category.setActive(categoryDTO.isActive());
        
        category = blogCategoryRepository.save(category);
        return convertToDTO(category);
    }
    
    // Admin: Update a category
    @Transactional
    public BlogCategoryDTO updateCategory(Long id, BlogCategoryDTO categoryDTO) {
        BlogCategory category = blogCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        // Check slug uniqueness if it's changed
        if (!category.getSlug().equals(categoryDTO.getSlug()) && 
            blogCategoryRepository.existsBySlug(categoryDTO.getSlug())) {
            throw new RuntimeException("A category with this slug already exists");
        }
        
        category.setName(categoryDTO.getName());
        category.setSlug(categoryDTO.getSlug());
        category.setDescription(categoryDTO.getDescription());
        category.setActive(categoryDTO.isActive());
        
        category = blogCategoryRepository.save(category);
        return convertToDTO(category);
    }
    
    // Admin: Delete a category
    @Transactional
    public void deleteCategory(Long id) {
        BlogCategory category = blogCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        // Check if category has blog posts
        if (category.getPosts() != null && !category.getPosts().isEmpty()) {
            throw new RuntimeException("Cannot delete category that has blog posts");
        }
        
        blogCategoryRepository.delete(category);
    }
}
