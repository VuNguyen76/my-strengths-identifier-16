
package com.spa.controller;

import com.spa.dto.ServiceCategoryDTO;
import com.spa.dto.ServiceDTO;
import com.spa.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;
    
    // Public endpoints
    @GetMapping("/services")
    public ResponseEntity<List<ServiceDTO>> getAllServices() {
        List<ServiceDTO> services = serviceService.getAllServices();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
    
    @GetMapping("/services/featured")
    public ResponseEntity<List<ServiceDTO>> getFeaturedServices() {
        List<ServiceDTO> services = serviceService.getFeaturedServices();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
    
    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceDTO> getServiceById(@PathVariable Long id) {
        ServiceDTO service = serviceService.getServiceById(id);
        return new ResponseEntity<>(service, HttpStatus.OK);
    }
    
    @GetMapping("/services/categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getAllCategories() {
        List<ServiceCategoryDTO> categories = serviceService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    
    @GetMapping("/services/categories/{id}")
    public ResponseEntity<ServiceCategoryDTO> getCategoryById(@PathVariable Long id) {
        ServiceCategoryDTO category = serviceService.getCategoryById(id);
        return new ResponseEntity<>(category, HttpStatus.OK);
    }
    
    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/services")
    public ResponseEntity<List<ServiceDTO>> getAllServicesAdmin() {
        List<ServiceDTO> services = serviceService.getAllServicesAdmin();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/services")
    public ResponseEntity<ServiceDTO> createService(@Valid @RequestBody ServiceDTO serviceDTO) {
        ServiceDTO createdService = serviceService.createService(serviceDTO);
        return new ResponseEntity<>(createdService, HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/services/{id}")
    public ResponseEntity<ServiceDTO> updateService(@PathVariable Long id, @Valid @RequestBody ServiceDTO serviceDTO) {
        ServiceDTO updatedService = serviceService.updateService(id, serviceDTO);
        return new ResponseEntity<>(updatedService, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/services/categories")
    public ResponseEntity<List<ServiceCategoryDTO>> getAllCategoriesAdmin() {
        List<ServiceCategoryDTO> categories = serviceService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/services/categories")
    public ResponseEntity<ServiceCategoryDTO> createCategory(@Valid @RequestBody ServiceCategoryDTO categoryDTO) {
        ServiceCategoryDTO createdCategory = serviceService.createCategory(categoryDTO);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/services/categories/{id}")
    public ResponseEntity<ServiceCategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody ServiceCategoryDTO categoryDTO) {
        ServiceCategoryDTO updatedCategory = serviceService.updateCategory(id, categoryDTO);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/services/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        serviceService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
