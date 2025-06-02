import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import authService, { AuthUser } from "../services/auth-service";
import { useToast } from "../components/ui/use-toast";

export type UserRole = "employee" | "manager" | "finance" | "admin";

interface UserContextType {
  user: AuthUser | null;
  userRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

const defaultUserContext: UserContextType = {
  user: null,
  userRole: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  hasRole: () => false,
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentUser = authService.getCurrentUser();

        if (token && currentUser) {
          // Validate the token with the server
          try {
            await authService.testAuth();

            // If token is valid, set user data
            setUser(currentUser);
            setIsAuthenticated(true);

            // Determine primary role (first one in the array)
            const roleMapping: Record<string, UserRole> = {
              ROLE_EMPLOYEE: "employee",
              ROLE_MANAGER: "manager",
              ROLE_FINANCE: "finance",
              ROLE_ADMIN: "admin",
            };

            if (currentUser.roles && currentUser.roles.length > 0) {
              // Get first role that maps to our UserRole type
              for (const role of currentUser.roles) {
                const normalizedRole = roleMapping[role];
                if (normalizedRole) {
                  setUserRole(normalizedRole);
                  break;
                }
              }
            }
          } catch (tokenError) {
            console.error("Token validation failed:", tokenError);
            // If token validation fails, clear auth data
            authService.logout();
            setUser(null);
            setUserRole(null);
            setIsAuthenticated(false);
          }
        } else {
          // No token or user data found
          authService.logout();
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        // Clear potentially corrupted auth data
        authService.logout();
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authService.login({ username, password });

      // Save auth data
      authService.setAuthData(response);

      // Update context state
      setUser({
        id: response.id,
        username: response.username,
        email: response.email,
        roles: response.roles,
      });

      setIsAuthenticated(true);

      // Determine primary role
      if (response.roles && response.roles.length > 0) {
        const role = response.roles[0]
          .replace("ROLE_", "")
          .toLowerCase() as UserRole;
        setUserRole(role);
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.username}!`,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    return user?.roles.includes(`ROLE_${role.toUpperCase()}`) || false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
