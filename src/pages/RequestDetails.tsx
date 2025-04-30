"use client"

import { useState, useEffect } from "react"
import AppShell from "@/components/layout/app-shell"
import { formatDate, mockBillRequests } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"
import { useParams, useNavigate } from "react-router-dom"

export default function RequestDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { toast } = useToast()

    // Find the request by ID
    const [request] = useState(mockBillRequests.find((req) => req.id === id))

    useEffect(() => {
        if (!request) {
            toast({
                variant: "destructive",
                title: "Request not found",
                description: "The requested bill could not be found",
            })
            navigate("/dashboard")
        }
    }, [request, navigate, toast])

    // Format amount for display
    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    // Badge color based on status
    const getBadgeVariant = (status: string) => {
        switch (status) {
            case "pending":
                return "outline"
            case "approved":
                return "success"
            case "rejected":
                return "destructive"
            case "credited":
            case "closed":
                return "default"
            default:
                return "secondary"
        }
    }

    if (!request) return null

    return (
        <AppShell>
            <div className="mx-auto max-w-3xl">
                <Button variant="outline" className="mb-6" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-2xl font-bold">Request #{request.id}</CardTitle>
                        <Badge variant={getBadgeVariant(request.status)}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                    </CardHeader>

                    <CardContent className="pt-6">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                                <dd className="text-sm font-semibold mt-1">{request.type}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                                <dd className="text-sm font-semibold mt-1">{formatAmount(request.amount)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                                <dd className="text-sm font-semibold mt-1">{request.department}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Submission Date</dt>
                                <dd className="text-sm font-semibold mt-1">{formatDate(request.submittedDate)}</dd>
                            </div>

                            <div>
                                <dt className="text-sm font-medium text-muted-foreground">Manager</dt>
                                <dd className="text-sm font-semibold mt-1">{request.managerName}</dd>
                            </div>

                            <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                                <dd className="text-sm mt-1">{request.description}</dd>
                            </div>
                        </dl>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-6">
                        <Button variant="outline" onClick={() => navigate("/dashboard")}>
                            Return to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </AppShell>
    )
}
