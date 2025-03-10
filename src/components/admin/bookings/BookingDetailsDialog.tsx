
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  price?: number;
  notes?: string;
}

interface BookingDetailsDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingDetailsDialog = ({
  booking,
  isOpen,
  onOpenChange
}: BookingDetailsDialogProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết lịch đặt</DialogTitle>
        </DialogHeader>
        {booking && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Khách hàng</p>
                <p className="font-medium">{booking.customer}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{booking.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{booking.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dịch vụ</p>
                <p className="font-medium">{booking.service}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Chuyên viên</p>
                <p className="font-medium">{booking.specialist}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ngày giờ</p>
                <p className="font-medium">
                  {format(new Date(booking.date), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <div className="pt-1">{getStatusBadge(booking.status)}</div>
              </div>
              {booking.price && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Giá</p>
                  <p className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(booking.price)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mã đặt lịch</p>
                <p className="font-medium">{booking.id}</p>
              </div>
            </div>
            {booking.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ghi chú</p>
                <p>{booking.notes}</p>
              </div>
            )}
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Hướng dẫn xử lý</p>
              <p className="text-sm">
                Liên hệ với khách hàng 24 giờ trước lịch hẹn để xác nhận. Nếu khách không đến đúng hẹn, vui lòng ghi chú và cập nhật trạng thái lịch hẹn.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
