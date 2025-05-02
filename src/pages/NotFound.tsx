"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { useUser } from "@/context/UserContext"
import { Home } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()
  const { isAuthenticated, userRole } = useUser()

  // Determine where to navigate based on user role
  const handleNavigateHome = () => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    // Navigate to appropriate home based on role
    switch (userRole) {
      case 'admin':
        navigate('/admin')
        break
      case 'manager':
        navigate('/manager')
        break
      case 'finance':
        navigate('/finance')
        break
      default:
        navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">404</CardTitle>
          <CardDescription className="text-xl mt-2">Page Not Found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleNavigateHome}>
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}