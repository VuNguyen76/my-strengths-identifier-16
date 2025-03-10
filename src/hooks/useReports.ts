
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";
import { format, subDays } from "date-fns";

interface DateRange {
  startDate: string;
  endDate: string;
}

export const useReports = (timePeriod: string = 'month') => {
  // Calculate date range based on selected time period
  const getDateRange = (): DateRange => {
    const endDate = new Date();
    let startDate;
    
    switch(timePeriod) {
      case 'week':
        startDate = subDays(endDate, 7);
        break;
      case 'month':
        startDate = subDays(endDate, 30);
        break;
      case 'quarter':
        startDate = subDays(endDate, 90);
        break;
      case 'year':
        startDate = subDays(endDate, 365);
        break;
      default:
        startDate = subDays(endDate, 30);
    }
    
    return {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd')
    };
  };
  
  const { startDate, endDate } = getDateRange();
  
  const getReportUrl = () => {
    return `${ENDPOINTS.REPORTS.ALL}?period=${timePeriod}&startDate=${startDate}&endDate=${endDate}`;
  };
  
  const getRevenueReportUrl = () => {
    return `${ENDPOINTS.REPORTS.REVENUE}?startDate=${startDate}&endDate=${endDate}`;
  };
  
  const getBookingsReportUrl = () => {
    return `${ENDPOINTS.REPORTS.BOOKINGS}?startDate=${startDate}&endDate=${endDate}`;
  };
  
  const reportQuery = useQuery({
    queryKey: ['reports', timePeriod, startDate, endDate],
    queryFn: async () => {
      return ApiService.get(getReportUrl());
    }
  });
  
  const revenueQuery = useQuery({
    queryKey: ['revenue-reports', startDate, endDate],
    queryFn: async () => {
      return ApiService.get(getRevenueReportUrl());
    }
  });
  
  const bookingsQuery = useQuery({
    queryKey: ['bookings-reports', startDate, endDate],
    queryFn: async () => {
      return ApiService.get(getBookingsReportUrl());
    }
  });
  
  return {
    reportData: reportQuery.data,
    isLoadingReport: reportQuery.isLoading,
    revenueData: revenueQuery.data,
    isLoadingRevenue: revenueQuery.isLoading,
    bookingsData: bookingsQuery.data,
    isLoadingBookings: bookingsQuery.isLoading,
    dateRange: { startDate, endDate },
  };
};
