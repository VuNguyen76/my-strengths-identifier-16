
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Specialists from "./pages/Specialists";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import UserBookings from "./pages/user/Bookings";
import UserSettings from "./pages/user/Settings";
import UserHistory from "./pages/user/History";
import UserPayments from "./pages/user/Payments";
import AdminUsers from "./pages/admin/Users";
import AdminRoles from "./pages/admin/Roles";
import AdminBookings from "./pages/admin/Bookings";
import AdminSettings from "./pages/admin/Settings";
import AdminReports from "./pages/admin/Reports";
import AdminTransactions from "./pages/admin/Transactions";
import AdminStaff from "./pages/admin/Staff";
import ServicesAdmin from "./pages/admin/Services";
import ServiceCategories from "./pages/admin/ServiceCategories";
import Schedule from "./pages/admin/Schedule";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AdminBlogs from "./pages/admin/Blogs";
import BlogCategories from "./pages/admin/BlogCategories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/services" element={<Services />} />
          <Route path="/specialists" element={<Specialists />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          
          {/* User Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="bookings" element={<UserBookings />} />
            <Route path="history" element={<UserHistory />} />
            <Route path="payments" element={<UserPayments />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<DashboardLayout requiredRole="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="categories" element={<ServiceCategories />} />
            <Route path="specialists/schedule" element={<Schedule />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/categories" element={<BlogCategories />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
