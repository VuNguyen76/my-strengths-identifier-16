
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BOOKING_STATUSES } from "@/components/booking/constants";

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  specialistId: string;
  specialistName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  price: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const UserBookings = () => {
  const [activeTab, setActiveTab] = useState(BOOKING_STATUSES.CONFIRMED);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch bookings from API
  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['userBookings'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải danh sách đặt lịch");
      }
      
      return response.json();
    }
  });

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể hủy lịch đặt");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
      toast.success("Đã hủy lịch hẹn thành công");
      setIsCancelDialogOpen(false);
      setTimeout(() => {
        setActiveTab(BOOKING_STATUSES.CANCELLED);
      }, 300);
    },
    onError: (error) => {
      toast.error(`Lỗi khi hủy lịch: ${error.message}`);
    }
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case BOOKING_STATUSES.CONFIRMED:
        return <Badge className="bg-blue-500">Sắp tới</Badge>;
      case BOOKING_STATUSES.COMPLETED:
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case BOOKING_STATUSES.CANCELLED:
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      case BOOKING_STATUSES.PENDING:
        return <Badge className="bg-yellow-500">Đang chờ</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const filteredBookings = bookings ? bookings.filter((booking: Booking) => {
    if (activeTab === "all") return true;
    return booking.status === activeTab;
  }) : [];

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      cancelBookingMutation.mutate(selectedBooking.id);
    }
  };

  const handleNewBooking = () => {
    navigate("/booking");
  };

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          Không thể tải danh sách đặt lịch: {(error as Error).message}
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['userBookings'] })}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Lịch đặt của tôi</h1>
        <Button onClick={handleNewBooking}>
          <Calendar className="mr-2 h-4 w-4" />
          Đặt lịch mới
        </Button>
      </div>

      <Tabs defaultValue={BOOKING_STATUSES.CONFIRMED} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value={BOOKING_STATUSES.CONFIRMED}>Sắp tới</TabsTrigger>
          <TabsTrigger value={BOOKING_STATUSES.COMPLETED}>Hoàn thành</TabsTrigger>
          <TabsTrigger value={BOOKING_STATUSES.CANCELLED}>Đã hủy</TabsTrigger>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch đặt</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Chuyên viên</TableHead>
                      <TableHead>Ngày giờ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking: Booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.serviceName}</TableCell>
                          <TableCell>{booking.specialistName}</TableCell>
                          <TableCell>
                            {format(new Date(`${booking.bookingDate}T${booking.bookingTime}`), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.status)}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(booking.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Xem chi tiết"
                                onClick={() => handleViewBooking(booking)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {booking.status === BOOKING_STATUSES.CONFIRMED && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Hủy lịch"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => handleCancelBooking(booking)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          Không có lịch đặt nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog xem chi tiết lịch đặt */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết lịch đặt</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dịch vụ</p>
                  <p className="font-medium">{selectedBooking.serviceName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Chuyên viên</p>
                  <p className="font-medium">{selectedBooking.specialistName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ngày giờ</p>
                  <p className="font-medium">
                    {format(new Date(`${selectedBooking.bookingDate}T${selectedBooking.bookingTime}`), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                  <div className="pt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Giá</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedBooking.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mã đặt lịch</p>
                  <p className="font-medium">{selectedBooking.id}</p>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">Thông tin thêm</p>
                <p className="text-sm">
                  Vui lòng đến trước 10 phút để làm thủ tục. Nếu bạn cần thay đổi lịch, vui lòng liên hệ trước ít nhất 24 giờ.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận hủy lịch */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy lịch</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy lịch đặt này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} disabled={cancelBookingMutation.isPending}>
              Hủy
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancelBooking} 
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận hủy lịch"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserBookings;
