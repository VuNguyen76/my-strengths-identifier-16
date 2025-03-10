
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  servicesCount: number;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export const CategoryTable = ({ categories, onEdit, onDelete }: CategoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên danh mục</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Số dịch vụ</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length > 0 ? (
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>
                <div className="max-w-[300px] truncate">
                  {category.description}
                </div>
              </TableCell>
              <TableCell>{category.icon}</TableCell>
              <TableCell>{category.servicesCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Xóa
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10">
              Chưa có danh mục nào. Hãy tạo danh mục mới.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
