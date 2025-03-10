
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { format, addHours, startOfToday } from "date-fns";
import { Search, Plus, Calendar as CalendarIcon, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

// Sample data for bookings
const bookingData = [
  {
    id: "1",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    service: "Chăm sóc da cơ bản",
    specialist: "Lê Thị B",
    date: "2023-09-15T09:00:00",
    status: "completed",
  },
  {
    id: "2",
    customer: "Trần Thị C",
    email: "tranthic@example.com",
    phone: "0913456789",
    service: "Trị mụn chuyên sâu",
    specialist: "Phạm Văn D",
    date: "2023-09-16T15:30:00",
    status: "cancelled",
  },
  {
    id: "3",
    customer: "Lê Văn E",
    email: "levane@example.com",
    phone: "0987654321",
    service: "Massage mặt",
    specialist: "Nguyễn Thị F",
    date: "2023-09-17T11:00:00",
    status: "pending",
  },
  {
    id: "4",
    customer: "Hoàng Thị G",
    email: "hoangthig@example.com",
    phone: "0932345678",
    service: "Trẻ hóa da",
    specialist: "Vũ Văn H",
    date: "2023-09-20T14:00:00",
    status: "confirmed",
  },
  {
    id: "5",
    customer: "Ngô Văn I",
    email: "ngovani@example.com",
    phone: "0945678912",
    service: "Tẩy trang chuyên sâu",
    specialist: "Lý Thị K",
    date: "2023-09-22T10:30:00",
    status: "pending",
  }
];

// Sample data for services
const services = [
  "Chăm sóc da cơ bản",
  "Trị mụn chuyên sâu", 
  "Massage mặt",
  "Trẻ hóa da",
  "Tẩy trang chuyên sâu",
  "Dịch vụ triệt lông",
  "Tắm trắng toàn thân",
  "Điều trị nám, tàn nhang"
];

// Sample data for specialists
const specialists = [
  "Lê Thị B",
  "Phạm Văn D",
  "Nguyễn Thị F",
  "Vũ Văn H",
  "Lý Thị K"
];

const AdminBookings = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  
  // State for new booking form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    customer: "",
    email: "",
    phone: "",
    service: "",
    specialist: "",
    date: startOfToday(),
    time: "09:00",
    notes: ""
  });
  
  // State to manage bookings
  const [bookings, setBookings] = useState(bookingData);
  
  // Date for calendar
  const [date, setDate] = useState<Date | undefined>(startOfToday());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    // Update new booking with selected date
    if (selectedDate) {
      setNewBooking(prev => ({ ...prev, date: selectedDate }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  const createBooking = () => {
    // Combine date and time
    const bookingDateTime = new Date(newBooking.date);
    const [hours, minutes] = newBooking.time.split(":").map(Number);
    bookingDateTime.setHours(hours, minutes);
    
    const formattedDateTime = bookingDateTime.toISOString();
    
    // Create new booking object
    const bookingEntry = {
      id: (bookings.length + 1).toString(),
      customer: newBooking.customer,
      email: newBooking.email,
      phone: newBooking.phone,
      service: newBooking.service,
      specialist: newBooking.specialist,
      date: formattedDateTime,
      status: "pending" as const, // Type assertion
    };
    
    // Add to bookings
    setBookings([...bookings, bookingEntry]);
    
    // Reset form and close dialog
    setNewBooking({
      customer: "",
      email: "",
      phone: "",
      service: "",
      specialist: "",
      date: startOfToday(),
      time: "09:00",
      notes: ""
    });
    
    setIsDialogOpen(false);
    toast.success("Đặt lịch mới đã được tạo!");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Function to handle status change
  const changeBookingStatus = (id: string, newStatus: "confirmed" | "completed" | "cancelled") => {
    const updatedBookings = bookings.map(booking => {
      if (booking.id === id) {
        return { ...booking, status: newStatus };
      }
      return booking;
    });
    
    setBookings(updatedBookings);
    
    const statusMessages = {
      confirmed: "Lịch đặt đã được xác nhận!",
      completed: "Lịch đặt đã được đánh dấu hoàn thành!",
      cancelled: "Lịch đặt đã bị hủy!"
    };
    
    toast.success(statusMessages[newStatus]);
  };

  // Function to view booking details
  const viewBookingDetails = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      toast.info(`Xem chi tiết lịch đặt: ${booking.customer} - ${booking.service}`);
      // In a real application, this would open a detailed view or modal
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Đã xác nhận</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Chờ xác nhận</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">Hoàn thành</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    // Filter by search term
    const matchesSearch =
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && booking.status === "pending") ||
      (activeTab === "confirmed" && booking.status === "confirmed") ||
      (activeTab === "completed" && booking.status === "completed") ||
      (activeTab === "cancelled" && booking.status === "cancelled");

    // Filter by cancelled switch
    const matchesCancelled = showCancelled || booking.status !== "cancelled";

    return matchesSearch && matchesTab && matchesCancelled;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý lịch đặt</h1>
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
                  <Label htmlFor="customer">Tên khách hàng</Label>
                  <Input
                    id="customer"
                    name="customer"
                    value={newBooking.customer}
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
                  <Label htmlFor="service">Dịch vụ</Label>
                  <Select
                    value={newBooking.service}
                    onValueChange={(value) => handleSelectChange("service", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialist">Chuyên viên</Label>
                  <Select
                    value={newBooking.specialist}
                    onValueChange={(value) => handleSelectChange("specialist", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chuyên viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialists.map((specialist) => (
                        <SelectItem key={specialist} value={specialist}>
                          {specialist}
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="button" onClick={createBooking}>
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm lịch đặt..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-cancelled"
            checked={showCancelled}
            onCheckedChange={setShowCancelled}
          />
          <Label htmlFor="show-cancelled">Hiển thị đã hủy</Label>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách lịch đặt</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead>Chuyên viên</TableHead>
                    <TableHead>Ngày giờ</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.customer}</TableCell>
                        <TableCell>
                          <div>{booking.email}</div>
                          <div className="text-sm text-muted-foreground">{booking.phone}</div>
                        </TableCell>
                        <TableCell>{booking.service}</TableCell>
                        <TableCell>{booking.specialist}</TableCell>
                        <TableCell>
                          {format(new Date(booking.date), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {booking.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => changeBookingStatus(booking.id, "confirmed")}
                                  className="flex items-center gap-1"
                                >
                                  <CheckCircle size={14} />
                                  Xác nhận
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => changeBookingStatus(booking.id, "cancelled")}
                                  className="text-red-500 flex items-center gap-1"
                                >
                                  <XCircle size={14} />
                                  Hủy
                                </Button>
                              </>
                            )}
                            {booking.status === "confirmed" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => changeBookingStatus(booking.id, "completed")}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle size={14} />
                                Hoàn thành
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => viewBookingDetails(booking.id)}
                              className="flex items-center gap-1"
                            >
                              <AlertCircle size={14} />
                              Chi tiết
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        Không có lịch đặt nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBookings;
