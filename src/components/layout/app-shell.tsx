"use client";

import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Home,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  User,
  Users,
  FileText,
  CreditCard,
  Layout,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

// Define the navigation items
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["employee"],
  },
  {
    name: "New Request",
    href: "/new-request",
    icon: PlusCircle,
    roles: ["employee"],
  },
  // {
  //   name: "My Requests",
  //   href: "/dashboard",
  //   icon: FileText,
  //   roles: ["employee"],
  // },
  {
    name: "Pending Approvals",
    href: "/manager",
    icon: FileText,
    roles: ["manager"],
  },
  {
    name: "Financial Overview",
    href: "/finance",
    icon: CreditCard,
    roles: ["finance"],
  },
  {
    name: "Admin Panel",
    href: "/admin",
    icon: Layout,
    roles: ["admin"],
  },
  // {
  //   name: "User Management",
  //   href: "/admin",
  //   icon: Users,
  //   roles: ["admin"],
  // },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, userRole, logout } = useUser();
  const [notifications] = useState(3); // Example notification count
  const navigate = useNavigate();

  // Get the user's name
  const userName = user?.username || "";

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex h-14 items-center border-b px-4">
              <span className="font-bold text-lg">Bill System</span>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <ul className="space-y-1 px-2">
                {filteredNavigation.map((item) => (
                  <Link to={item.href} key={item.name}>
                    <Button
                      variant={"ghost"}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </ul>
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>
                    {(userName && userName.charAt(0).toUpperCase()) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userName || "User"}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userRole || "guest"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col h-full border-r bg-white">
          <div className="flex h-14 items-center border-b px-4">
            <span className="font-bold text-lg">Bill System</span>
          </div>
          <nav className="flex-1 overflow-auto py-4">
            <ul className="space-y-1 px-2">
              {filteredNavigation.map((item) => (
                <Link to={item.href} key={item.name}>
                  <Button
                    variant={"ghost"}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>
                  {(userName && userName.charAt(0).toUpperCase()) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{userName || "User"}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {userRole || "guest"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 md:px-6">
          <div className="ml-auto flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {notifications}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>
                      {(userName && userName.charAt(0).toUpperCase()) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
