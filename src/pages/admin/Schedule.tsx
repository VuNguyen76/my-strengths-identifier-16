
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Edit, Loader2, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { SPECIALISTS } from "@/components/booking/specialists";
import { TIME_SLOTS } from "@/components/booking/constants";

const AdminSchedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [specialist, setSpecialist] = useState<string>("");
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [specialists, setSpecialists] = useState(SPECIALISTS);
  const [isLoadingSpecialists, setIsLoadingSpecialists] = useState(true);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    setIsLoadingSpecialists(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch('http://localhost:8081/api/specialists', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch specialists');
      }
      
      const data = await response.json();
      setSpecialists(data);
    } catch (error) {
      console.error('Error fetching specialists:', error);
      toast.error('Không thể tải danh sách chuyên viên. Vui lòng thử lại sau.');
    } finally {
      setIsLoadingSpecialists(false);
    }
  };

  const fetchSchedule = async () => {
    if (!specialist || !date) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:8081/api/admin/specialists/${specialist}/schedule?date=${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch schedule');
      }
      
      const data = await response.json();
      setSchedule(data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Không thể tải lịch làm việc. Vui lòng thử lại sau.');
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (specialist && date) {
      fetchSchedule();
    }
  }, [specialist, date]);

  const handleAddTimeSlot = async (time: string) => {
    if (!specialist || !date) {
      toast.error("Vui lòng chọn chuyên viên và ngày");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const formattedDate = date.toISOString().split('T')[0];
      
      const response = await fetch(`http://localhost:8081/api/admin/specialists/${specialist}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          date: formattedDate,
          time: time,
          available: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add time slot');
      }
      
      fetchSchedule();
      toast.success("Đã thêm khung giờ thành công");
    } catch (error) {
      console.error('Error adding time slot:', error);
      toast.error('Không thể thêm khung giờ. Vui lòng thử lại sau.');
    }
  };

  const handleRemoveTimeSlot = async (slotId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }
      
      const response = await fetch(`http://localhost:8081/api/admin/schedule/${slotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove time slot');
      }
      
      fetchSchedule();
      toast.success("Đã xóa khung giờ thành công");
    } catch (error) {
      console.error('Error removing time slot:', error);
      toast.error('Không thể xóa khung giờ. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý lịch làm việc</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm mới nhanh
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm khung giờ làm việc</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quick-specialist">Chuyên viên</Label>
                <Select onValueChange={(value) => setSpecialist(value)}>
                  <SelectTrigger id="quick-specialist">
                    <SelectValue placeholder="Chọn chuyên viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialists.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ngày</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-time">Khung giờ</Label>
                <Select onValueChange={(value) => handleAddTimeSlot(value)}>
                  <SelectTrigger id="quick-time">
                    <SelectValue placeholder="Chọn giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Xem lịch làm việc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="specialist-select">Chuyên viên</Label>
              <Select 
                onValueChange={setSpecialist} 
                value={specialist}
                disabled={isLoadingSpecialists}
              >
                <SelectTrigger id="specialist-select" className="mt-1.5">
                  <SelectValue placeholder="Chọn chuyên viên" />
                </SelectTrigger>
                <SelectContent>
                  {specialists.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ngày</Label>
              <div className="mt-1.5">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md p-3"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-md">
            {loading ? (
              <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : specialist && date ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi chú</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.length > 0 ? (
                    schedule.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell className="font-medium">{slot.time}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className={`h-2.5 w-2.5 rounded-full mr-2 ${slot.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {slot.available ? 'Có sẵn' : 'Đã đặt'}
                          </div>
                        </TableCell>
                        <TableCell>{slot.notes || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500"
                              onClick={() => handleRemoveTimeSlot(slot.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                        Không có khung giờ nào. Hãy thêm khung giờ mới.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-10 text-gray-500">
                Vui lòng chọn chuyên viên và ngày để xem lịch làm việc
              </div>
            )}
          </div>

          {specialist && date && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Thêm khung giờ mới</h3>
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((time) => (
                  <Button 
                    key={time} 
                    variant="outline"
                    onClick={() => handleAddTimeSlot(time)}
                    className="flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSchedule;
