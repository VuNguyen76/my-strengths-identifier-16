
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Star,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import ApiService from "@/services/api.service";
import { ENDPOINTS } from "@/config/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  experience: string;
  rating: number;
  status: string;
  image: string;
  bio?: string;
}

const AdminStaff = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Specialist | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const queryClient = useQueryClient();

  // Query to fetch specialists
  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['specialists', 'admin'],
    queryFn: async () => {
      try {
        return await ApiService.get<Specialist[]>(ENDPOINTS.SPECIALISTS.ALL);
      } catch (error) {
        console.error('Error fetching specialists:', error);
        toast.error('Không thể tải danh sách chuyên viên. Vui lòng thử lại sau.');
        return [];
      }
    }
  });

  // Mutation for adding a specialist
  const addSpecialistMutation = useMutation({
    mutationFn: async (specialistData: any) => {
      return await ApiService.post(ENDPOINTS.SPECIALISTS.ALL, specialistData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      toast.success("Đã thêm chuyên viên mới thành công");
      setIsAddStaffDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể thêm chuyên viên. Vui lòng thử lại sau.');
    }
  });

  // Mutation for updating a specialist
  const updateSpecialistMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      return await ApiService.put(`${ENDPOINTS.SPECIALISTS.ALL}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      toast.success("Đã cập nhật thông tin chuyên viên thành công");
      setIsEditStaffDialogOpen(false);
      setSelectedStaff(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể cập nhật chuyên viên. Vui lòng thử lại sau.');
    }
  });

  // Mutation for deleting a specialist
  const deleteSpecialistMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ApiService.delete(`${ENDPOINTS.SPECIALISTS.ALL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialists'] });
      toast.success("Đã xóa chuyên viên thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Không thể xóa chuyên viên. Vui lòng thử lại sau.');
    }
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredStaff = staff.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      (member.specialty && member.specialty.toLowerCase().includes(query)) ||
      member.email.toLowerCase().includes(query) ||
      member.phone.includes(query)
    );
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const staffData = {
        name: formData.get("name"),
        specialty: formData.get("specialty"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        experience: formData.get("experience"),
        image: formData.get("image") || "/placeholder.svg",
        bio: formData.get("bio")
      };
      
      await addSpecialistMutation.mutateAsync(staffData);
      form.reset();
    } catch (error) {
      console.error('Error adding specialist:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    if (selectedStaff) {
      try {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        const staffData = {
          name: formData.get("name"),
          specialty: formData.get("specialty"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          experience: formData.get("experience"),
          image: formData.get("image") || selectedStaff.image,
          bio: formData.get("bio")
        };
        
        await updateSpecialistMutation.mutateAsync({
          id: selectedStaff.id,
          data: staffData
        });
      } catch (error) {
        console.error('Error updating specialist:', error);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await deleteSpecialistMutation.mutateAsync(staffId);
    } catch (error) {
      console.error('Error deleting specialist:', error);
    }
  };

  const openEditDialog = (member: Specialist) => {
    setSelectedStaff(member);
    setIsEditStaffDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge className="bg-green-500">Đang làm việc</Badge>
      : <Badge className="bg-gray-500">Nghỉ việc</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý chuyên viên</h1>
        <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm chuyên viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm chuyên viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để thêm chuyên viên mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Tên đầy đủ</Label>
                    <Input id="name" name="name" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Chuyên môn</Label>
                    <Input id="specialty" name="specialty" placeholder="Chăm sóc da" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="example@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" placeholder="0901234567" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Kinh nghiệm</Label>
                    <Input id="experience" name="experience" placeholder="5 năm" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Hình ảnh URL</Label>
                    <Input id="image" name="image" placeholder="https://example.com/image.jpg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Tiểu sử</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    placeholder="Thông tin chi tiết về chuyên viên..." 
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={formLoading || addSpecialistMutation.isPending}>
                  {(formLoading || addSpecialistMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Thêm chuyên viên'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chuyên viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, chuyên môn, email hoặc số điện thoại..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Chuyên môn</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Kinh nghiệm</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="h-8 w-8 rounded-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.specialty}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.experience}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                          <span>{member.rating || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditDialog(member)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteStaff(member.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      {searchQuery ? "Không tìm thấy chuyên viên nào" : "Chưa có chuyên viên nào. Hãy thêm chuyên viên mới."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin chuyên viên</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin của {selectedStaff?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <form onSubmit={handleEditStaff} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Tên đầy đủ</Label>
                    <Input 
                      id="edit-name" 
                      name="name" 
                      defaultValue={selectedStaff.name} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-specialty">Chuyên môn</Label>
                    <Input 
                      id="edit-specialty" 
                      name="specialty" 
                      defaultValue={selectedStaff.specialty} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input 
                      id="edit-email" 
                      name="email" 
                      type="email" 
                      defaultValue={selectedStaff.email} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Số điện thoại</Label>
                    <Input 
                      id="edit-phone" 
                      name="phone" 
                      defaultValue={selectedStaff.phone} 
                      required 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-experience">Kinh nghiệm</Label>
                    <Input 
                      id="edit-experience" 
                      name="experience" 
                      defaultValue={selectedStaff.experience} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-image">Hình ảnh URL</Label>
                    <Input 
                      id="edit-image" 
                      name="image" 
                      defaultValue={selectedStaff.image} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-bio">Tiểu sử</Label>
                  <Textarea 
                    id="edit-bio" 
                    name="bio" 
                    defaultValue={selectedStaff.bio || ""}
                    placeholder="Thông tin chi tiết về chuyên viên..." 
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={formLoading || updateSpecialistMutation.isPending}>
                  {(formLoading || updateSpecialistMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStaff;
