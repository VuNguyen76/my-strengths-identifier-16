
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search,
  UserPlus,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { AddUserDialog } from "@/components/admin/users/AddUserDialog";
import { ChangeRoleDialog } from "@/components/admin/users/ChangeRoleDialog";

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

  const handleAddUser = async (userData: any) => {
    setFormLoading(true);
    
    try {
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

  const handleChangeRole = async (userId: string, newRole: string) => {
    setFormLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch(`http://localhost:8081/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change role');
      }
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole } 
          : user
      ));
      
      toast.success(`Đã thay đổi vai trò thành công`);
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể thay đổi vai trò. Vui lòng thử lại sau.');
    } finally {
      setFormLoading(false);
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setIsRoleDialogOpen(true);
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
        <AddUserDialog 
          isOpen={isAddUserDialogOpen} 
          onOpenChange={setIsAddUserDialogOpen}
          onAddUser={handleAddUser}
          isLoading={formLoading}
        />
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

          <UsersTable 
            users={filteredUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onChangeRole={openRoleDialog}
          />
        </CardContent>
      </Card>

      <ChangeRoleDialog 
        isOpen={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        user={selectedUser}
        onChangeRole={handleChangeRole}
        isLoading={formLoading}
      />
    </div>
  );
};

export default AdminUsers;
