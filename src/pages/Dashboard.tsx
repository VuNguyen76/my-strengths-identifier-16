
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import AuthService from "@/services/auth.service";
import ApiService from "@/services/api.service";
import { ENDPOINTS } from "@/config/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const token = AuthService.getToken();
        
        if (!token) {
          console.log("No token found, redirecting to login");
          toast.error("Bạn cần đăng nhập để truy cập trang này");
          navigate("/login");
          return;
        }
        
        // Check if token is expired
        if (AuthService.isTokenExpired(token)) {
          console.log("Token expired, attempting to refresh");
          // Try to refresh the token
          const newToken = await AuthService.refreshToken();
          if (!newToken) {
            console.log("Token refresh failed, redirecting to login");
            toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            navigate("/login");
            return;
          }
          console.log("Token refreshed successfully");
        }
        
        // Fetch user data from API
        console.log("Fetching user profile");
        const userData = await ApiService.get(ENDPOINTS.AUTH.ME);
        
        if (!userData) {
          console.log("No user data returned, logging out");
          toast.error("Không thể xác thực tài khoản");
          AuthService.logout();
          navigate("/login");
          return;
        }
        
        console.log("User data retrieved, redirecting based on role");
        // Redirect based on role
        if (userData.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else if (userData.role === "ROLE_STAFF") {
          navigate("/staff/dashboard");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Đã xảy ra lỗi khi xác thực. Vui lòng đăng nhập lại.");
        AuthService.logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndRedirect();
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-primary font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return null; // Actual rendering is handled by the redirect
};

export default Dashboard;
