
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "./schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
  duration?: number;
}

interface ServiceMultiSelectProps {
  form: UseFormReturn<BookingFormValues>;
  services: Service[];
}

export const ServiceMultiSelect = ({ form, services }: ServiceMultiSelectProps) => {
  const selectedServices = form.watch("services") || [];

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = [...selectedServices];
    const index = currentServices.indexOf(serviceId);
    
    if (index > -1) {
      currentServices.splice(index, 1);
    } else {
      currentServices.push(serviceId);
    }
    
    form.setValue("services", currentServices, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <FormField
      control={form.control}
      name="services"
      render={() => (
        <FormItem>
          <FormLabel>Dịch vụ</FormLabel>
          <FormControl>
            <Card>
              <CardContent className="p-4 grid gap-4">
                {services.length > 0 ? (
                  services.map((service) => (
                    <div key={service.id} className="flex items-start space-x-3 p-3 rounded hover:bg-muted/40">
                      <Checkbox
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        id={`service-${service.id}`}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`service-${service.id}`}
                          className="flex justify-between text-sm font-medium cursor-pointer"
                        >
                          <span>{service.name}</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
                          </span>
                        </label>
                        {service.description && (
                          <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                        )}
                        {service.duration && (
                          <div className="flex items-center text-muted-foreground text-xs mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{service.duration} phút</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Không có dịch vụ nào. Vui lòng thử lại sau.
                  </div>
                )}
              </CardContent>
            </Card>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
