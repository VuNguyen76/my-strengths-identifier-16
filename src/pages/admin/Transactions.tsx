
import { useState, useEffect } from "react";
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
import { Calendar as CalendarIcon, Download, Search, Filter, Eye } from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const transactionsData = [
  {
    id: "TX12345",
    date: "2023-06-15T09:30:00",
    customer: "Nguyễn Văn A",
    service: "Chăm sóc da cơ bản",
    specialist: "Trần Thị B",
    amount: 450000,
    status: "completed",
    paymentMethod: "Thẻ tín dụng",
  },
  {
    id: "TX12346",
    date: "2023-06-15T14:00:00",
    customer: "Lê Văn C",
    service: "Trị mụn chuyên sâu",
    specialist: "Phạm Văn D",
    amount: 650000,
    status: "completed",
    paymentMethod: "Tiền mặt",
  },
  {
    id: "TX12347",
    date: "2023-06-16T10:15:00",
    customer: "Hoàng Thị E",
    service: "Trẻ hóa da",
    specialist: "Nguyễn Thị F",
    amount: 850000,
    status: "completed",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "TX12348",
    date: "2023-06-16T16:30:00",
    customer: "Đỗ Văn G",
    service: "Massage mặt",
    specialist: "Lý Thị H",
    amount: 350000,
    status: "pending",
    paymentMethod: "Thẻ tín dụng",
  },
  {
    id: "TX12349",
    date: "2023-06-17T11:00:00",
    customer: "Trịnh Văn I",
    service: "Tẩy trang chuyên sâu",
    specialist: "Bùi Thị K",
    amount: 250000,
    status: "completed",
    paymentMethod: "Tiền mặt",
  },
  {
    id: "TX12350",
    date: "2023-06-17T13:45:00",
    customer: "Lương Thị L",
    service: "Trị nám",
    specialist: "Vũ Văn M",
    amount: 750000,
    status: "failed",
    paymentMethod: "Thẻ tín dụng",
  },
  {
    id: "TX12351",
    date: "2023-06-18T09:00:00",
    customer: "Mai Văn N",
    service: "Chăm sóc da cơ bản",
    specialist: "Đinh Thị O",
    amount: 450000,
    status: "completed",
    paymentMethod: "Chuyển khoản",
  },
  {
    id: "TX12352",
    date: "2023-06-18T15:30:00",
    customer: "Cao Thị P",
    service: "Trị mụn chuyên sâu",
    specialist: "Đặng Văn Q",
    amount: 650000,
    status: "refunded",
    paymentMethod: "Thẻ tín dụng",
  },
  {
    id: "TX12353",
    date: "2023-06-19T10:30:00",
    customer: "Lâm Văn R",
    service: "Trẻ hóa da",
    specialist: "Hà Thị S",
    amount: 850000,
    status: "completed",
    paymentMethod: "Tiền mặt",
  },
  {
    id: "TX12354",
    date: "2023-06-19T14:15:00",
    customer: "Trương Văn T",
    service: "Massage mặt",
    specialist: "Ngô Thị U",
    amount: 350000,
    status: "pending",
    paymentMethod: "Chuyển khoản",
  },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsData);
  const itemsPerPage = 10;

  // Apply filters whenever any filter changes
  useEffect(() => {
    // Apply filters
    const filtered = transactionsData.filter((transaction) => {
      // Apply text search
      const matchesSearch =
        searchTerm === "" ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.service.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      // Apply date filter
      let matchesDate = true;
      if (dateRange.from && dateRange.to) {
        const transactionDate = parseISO(transaction.date);
        matchesDate = isWithinInterval(transactionDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      }

      return matchesSearch && matchesStatus && matchesDate;
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, dateRange]);

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
        'ID Giao dịch': transaction.id,
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
      const transaction = transactionsData.find(t => t.id === id);
      if (transaction) {
        toast.success(`Đã mở hóa đơn cho giao dịch ${id}`);
      }
    }, 500);
  };

  // Apply date filter
  const handleDateRangeApply = () => {
    if (dateRange.from && dateRange.to) {
      toast.success(`Đã lọc giao dịch từ ${format(dateRange.from, "dd/MM/yyyy")} đến ${format(dateRange.to, "dd/MM/yyyy")}`);
    }
  };

  // Clear date filter
  const clearDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
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
                {dateRange.from && dateRange.to ? (
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
                {dateRange.from && dateRange.to && (
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
                        {transaction.id}
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
                      Không tìm thấy giao dịch nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious href="#" />
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationEllipsis />
              <PaginationNext href="#" />
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
