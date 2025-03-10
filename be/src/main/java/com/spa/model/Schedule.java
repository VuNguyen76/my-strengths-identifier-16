
package com.spa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "specialist_id", nullable = false)
    private Specialist specialist;
    
    private LocalDate date;
    
    @ElementCollection
    @CollectionTable(name = "schedule_time_slots", 
                    joinColumns = @JoinColumn(name = "schedule_id"))
    @Column(name = "time_slot")
    private Set<String> timeSlots;
    
    @Enumerated(EnumType.STRING)
    private ScheduleStatus status = ScheduleStatus.AVAILABLE;
    
    public enum ScheduleStatus {
        AVAILABLE, BOOKED, OFF
    }
}
