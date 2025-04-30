"use client";

import type React from "react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // This is a mock login - in a real app, you'd authenticate against your backend
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (email.includes("admin")) {
        navigate("/admin");
      } else if (email.includes("finance")) {
        navigate("/finance");
      } else if (email.includes("manager")) {
        navigate("/manager");
      } else {
        navigate("/dashboard");
      }

      toast({
        title: "Login successful",
        description: "Welcome to the Bill Submission System",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <image
              src="/placeholder.svg?height=80&width=80"
              alt="Organization Logo"
              width={80}
              height={80}
              className="mb-4"
            />
          </div>
          <h1 className="text-2xl font-bold text-black">
            Bill Submission System
          </h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-800">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-gray-50 text-gray-900"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-600">
                Password
              </Label>
              {/* <a href="#" className="text-sm text-blue-600 hover:underline" >
                Forgot password?
              </a> */}
            </div>
            <Input
              id="password"
              type="password"
              className="bg-gray-50 text-gray-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 text-white hover:bg-gray-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>© 2025 Your Organization. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
