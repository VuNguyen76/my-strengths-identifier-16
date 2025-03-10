
package com.spa.service;

import com.spa.dto.BookingDTO;
import com.spa.exception.ResourceNotFoundException;
import com.spa.model.Booking;
import com.spa.model.Service;
import com.spa.model.Specialist;
import com.spa.model.User;
import com.spa.repository.BookingRepository;
import com.spa.repository.ServiceRepository;
import com.spa.repository.SpecialistRepository;
import com.spa.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private SpecialistRepository specialistRepository;
    
    // Convert Booking entity to DTO
    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        
        if (booking.getCustomer() != null) {
            dto.setCustomerId(booking.getCustomer().getId());
            dto.setCustomer(booking.getCustomer().getFullName());
            dto.setEmail(booking.getCustomer().getEmail());
            dto.setPhone(booking.getCustomer().getPhone());
        }
        
        if (booking.getService() != null) {
            dto.setServiceId(booking.getService().getId());
            dto.setService(booking.getService().getName());
            dto.setPrice(booking.getService().getPrice());
        }
        
        if (booking.getSpecialist() != null) {
            dto.setSpecialistId(booking.getSpecialist().getId());
            dto.setSpecialist(booking.getSpecialist().getUser().getFullName());
        }
        
        dto.setBookingDate(booking.getBookingDate());
        dto.setBookingTime(booking.getBookingTime());
        dto.setStatus(booking.getStatus().name());
        dto.setNote(booking.getNote());
        
        return dto;
    }
    
    // Get bookings for a specific user
    public List<BookingDTO> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get all bookings (admin)
    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get booking by ID
    public BookingDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        return convertToDTO(booking);
    }
    
    // Create a new booking
    @Transactional
    public BookingDTO createBooking(BookingDTO bookingDTO) {
        Booking booking = new Booking();
        
        // Set customer
        User customer = userRepository.findById(bookingDTO.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + bookingDTO.getCustomerId()));
        booking.setCustomer(customer);
        
        // Set service
        com.spa.model.Service service = serviceRepository.findById(bookingDTO.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + bookingDTO.getServiceId()));
        booking.setService(service);
        
        // Set specialist
        Specialist specialist = specialistRepository.findById(bookingDTO.getSpecialistId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + bookingDTO.getSpecialistId()));
        booking.setSpecialist(specialist);
        
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setBookingTime(bookingDTO.getBookingTime());
        booking.setStatus(Booking.BookingStatus.PENDING); // Default status
        booking.setNote(bookingDTO.getNote());
        
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }
    
    // Create a new booking for guest users
    @Transactional
    public BookingDTO createGuestBooking(BookingDTO bookingDTO, String customerName, String customerEmail, String customerPhone) {
        // Check if user exists with the provided email
        User customer = userRepository.findByEmail(customerEmail)
                .orElseGet(() -> {
                    // Create a new user if not exists
                    User newUser = new User();
                    newUser.setEmail(customerEmail);
                    newUser.setFullName(customerName);
                    newUser.setPhone(customerPhone);
                    newUser.setUsername(customerEmail); // Using email as username
                    newUser.setPassword("guest123"); // Temporary password
                    newUser.setRole(User.Role.ROLE_CUSTOMER);
                    newUser.setActive(true);
                    return userRepository.save(newUser);
                });
        
        Booking booking = new Booking();
        booking.setCustomer(customer);
        
        // Set service
        com.spa.model.Service service = serviceRepository.findById(bookingDTO.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + bookingDTO.getServiceId()));
        booking.setService(service);
        
        // Set specialist
        Specialist specialist = specialistRepository.findById(bookingDTO.getSpecialistId())
                .orElseThrow(() -> new ResourceNotFoundException("Specialist not found with id: " + bookingDTO.getSpecialistId()));
        booking.setSpecialist(specialist);
        
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setBookingTime(bookingDTO.getBookingTime());
        booking.setStatus(Booking.BookingStatus.PENDING); // Default status
        booking.setNote(bookingDTO.getNote());
        
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }
    
    // Update booking status
    @Transactional
    public BookingDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        try {
            Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(newStatus);
            booking = bookingRepository.save(booking);
            return convertToDTO(booking);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
    
    // Cancel booking
    @Transactional
    public BookingDTO cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);
        return convertToDTO(booking);
    }
    
    // Get bookings by date range
    public List<BookingDTO> getBookingsByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Booking> bookings = bookingRepository.findByBookingDateBetween(startDate, endDate);
        return bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get bookings by status
    public List<BookingDTO> getBookingsByStatus(String status) {
        try {
            Booking.BookingStatus bookingStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
            List<Booking> bookings = bookingRepository.findByStatus(status);
            return bookings.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }
}
