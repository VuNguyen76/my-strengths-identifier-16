
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, CalendarDays, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Charts component
import { Bar } from "recharts";
import { Chart } from "@/components/ui/chart";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        navigate("/admin/login");
        return;
      }

      const response = await fetch('http://localhost:8081/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      
      // Update stats
      setStats({
        totalUsers: data.totalUsers || 0,
        totalBookings: data.totalBookings || 0,
        totalRevenue: data.totalRevenue || 0,
        pendingBookings: data.pendingBookings || 0
      });
      
      // Update chart data
      setRevenueData(data.revenueData || []);
      setBookingsData(data.bookingsData || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
      
      // Set empty data when API fails
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0
      });
      setRevenueData([]);
      setBookingsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if API fails to return data
  const fallbackRevenueData = [
    { name: "T1", value: 0 },
    { name: "T2", value: 0 },
    { name: "T3", value: 0 },
    { name: "T4", value: 0 },
    { name: "T5", value: 0 },
    { name: "T6", value: 0 },
  ];

  const fallbackBookingsData = [
    { name: "T1", value: 0 },
    { name: "T2", value: 0 },
    { name: "T3", value: 0 },
    { name: "T4", value: 0 },
    { name: "T5", value: 0 },
    { name: "T6", value: 0 },
  ];

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
                  Tổng số người dùng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Tổng số người dùng đã đăng ký
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lịch đặt chờ xử lý
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Cần xác nhận
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng số lịch đặt
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Tổng số lịch đặt đã đăng ký
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
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalRevenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng doanh thu từ đầu năm
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Doanh thu gần đây</CardTitle>
                <CardDescription>
                  Doanh thu 6 tháng gần nhất
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Chart 
                  className="h-80" 
                  type="bar"
                  data={revenueData.length > 0 ? revenueData : fallbackRevenueData}
                >
                  <Bar dataKey="value" fill="#0ea5e9" />
                </Chart>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Lịch đặt gần đây</CardTitle>
                <CardDescription>
                  Số lượng lịch đặt 6 tháng gần nhất
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Chart 
                  className="h-80" 
                  type="bar"
                  data={bookingsData.length > 0 ? bookingsData : fallbackBookingsData}
                >
                  <Bar dataKey="value" fill="#10b981" />
                </Chart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích người dùng</CardTitle>
                <CardDescription>
                  Số liệu về người dùng mới và quay lại
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-10">
                  Tính năng đang được phát triển. Vui lòng quay lại sau.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Phân tích dịch vụ</CardTitle>
                <CardDescription>
                  Dịch vụ phổ biến nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-10">
                  Tính năng đang được phát triển. Vui lòng quay lại sau.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
