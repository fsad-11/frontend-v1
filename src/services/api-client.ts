import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Get base URL from environment variable or use a default
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug("Adding token to request:", config.url);
    } else if (!token) {
      console.debug("No token found for request:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle expired tokens or authentication errors
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response?.data);

      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login page if not already there
      if (window.location.pathname !== "/") {
        console.debug("Redirecting to login due to 401 response");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

// Generic request function with error handling
export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error types
      const status = error.response?.status;
      const errorData = error.response?.data as
        | { message?: string }
        | undefined;

      // Create a more detailed error
      const enhancedError = new Error(
        errorData?.message || error.message || "An unknown error occurred"
      );

      // Add additional properties to the error
      Object.assign(enhancedError, {
        status,
        data: error.response?.data,
        isApiError: true,
      });

      throw enhancedError;
    }

    // For non-Axios errors
    throw error;
  }
};

export default apiClient;
