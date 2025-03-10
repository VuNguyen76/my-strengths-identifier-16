
package com.spa.controller;

import com.spa.dto.BlogCategoryDTO;
import com.spa.dto.BlogPostDTO;
import com.spa.service.BlogService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BlogController {

    @Autowired
    private BlogService blogService;
    
    // Public blog endpoints
    @GetMapping("/blogs")
    public ResponseEntity<List<BlogPostDTO>> getAllBlogs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<BlogPostDTO> blogs = blogService.getAllBlogs(categoryId, page, size);
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }
    
    @GetMapping("/blogs/featured")
    public ResponseEntity<List<BlogPostDTO>> getFeaturedBlogs() {
        List<BlogPostDTO> blogs = blogService.getFeaturedBlogs();
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }
    
    @GetMapping("/blogs/{id}")
    public ResponseEntity<BlogPostDTO> getBlogById(@PathVariable Long id) {
        BlogPostDTO blog = blogService.getBlogById(id);
        return new ResponseEntity<>(blog, HttpStatus.OK);
    }
    
    @GetMapping("/blogs/categories")
    public ResponseEntity<List<BlogCategoryDTO>> getAllCategories() {
        List<BlogCategoryDTO> categories = blogService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    
    // Admin blog endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/blogs")
    public ResponseEntity<List<BlogPostDTO>> getAllBlogsAdmin() {
        List<BlogPostDTO> blogs = blogService.getAllBlogsAdmin();
        return new ResponseEntity<>(blogs, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/blogs")
    public ResponseEntity<BlogPostDTO> createBlog(@Valid @RequestBody BlogPostDTO blogDTO) {
        BlogPostDTO createdBlog = blogService.createBlog(blogDTO);
        return new ResponseEntity<>(createdBlog, HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/blogs/{id}")
    public ResponseEntity<BlogPostDTO> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogPostDTO blogDTO) {
        BlogPostDTO updatedBlog = blogService.updateBlog(id, blogDTO);
        return new ResponseEntity<>(updatedBlog, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/blogs/{id}")
    public ResponseEntity<Void> deleteBlog(@PathVariable Long id) {
        blogService.deleteBlog(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Blog category admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/blogs/categories")
    public ResponseEntity<List<BlogCategoryDTO>> getAllCategoriesAdmin() {
        List<BlogCategoryDTO> categories = blogService.getAllCategoriesWithStats();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/blogs/categories")
    public ResponseEntity<BlogCategoryDTO> createCategory(@Valid @RequestBody BlogCategoryDTO categoryDTO) {
        BlogCategoryDTO createdCategory = blogService.createCategory(categoryDTO);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/blogs/categories/{id}")
    public ResponseEntity<BlogCategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody BlogCategoryDTO categoryDTO) {
        BlogCategoryDTO updatedCategory = blogService.updateCategory(id, categoryDTO);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/blogs/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        blogService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
