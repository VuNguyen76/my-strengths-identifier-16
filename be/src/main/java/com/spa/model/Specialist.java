
package com.spa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "specialists")
public class Specialist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String role;
    
    private String experience;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String specialties;
    
    private Double rating;
    
    @ElementCollection
    @CollectionTable(name = "specialist_availability", 
                    joinColumns = @JoinColumn(name = "specialist_id"))
    @Column(name = "availability")
    private Set<String> availability;
}
