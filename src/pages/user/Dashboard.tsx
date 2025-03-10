
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { BOOKING_STATUSES } from "@/components/booking/constants";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  // Fetch user's upcoming bookings
  const { data: upcomingBookings, isLoading: loadingUpcoming } = useQuery({
    queryKey: ['userUpcomingBookings'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/bookings/user/upcoming', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải lịch đặt sắp tới");
      }
      
      return response.json();
    }
  });

  // Fetch user's past bookings
  const { data: pastBookings, isLoading: loadingPast } = useQuery({
    queryKey: ['userPastBookings'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/bookings/user/past', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải lịch sử đặt lịch");
      }
      
      return response.json();
    }
  });

  // Fetch recommended services
  const { data: recommendedServices, isLoading: loadingRecommended } = useQuery({
    queryKey: ['recommendedServices'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/services/recommended', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải dịch vụ đề xuất");
      }
      
      return response.json();
    }
  });

  const getStatusBadge = (status: string) => {
    let className = "px-2 py-1 rounded-full text-xs font-medium ";
    
    switch (status) {
      case BOOKING_STATUSES.CONFIRMED:
        className += "bg-blue-100 text-blue-800";
        return <span className={className}>Sắp tới</span>;
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

  const isLoading = loadingUpcoming || loadingPast || loadingRecommended;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tổng quan</h1>
        <Button asChild>
          <Link to="/booking">Đặt lịch mới</Link>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Lịch sắp tới
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingBookings?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Lịch hẹn trong 30 ngày tới
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Lịch đã đặt
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pastBookings?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Lịch hẹn đã hoàn thành
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Dịch vụ đề xuất
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recommendedServices?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Dựa trên sở thích của bạn
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Lịch sắp tới</CardTitle>
                  <CardDescription>
                    Các lịch hẹn sắp tới của bạn
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/user/bookings">Quản lý lịch hẹn</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingBookings && upcomingBookings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Chuyên viên</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingBookings.map((booking: any) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.serviceName}</TableCell>
                          <TableCell>{booking.specialistName}</TableCell>
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
                    <p className="text-muted-foreground">Bạn không có lịch hẹn nào sắp tới</p>
                    <Button variant="outline" className="mt-2" asChild>
                      <Link to="/booking">Đặt lịch ngay</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Lịch sử đặt lịch</CardTitle>
                  <CardDescription>
                    Các lịch hẹn đã hoàn thành
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {pastBookings && pastBookings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dịch vụ</TableHead>
                        <TableHead>Chuyên viên</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastBookings.map((booking: any) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.serviceName}</TableCell>
                          <TableCell>{booking.specialistName}</TableCell>
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
                    <p className="text-muted-foreground">Bạn chưa có lịch sử đặt lịch nào</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {recommendedServices && recommendedServices.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dịch vụ đề xuất cho bạn</CardTitle>
                <CardDescription>
                  Dựa trên lịch sử đặt lịch của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendedServices.map((service: any) => (
                    <Card key={service.id}>
                      <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2">{service.description}</p>
                        <p className="font-medium">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                        </p>
                      </CardContent>
                      <div className="px-6 pb-4">
                        <Button className="w-full" asChild>
                          <Link to={`/booking?service=${service.id}`}>Đặt lịch</Link>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
