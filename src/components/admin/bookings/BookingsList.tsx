
import { useState } from "react";
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
import { format } from "date-fns";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { BOOKING_STATUSES } from "@/components/booking/constants";

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  specialist: string;
  date: string;
  status: string;
}

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  viewBookingDetails: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export const BookingsList = ({ 
  bookings, 
  isLoading, 
  viewBookingDetails,
  onStatusChange
}: BookingsListProps) => {
  const queryClient = useQueryClient();

  // Mutation for changing booking status
  const statusChangeMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch(`http://localhost:8081/api/admin/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success("Cập nhật trạng thái thành công");
    },
    onError: (error) => {
      toast.error(`Lỗi: ${(error as Error).message}`);
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case BOOKING_STATUSES.CONFIRMED:
        return <Badge className="bg-green-500">Đã xác nhận</Badge>;
      case BOOKING_STATUSES.PENDING:
        return <Badge className="bg-yellow-500">Chờ xác nhận</Badge>;
      case BOOKING_STATUSES.COMPLETED:
        return <Badge className="bg-blue-500">Hoàn thành</Badge>;
      case BOOKING_STATUSES.CANCELLED:
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    statusChangeMutation.mutate({ id, status: newStatus });
    onStatusChange(id, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Liên hệ</TableHead>
          <TableHead>Dịch vụ</TableHead>
          <TableHead>Chuyên viên</TableHead>
          <TableHead>Ngày giờ</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.customer}</TableCell>
              <TableCell>
                <div>{booking.email}</div>
                <div className="text-sm text-muted-foreground">{booking.phone}</div>
              </TableCell>
              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking.specialist}</TableCell>
              <TableCell>
                {booking.date && format(new Date(booking.date), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{getStatusBadge(booking.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {booking.status === BOOKING_STATUSES.PENDING && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleStatusChange(booking.id, BOOKING_STATUSES.CONFIRMED)}
                        className="flex items-center gap-1"
                        disabled={statusChangeMutation.isPending}
                      >
                        {statusChangeMutation.isPending ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        Xác nhận
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleStatusChange(booking.id, BOOKING_STATUSES.CANCELLED)}
                        className="text-red-500 flex items-center gap-1"
                        disabled={statusChangeMutation.isPending}
                      >
                        <XCircle size={14} />
                        Hủy
                      </Button>
                    </>
                  )}
                  {booking.status === BOOKING_STATUSES.CONFIRMED && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusChange(booking.id, BOOKING_STATUSES.COMPLETED)}
                      className="flex items-center gap-1"
                      disabled={statusChangeMutation.isPending}
                    >
                      <CheckCircle size={14} />
                      Hoàn thành
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => viewBookingDetails(booking.id)}
                    className="flex items-center gap-1"
                  >
                    <AlertCircle size={14} />
                    Chi tiết
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-6">
              Không có lịch đặt nào
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
