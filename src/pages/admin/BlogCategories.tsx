
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "@/services/api.service";
import { ENDPOINTS } from "@/config/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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
import { Checkbox } from "@/components/ui/checkbox";

// Blog category schema
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên danh mục phải có ít nhất 2 ký tự",
  }),
  slug: z.string().min(2, {
    message: "Slug phải có ít nhất 2 ký tự",
  }).regex(/^[a-z0-9-]+$/, {
    message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  postsCount: number;
}

const BlogCategories = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<BlogCategory | null>(null);
  const queryClient = useQueryClient();

  // Query to fetch categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['blogCategories'],
    queryFn: async () => {
      try {
        const data = await ApiService.get<BlogCategory[]>(ENDPOINTS.BLOGS.CATEGORIES);
        return data || [];
      } catch (error) {
        console.error("Error fetching blog categories:", error);
        toast.error("Không thể tải danh mục blog");
        return [];
      }
    }
  });

  // Add category form
  const addForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  // Edit category form
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      isActive: true,
    },
  });

  // Mutation for adding a category
  const addCategoryMutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      return await ApiService.post(ENDPOINTS.BLOGS.CATEGORIES, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
      toast.success("Danh mục blog mới đã được thêm thành công!");
      setIsAddDialogOpen(false);
      addForm.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể thêm danh mục blog");
    }
  });

  // Mutation for updating a category
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: CategoryFormValues }) => {
      return await ApiService.put(`${ENDPOINTS.BLOGS.CATEGORIES}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
      toast.success("Danh mục blog đã được cập nhật thành công!");
      setIsEditDialogOpen(false);
      setCurrentCategory(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật danh mục blog");
    }
  });

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await ApiService.delete(`${ENDPOINTS.BLOGS.CATEGORIES}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogCategories'] });
      toast.success("Danh mục blog đã được xóa thành công!");
      setIsDeleteDialogOpen(false);
      setCurrentCategory(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể xóa danh mục blog");
    }
  });

  // Auto-generate slug from name for add form
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");
  };

  const watchAddName = addForm.watch("name");
  const watchAddSlug = addForm.watch("slug");

  if (watchAddName && !watchAddSlug) {
    const generatedSlug = generateSlug(watchAddName);
    addForm.setValue("slug", generatedSlug);
  }

  const handleAddCategory = (values: CategoryFormValues) => {
    // Check if slug is already in use
    if (categories.some(cat => cat.slug === values.slug)) {
      addForm.setError("slug", { 
        type: "manual", 
        message: "Slug này đã được sử dụng, vui lòng chọn slug khác" 
      });
      return;
    }

    addCategoryMutation.mutate(values);
  };

  const handleEditCategory = (values: CategoryFormValues) => {
    if (currentCategory) {
      // Check if slug is already in use (excluding the current category)
      if (
        values.slug !== currentCategory.slug && 
        categories.some(cat => cat.slug === values.slug)
      ) {
        editForm.setError("slug", { 
          type: "manual", 
          message: "Slug này đã được sử dụng, vui lòng chọn slug khác" 
        });
        return;
      }

      updateCategoryMutation.mutate({
        id: currentCategory.id,
        data: values
      });
    }
  };

  const handleDeleteCategory = () => {
    if (currentCategory) {
      if (currentCategory.postsCount > 0) {
        toast.error(`Không thể xóa danh mục này vì có ${currentCategory.postsCount} bài viết đang sử dụng!`);
        setIsDeleteDialogOpen(false);
        return;
      }
      
      deleteCategoryMutation.mutate(currentCategory.id);
    }
  };

  const openEditDialog = (category: BlogCategory) => {
    setCurrentCategory(category);
    editForm.reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: BlogCategory) => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải danh mục...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý danh mục blog</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục blog</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số bài viết</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <code className="bg-muted rounded px-1.5 py-0.5 text-sm">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {category.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {category.isActive ? "Hoạt động" : "Ẩn"}
                      </span>
                    </TableCell>
                    <TableCell>{category.postsCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(category)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Chưa có danh mục blog nào. Hãy thêm danh mục mới.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm danh mục blog mới</DialogTitle>
            <DialogDescription>
              Tạo danh mục blog mới để phân loại các bài viết.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(handleAddCategory)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên danh mục" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="ten-danh-muc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả danh mục này" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={addForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Hoạt động
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Danh mục sẽ hiển thị với người dùng
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={addCategoryMutation.isPending}>
                  {addCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    'Thêm danh mục'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục blog</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin của danh mục blog hiện tại.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditCategory)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên danh mục</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên danh mục" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="ten-danh-muc" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Mô tả danh mục này" 
                        className="resize-none" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Hoạt động
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Danh mục sẽ hiển thị với người dùng
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending ? (
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
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              {currentCategory?.postsCount && currentCategory.postsCount > 0 ? 
                `Không thể xóa danh mục "${currentCategory.name}" vì có ${currentCategory.postsCount} bài viết đang sử dụng!` : 
                `Bạn có chắc chắn muốn xóa danh mục "${currentCategory?.name}"? Hành động này không thể hoàn tác.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={currentCategory?.postsCount && currentCategory.postsCount > 0 || deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlogCategories;
