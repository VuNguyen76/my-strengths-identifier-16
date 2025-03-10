
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

// Service category schema
const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên danh mục phải có ít nhất 2 ký tự",
  }),
  description: z.string().optional(),
  icon: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  servicesCount: number;
}

interface EditCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onEditCategory: (values: CategoryFormValues) => void;
  isLoading: boolean;
}

export const EditCategoryDialog = ({ 
  isOpen, 
  onOpenChange, 
  category,
  onEditCategory, 
  isLoading 
}: EditCategoryDialogProps) => {
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      icon: "",
    },
  });

  // Update form values when category changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description,
        icon: category.icon,
      });
    }
  }, [category, form]);

  const handleSubmit = (values: CategoryFormValues) => {
    onEditCategory(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa danh mục dịch vụ</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin của danh mục dịch vụ hiện tại.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên icon" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
