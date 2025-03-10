
import { useState } from "react";
import { format, startOfToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface NewBookingProps {
  onBookingCreated: () => void;
}

export const NewBookingDialog = ({ onBookingCreated }: NewBookingProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(startOfToday());
  const queryClient = useQueryClient();
  
  // State for new booking form
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    email: "",
    phone: "",
    serviceId: "",
    specialistId: "",
    date: startOfToday(),
    time: "09:00",
    notes: ""
  });

  // Fetch services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8081/api/services');
      if (!response.ok) {
        throw new Error('Không thể tải dịch vụ');
      }
      return response.json();
    }
  });

  // Fetch specialists
  const { data: specialists, isLoading: isLoadingSpecialists } = useQuery({
    queryKey: ['specialists'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8081/api/specialists');
      if (!response.ok) {
        throw new Error('Không thể tải chuyên viên');
      }
      return response.json();
    }
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
      toast.success("Đặt lịch mới đã được tạo!");
      setIsDialogOpen(false);
      resetForm();
      onBookingCreated();
    },
    onError: (error) => {
      toast.error(`Lỗi khi tạo lịch đặt: ${error.message}`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
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
      date: startOfToday(),
      time: "09:00",
      notes: ""
    });
    setDate(startOfToday());
  };

  const createBooking = () => {
    // Create booking data for API
    const bookingData = {
      customerName: newBooking.customerName,
      email: newBooking.email,
      phone: newBooking.phone,
      serviceId: newBooking.serviceId,
      specialistId: newBooking.specialistId,
      bookingDate: format(newBooking.date, 'yyyy-MM-dd'),
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Tên khách hàng</Label>
              <Input
                id="customerName"
                name="customerName"
                value={newBooking.customerName}
                onChange={handleInputChange}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newBooking.email}
                onChange={handleInputChange}
                placeholder="example@gmail.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                name="phone"
                value={newBooking.phone}
                onChange={handleInputChange}
                placeholder="0901234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceId">Dịch vụ</Label>
              <Select
                value={newBooking.serviceId}
                onValueChange={(value) => handleSelectChange("serviceId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịch vụ" />
                </SelectTrigger>
                <SelectContent>
                  {services && services.map((service: any) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialistId">Chuyên viên</Label>
              <Select
                value={newBooking.specialistId}
                onValueChange={(value) => handleSelectChange("specialistId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chuyên viên" />
                </SelectTrigger>
                <SelectContent>
                  {specialists && specialists.map((specialist: any) => (
                    <SelectItem key={specialist.id} value={specialist.id.toString()}>
                      {specialist.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Giờ</Label>
              <Select
                value={newBooking.time}
                onValueChange={(value) => handleSelectChange("time", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giờ" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }).map((_, i) => {
                    const hour = 8 + i;
                    const time = `${hour.toString().padStart(2, '0')}:00`;
                    return (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ngày</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Chọn ngày</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < startOfToday()}
                  initialFocus
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Input
              id="notes"
              name="notes"
              value={newBooking.notes}
              onChange={handleInputChange}
              placeholder="Ghi chú về đặt lịch"
            />
          </div>
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
