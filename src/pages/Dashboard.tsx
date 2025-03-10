
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  exp: number;
  role: string;
  [key: string]: any;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      toast.error("Bạn cần đăng nhập để truy cập trang này");
      navigate("/login");
      return;
    }
    
    try {
      // Check if token is expired
      const decodedToken = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token expired
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        navigate("/login");
        return;
      }
      
      // Fetch user data from API
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:8081/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          
          const userData = await response.json();
          localStorage.setItem("user", JSON.stringify(userData));
          
          // Redirect based on role
          if (userData.role === "ROLE_ADMIN") {
            navigate("/admin/dashboard");
          } else if (userData.role === "ROLE_STAFF") {
            navigate("/staff/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    } catch (error) {
      console.error("JWT validation error:", error);
      toast.error("Phiên đăng nhập không hợp lệ");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      navigate("/login");
      setLoading(false);
    }
  }, [navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  return null; // Actual rendering is handled by the redirect
};

export default Dashboard;
