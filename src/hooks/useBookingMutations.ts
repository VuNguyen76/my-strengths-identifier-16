
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";

export interface BookingData {
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

export interface BookingResponse {
  id: string;
  service: string;
  specialist: string;
  date: string;
  status: string;
  price: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  notes?: string;
}

export const useCreateBooking = (options?: UseMutationOptions) => {
  return useMutation({
    mutationFn: async (bookingData: BookingData): Promise<BookingResponse> => {
      return ApiService.post<BookingResponse>(ENDPOINTS.BOOKINGS.ADMIN, bookingData);
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
    mutationFn: async (bookingId: string): Promise<BookingResponse> => {
      return ApiService.patch<BookingResponse>(ENDPOINTS.BOOKINGS.CANCEL(bookingId), {});
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
    mutationFn: async ({ bookingId, status }: { bookingId: string, status: string }): Promise<BookingResponse> => {
      return ApiService.patch<BookingResponse>(ENDPOINTS.BOOKINGS.STATUS(bookingId), { status });
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật trạng thái: ${(error as Error).message}`);
      options?.onError?.(error as Error);
    }
  });
};
