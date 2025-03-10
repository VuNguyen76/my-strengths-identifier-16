
import { useState, useEffect } from "react";
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
import { Facebook, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginValues = z.infer<typeof loginSchema>;

// Facebook SDK initialization - Optimized with lazy loading
const initFacebookSDK = () => {
  if (window.FB) return Promise.resolve();
  
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("Facebook SDK loading timeout"));
    }, 5000); // Reduce timeout for better UX
    
    window.fbAsyncInit = function() {
      clearTimeout(timeoutId);
      window.FB.init({
        appId: '1343611270219538',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      resolve();
    };

    // Create script element only when needed
    const loadFBScript = () => {
      const fjs = document.getElementsByTagName('script')[0];
      if (document.getElementById('facebook-jssdk')) return;
      const js = document.createElement('script') as HTMLScriptElement;
      js.id = 'facebook-jssdk';
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.defer = true;
      js.async = true;
      js.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Failed to load Facebook SDK"));
      };
      fjs.parentNode?.insertBefore(js, fjs);
    };

    // Load FB script with requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadFBScript);
    } else {
      setTimeout(loadFBScript, 100);
    }
  });
};

// Google OAuth initialization - Optimized with promise and requestIdleCallback
const loadGoogleScript = () => {
  return new Promise<void>((resolve, reject) => {
    // Check if script already exists
    if (document.getElementById('google-login-sdk')) {
      return resolve();
    }
    
    const loadGScript = () => {
      const script = document.createElement('script');
      script.id = 'google-login-sdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (error) => reject(new Error(`Google SDK failed to load: ${error}`));
      document.head.appendChild(script);
    };

    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadGScript);
    } else {
      setTimeout(loadGScript, 100);
    }
  });
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [facebookSDKLoaded, setFacebookSDKLoaded] = useState(false);
  const [facebookSDKError, setFacebookSDKError] = useState<string | null>(null);
  const [googleSDKLoaded, setGoogleSDKLoaded] = useState(false);
  const [googleSDKError, setGoogleSDKError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    // Facebook SDK initialization
    const loadFacebook = async () => {
      try {
        await initFacebookSDK();
        if (mounted) {
          setFacebookSDKLoaded(true);
          console.log("Facebook SDK initialized successfully");
        }
      } catch (error) {
        if (mounted) {
          console.error("Error initializing Facebook SDK:", error);
          setFacebookSDKError((error as Error).message);
          toast.error("Không thể kết nối với Facebook. Vui lòng thử lại sau.");
        }
      }
    };
      
    // Google SDK initialization
    const loadGoogle = async () => {
      try {
        await loadGoogleScript();
        
        // Short delay to ensure script is fully loaded
        setTimeout(() => {
          if (!mounted) return;
          
          if (!window.google || !window.google.accounts) {
            throw new Error("Google accounts API not loaded properly");
          }
          
          try {
            window.google.accounts.id.initialize({
              client_id: "35156739608-j5hjt1e0v3a59et982igvj3l8ae2u7on.apps.googleusercontent.com",
              callback: handleGoogleCallback,
              auto_select: false,
              cancel_on_tap_outside: true,
              context: 'signin',
              ux_mode: 'popup',
            });
            if (mounted) {
              setGoogleSDKLoaded(true);
              console.log("Google SDK initialized successfully");
            }
          } catch (initError) {
            if (mounted) {
              console.error("Error during Google SDK initialization:", initError);
              setGoogleSDKError(String(initError));
              toast.error("Lỗi khi khởi tạo Google SDK. Vui lòng thử lại sau.");
            }
          }
        }, 300);
      } catch (error) {
        if (mounted) {
          console.error("Error loading Google SDK:", error);
          setGoogleSDKError((error as Error).message);
          toast.error("Không thể tải Google SDK. Vui lòng thử lại sau.");
        }
      }
    };
    
    // Prioritize core page loading, then load SDKs
    if (document.readyState === 'complete') {
      // Page already loaded, load SDKs right away
      loadFacebook();
      loadGoogle();
    } else {
      // Wait for page to load completely before loading SDKs
      window.addEventListener('load', () => {
        setTimeout(() => {
          loadFacebook();
          loadGoogle();
        }, 300);
      });
    }
      
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  const handleGoogleCallback = (response: any) => {
    try {
      console.log("Google response:", response);
      
      if (!response || !response.credential) {
        toast.error("Không nhận được thông tin xác thực từ Google");
        return;
      }

      setIsLoading(true);
      
      // Decode the JWT token
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { email, name, picture, sub } = JSON.parse(jsonPayload);
      
      console.log('Google login successful', { email, name });
      
      // Store user data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ 
        email,
        name,
        provider: "google",
        googleId: sub,
        picture,
        role: "user"
      }));
      
      setIsLoading(false);
      toast.success("Đăng nhập Google thành công!");
      
      // Navigate to home page - Use shorter timeout
      setTimeout(() => {
        navigate("/");
      }, 50);
    } catch (error) {
      console.error("Error processing Google login:", error);
      setIsLoading(false);
      toast.error("Đã xảy ra lỗi khi xử lý đăng nhập Google.");
    }
  };

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    setIsLoading(true);

    // Mock login simulation - Replace with actual API call
    setTimeout(() => {
      console.log("Login submitted:", values);
      
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ email: values.email, role: "user" }));
      
      setIsLoading(false);
      toast.success("Đăng nhập thành công!");
      
      setTimeout(() => {
        navigate("/");
      }, 50); // Use shorter timeout for better UX
    }, 600); // Reduce simulation time for better UX
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    
    if (!window.FB) {
      toast.error("Facebook SDK chưa được tải");
      setIsLoading(false);
      return;
    }
    
    window.FB.login((response) => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'name,email' }, (userInfo) => {
          console.log('Facebook login successful', userInfo);
          toast.success("Đăng nhập Facebook thành công!");
          
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify({ 
            email: userInfo.email || `${userInfo.id}@facebook.com`, 
            name: userInfo.name,
            provider: "facebook",
            facebookId: userInfo.id,
            role: "user"
          }));
          
          setIsLoading(false);
          
          setTimeout(() => {
            navigate("/");
          }, 50); // Use shorter timeout for better UX
        });
      } else {
        console.log('Facebook login cancelled');
        toast.error("Đăng nhập Facebook bị hủy");
        setIsLoading(false);
      }
    }, { scope: 'public_profile,email' });
  };

  const handleGmailLogin = () => {
    try {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        toast.error("Google SDK chưa được tải hoặc khởi tạo");
        return;
      }
      
      // For debugging
      console.log("Triggering Google sign-in prompt");
      
      // Render a custom Google button
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Google sign-in prompt not displayed:", notification.getNotDisplayedReason() || notification.getSkippedReason());
          // Fallback to standard prompt
          toast.error("Không thể hiển thị cửa sổ đăng nhập Google. Vui lòng thử lại sau.");
        } else {
          console.log("Google sign-in prompt displayed");
        }
      });
    } catch (error) {
      console.error("Error displaying Google sign-in:", error);
      toast.error("Đã xảy ra lỗi khi hiển thị đăng nhập Google");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 mt-16 animate-fade-in">
        <div className="w-full max-w-md">
          <AuthCard
            title="Đăng nhập"
            description="Nhập thông tin tài khoản của bạn"
          >
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button 
                variant="outline" 
                className="w-full bg-white text-blue-600 border-blue-200 hover:bg-blue-50" 
                onClick={handleFacebookLogin}
                disabled={isLoading || (!facebookSDKLoaded && facebookSDKError === null)}
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                Facebook
              </Button>
              <Button 
                variant="outline" 
                className="w-full bg-white text-red-500 border-red-200 hover:bg-red-50" 
                onClick={handleGmailLogin}
                disabled={isLoading || (!googleSDKLoaded && googleSDKError === null)}
              >
                <Mail className="mr-2 h-4 w-4 text-red-500" />
                Gmail
              </Button>
            </div>

            <div className="relative my-6">
              <Separator className="bg-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-xs text-gray-500">
                  Hoặc đăng nhập bằng email
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} className="bg-white border-gray-300" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white border-gray-300"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Đăng nhập"}
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm space-y-2">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng ký
                </Link>
              </p>
              <p className="text-gray-600">
                Đăng nhập quản trị viên?{" "}
                <Link
                  to="/admin/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Đăng nhập quản trị
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

// Types for Facebook SDK and Google SDK
declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
        }
      }
    };
  }
}

export default Login;
