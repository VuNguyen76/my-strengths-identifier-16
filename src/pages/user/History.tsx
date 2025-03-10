
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Star, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BOOKING_STATUSES } from "@/components/booking/constants";

interface BookingHistory {
  id: number;
  serviceName: string;
  specialistName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  price: number;
  rating?: number;
  feedback?: string;
}

const UserHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const queryClient = useQueryClient();
  
  // Fetch booking history
  const { data: bookingHistory, isLoading, isError } = useQuery({
    queryKey: ['bookingHistory'],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch('http://localhost:8081/api/bookings/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Không thể tải lịch sử đặt lịch");
      }
      
      return response.json();
    }
  });

  // Rating mutation
  const ratingMutation = useMutation({
    mutationFn: async ({ bookingId, rating, feedback }: { bookingId: number, rating: number, feedback?: string }) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating, feedback })
      });
      
      if (!response.ok) {
        throw new Error("Không thể gửi đánh giá");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingHistory'] });
      toast.success("Đánh giá của bạn đã được ghi nhận!");
      setRatingDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Lỗi khi gửi đánh giá: ${error.message}`);
    }
  });

  // Feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: async ({ bookingId, feedback }: { bookingId: number, feedback: string }) => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        throw new Error("Không tìm thấy token đăng nhập");
      }
      
      const response = await fetch(`http://localhost:8081/api/bookings/${bookingId}/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback })
      });
      
      if (!response.ok) {
        throw new Error("Không thể gửi phản hồi");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookingHistory'] });
      toast.success("Phản hồi của bạn đã được gửi!");
      setFeedbackDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Lỗi khi gửi phản hồi: ${error.message}`);
    }
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case BOOKING_STATUSES.COMPLETED:
        return <Badge className="bg-green-500">Hoàn thành</Badge>;
      case BOOKING_STATUSES.CANCELLED:
        return <Badge className="bg-red-500">Đã hủy</Badge>;
      case BOOKING_STATUSES.CONFIRMED:
        return <Badge className="bg-blue-500">Đã xác nhận</Badge>;
      case BOOKING_STATUSES.PENDING:
        return <Badge className="bg-yellow-500">Đang chờ</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  const getRatingStars = (rating: number | undefined, interactive = false, itemId?: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              (interactive ? hoverRating || currentRating : rating || 0) >= star 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && setCurrentRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  const openRatingDialog = (bookingId: number) => {
    setSelectedService(bookingId);
    setCurrentRating(0);
    setHoverRating(0);
    setFeedbackText("");
    setRatingDialogOpen(true);
  };

  const openFeedbackDialog = (bookingId: number) => {
    const booking = bookingHistory?.find(item => item.id === bookingId);
    setSelectedService(bookingId);
    setFeedbackText(booking?.feedback || "");
    setFeedbackDialogOpen(true);
  };

  const submitRating = () => {
    if (selectedService) {
      ratingMutation.mutate({ 
        bookingId: selectedService, 
        rating: currentRating, 
        feedback: feedbackText 
      });
    }
  };

  const submitFeedback = () => {
    if (selectedService) {
      feedbackMutation.mutate({
        bookingId: selectedService,
        feedback: feedbackText
      });
    }
  };

  const filteredHistory = bookingHistory ? bookingHistory.filter((item: BookingHistory) => {
    if (activeTab === "all") return true;
    if (activeTab === "rated") return Boolean(item.rating);
    if (activeTab === "unrated") return !item.rating && item.status === BOOKING_STATUSES.COMPLETED;
    return true;
  }) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Lịch sử dịch vụ</h1>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="rated">Đã đánh giá</TabsTrigger>
          <TabsTrigger value="unrated">Chưa đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử sử dụng dịch vụ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isError ? (
                <div className="py-8 text-center text-red-500">
                  Không thể tải lịch sử dịch vụ. Vui lòng thử lại sau.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Chuyên viên</TableHead>
                      <TableHead>Ngày giờ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item: BookingHistory) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.serviceName}</TableCell>
                          <TableCell>{item.specialistName}</TableCell>
                          <TableCell>
                            {format(new Date(`${item.bookingDate}T${item.bookingTime}`), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}
                          </TableCell>
                          <TableCell>
                            {item.rating ? (
                              getRatingStars(item.rating)
                            ) : (
                              <span className="text-sm text-muted-foreground">Chưa đánh giá</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {item.status === BOOKING_STATUSES.COMPLETED && !item.rating && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center"
                                  onClick={() => openRatingDialog(item.id)}
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Đánh giá
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center"
                                onClick={() => openFeedbackDialog(item.id)}
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Phản hồi
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Không có lịch sử dịch vụ nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Đánh giá dịch vụ</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex flex-col items-center space-y-4">
            <p className="text-center text-muted-foreground">Bạn đánh giá như thế nào về dịch vụ này?</p>
            <div className="flex justify-center">
              {getRatingStars(0, true)}
            </div>
            <Textarea 
              placeholder="Nhập phản hồi của bạn (tùy chọn)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRatingDialogOpen(false)}
              disabled={ratingMutation.isPending}
            >
              Hủy
            </Button>
            <Button 
              onClick={submitRating} 
              disabled={currentRating === 0 || ratingMutation.isPending}
            >
              {ratingMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đánh giá"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Phản hồi dịch vụ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Nhập phản hồi của bạn"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={6}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setFeedbackDialogOpen(false)} 
              disabled={feedbackMutation.isPending}
            >
              Hủy
            </Button>
            <Button 
              onClick={submitFeedback} 
              disabled={!feedbackText.trim() || feedbackMutation.isPending}
            >
              {feedbackMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi phản hồi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserHistory;
