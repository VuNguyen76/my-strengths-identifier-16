
export interface ReportItem {
  name: string;
  value: number;
}

export interface DailyRevenueItem {
  date: string;
  revenue: number;
}

export interface Report {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number;
  revenueByService: ReportItem[];
  bookingsByStatus: ReportItem[];
  dailyRevenue: DailyRevenueItem[];
  customerRetentionRate: ReportItem[];
}

export interface RevenueReport {
  totalRevenue: number;
  byPaymentMethod: ReportItem[];
}

export interface BookingsReport {
  totalBookings: number;
  byStatus: ReportItem[];
}
