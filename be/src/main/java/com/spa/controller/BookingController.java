
package com.spa.controller;

import com.spa.dto.BookingDTO;
import com.spa.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    // User bookings
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDTO>> getUserBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Long userId) {
        
        // If admin is querying for a specific user
        if (userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) && userId != null) {
            List<BookingDTO> bookings = bookingService.getUserBookings(userId);
            return new ResponseEntity<>(bookings, HttpStatus.OK);
        }
        
        // TODO: Get userId from authentication
        Long authenticatedUserId = 1L; // Placeholder
        
        List<BookingDTO> bookings = bookingService.getUserBookings(authenticatedUserId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    // Create a booking for authenticated user
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    @PostMapping("/bookings")
    public ResponseEntity<BookingDTO> createBooking(
            @Valid @RequestBody BookingDTO bookingDTO) {
        
        // TODO: Set customerId from authentication if not provided
        
        BookingDTO createdBooking = bookingService.createBooking(bookingDTO);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }
    
    // Create a booking for guest user
    @PostMapping("/bookings/guest")
    public ResponseEntity<BookingDTO> createGuestBooking(
            @Valid @RequestBody Map<String, Object> request) {
        
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setServiceId(Long.valueOf(request.get("serviceId").toString()));
        bookingDTO.setSpecialistId(Long.valueOf(request.get("specialistId").toString()));
        bookingDTO.setBookingDate(LocalDate.parse(request.get("bookingDate").toString()));
        bookingDTO.setBookingTime(java.time.LocalTime.parse(request.get("bookingTime").toString()));
        
        if (request.containsKey("note")) {
            bookingDTO.setNote(request.get("note").toString());
        }
        
        String customerName = request.get("customerName").toString();
        String customerEmail = request.get("customerEmail").toString();
        String customerPhone = request.get("customerPhone").toString();
        
        BookingDTO createdBooking = bookingService.createGuestBooking(
                bookingDTO, customerName, customerEmail, customerPhone);
        
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }
    
    // Admin endpoints
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/bookings")
    public ResponseEntity<List<BookingDTO>> getAllBookings(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String status) {
        
        List<BookingDTO> bookings;
        
        if (startDate != null && endDate != null) {
            bookings = bookingService.getBookingsByDateRange(startDate, endDate);
        } else if (status != null) {
            bookings = bookingService.getBookingsByStatus(status);
        } else {
            bookings = bookingService.getAllBookings();
        }
        
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/bookings/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/bookings")
    public ResponseEntity<BookingDTO> createAdminBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        BookingDTO createdBooking = bookingService.createBooking(bookingDTO);
        return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/bookings/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        
        String status = statusUpdate.get("status");
        if (status == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        BookingDTO updatedBooking = bookingService.updateBookingStatus(id, status);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/bookings/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id) {
        BookingDTO cancelledBooking = bookingService.cancelBooking(id);
        return new ResponseEntity<>(cancelledBooking, HttpStatus.OK);
    }
}
