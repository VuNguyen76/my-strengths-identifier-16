
import { API_URL, getAuthHeaders } from "@/config/api";
import AuthService from "./auth.service";
import { toast } from "sonner";

interface ApiOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  showErrorToast?: boolean;
}

const defaultOptions: ApiOptions = {
  requiresAuth: true,
  showErrorToast: true,
};

class ApiService {
  // Generic request method with token refresh handling
  private async request<T>(
    url: string,
    method: string = 'GET',
    data?: any,
    options: ApiOptions = {}
  ): Promise<T> {
    const opts = { ...defaultOptions, ...options };
    
    try {
      // Check if authentication is required and token exists
      if (opts.requiresAuth) {
        const token = AuthService.getToken();
        
        if (!token) {
          throw new Error('Vui lòng đăng nhập để tiếp tục');
        }
        
        // Check if token is expired and refresh if needed
        if (AuthService.isTokenExpired(token)) {
          console.log("Token expired, refreshing...");
          const newToken = await AuthService.refreshToken();
          if (!newToken) {
            throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          }
        }
      }
      
      // Prepare request
      const requestOptions: RequestInit = {
        method,
        headers: {
          ...getAuthHeaders(),
          ...(opts.headers || {}),
        },
      };
      
      if (data) {
        requestOptions.body = JSON.stringify(data);
      }
      
      console.log(`Making ${method} request to ${url}`);
      const response = await fetch(`${API_URL}${url}`, requestOptions);
      
      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 401) {
          // Token might be invalid, try to refresh once
          console.log("Received 401, attempting token refresh");
          const refreshed = await AuthService.refreshToken();
          if (refreshed) {
            // Retry request with new token
            console.log("Token refreshed, retrying request");
            return this.request(url, method, data, options);
          } else {
            console.log("Refresh failed, logging out");
            AuthService.logout();
            throw new Error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
          }
        }
        
        // Extract error message from response if possible
        let errorMessage = 'Lỗi server';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Server error: ${response.status}`;
        } catch (e) {
          errorMessage = `Lỗi server: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
      
      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }
      
      // Parse JSON response
      try {
        const responseData = await response.json();
        return responseData as T;
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        return {} as T;
      }
    } catch (error) {
      // Show error toast if enabled
      if (opts.showErrorToast) {
        toast.error((error as Error).message || 'Đã xảy ra lỗi');
      }
      console.error("API Error:", error);
      throw error;
    }
  }
  
  // HTTP methods
  public get<T>(url: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(url, 'GET', undefined, options);
  }
  
  public post<T>(url: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(url, 'POST', data, options);
  }
  
  public put<T>(url: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(url, 'PUT', data, options);
  }
  
  public patch<T>(url: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(url, 'PATCH', data, options);
  }
  
  public delete<T>(url: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(url, 'DELETE', undefined, options);
  }
}

export default new ApiService();
