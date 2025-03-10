
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, CreditCard, Clock, BookOpen } from "lucide-react";
import { toast } from "sonner";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    pendingBookings: 0,
    completedServices: 0,
    upcomingBooking: null,
    recentActivity: [],
    totalPayments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDashboard();
  }, []);

  const fetchUserDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        navigate("/login");
        return;
      }

      const response = await fetch('http://localhost:8081/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user dashboard data');
      }
      
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user dashboard:', error);
      toast.error('Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.');
      
      // Set default empty data
      setUserData({
        pendingBookings: 0,
        completedServices: 0,
        upcomingBooking: null,
        recentActivity: [],
        totalPayments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchUserDashboard}>
            Làm mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động gần đây</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lịch đặt đang chờ
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.pendingBookings}</div>
                <p className="text-xs text-muted-foreground">
                  Số lịch đặt chờ xác nhận
                </p>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/dashboard/bookings")}>
                  Xem lịch đặt
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dịch vụ đã sử dụng
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.completedServices}</div>
                <p className="text-xs text-muted-foreground">
                  Tổng số dịch vụ bạn đã sử dụng
                </p>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/dashboard/history")}>
                  Xem lịch sử
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Thanh toán
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData.totalPayments ? 
                  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(userData.totalPayments) :
                  "0 ₫"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tổng số thanh toán của bạn
                </p>
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/dashboard/payments")}>
                  Xem thanh toán
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn sắp tới</CardTitle>
                <CardDescription>
                  Lịch hẹn gần nhất của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userData.upcomingBooking ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{userData.upcomingBooking.serviceName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Với chuyên viên: {userData.upcomingBooking.specialistName}
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(userData.upcomingBooking.date).toLocaleDateString('vi-VN')} - {userData.upcomingBooking.time}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => navigate(`/dashboard/bookings/${userData.upcomingBooking.id}`)}>
                      Chi tiết
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground mb-4">Bạn chưa có lịch hẹn nào sắp tới</p>
                    <Button onClick={() => navigate("/booking")}>Đặt lịch ngay</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>
                Các hoạt động của bạn trong vòng 30 ngày qua
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userData.recentActivity && userData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {userData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        activity.type === 'booking' ? 'bg-blue-100 text-blue-700' : 
                        activity.type === 'payment' ? 'bg-green-100 text-green-700' : 
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {activity.type === 'booking' ? <CalendarDays className="h-4 w-4" /> : 
                         activity.type === 'payment' ? <CreditCard className="h-4 w-4" /> : 
                         <Clock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Chưa có hoạt động nào gần đây</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
