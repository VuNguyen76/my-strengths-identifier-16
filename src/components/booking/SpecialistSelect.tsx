
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { BookingFormValues } from "./schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface Specialist {
  id: string;
  name: string;
  title?: string;
  imageUrl?: string;
  expertise?: string[];
}

interface SpecialistSelectProps {
  form: UseFormReturn<BookingFormValues>;
  specialists: Specialist[];
}

export const SpecialistSelect = ({ form, specialists }: SpecialistSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="specialist"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Chuyên viên</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid gap-4"
            >
              <Card>
                <CardContent className="p-4 grid gap-4">
                  {specialists.map((specialist) => (
                    <div 
                      key={specialist.id}
                      className={`flex items-center space-x-4 p-3 rounded cursor-pointer hover:bg-muted/40 ${
                        field.value === specialist.id ? "bg-muted/50" : ""
                      }`}
                      onClick={() => field.onChange(specialist.id)}
                    >
                      <RadioGroupItem 
                        value={specialist.id} 
                        id={`specialist-${specialist.id}`} 
                        className="mt-1"
                      />
                      <Avatar className="h-10 w-10">
                        {specialist.imageUrl ? (
                          <AvatarImage src={specialist.imageUrl} alt={specialist.name} />
                        ) : (
                          <AvatarFallback>{specialist.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <label
                          htmlFor={`specialist-${specialist.id}`}
                          className="block text-sm font-medium cursor-pointer"
                        >
                          {specialist.name}
                        </label>
                        {specialist.title && (
                          <p className="text-xs text-muted-foreground">{specialist.title}</p>
                        )}
                        {specialist.expertise && specialist.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {specialist.expertise.map((exp, index) => (
                              <span 
                                key={index} 
                                className="text-xs bg-muted px-1.5 py-0.5 rounded"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
