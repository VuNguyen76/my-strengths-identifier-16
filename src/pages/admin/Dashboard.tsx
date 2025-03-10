
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Calendar, Clock, DollarSign, Loader2, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BOOKING_STATUSES } from "@/components/booking/constants";

const AdminDashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải thống kê");
      }
      
      return response.json();
    }
  });

  // Fetch recent bookings
  const { data: recentBookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['adminRecentBookings'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/admin/bookings/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải lịch đặt gần đây");
      }
      
      return response.json();
    }
  });

  // Fetch popular services
  const { data: popularServices, isLoading: loadingServices } = useQuery({
    queryKey: ['adminPopularServices'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/admin/services/popular', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải dịch vụ phổ biến");
      }
      
      return response.json();
    }
  });

  const getStatusBadge = (status: string) => {
    let className = "px-2 py-1 rounded-full text-xs font-medium ";
    
    switch (status) {
      case BOOKING_STATUSES.CONFIRMED:
        className += "bg-blue-100 text-blue-800";
        return <span className={className}>Đã xác nhận</span>;
      case BOOKING_STATUSES.COMPLETED:
        className += "bg-green-100 text-green-800";
        return <span className={className}>Hoàn thành</span>;
      case BOOKING_STATUSES.CANCELLED:
        className += "bg-red-100 text-red-800";
        return <span className={className}>Đã hủy</span>;
      case BOOKING_STATUSES.PENDING:
        className += "bg-yellow-100 text-yellow-800";
        return <span className={className}>Đang chờ</span>;
      default:
        className += "bg-gray-100 text-gray-800";
        return <span className={className}>Không xác định</span>;
    }
  };

  const isLoading = loadingStats || loadingBookings || loadingServices;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý hệ thống</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Người dùng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.userGrowth > 0 ? `+${stats?.userGrowth}%` : `${stats?.userGrowth}%`} so với tháng trước
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Dịch vụ
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalServices || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.serviceGrowth > 0 ? `+${stats?.serviceGrowth}%` : `${stats?.serviceGrowth}%`} so với tháng trước
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Chuyên viên
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalSpecialists || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.newSpecialists > 0 ? `+${stats?.newSpecialists}` : '0'} người mới
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Lịch đặt
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.bookingGrowth > 0 ? `+${stats?.bookingGrowth}%` : `${stats?.bookingGrowth}%`} so với tháng trước
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Doanh thu
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.revenueGrowth > 0 ? `+${stats?.revenueGrowth}%` : `${stats?.revenueGrowth}%`} so với tháng trước
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Lịch đặt gần đây</CardTitle>
                  <CardDescription>
                    Danh sách các lịch đặt mới nhất
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/bookings">Xem tất cả</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentBookings && recentBookings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBookings.map((booking: any) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.customerName}</TableCell>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell>
                            {new Date(booking.bookingDate + 'T' + booking.bookingTime).toLocaleDateString('vi-VN')} {' '}
                            {new Date(booking.bookingDate + 'T' + booking.bookingTime).toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Không có lịch đặt gần đây</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Dịch vụ phổ biến</CardTitle>
                  <CardDescription>
                    Dịch vụ được đặt nhiều nhất
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/services">Quản lý dịch vụ</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {popularServices && popularServices.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên dịch vụ</TableHead>
                          <TableHead className="text-right">Số lượt đặt</TableHead>
                          <TableHead className="text-right">Doanh thu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {popularServices.map((service: any) => (
                          <TableRow key={service.id}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell className="text-right">{service.bookings}</TableCell>
                            <TableCell className="text-right">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.revenue)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4 space-y-2">
                      {popularServices.map((service: any) => (
                        <div key={service.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{service.name}</p>
                            <p className="text-sm font-medium">{Math.round((service.bookings / (stats?.totalBookings || 1)) * 100)}%</p>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full rounded-full" 
                              style={{ width: `${Math.round((service.bookings / (stats?.totalBookings || 1)) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Không có dữ liệu dịch vụ phổ biến</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
