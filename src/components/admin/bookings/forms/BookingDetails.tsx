
import { format, startOfToday } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";

interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration?: string;
}

interface Specialist {
  id: string;
  name: string;
  title?: string;
  expertise?: string[];
}

interface BookingDetailsProps {
  booking: {
    serviceId: string;
    specialistId: string;
    date: Date;
    time: string;
    notes: string;
    [key: string]: any;
  };
  handleSelectChange: (name: string, value: string) => void;
  handleDateChange: (date: Date | undefined) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BookingDetails = ({ 
  booking,
  handleSelectChange,
  handleDateChange,
  handleInputChange
}: BookingDetailsProps) => {
  // Fetch services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      return ApiService.get<Service[]>(ENDPOINTS.SERVICES.ALL);
    }
  });

  // Fetch specialists
  const { data: specialists, isLoading: isLoadingSpecialists } = useQuery({
    queryKey: ['specialists'],
    queryFn: async () => {
      return ApiService.get<Specialist[]>(ENDPOINTS.SPECIALISTS.ALL);
    }
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceId">Dịch vụ</Label>
          <Select
            value={booking.serviceId}
            onValueChange={(value) => handleSelectChange("serviceId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingServices ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : services && Array.isArray(services) ? (
                services.map((service: Service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-services">Không có dịch vụ</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="specialistId">Chuyên viên</Label>
          <Select
            value={booking.specialistId}
            onValueChange={(value) => handleSelectChange("specialistId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn chuyên viên" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingSpecialists ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : specialists && Array.isArray(specialists) ? (
                specialists.map((specialist: Specialist) => (
                  <SelectItem key={specialist.id} value={specialist.id.toString()}>
                    {specialist.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-specialists">Không có chuyên viên</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ngày</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {booking.date ? format(booking.date, "PPP") : <span>Chọn ngày</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={booking.date}
                onSelect={handleDateChange}
                disabled={(date) => date < startOfToday()}
                initialFocus
                className="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Giờ</Label>
          <Select
            value={booking.time}
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
        <Label htmlFor="notes">Ghi chú</Label>
        <Input
          id="notes"
          name="notes"
          value={booking.notes}
          onChange={handleInputChange}
          placeholder="Ghi chú về đặt lịch"
        />
      </div>
    </>
  );
};
