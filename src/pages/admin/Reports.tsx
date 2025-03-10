
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { subDays, format } from 'date-fns';
import { ENDPOINTS } from '@/config/api';
import ApiService from '@/services/api.service';
import { Loader } from 'lucide-react';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  
  // Calculate date range based on selected time period
  const getDateRange = () => {
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
  
  // Fetch report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', timePeriod, startDate, endDate],
    queryFn: async () => {
      return ApiService.get(
        `${ENDPOINTS.REPORTS.ALL}?period=${timePeriod}&startDate=${startDate}&endDate=${endDate}`
      );
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Báo cáo và thống kê</h1>
        <Select 
          value={timePeriod} 
          onValueChange={(value) => setTimePeriod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">7 ngày qua</SelectItem>
            <SelectItem value="month">30 ngày qua</SelectItem>
            <SelectItem value="quarter">Quý này</SelectItem>
            <SelectItem value="year">Năm nay</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tổng doanh thu</CardTitle>
            <CardDescription>Trong khoảng thời gian đã chọn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {reportData?.totalRevenue?.toLocaleString('vi-VN')} VND
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Lượt đặt lịch</CardTitle>
            <CardDescription>Tổng số lượt đặt lịch</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reportData?.totalBookings}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Đã hoàn thành</CardTitle>
            <CardDescription>Số lượt đặt lịch đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reportData?.completedBookings}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tỷ lệ hoàn thành</CardTitle>
            <CardDescription>Tỷ lệ hoàn thành lịch hẹn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{reportData?.completionRate?.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Service */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Doanh thu theo dịch vụ</CardTitle>
            <CardDescription>Tỷ lệ doanh thu từ các dịch vụ</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData?.revenueByService}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData?.revenueByService?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VND`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Bookings by Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trạng thái đặt lịch</CardTitle>
            <CardDescription>Số lượng đặt lịch theo trạng thái</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={reportData?.bookingsByStatus}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {reportData?.bookingsByStatus?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Daily Revenue */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Doanh thu theo ngày</CardTitle>
            <CardDescription>Xu hướng doanh thu theo ngày</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={reportData?.dailyRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VND`} />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Customer Retention */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Tỷ lệ khách hàng</CardTitle>
            <CardDescription>Khách hàng mới và khách hàng quay lại</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reportData?.customerRetentionRate}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {reportData?.customerRetentionRate?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
