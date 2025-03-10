import React, { useState } from 'react';
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
import { Loader } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import type { Report } from '@/types/report';

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Reports: React.FC = () => {
  const [timePeriod, setTimePeriod] = useState('month');
  const { reportData, isLoadingReport } = useReports(timePeriod);
  
  if (isLoadingReport) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const data = reportData as Report;
  
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
              {data?.totalRevenue?.toLocaleString('vi-VN')} VND
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Lượt đặt lịch</CardTitle>
            <CardDescription>Tổng số lượt đặt lịch</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.totalBookings}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Đã hoàn thành</CardTitle>
            <CardDescription>Số lượt đặt lịch đã hoàn thành</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.completedBookings}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Tỷ lệ hoàn thành</CardTitle>
            <CardDescription>Tỷ lệ hoàn thành lịch hẹn</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data?.completionRate?.toFixed(1)}%</p>
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
                  data={data?.revenueByService}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data?.revenueByService?.map((entry, index) => (
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
                data={data?.bookingsByStatus}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {data?.bookingsByStatus?.map((entry, index) => (
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
                data={data?.dailyRevenue}
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
                  data={data?.customerRetentionRate}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data?.customerRetentionRate?.map((entry, index) => (
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
