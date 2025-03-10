
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Users, 
  Activity, 
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import ApiService from "@/services/api.service";
import { ENDPOINTS } from "@/config/api";
import { useQuery } from "@tanstack/react-query";

// Define types for dashboard data
interface DashboardData {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  completionRate: number;
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    userName: string;
    userAvatar?: string;
  }>;
  bookingsByDay: Array<{
    date: string;
    count: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
  }>;
}

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState('week');

  // Use React Query to fetch dashboard data
  const { 
    data: dashboardData, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['adminDashboard', timeframe],
    queryFn: async () => {
      try {
        const response = await ApiService.get<DashboardData>(`${ENDPOINTS.DASHBOARD.ADMIN}?timeframe=${timeframe}`);
        return response || {
          totalUsers: 0,
          totalBookings: 0,
          totalRevenue: 0,
          completionRate: 0,
          recentActivity: [],
          bookingsByDay: [],
          revenueByMonth: []
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Return default data structure if API fails
        return {
          totalUsers: 0,
          totalBookings: 0,
          totalRevenue: 0,
          completionRate: 0,
          recentActivity: [],
          bookingsByDay: [],
          revenueByMonth: []
        };
      }
    }
  });

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </div>
        <Button onClick={() => refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  const data = dashboardData || {
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    completionRate: 0,
    recentActivity: [],
    bookingsByDay: [],
    revenueByMonth: []
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            Làm mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng khách hàng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {/* This would come from API in a real implementation */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng lịch đặt
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {/* This would come from API in a real implementation */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Doanh thu
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* This would come from API in a real implementation */}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tỷ lệ hoàn thành
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.completionRate ? `${data.completionRate}%` : '0%'}</div>
                <p className="text-xs text-muted-foreground">
                  {/* This would come from API in a real implementation */}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Lịch đặt theo ngày</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.bookingsByDay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Số lịch đặt" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Những hoạt động mới nhất trên hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentActivity.length > 0 ? 
                    data.recentActivity.slice(0, 5).map((activity, index) => (
                      <div key={activity.id || index} className="flex items-center">
                        <Avatar className="h-9 w-9 mr-3">
                          <AvatarImage src={activity.userAvatar} alt={activity.userName} />
                          <AvatarFallback>
                            {activity.userName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground">Chưa có hoạt động nào gần đây</p>
                    )
                  }
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader className="flex flex-row items-center">
                <div className="flex-1">
                  <CardTitle>Doanh thu theo tháng</CardTitle>
                  <CardDescription>
                    Tổng doanh thu theo từng tháng
                  </CardDescription>
                </div>
                <div>
                  <select 
                    className="p-2 border rounded-md"
                    value={timeframe}
                    onChange={(e) => handleTimeframeChange(e.target.value)}
                  >
                    <option value="week">7 ngày qua</option>
                    <option value="month">30 ngày qua</option>
                    <option value="year">Năm nay</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.revenueByMonth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => 
                        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))
                      } />
                      <Legend />
                      <Bar dataKey="revenue" name="Doanh thu" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
