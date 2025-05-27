import { apiRequest } from "./api-client";

// Types
export interface UserDetails {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  department?: string;
  managerId?: number;
}

// User management API methods (admin only)
export const userService = {
  /**
   * Get all users (admin only)
   */
  getAllUsers: async (): Promise<UserDetails[]> => {
    return apiRequest<UserDetails[]>({
      method: "GET",
      url: "/api/users",
    });
  },

  /**
   * Get user by ID (admin only)
   */
  getUserById: async (id: number): Promise<UserDetails> => {
    return apiRequest<UserDetails>({
      method: "GET",
      url: `/api/users/${id}`,
    });
  },

  /**
   * Update user (admin only)
   */
  updateUser: async (
    id: number,
    data: Partial<UserDetails>
  ): Promise<UserDetails> => {
    return apiRequest<UserDetails>({
      method: "PUT",
      url: `/api/users/${id}`,
      data,
    });
  },

  /**
   * Delete user (admin only)
   */
  deleteUser: async (id: number): Promise<void> => {
    return apiRequest<void>({
      method: "DELETE",
      url: `/api/users/${id}`,
    });
  },
};

export default userService;
