
package com.spa.service;

import com.spa.dto.SpecialistDTO;
import com.spa.exception.ResourceNotFoundException;
import com.spa.model.Specialist;
import com.spa.model.User;
import com.spa.repository.SpecialistRepository;
import com.spa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecialistService {

    @Autowired
    private SpecialistRepository specialistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Convert entity to DTO
    private SpecialistDTO convertToDTO(Specialist specialist) {
        SpecialistDTO dto = new SpecialistDTO();
        dto.setId(specialist.getId());
        dto.setName(specialist.getUser().getFullName());
        dto.setRole(specialist.getRole());
        dto.setEmail(specialist.getUser().getEmail());
        dto.setPhone(specialist.getUser().getPhone());
        dto.setExperience(specialist.getExperience());
        dto.setBio(specialist.getBio());
        dto.setSpecialties(specialist.getSpecialties());
        dto.setRating(specialist.getRating());
        dto.setUserId(specialist.getUser().getId());
        dto.setAvailability(specialist.getAvailability());
        // Set status based on user account status
        dto.setStatus(specialist.getUser().isEnabled() ? "active" : "inactive");
        return dto;
    }
    
    // Convert DTO to entity (for create/update)
    private Specialist convertToEntity(SpecialistDTO dto, User user) {
        Specialist specialist = new Specialist();
        specialist.setUser(user);
        specialist.setRole(dto.getRole());
        specialist.setExperience(dto.getExperience());
        specialist.setBio(dto.getBio());
        specialist.setSpecialties(dto.getSpecialties());
        specialist.setRating(dto.getRating() != null ? dto.getRating() : 0.0);
        specialist.setAvailability(dto.getAvailability());
        return specialist;
    }
    
    // Get all specialists (basic info)
    public List<SpecialistDTO> getAllSpecialists() {
        return specialistRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get featured specialists
    public List<SpecialistDTO> getFeaturedSpecialists() {
        // Logic to get featured specialists (e.g., highest rated)
        return specialistRepository.findAll().stream()
                .sorted((s1, s2) -> Double.compare(s2.getRating(), s1.getRating()))
                .limit(4)  // Get top 4
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get specialist by ID
    public SpecialistDTO getSpecialistById(Long id) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        return convertToDTO(specialist);
    }
    
    // Get all specialists with detailed info (for admin)
    public List<SpecialistDTO> getAllSpecialistsWithDetails() {
        return specialistRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Create a new specialist
    public SpecialistDTO createSpecialist(SpecialistDTO specialistDTO) {
        // Find or create user
        User user;
        if (specialistDTO.getUserId() != null) {
            user = userRepository.findById(specialistDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + specialistDTO.getUserId()));
        } else {
            // Create a new user if userId is not provided
            user = new User();
            user.setEmail(specialistDTO.getEmail());
            user.setFullName(specialistDTO.getName());
            user.setPhone(specialistDTO.getPhone());
            user.setEnabled(true);
            user = userRepository.save(user);
        }
        
        Specialist specialist = convertToEntity(specialistDTO, user);
        specialist = specialistRepository.save(specialist);
        return convertToDTO(specialist);
    }
    
    // Update an existing specialist
    public SpecialistDTO updateSpecialist(Long id, SpecialistDTO specialistDTO) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        
        // Update user info
        User user = specialist.getUser();
        user.setFullName(specialistDTO.getName());
        user.setEmail(specialistDTO.getEmail());
        user.setPhone(specialistDTO.getPhone());
        userRepository.save(user);
        
        // Update specialist info
        specialist.setRole(specialistDTO.getRole());
        specialist.setExperience(specialistDTO.getExperience());
        specialist.setBio(specialistDTO.getBio());
        specialist.setSpecialties(specialistDTO.getSpecialties());
        if (specialistDTO.getRating() != null) {
            specialist.setRating(specialistDTO.getRating());
        }
        if (specialistDTO.getAvailability() != null) {
            specialist.setAvailability(specialistDTO.getAvailability());
        }
        
        specialist = specialistRepository.save(specialist);
        return convertToDTO(specialist);
    }
    
    // Delete a specialist
    public void deleteSpecialist(Long id) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        specialistRepository.delete(specialist);
    }
    
    // Get specialist availability
    public List<String> getSpecialistAvailability(Long id) {
        Specialist specialist = specialistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + id));
        return specialist.getAvailability().stream().collect(Collectors.toList());
    }
}
