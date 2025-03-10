
package com.spa.service;

import com.spa.dto.ServiceCategoryDTO;
import com.spa.dto.ServiceDTO;
import com.spa.exception.ResourceNotFoundException;
import com.spa.model.Service;
import com.spa.model.ServiceCategory;
import com.spa.repository.ServiceCategoryRepository;
import com.spa.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private ServiceCategoryRepository categoryRepository;
    
    // Convert Service entity to DTO
    private ServiceDTO convertToDTO(Service service) {
        ServiceDTO dto = new ServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setDuration(service.getDuration());
        dto.setImage(service.getImage());
        dto.setActive(service.isActive());
        
        if (service.getCategory() != null) {
            dto.setCategoryId(service.getCategory().getId());
            dto.setCategoryName(service.getCategory().getName());
        }
        
        return dto;
    }
    
    // Convert category entity to DTO
    private ServiceCategoryDTO convertToCategoryDTO(ServiceCategory category) {
        ServiceCategoryDTO dto = new ServiceCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImage(category.getImage());
        
        // Count services in this category
        long serviceCount = serviceRepository.countByCategoryId(category.getId());
        dto.setServiceCount((int) serviceCount);
        
        return dto;
    }
    
    // Get all services
    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get featured services
    public List<ServiceDTO> getFeaturedServices() {
        return serviceRepository.findFeaturedServices().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get service by ID
    public ServiceDTO getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return convertToDTO(service);
    }
    
    // Get all service categories
    public List<ServiceCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::convertToCategoryDTO)
                .collect(Collectors.toList());
    }
    
    // Get category by ID
    public ServiceCategoryDTO getCategoryById(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return convertToCategoryDTO(category);
    }
    
    // Admin: Get all services (including inactive)
    public List<ServiceDTO> getAllServicesAdmin() {
        return serviceRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Admin: Create a service
    @Transactional
    public ServiceDTO createService(ServiceDTO serviceDTO) {
        Service service = new Service();
        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setPrice(serviceDTO.getPrice());
        service.setDuration(serviceDTO.getDuration());
        service.setImage(serviceDTO.getImage());
        service.setActive(serviceDTO.isActive());
        
        if (serviceDTO.getCategoryId() != null) {
            ServiceCategory category = categoryRepository.findById(serviceDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + serviceDTO.getCategoryId()));
            service.setCategory(category);
        }
        
        service = serviceRepository.save(service);
        return convertToDTO(service);
    }
    
    // Admin: Update a service
    @Transactional
    public ServiceDTO updateService(Long id, ServiceDTO serviceDTO) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setPrice(serviceDTO.getPrice());
        service.setDuration(serviceDTO.getDuration());
        service.setImage(serviceDTO.getImage());
        service.setActive(serviceDTO.isActive());
        
        if (serviceDTO.getCategoryId() != null) {
            ServiceCategory category = categoryRepository.findById(serviceDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + serviceDTO.getCategoryId()));
            service.setCategory(category);
        } else {
            service.setCategory(null);
        }
        
        service = serviceRepository.save(service);
        return convertToDTO(service);
    }
    
    // Admin: Delete a service
    @Transactional
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }
    
    // Admin: Create a category
    @Transactional
    public ServiceCategoryDTO createCategory(ServiceCategoryDTO categoryDTO) {
        ServiceCategory category = new ServiceCategory();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setImage(categoryDTO.getImage());
        
        category = categoryRepository.save(category);
        return convertToCategoryDTO(category);
    }
    
    // Admin: Update a category
    @Transactional
    public ServiceCategoryDTO updateCategory(Long id, ServiceCategoryDTO categoryDTO) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());
        category.setImage(categoryDTO.getImage());
        
        category = categoryRepository.save(category);
        return convertToCategoryDTO(category);
    }
    
    // Admin: Delete a category
    @Transactional
    public void deleteCategory(Long id) {
        ServiceCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        
        // Check if category has services
        List<Service> services = serviceRepository.findByCategoryId(id);
        if (!services.isEmpty()) {
            throw new RuntimeException("Cannot delete category that has services");
        }
        
        categoryRepository.delete(category);
    }
}
