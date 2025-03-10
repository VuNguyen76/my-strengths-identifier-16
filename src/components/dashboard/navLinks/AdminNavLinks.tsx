
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Users, Calendar, 
  ChevronDown, FilePlus, 
  ShieldCheck, BarChart, 
  CreditCard, BookOpen,
  UserCheck
} from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import SidebarNavLink from "../SidebarNavLink";

interface AdminNavLinksProps {
  isActiveLink: (path: string) => boolean;
}

export const AdminNavLinks = ({ isActiveLink }: AdminNavLinksProps) => {
  const location = useLocation();
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(() => {
    // Auto-open the correct section based on current path
    if (location.pathname.includes('/admin/users') || location.pathname.includes('/admin/roles')) {
      return 'users';
    } else if (location.pathname.includes('/admin/services') || location.pathname.includes('/admin/categories')) {
      return 'services';
    } else if (location.pathname.includes('/admin/staff') || location.pathname.includes('/admin/specialists')) {
      return 'specialists';
    } else if (location.pathname.includes('/admin/blogs')) {
      return 'blogs';
    }
    return null;
  });
  
  // Toggle collapsible sections
  const toggleCollapsible = (section: string) => {
    setOpenCollapsible(openCollapsible === section ? null : section);
  };

  return (
    <>
      <Collapsible open={openCollapsible === 'users'} onOpenChange={() => toggleCollapsible('users')}>
        <CollapsibleTrigger className="w-full px-6 py-3 flex items-center justify-between hover:bg-muted">
          <div className="flex items-center space-x-3">
            <Users size={20} />
            <span>Quản lý người dùng</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${openCollapsible === 'users' ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Link 
            to="/admin/users" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/users") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Danh sách người dùng</span>
          </Link>
          <Link 
            to="/admin/roles" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/roles") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Phân quyền</span>
          </Link>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openCollapsible === 'services'} onOpenChange={() => toggleCollapsible('services')}>
        <CollapsibleTrigger className="w-full px-6 py-3 flex items-center justify-between hover:bg-muted">
          <div className="flex items-center space-x-3">
            <FilePlus size={20} />
            <span>Quản lý dịch vụ</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${openCollapsible === 'services' ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Link 
            to="/admin/services" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/services") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Danh sách dịch vụ</span>
          </Link>
          <Link 
            to="/admin/categories" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/categories") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Danh mục dịch vụ</span>
          </Link>
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible open={openCollapsible === 'specialists'} onOpenChange={() => toggleCollapsible('specialists')}>
        <CollapsibleTrigger className="w-full px-6 py-3 flex items-center justify-between hover:bg-muted">
          <div className="flex items-center space-x-3">
            <UserCheck size={20} />
            <span>Quản lý chuyên viên</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${openCollapsible === 'specialists' ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Link 
            to="/admin/staff" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/staff") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Danh sách chuyên viên</span>
          </Link>
          <Link 
            to="/admin/specialists/schedule" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/specialists/schedule") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Lịch làm việc</span>
          </Link>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openCollapsible === 'blogs'} onOpenChange={() => toggleCollapsible('blogs')}>
        <CollapsibleTrigger className="w-full px-6 py-3 flex items-center justify-between hover:bg-muted">
          <div className="flex items-center space-x-3">
            <BookOpen size={20} />
            <span>Quản lý blog</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${openCollapsible === 'blogs' ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Link 
            to="/admin/blogs" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/blogs") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Danh sách bài viết</span>
          </Link>
          <Link 
            to="/admin/blogs/categories" 
            className={`pl-14 pr-6 py-2 flex items-center space-x-3 ${
              isActiveLink("/admin/blogs/categories") 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-muted"
            }`}
          >
            <span>Danh mục blog</span>
          </Link>
        </CollapsibleContent>
      </Collapsible>
      
      <SidebarNavLink 
        to="/admin/bookings" 
        icon={<Calendar size={20} />}
        isActive={isActiveLink("/admin/bookings")}
      >
        Lịch đặt
      </SidebarNavLink>
      
      <SidebarNavLink 
        to="/admin/reports" 
        icon={<BarChart size={20} />}
        isActive={isActiveLink("/admin/reports")}
      >
        Báo cáo & Thống kê
      </SidebarNavLink>
      
      <SidebarNavLink 
        to="/admin/transactions" 
        icon={<CreditCard size={20} />}
        isActive={isActiveLink("/admin/transactions")}
      >
        Giao dịch
      </SidebarNavLink>
    </>
  );
};
