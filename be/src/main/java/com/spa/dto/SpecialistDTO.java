
package com.spa.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpecialistDTO {
    private Long id;
    private String name;
    private String role;
    private String specialty;
    private String email;
    private String phone;
    private String experience;
    private String bio;
    private String specialties;
    private Double rating;
    private String image;
    private String status;
    private Set<String> availability;
    private Long userId;
}
