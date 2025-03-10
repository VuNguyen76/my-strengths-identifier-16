
package com.spa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportDTO {
    private String period;
    private Double totalRevenue;
    private Integer totalBookings;
    private Integer completedBookings;
    private Integer cancelledBookings;
    private Double completionRate;
    private List<Map<String, Object>> revenueByService;
    private List<Map<String, Object>> bookingsByStatus;
    private List<Map<String, Object>> dailyRevenue;
    private List<Map<String, Object>> customerRetentionRate;
}
