
package com.spa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;
    
    private Double amount;
    
    private String paymentMethod;
    
    @Enumerated(EnumType.STRING)
    private TransactionStatus status = TransactionStatus.PENDING;
    
    private LocalDateTime transactionDate;
    
    private String referenceNumber;
    
    @Column(columnDefinition = "TEXT")
    private String note;
    
    public enum TransactionStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }
}
