
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
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Edit, 
  Trash, 
  Shield,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch('http://localhost:8081/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query)
    );
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      const userData = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
        role: formData.get("role")
      };
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch('http://localhost:8081/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }
      
      toast.success("Người dùng mới đã được thêm thành công");
      setIsAddUserDialogOpen(false);
      form.reset();
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể thêm người dùng. Vui lòng thử lại sau.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    toast.info("Chức năng chỉnh sửa người dùng sẽ được cập nhật sau");
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch(`http://localhost:8081/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      toast.success("Đã xóa người dùng thành công");
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể xóa người dùng. Vui lòng thử lại sau.');
    }
  };

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    if (selectedUser) {
      try {
        const form = e.target as HTMLFormElement;
        const newRole = form.querySelector('#new-role') as HTMLSelectElement;
        
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Bạn cần đăng nhập lại");
          return;
        }

        const response = await fetch(`http://localhost:8081/api/admin/users/${selectedUser.id}/role`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: newRole.value })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to change role');
        }
        
        // Update local state
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, role: newRole.value } 
            : user
        ));
        
        toast.success(`Đã thay đổi vai trò của ${selectedUser.name} thành công`);
        setIsRoleDialogOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error changing role:', error);
        toast.error(error instanceof Error ? error.message : 'Không thể thay đổi vai trò. Vui lòng thử lại sau.');
      } finally {
        setFormLoading(false);
      }
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ROLE_ADMIN':
        return <Badge className="bg-purple-600">Admin</Badge>;
      case 'ROLE_STAFF':
        return <Badge className="bg-orange-500">Nhân viên</Badge>;
      default:
        return <Badge className="bg-blue-500">Người dùng</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? <Badge className="bg-green-500">Hoạt động</Badge>
      : <Badge className="bg-gray-500">Không hoạt động</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản người dùng mới
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên đầy đủ</Label>
                  <Input id="name" name="name" placeholder="Nguyễn Văn A" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="example@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" name="phone" placeholder="0901234567" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <select 
                    id="role" 
                    name="role"
                    className="w-full p-2 border rounded-md"
                    defaultValue="ROLE_USER"
                  >
                    <option value="ROLE_USER">Người dùng</option>
                    <option value="ROLE_ADMIN">Admin</option>
                    <option value="ROLE_STAFF">Nhân viên</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Tạo người dùng'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Phân quyền
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
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
                    <TableCell colSpan={7} className="text-center">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phân quyền người dùng</DialogTitle>
            <DialogDescription>
              Thay đổi vai trò của {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangeRole} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-role">Vai trò mới</Label>
                <select 
                  id="new-role" 
                  className="w-full p-2 border rounded-md"
                  defaultValue={selectedUser?.role}
                >
                  <option value="ROLE_USER">Người dùng</option>
                  <option value="ROLE_ADMIN">Admin</option>
                  <option value="ROLE_STAFF">Nhân viên</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? (
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
