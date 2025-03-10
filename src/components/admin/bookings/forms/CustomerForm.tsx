
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CustomerFormProps {
  booking: {
    customerName: string;
    email: string;
    phone: string;
    [key: string]: any;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerForm = ({ booking, handleInputChange }: CustomerFormProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Tên khách hàng</Label>
        <Input
          id="customerName"
          name="customerName"
          value={booking.customerName}
          onChange={handleInputChange}
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={booking.email}
          onChange={handleInputChange}
          placeholder="example@gmail.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          name="phone"
          value={booking.phone}
          onChange={handleInputChange}
          placeholder="0901234567"
        />
      </div>
    </div>
  );
};
