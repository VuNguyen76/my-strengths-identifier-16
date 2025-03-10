
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
  } | null;
  onDelete: () => void;
}

export function DeleteCategoryDialog({
  isOpen,
  onClose,
  category,
  onDelete,
}: DeleteCategoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!category) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:8081/api/service-categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      toast.success('Đã xóa danh mục dịch vụ');
      onDelete();
      onClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Không thể xóa danh mục. Vui lòng thử lại sau.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa danh mục <strong>{category?.name}</strong>? 
            Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
