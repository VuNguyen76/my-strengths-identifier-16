
import React from "react";
import { Calendar, FileText, CreditCard, Settings } from "lucide-react";
import SidebarNavLink from "../SidebarNavLink";

interface UserNavLinksProps {
  isActiveLink: (path: string) => boolean;
}

export const UserNavLinks = ({ isActiveLink }: UserNavLinksProps) => {
  return (
    <>
      <SidebarNavLink 
        to="/dashboard/bookings" 
        icon={<Calendar size={20} />}
        isActive={isActiveLink("/dashboard/bookings")}
      >
        Lịch đặt của tôi
      </SidebarNavLink>
      
      <SidebarNavLink 
        to="/dashboard/history" 
        icon={<FileText size={20} />}
        isActive={isActiveLink("/dashboard/history")}
      >
        Lịch sử dịch vụ
      </SidebarNavLink>
      
      <SidebarNavLink 
        to="/dashboard/payments" 
        icon={<CreditCard size={20} />}
        isActive={isActiveLink("/dashboard/payments")}
      >
        Thanh toán
      </SidebarNavLink>
    </>
  );
};
