import React, { createContext, useState, useContext, ReactNode } from "react";

type UserRole = "employee" | "manager" | "finance" | "admin";

interface UserContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const defaultUserContext: UserContextType = {
  userRole: "employee",
  setUserRole: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  userName: "",
  setUserName: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userRole, setUserRole] = useState<UserRole>("employee");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <UserContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        userName,
        setUserName,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};