
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
  ArrowUpRight, 
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentActivity: [],
    bookingsByDay: [],
    revenueByMonth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch(`http://localhost:8081/api/admin/dashboard?timeframe=${timeframe}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      
      // Set default data for UI rendering
      setDashboardData({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        recentActivity: [],
        bookingsByDay: [],
        revenueByMonth: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchDashboardData}>
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
                <div className="text-2xl font-bold">{dashboardData.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% so với tháng trước
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
                <div className="text-2xl font-bold">{dashboardData.totalBookings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +10.5% so với tháng trước
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
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dashboardData.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15.3% so với tháng trước
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
                <div className="text-2xl font-bold">89.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% so với tháng trước
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
                    <BarChart data={dashboardData.bookingsByDay}>
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
                  {dashboardData.recentActivity.length > 0 ? 
                    dashboardData.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center">
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
                        {activity.type === 'increase' ? (
                          <ArrowUpRight className="ml-auto h-4 w-4 text-green-500" />
                        ) : activity.type === 'decrease' ? (
                          <ArrowDownRight className="ml-auto h-4 w-4 text-red-500" />
                        ) : null}
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
                    onChange={(e) => setTimeframe(e.target.value)}
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
                    <BarChart data={dashboardData.revenueByMonth}>
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
