
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface BookingData {
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  specialistId: string;
  bookingDate: string;
  bookingTime: string;
  notes?: string;
}

interface UseMutationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useCreateBooking = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async (bookingData: BookingData) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/admin/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        throw new Error("Không thể tạo lịch đặt");
      }
      
      return response.json();
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi tạo lịch đặt: ${error.message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useCancelBooking = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch(`http://localhost:8081/api/admin/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể hủy lịch đặt");
      }
      
      return response.json();
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi hủy lịch đặt: ${error.message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useUpdateBookingStatus = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: string }) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch(`http://localhost:8081/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái đặt lịch");
      }
      
      return response.json();
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật trạng thái: ${error.message}`);
      options?.onError?.(error as Error);
    }
  });
};
