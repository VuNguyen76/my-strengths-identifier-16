
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token) {
      try {
        // Check if token is expired
        const decodedToken: any = jwtDecode(token);
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
        
        // Token valid, check user data
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
          
          // Redirect based on role
          if (userData.role === "ROLE_ADMIN") {
            navigate("/admin");
          } else if (userData.role === "ROLE_STAFF") {
            navigate("/staff");
          } else {
            navigate("/user/dashboard");
          }
        } else {
          toast.error("Dữ liệu người dùng không hợp lệ");
          navigate("/login");
        }
      } catch (error) {
        console.error("JWT validation error:", error);
        toast.error("Phiên đăng nhập không hợp lệ");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Bạn cần đăng nhập để truy cập trang này");
      navigate("/login");
      setLoading(false);
    }
  }, [navigate]);

  // Loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  return null; // Actual rendering is handled by the redirect
};

export default Dashboard;
