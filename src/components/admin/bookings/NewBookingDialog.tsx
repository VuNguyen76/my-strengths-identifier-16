
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { CustomerForm } from "./forms/CustomerForm";
import { BookingDetails } from "./forms/BookingDetails";
import { useCreateBooking } from "@/hooks/useBookingMutations";

interface NewBookingProps {
  onBookingCreated: () => void;
}

export const NewBookingDialog = ({ onBookingCreated }: NewBookingProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // State for new booking form
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceId: "",
    specialistId: "",
    date: new Date(),
    time: "09:00",
    notes: ""
  });

  const createBookingMutation = useCreateBooking({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success("Đặt lịch mới đã được tạo!");
      setIsDialogOpen(false);
      resetForm();
      onBookingCreated();
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    // Update new booking with selected date
    if (selectedDate) {
      setNewBooking(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const resetForm = () => {
    setNewBooking({
      customerName: "",
      email: "",
      phone: "",
      serviceId: "",
      specialistId: "",
      date: new Date(),
      time: "09:00",
      notes: ""
    });
  };

  const createBooking = () => {
    // Create booking data for API
    const bookingData = {
      customerName: newBooking.customerName,
      email: newBooking.email,
      phone: newBooking.phone,
      serviceId: newBooking.serviceId,
      specialistId: newBooking.specialistId,
      bookingDate: newBooking.date.toISOString().split('T')[0],
      bookingTime: newBooking.time,
      notes: newBooking.notes
    };
    
    createBookingMutation.mutate(bookingData);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Đặt lịch mới
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Đặt lịch mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <CustomerForm 
            booking={newBooking} 
            handleInputChange={handleInputChange} 
          />
          <BookingDetails 
            booking={newBooking}
            handleSelectChange={handleSelectChange}
            handleDateChange={handleDateChange}
            handleInputChange={handleInputChange}
          />
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsDialogOpen(false)}
            disabled={createBookingMutation.isPending}
          >
            Hủy
          </Button>
          <Button 
            type="button" 
            onClick={createBooking}
            disabled={createBookingMutation.isPending}
          >
            {createBookingMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Xác nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
