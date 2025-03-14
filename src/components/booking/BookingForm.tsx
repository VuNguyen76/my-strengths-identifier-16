
import { useState, useEffect } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookingData } from "@/pages/Booking";
import { bookingFormSchema, type BookingFormValues } from "./schema";
import { ServiceMultiSelect } from "./ServiceMultiSelect";
import { DateTimeSelect } from "./DateTimeSelect";
import { CustomerInfo } from "./CustomerInfo";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/config/api";
import ApiService from "@/services/api.service";
import AuthService from "@/services/auth.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service, Specialist } from "@/types/service";

interface BookingFormProps {
  onFormUpdate: (data: BookingData) => void;
  onBookingComplete: () => void;
}

const BookingForm = ({ onFormUpdate, onBookingComplete }: BookingFormProps) => {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      services: [],
      name: "",
      phone: "",
      email: "",
    }
  });

  // Fetch services using API service
  const { data: services, isLoading: isLoadingServices, isError: isServicesError } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      console.log("Fetching services data");
      return ApiService.get<Service[]>(ENDPOINTS.SERVICES.ALL, { requiresAuth: false });
    }
  });

  // Fetch specialists using API service
  const { data: specialists, isLoading: isLoadingSpecialists, isError: isSpecialistsError } = useQuery({
    queryKey: ['specialists'],
    queryFn: async () => {
      console.log("Fetching specialists data");
      return ApiService.get<Specialist[]>(ENDPOINTS.SPECIALISTS.ALL, { requiresAuth: false });
    }
  });

  useEffect(() => {
    // Load user information if logged in
    const user = AuthService.getCurrentUser();
    
    if (user) {
      form.setValue("name", user.fullName || "");
      // Safely access the phone property with type checking
      if (user && typeof user === 'object' && 'phone' in user) {
        form.setValue("phone", user.phone || "");
      }
      form.setValue("email", user.email || "");
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const serviceIds = value.services || [];
      const specialistId = value.specialist;
      
      const selectedServices = serviceIds
        .map(id => services && Array.isArray(services) ? 
              services.find((s) => String(s.id) === id) : undefined)
        .filter(Boolean) as Service[];
      
      const selectedSpecialist = specialists && Array.isArray(specialists) ? 
        specialists.find((s) => String(s.id) === specialistId) : undefined;

      const bookingData: BookingData = {
        services: selectedServices,
        specialist: selectedSpecialist,
        date: value.date,
        time: value.time,
        customerName: value.name,
        customerPhone: value.phone,
        customerEmail: value.email,
      };

      onFormUpdate(bookingData);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, onFormUpdate, services, specialists]);

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const bookingData = {
        serviceId: values.services[0], // Currently only booking 1 service
        specialistId: values.specialist,
        bookingDate: values.date.toISOString().split('T')[0],
        bookingTime: values.time,
        customerName: values.name,
        customerPhone: values.phone,
        customerEmail: values.email,
      };
      
      await ApiService.post(ENDPOINTS.BOOKINGS.USER, bookingData);
      
      toast.success("Đặt lịch thành công");
      onBookingComplete();
    } catch (error) {
      toast.error(`Lỗi khi đặt lịch: ${(error as Error).message}`);
    }
  };

  if (isLoadingServices || isLoadingSpecialists) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isServicesError || isSpecialistsError) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">
          Không thể tải dữ liệu. Vui lòng thử lại sau.
        </div>
        <Button onClick={() => window.location.reload()}>
          Tải lại
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ServiceMultiSelect 
          form={form} 
          services={Array.isArray(services) ? services : []} 
        />
        
        <FormField
          control={form.control}
          name="specialist"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên viên</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value}
                disabled={!form.watch("services")?.length || isLoadingSpecialists}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên viên" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {specialists && Array.isArray(specialists) && specialists.length > 0 ? 
                    specialists.map((specialist) => (
                      <SelectItem key={specialist.id} value={String(specialist.id)}>
                        {specialist.name}
                      </SelectItem>
                    )) : 
                    <SelectItem value="no-specialists">Không có chuyên viên</SelectItem>
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DateTimeSelect form={form} />
        <CustomerInfo form={form} />
        <Button type="submit" className="w-full">
          Đặt lịch
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
