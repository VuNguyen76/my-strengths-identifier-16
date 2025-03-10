
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  role: string;
  [key: string]: any;
}

interface ChangeRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onChangeRole: (userId: string, role: string) => void;
  isLoading: boolean;
}

export const ChangeRoleDialog = ({ 
  isOpen, 
  onOpenChange, 
  user, 
  onChangeRole, 
  isLoading 
}: ChangeRoleDialogProps) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const form = e.target as HTMLFormElement;
      const newRole = (form.querySelector('#new-role') as HTMLSelectElement).value;
      onChangeRole(user.id, newRole);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Phân quyền người dùng</DialogTitle>
          <DialogDescription>
            Thay đổi vai trò của {user?.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-role">Vai trò mới</Label>
              <select 
                id="new-role" 
                className="w-full p-2 border rounded-md"
                defaultValue={user?.role}
              >
                <option value="ROLE_USER">Người dùng</option>
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_STAFF">Nhân viên</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
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
  );
};
