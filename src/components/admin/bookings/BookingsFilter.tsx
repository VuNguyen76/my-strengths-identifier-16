
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BOOKING_STATUSES } from "@/components/booking/constants";

interface BookingsFilterProps {
  activeTab: string;
  searchTerm: string;
  showCancelled: boolean;
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onShowCancelledChange: (value: boolean) => void;
}

export const BookingsFilter = ({
  activeTab,
  searchTerm,
  showCancelled,
  onTabChange,
  onSearchChange,
  onShowCancelledChange
}: BookingsFilterProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm lịch đặt..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="show-cancelled"
            checked={showCancelled}
            onCheckedChange={onShowCancelledChange}
          />
          <Label htmlFor="show-cancelled">Hiển thị đã hủy</Label>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value={BOOKING_STATUSES.PENDING}>Chờ xác nhận</TabsTrigger>
          <TabsTrigger value={BOOKING_STATUSES.CONFIRMED}>Đã xác nhận</TabsTrigger>
          <TabsTrigger value={BOOKING_STATUSES.COMPLETED}>Hoàn thành</TabsTrigger>
          <TabsTrigger value={BOOKING_STATUSES.CANCELLED}>Đã hủy</TabsTrigger>
        </TabsList>
      </Tabs>
    </>
  );
};
