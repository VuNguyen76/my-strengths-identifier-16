
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { BookingsFilter } from "@/components/admin/bookings/BookingsFilter";
import { BookingsList } from "@/components/admin/bookings/BookingsList";
import { NewBookingDialog } from "@/components/admin/bookings/NewBookingDialog";
import { BookingDetailsDialog } from "@/components/admin/bookings/BookingDetailsDialog";
import { toast } from "sonner";
import { BOOKING_STATUSES } from "@/components/booking/constants";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  service: string;
  specialist: string;
  date: string;
  status: string;
  [key: string]: any;
}

const AdminBookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch bookings from API
  const { data: bookings, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: async () => {
      return ApiService.get<Booking[]>(ENDPOINTS.BOOKINGS.ADMIN);
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleShowCancelledChange = (value: boolean) => {
    setShowCancelled(value);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await ApiService.patch(ENDPOINTS.BOOKINGS.STATUS(id), { status: newStatus });
      toast.success(`Cập nhật trạng thái thành công`);
      refetch();
    } catch (error) {
      toast.error(`Lỗi khi cập nhật trạng thái: ${(error as Error).message}`);
    }
  };

  const viewBookingDetails = (id: string) => {
    if (!bookings || !Array.isArray(bookings)) {
      toast.error("Không thể xem chi tiết: Dữ liệu không có sẵn");
      return;
    }
    
    const booking = bookings.find((b: Booking) => b.id === id);
    if (booking) {
      setSelectedBooking(booking);
      setIsViewDialogOpen(true);
    }
  };

  const handleBookingCreated = () => {
    refetch();
    toast.success("Lịch đặt mới đã được tạo thành công!");
  };

  // Filter bookings based on search, tab, and showCancelled
  const filteredBookings = bookings && Array.isArray(bookings) 
    ? bookings.filter((booking: Booking) => {
        // Filter by search term
        const matchesSearch =
          booking.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.service?.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by tab
        const matchesTab =
          activeTab === "all" ||
          (activeTab === BOOKING_STATUSES.PENDING && booking.status === BOOKING_STATUSES.PENDING) ||
          (activeTab === BOOKING_STATUSES.CONFIRMED && booking.status === BOOKING_STATUSES.CONFIRMED) ||
          (activeTab === BOOKING_STATUSES.COMPLETED && booking.status === BOOKING_STATUSES.COMPLETED) ||
          (activeTab === BOOKING_STATUSES.CANCELLED && booking.status === BOOKING_STATUSES.CANCELLED);

        // Filter by cancelled switch
        const matchesCancelled = showCancelled || booking.status !== BOOKING_STATUSES.CANCELLED;

        return matchesSearch && matchesTab && matchesCancelled;
      }) 
    : [];

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          Không thể tải danh sách đặt lịch: {(error as Error)?.message}
        </div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md" 
          onClick={() => refetch()}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý lịch đặt</h1>
        <NewBookingDialog onBookingCreated={handleBookingCreated} />
      </div>

      <BookingsFilter
        activeTab={activeTab}
        searchTerm={searchTerm}
        showCancelled={showCancelled}
        onTabChange={handleTabChange}
        onSearchChange={handleSearchChange}
        onShowCancelledChange={handleShowCancelledChange}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingsList
                bookings={filteredBookings}
                isLoading={isLoading}
                viewBookingDetails={viewBookingDetails}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BookingDetailsDialog
        booking={selectedBooking}
        isOpen={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
    </div>
  );
};

export default AdminBookings;
