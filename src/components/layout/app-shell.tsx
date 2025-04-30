"use client";

import type React from "react";

import { useState } from "react";
import {
  Bell,
  Home,
  LogOut,
  Menu,
  Plus,
  Settings,
  User,
  FileText,
  Users,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigation: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["employee", "manager", "finance", "admin"],
  },
  {
    name: "New Request",
    href: "/new-request",
    icon: Plus,
    roles: ["employee", "admin"],
  },
  {
    name: "Pending Reviews",
    href: "/manager",
    icon: FileText,
    roles: ["manager", "admin"],
  },
  {
    name: "Finance Review",
    href: "/finance",
    icon: CreditCard,
    roles: ["finance", "admin"],
  },
  { name: "Admin Panel", href: "/admin", icon: Users, roles: ["admin"] },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["employee", "manager", "finance", "admin"],
  },
];

export default function AppShell({
  children,
  // userRole = "employee", // Default to employee role
  userRole = "admin", // Show admin role by default for testing
}: {
  children: React.ReactNode;
  userRole?: "employee" | "manager" | "finance" | "admin";
}) {
  const [notifications] = useState(3); // Example notification count

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole),
  );

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
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                ))}
              </ul>
            </nav>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
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
                <Button
                  variant={"ghost"}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Button>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500 capitalize">{userRole}</p>
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
                    <AvatarFallback>JD</AvatarFallback>
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
                <DropdownMenuItem>
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
