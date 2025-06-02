import { apiRequest } from "./api-client";

// Types
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

// Authentication API methods
export const authService = {
  /**
   * Login with username and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>({
      method: "POST",
      url: "/api/auth/login",
      data,
    });
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>({
      method: "POST",
      url: "/api/auth/register",
      data,
    });
  },

  /**
   * Test authentication with current token
   */
  testAuth: async (): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>({
      method: "GET",
      url: "/api/auth/test",
    });
  },

  /**
   * Logout the current user (client-side only)
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Store authentication data in localStorage
   */
  setAuthData: (response: AuthResponse): void => {
    localStorage.setItem("token", response.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles,
      })
    );
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): AuthUser | null => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!userStr || !token) return null;

    try {
      return JSON.parse(userStr) as AuthUser;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      localStorage.removeItem("user"); // Clean up invalid data
      return null;
    }
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return !!user?.roles.includes(`ROLE_${role.toUpperCase()}`);
  },

  /**
   * Check if the user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};

export default authService;
