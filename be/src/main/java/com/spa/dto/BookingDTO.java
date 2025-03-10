
package com.spa.dto;

import com.spa.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long customerId;
    private String customer;
    private String email;
    private String phone;
    private Long serviceId;
    private String service;
    private Double price;
    private Long specialistId;
    private String specialist;
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String status;
    private String note;
}
