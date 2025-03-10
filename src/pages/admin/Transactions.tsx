
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Download, Search, Filter, Eye, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/api.service";
import { ENDPOINTS } from "@/config/api";

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  customer: string;
  service: string;
  specialist: string;
  amount: number;
  status: "completed" | "pending" | "failed" | "refunded";
  paymentMethod: string;
}

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const itemsPerPage = 10;

  // Query transactions with React Query
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', statusFilter, dateRange],
    queryFn: async () => {
      try {
        let endpoint = ENDPOINTS.DASHBOARD.ADMIN + '/transactions';
        
        // Add query parameters
        const params = new URLSearchParams();
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }
        if (dateRange?.from) {
          params.append('startDate', dateRange.from.toISOString().split('T')[0]);
        }
        if (dateRange?.to) {
          params.append('endDate', dateRange.to.toISOString().split('T')[0]);
        }
        
        const queryString = params.toString();
        if (queryString) {
          endpoint = `${endpoint}?${queryString}`;
        }
        
        const data = await ApiService.get<Transaction[]>(endpoint);
        return data || [];
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("Không thể tải dữ liệu giao dịch");
        return [];
      }
    },
    refetchOnWindowFocus: false
  });

  // Apply search filter
  const filteredTransactions = transactions.filter((transaction) => {
    // Apply text search
    const matchesSearch =
      searchTerm === "" ||
      transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.service?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Thất bại</Badge>;
      case "refunded":
        return <Badge className="bg-purple-500">Hoàn tiền</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Function to export transactions to Excel
  const exportToExcel = () => {
    try {
      // Format the data for Excel
      const excelData = filteredTransactions.map(transaction => ({
        'ID Giao dịch': transaction.transactionId,
        'Ngày': format(new Date(transaction.date), "dd/MM/yyyy HH:mm"),
        'Khách hàng': transaction.customer,
        'Dịch vụ': transaction.service,
        'Chuyên viên': transaction.specialist,
        'Số tiền': transaction.amount,
        'Trạng thái': transaction.status === 'completed' ? 'Hoàn thành' : 
                    transaction.status === 'pending' ? 'Đang xử lý' : 
                    transaction.status === 'failed' ? 'Thất bại' : 
                    transaction.status === 'refunded' ? 'Hoàn tiền' : 'Không xác định',
        'Phương thức': transaction.paymentMethod
      }));

      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Giao dịch");

      // Generate Excel file and download
      XLSX.writeFile(workbook, "bao-cao-giao-dich.xlsx");
      toast.success("Xuất Excel thành công!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Có lỗi khi xuất Excel!");
    }
  };

  // Generate PDF for viewing the transaction
  const viewTransaction = (id: string) => {
    // For demonstration, just show a toast
    toast.info(`Đang hiển thị hóa đơn: ${id}`);
    
    // In real implementation, this would open a dialog or generate a PDF
    // For now, we'll just simulate it
    setTimeout(() => {
      toast.success(`Đã mở hóa đơn cho giao dịch ${id}`);
    }, 500);
  };

  // Apply date filter
  const handleDateRangeApply = () => {
    if (dateRange?.from && dateRange?.to) {
      toast.success(`Đã lọc giao dịch từ ${format(dateRange.from, "dd/MM/yyyy")} đến ${format(dateRange.to, "dd/MM/yyyy")}`);
    }
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange(undefined);
    toast.success("Đã xóa bộ lọc ngày");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Quản lý giao dịch</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from && dateRange?.to ? (
                  <>
                    {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                    {format(dateRange.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  <span>Lọc theo ngày</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="flex items-center p-3 border-t border-border">
                {dateRange?.from && dateRange?.to && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearDateFilter}
                    className="mr-auto"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
                <Button size="sm" onClick={handleDateRangeApply}>
                  Áp dụng
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Giao dịch thanh toán</CardTitle>
          <CardDescription>Quản lý tất cả các giao dịch thanh toán trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo ID, khách hàng, dịch vụ..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[180px]">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="refunded">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Đang tải dữ liệu...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Giao dịch</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead>Chuyên viên</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.transactionId}
                        </TableCell>
                        <TableCell>
                          {format(new Date(transaction.date), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.service}</TableCell>
                        <TableCell>{transaction.specialist}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(transaction.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => viewTransaction(transaction.id)}
                              title="Xem hóa đơn"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={exportToExcel}
                              title="Tải hóa đơn"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6">
                        {searchTerm ? "Không tìm thấy giao dịch nào" : "Chưa có giao dịch nào"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
                
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum = i + 1;
                  
                  // If we have more than 5 pages, show appropriate page numbers
                  if (totalPages > 5) {
                    if (currentPage > 3 && currentPage < totalPages - 1) {
                      pageNum = currentPage - 2 + i;
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                  
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationEllipsis />
                )}
                
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
