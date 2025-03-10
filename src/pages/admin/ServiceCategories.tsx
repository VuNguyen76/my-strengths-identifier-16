import { useState, useEffect } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryTable } from "@/components/admin/services/CategoryTable";
import { AddCategoryDialog } from "@/components/admin/services/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/admin/services/EditCategoryDialog";
import { DeleteCategoryDialog } from "@/components/admin/services/DeleteCategoryDialog";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  servicesCount: number;
}

const ServiceCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch('http://localhost:8081/api/admin/service-categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh mục. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (values: any) => {
    setFormLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập lại");
        return;
      }

      const response = await fetch('http://localhost:8081/api/admin/service-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add category');
      }
      
      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      toast.success("Danh mục dịch vụ mới đã được thêm thành công!");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(error instanceof Error ? error.message : 'Không thể thêm danh mục. Vui lòng thử lại sau.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCategory = async (values: any) => {
    setFormLoading(true);
    if (currentCategory) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Bạn cần đăng nhập lại");
          return;
        }

        const response = await fetch(`http://localhost:8081/api/admin/service-categories/${currentCategory.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update category');
        }
        
        const updatedCategory = await response.json();
        
        setCategories(categories.map(category =>
          category.id === currentCategory.id ? {
            ...updatedCategory,
            servicesCount: category.servicesCount // Preserve services count
          } : category
        ));
        
        toast.success("Danh mục dịch vụ đã được cập nhật thành công!");
        setIsEditDialogOpen(false);
        setCurrentCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
        toast.error(error instanceof Error ? error.message : 'Không thể cập nhật danh mục. Vui lòng thử lại sau.');
      } finally {
        setFormLoading(false);
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (currentCategory) {
      if (currentCategory.servicesCount > 0) {
        toast.error(`Không thể xóa danh mục này vì có ${currentCategory.servicesCount} dịch vụ đang sử dụng!`);
        setIsDeleteDialogOpen(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Bạn cần đăng nhập lại");
          return;
        }

        const response = await fetch(`http://localhost:8081/api/admin/service-categories/${currentCategory.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete category');
        }
        
        setCategories(categories.filter(category => category.id !== currentCategory.id));
        toast.success("Danh mục dịch vụ đã được xóa thành công!");
        setIsDeleteDialogOpen(false);
        setCurrentCategory(null);
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error(error instanceof Error ? error.message : 'Không thể xóa danh mục. Vui lòng thử lại sau.');
      }
    }
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
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
        <h1 className="text-2xl font-bold">Quản lý danh mục dịch vụ</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryTable 
            categories={categories}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
          />
        </CardContent>
      </Card>

      <AddCategoryDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddCategory={handleAddCategory}
        isLoading={formLoading}
      />

      <EditCategoryDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={currentCategory}
        onEditCategory={handleEditCategory}
        isLoading={formLoading}
      />

      <DeleteCategoryDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        category={currentCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
};

export default ServiceCategories;
