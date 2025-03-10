
package com.spa.service;

import com.spa.dto.ReportDTO;
import com.spa.model.Booking;
import com.spa.model.Transaction;
import com.spa.repository.BookingRepository;
import com.spa.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public ReportDTO generateReport(LocalDate startDate, LocalDate endDate, String period) {
        List<Booking> bookings = bookingRepository.findByBookingDateBetween(startDate, endDate);
        List<Transaction> transactions = transactionRepository.findByDateBetween(startDate, endDate);
        
        double totalRevenue = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
        
        int totalBookings = bookings.size();
        int completedBookings = (int) bookings.stream()
                .filter(b -> "COMPLETED".equals(b.getStatus()))
                .count();
        int cancelledBookings = (int) bookings.stream()
                .filter(b -> "CANCELLED".equals(b.getStatus()))
                .count();
        
        double completionRate = totalBookings > 0 
                ? (double) completedBookings / totalBookings * 100 
                : 0;
        
        // Revenue by service
        Map<String, Double> serviceRevenue = new HashMap<>();
        bookings.forEach(booking -> {
            String serviceName = booking.getService().getName();
            serviceRevenue.put(
                serviceName, 
                serviceRevenue.getOrDefault(serviceName, 0.0) + booking.getService().getPrice()
            );
        });
        
        List<Map<String, Object>> revenueByService = serviceRevenue.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        
        // Bookings by status
        Map<String, Integer> statusCount = new HashMap<>();
        bookings.forEach(booking -> {
            String status = booking.getStatus();
            statusCount.put(status, statusCount.getOrDefault(status, 0) + 1);
        });
        
        List<Map<String, Object>> bookingsByStatus = statusCount.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        
        // Daily revenue
        Map<LocalDate, Double> dailyRevenueMap = new HashMap<>();
        transactions.forEach(transaction -> {
            LocalDate date = transaction.getDate();
            dailyRevenueMap.put(date, dailyRevenueMap.getOrDefault(date, 0.0) + transaction.getAmount());
        });
        
        List<Map<String, Object>> dailyRevenue = dailyRevenueMap.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", entry.getKey().toString());
                    map.put("revenue", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        
        // Customer retention (simplified mock for now)
        List<Map<String, Object>> customerRetention = new ArrayList<>();
        Map<String, Object> retention = new HashMap<>();
        retention.put("name", "Returning");
        retention.put("value", 65); // mock value, would be calculated from real data
        customerRetention.add(retention);
        
        Map<String, Object> newCustomers = new HashMap<>();
        newCustomers.put("name", "New");
        newCustomers.put("value", 35); // mock value, would be calculated from real data
        customerRetention.add(newCustomers);
        
        return ReportDTO.builder()
                .period(period)
                .totalRevenue(totalRevenue)
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .completionRate(completionRate)
                .revenueByService(revenueByService)
                .bookingsByStatus(bookingsByStatus)
                .dailyRevenue(dailyRevenue)
                .customerRetentionRate(customerRetention)
                .build();
    }
    
    public Map<String, Object> getRevenueReport(LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByDateBetween(startDate, endDate);
        
        double totalRevenue = transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
                
        // Group by payment method
        Map<String, Double> byPaymentMethod = transactions.stream()
                .collect(Collectors.groupingBy(
                    Transaction::getPaymentMethod,
                    Collectors.summingDouble(Transaction::getAmount)
                ));
                
        List<Map<String, Object>> paymentMethodData = byPaymentMethod.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
                
        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("byPaymentMethod", paymentMethodData);
        
        return result;
    }
    
    public Map<String, Object> getBookingsReport(LocalDate startDate, LocalDate endDate) {
        List<Booking> bookings = bookingRepository.findByBookingDateBetween(startDate, endDate);
        
        int totalBookings = bookings.size();
        
        // Group by status
        Map<String, Long> byStatus = bookings.stream()
                .collect(Collectors.groupingBy(
                    Booking::getStatus,
                    Collectors.counting()
                ));
                
        List<Map<String, Object>> statusData = byStatus.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", entry.getKey());
                    map.put("value", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
                
        Map<String, Object> result = new HashMap<>();
        result.put("totalBookings", totalBookings);
        result.put("byStatus", statusData);
        
        return result;
    }
}
