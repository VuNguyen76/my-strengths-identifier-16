
import { API_URL, ENDPOINTS, getAuthHeaders } from "@/config/api";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  sub: string;
  exp: number;
  role: string;
  [key: string]: any;
}

export interface User {
  id?: string;
  username?: string;
  email?: string;
  fullName?: string;
  role?: string;
  profileImage?: string;
}

class AuthService {
  private refreshPromise: Promise<string | null> | null = null;

  // Check if token is expired
  public isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Invalid token format:", error);
      return true;
    }
  }

  // Get current user from localStorage
  public getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.logout();
      return null;
    }
  }

  // Get current user token
  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Get refresh token
  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Login user
  public async login(username: string, password: string): Promise<User> {
    const response = await fetch(`${API_URL}${ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Đăng nhập thất bại');
    }

    const data = await response.json();
    this.setAuthData(data);
    return data;
  }

  // Register user
  public async register(userData: any): Promise<User> {
    const response = await fetch(`${API_URL}${ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Đăng ký thất bại');
    }

    const data = await response.json();
    this.setAuthData(data);
    return data;
  }

  // Logout user
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Store authentication data
  private setAuthData(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify({
      username: data.username,
      email: data.email,
      fullName: data.fullName, 
      role: data.role,
      profileImage: data.profileImage
    }));
  }

  // Refresh token - implements debouncing for multiple calls
  public async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return null;
    }

    // If there's already a refresh in progress, return that promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    // Create a new refresh promise
    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}${ENDPOINTS.AUTH.REFRESH}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        this.setAuthData(data);
        return data.token;
      } catch (error) {
        console.error("Token refresh failed:", error);
        this.logout();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // Get user data from API
  public async getUserProfile(): Promise<User | null> {
    const token = this.getToken();
    
    if (!token) {
      return null;
    }

    try {
      // Check if token needs refresh
      if (this.isTokenExpired(token)) {
        const newToken = await this.refreshToken();
        if (!newToken) {
          return null;
        }
      }

      const response = await fetch(`${API_URL}${ENDPOINTS.AUTH.ME}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get user profile');
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }
}

export default new AuthService();
