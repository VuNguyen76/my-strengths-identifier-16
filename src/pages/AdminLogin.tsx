
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ApiService from "@/services/api.service";
import { ENDPOINTS } from "@/config/api";
import AuthService from "@/services/auth.service";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);

    try {
      // Use real API instead of mock data
      const response = await ApiService.post(ENDPOINTS.AUTH.LOGIN, {
        username: values.email,
        password: values.password
      }, { requiresAuth: false });
      
      if (!response || !response.token) {
        throw new Error("Đăng nhập thất bại");
      }
      
      // Save auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken || '');
      localStorage.setItem('user', JSON.stringify({
        email: values.email,
        role: response.role,
        fullName: response.fullName,
        username: response.username
      }));
      
      toast.success("Đăng nhập thành công!");
      
      // Redirect based on role
      if (response.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (response.role === "ROLE_STAFF") {
        navigate("/staff/dashboard");
      } else {
        toast.error("Bạn không có quyền truy cập trang quản trị");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error((error as Error).message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 mt-16">
        <div className="w-full max-w-md">
          <AuthCard
            title="Đăng nhập quản trị"
            description="Dành cho quản trị viên và nhân viên"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              <p>
                Đăng nhập dành cho khách hàng?{" "}
                <Link
                  to="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Trang đăng nhập
                </Link>
              </p>
            </div>
          </AuthCard>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
