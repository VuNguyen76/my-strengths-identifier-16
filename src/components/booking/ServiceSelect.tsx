
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICES } from "./services";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "./schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ServiceSelectProps {
  form: UseFormReturn<BookingFormValues>;
}

export const ServiceSelect = ({ form }: ServiceSelectProps) => {
  const [services, setServices] = useState(SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
        toast.error('Không thể tải dịch vụ. Vui lòng thử lại sau.');
        // Fallback to mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <FormField
      control={form.control}
      name="services"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dịch vụ</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange([value])} 
            value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : ""}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn dịch vụ" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
