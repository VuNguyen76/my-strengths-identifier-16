
package com.spa.dto;

import com.spa.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private String transactionId;
    private Long bookingId;
    private String customerName;
    private String serviceName;
    private String specialistName;
    private Double amount;
    private String paymentMethod;
    private Transaction.TransactionStatus status;
    private LocalDateTime transactionDate;
    private String referenceNumber;
    private String note;
}
