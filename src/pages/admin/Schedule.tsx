
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { format, isSameDay, addDays } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { PlusCircle, Trash2, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { SPECIALISTS, TIME_SLOTS } from "@/components/booking/constants";
import { Specialist } from "@/types/service";

// Schedule entry schema
const scheduleFormSchema = z.object({
  specialistId: z.string({
    required_error: "Vui lòng chọn chuyên viên",
  }),
  date: z.date({
    required_error: "Vui lòng chọn ngày",
  }),
  slots: z.array(z.string()).min(1, {
    message: "Vui lòng chọn ít nhất một khung giờ",
  }),
});

type FormValues = z.infer<typeof scheduleFormSchema>;

// Sample data for existing schedules
const initialSchedules = [
  {
    id: "1",
    specialistId: "1",
    date: new Date(new Date().setHours(0, 0, 0, 0)), // Today
    slots: ["09:00", "10:00", "14:00"]
  },
  {
    id: "2",
    specialistId: "2",
    date: new Date(new Date().setHours(0, 0, 0, 0)), // Today
    slots: ["11:00", "15:00", "16:00"]
  },
  {
    id: "3",
    specialistId: "1",
    date: addDays(new Date().setHours(0, 0, 0, 0), 1), // Tomorrow
    slots: ["09:00", "10:00", "11:00"]
  },
  {
    id: "4",
    specialistId: "3",
    date: addDays(new Date().setHours(0, 0, 0, 0), 2), // Day after tomorrow
    slots: ["14:00", "15:00"]
  }
];

const Schedule = () => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSchedule, setSelectedSchedule] = useState<typeof initialSchedules[0] | null>(null);
  const [activeTab, setActiveTab] = useState("calendar"); // "calendar" or "list"

  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      specialistId: "",
      date: new Date(),
      slots: [],
    },
  });

  // Get schedules for the selected date
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(
      (schedule) => isSameDay(new Date(schedule.date), date)
    );
  };

  // Get specialist by ID
  const getSpecialistById = (id: string): Specialist | undefined => {
    return SPECIALISTS.find((specialist) => specialist.id === id);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddSchedule = (values: FormValues) => {
    // Check if schedule already exists for this specialist and date
    const existingScheduleIndex = schedules.findIndex(
      schedule => 
        schedule.specialistId === values.specialistId && 
        isSameDay(new Date(schedule.date), values.date)
    );
    
    if (existingScheduleIndex >= 0) {
      // Update existing schedule
      const updatedSchedules = [...schedules];
      updatedSchedules[existingScheduleIndex] = {
        ...updatedSchedules[existingScheduleIndex],
        slots: values.slots
      };
      setSchedules(updatedSchedules);
      toast.success("Lịch làm việc đã được cập nhật thành công!");
    } else {
      // Create new schedule
      const newSchedule = {
        id: Date.now().toString(),
        specialistId: values.specialistId,
        date: values.date,
        slots: values.slots
      };
      setSchedules([...schedules, newSchedule]);
      toast.success("Lịch làm việc mới đã được tạo thành công!");
    }
    
    setIsAddDialogOpen(false);
    form.reset();
  };

  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      setSchedules(schedules.filter(schedule => schedule.id !== selectedSchedule.id));
      toast.success("Lịch làm việc đã được xóa thành công!");
      setIsDeleteDialogOpen(false);
      setSelectedSchedule(null);
    }
  };

  const openDeleteDialog = (schedule: typeof initialSchedules[0]) => {
    setSelectedSchedule(schedule);
    setIsDeleteDialogOpen(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Function to add/edit schedule for a specific specialist
  const handleSpecialistSchedule = (specialistId: string) => {
    form.reset({
      specialistId: specialistId,
      date: new Date(),
      slots: [],
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý lịch làm việc</h1>
        <Button onClick={() => {
          form.reset({
            specialistId: "",
            date: new Date(),
            slots: [],
          });
          setIsAddDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo lịch mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Lịch làm việc theo ngày
          </TabsTrigger>
          <TabsTrigger value="list">
            <User className="mr-2 h-4 w-4" />
            Lịch làm việc theo chuyên viên
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-5">
              <Card>
                <CardHeader>
                  <CardTitle>Chọn ngày</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={vi}
                    className="rounded-md border mx-auto"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Lịch làm việc ngày {format(selectedDate, "dd/MM/yyyy")}
                  </CardTitle>
                  <CardDescription>
                    Hiển thị các khung giờ làm việc của chuyên viên
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {getSchedulesForDate(selectedDate).length > 0 ? (
                    getSchedulesForDate(selectedDate).map((schedule) => {
                      const specialist = getSpecialistById(schedule.specialistId);
                      return (
                        <div
                          key={schedule.id}
                          className="border rounded-md p-4 mb-4 relative"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{specialist?.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {specialist?.role}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => openDeleteDialog(schedule)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {schedule.slots.map((slot) => (
                              <div
                                key={slot}
                                className="bg-primary/10 text-primary rounded px-2 py-1 text-sm flex items-center"
                              >
                                <Clock className="h-3 w-3 mr-1" />
                                {slot}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Không có lịch làm việc nào cho ngày này
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list">
          <div className="grid grid-cols-1 gap-6">
            {SPECIALISTS.map((specialist) => (
              <Card key={specialist.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{specialist.name}</CardTitle>
                      <CardDescription>{specialist.role}</CardDescription>
                    </div>
                    <Button
                      onClick={() => handleSpecialistSchedule(specialist.id)}
                      variant="outline"
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Thêm lịch
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {schedules.filter(schedule => schedule.specialistId === specialist.id).length > 0 ? (
                    <div className="space-y-4">
                      {schedules
                        .filter(schedule => schedule.specialistId === specialist.id)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((schedule) => (
                          <div
                            key={schedule.id}
                            className="border rounded-md p-4 relative"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-medium">
                                {format(new Date(schedule.date), "EEEE, dd/MM/yyyy", { locale: vi })}
                              </h3>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    form.reset({
                                      specialistId: schedule.specialistId,
                                      date: new Date(schedule.date),
                                      slots: schedule.slots,
                                    });
                                    setIsAddDialogOpen(true);
                                  }}
                                >
                                  Sửa
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive"
                                  onClick={() => openDeleteDialog(schedule)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {schedule.slots.map((slot) => (
                                <div
                                  key={slot}
                                  className="bg-primary/10 text-primary rounded px-2 py-1 text-sm flex items-center"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {slot}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      Chuyên viên này chưa có lịch làm việc
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Schedule Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo lịch làm việc mới</DialogTitle>
            <DialogDescription>
              Thiết lập lịch làm việc cho chuyên viên.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSchedule)} className="space-y-6">
              <FormField
                control={form.control}
                name="specialistId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chuyên viên</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chuyên viên" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SPECIALISTS.map((specialist) => (
                          <SelectItem key={specialist.id} value={specialist.id}>
                            {specialist.name} - {specialist.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày làm việc</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={vi}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="slots"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Khung giờ làm việc</FormLabel>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {TIME_SLOTS.map((slot) => (
                        <FormField
                          key={slot}
                          control={form.control}
                          name="slots"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={slot}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(slot)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, slot])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== slot
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {slot}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Lưu lịch làm việc</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lịch</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch làm việc này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSchedule} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Schedule;
