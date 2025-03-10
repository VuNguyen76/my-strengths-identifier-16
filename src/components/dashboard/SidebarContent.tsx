import React from "react";
import { useLocation } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import SidebarNavLink from "./SidebarNavLink";
import { AdminNavLinks } from "./navLinks/AdminNavLinks";
import { UserNavLinks } from "./navLinks/UserNavLinks";

interface SidebarContentProps {
  user: any;
}

const SidebarContent = ({ user }: SidebarContentProps) => {
  const location = useLocation();
  
  // Check if current path matches link
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const isAdmin = user?.role === "admin";
  const dashboardBasePath = isAdmin ? "/admin" : "/dashboard";

  return (
    <div className="flex-1 py-6 space-y-1 overflow-y-auto">
      <SidebarNavLink 
        to={dashboardBasePath} 
        icon={<LayoutDashboard size={20} />} 
        isActive={isActiveLink(dashboardBasePath)}
      >
        Tổng quan
      </SidebarNavLink>
      
      {isAdmin ? (
        <AdminNavLinks isActiveLink={isActiveLink} />
      ) : (
        <UserNavLinks isActiveLink={isActiveLink} />
      )}
      
      <SidebarNavLink 
        to={isAdmin ? "/admin/settings" : "/dashboard/settings"} 
        icon={<Settings size={20} />}
        isActive={isActiveLink(isAdmin ? "/admin/settings" : "/dashboard/settings")}
      >
        Cài đặt
      </SidebarNavLink>
    </div>
  );
};

export default SidebarContent;
