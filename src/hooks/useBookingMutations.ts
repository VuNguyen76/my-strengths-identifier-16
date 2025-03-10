
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";

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
      return ApiService.post(ENDPOINTS.BOOKINGS.ADMIN, bookingData);
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi tạo lịch đặt: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useCancelBooking = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async (bookingId: string) => {
      return ApiService.patch(ENDPOINTS.BOOKINGS.CANCEL(bookingId), {});
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi hủy lịch đặt: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};

export const useUpdateBookingStatus = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: string }) => {
      return ApiService.patch(ENDPOINTS.BOOKINGS.STATUS(bookingId), { status });
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật trạng thái: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};
