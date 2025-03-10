
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn, useWatch } from "react-hook-form";
import { BookingFormValues } from "./schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SPECIALISTS } from "./specialists";

interface SpecialistSelectProps {
  form: UseFormReturn<BookingFormValues>;
}

export const SpecialistSelect = ({ form }: SpecialistSelectProps) => {
  const [specialists, setSpecialists] = useState(SPECIALISTS);
  const [loading, setLoading] = useState(true);
  const selectedServices = useWatch({
    control: form.control,
    name: "services",
  });

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/specialists');
        if (!response.ok) {
          throw new Error('Failed to fetch specialists');
        }
        const data = await response.json();
        setSpecialists(data);
      } catch (error) {
        console.error('Error fetching specialists:', error);
        toast.error('Không thể tải chuyên viên. Vui lòng thử lại sau.');
        // Fallback to mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  return (
    <FormField
      control={form.control}
      name="specialistId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Chuyên viên</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value}
            disabled={!selectedServices?.length || loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Chọn chuyên viên" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {specialists.map((specialist) => (
                <SelectItem key={specialist.id} value={specialist.id}>
                  {specialist.name}
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
