
package com.spa.controller;

import com.spa.dto.SpecialistDTO;
import com.spa.model.Specialist;
import com.spa.service.SpecialistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SpecialistController {

    @Autowired
    private SpecialistService specialistService;
    
    // Public endpoints
    @GetMapping("/specialists")
    public ResponseEntity<List<SpecialistDTO>> getAllSpecialists() {
        List<SpecialistDTO> specialists = specialistService.getAllSpecialists();
        return new ResponseEntity<>(specialists, HttpStatus.OK);
    }
    
    @GetMapping("/specialists/featured")
    public ResponseEntity<List<SpecialistDTO>> getFeaturedSpecialists() {
        List<SpecialistDTO> specialists = specialistService.getFeaturedSpecialists();
        return new ResponseEntity<>(specialists, HttpStatus.OK);
    }
    
    @GetMapping("/specialists/{id}")
    public ResponseEntity<SpecialistDTO> getSpecialistById(@PathVariable Long id) {
        SpecialistDTO specialist = specialistService.getSpecialistById(id);
        return new ResponseEntity<>(specialist, HttpStatus.OK);
    }
    
    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/specialists")
    public ResponseEntity<List<SpecialistDTO>> getAllSpecialistsAdmin() {
        List<SpecialistDTO> specialists = specialistService.getAllSpecialistsWithDetails();
        return new ResponseEntity<>(specialists, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/specialists")
    public ResponseEntity<SpecialistDTO> createSpecialist(@Valid @RequestBody SpecialistDTO specialistDTO) {
        SpecialistDTO createdSpecialist = specialistService.createSpecialist(specialistDTO);
        return new ResponseEntity<>(createdSpecialist, HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/specialists/{id}")
    public ResponseEntity<SpecialistDTO> updateSpecialist(@PathVariable Long id, @Valid @RequestBody SpecialistDTO specialistDTO) {
        SpecialistDTO updatedSpecialist = specialistService.updateSpecialist(id, specialistDTO);
        return new ResponseEntity<>(updatedSpecialist, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/specialists/{id}")
    public ResponseEntity<Void> deleteSpecialist(@PathVariable Long id) {
        specialistService.deleteSpecialist(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
    // Specialist schedule endpoint
    @GetMapping("/specialists/schedule/{id}")
    public ResponseEntity<List<String>> getSpecialistAvailability(@PathVariable Long id) {
        List<String> availability = specialistService.getSpecialistAvailability(id);
        return new ResponseEntity<>(availability, HttpStatus.OK);
    }
}
