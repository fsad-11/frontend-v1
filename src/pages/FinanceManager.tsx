"use client"

import { useState } from "react"
import AppShell from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockBillRequests, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Search } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"

export default function FinancePage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")

  // Filter for approved requests
  const approvedRequests = mockBillRequests.filter((request) => request.status === "approved")

  // Filter for credited/closed requests
  const creditedRequests = mockBillRequests.filter(
    (request) => request.status === "credited" || request.status === "closed",
  )

  // Filter based on search
  const filteredApproved = approvedRequests.filter(
    (request) =>
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Handle mark as credited action
  const handleMarkAsCredited = async (id: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast({
      title: "Request credited",
      description: `Request #${id} has been marked as credited`,
    })
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance Manager</h1>
          <p className="text-muted-foreground">Process approved bill requests and mark them as credited</p>
        </div>

        <div className="flex w-full items-center space-x-2 max-w-sm">
          <Input
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="icon" className="h-9 w-9">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Credit ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="processed">Processed ({creditedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {filteredApproved.length > 0 ? (
              <div className="grid gap-4">
                {filteredApproved.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {request.type} - {request.id}
                        </CardTitle>
                        <Badge variant="success">Approved</Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                          <dd className="text-sm font-semibold">{formatAmount(request.amount)}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                          <dd className="text-sm font-semibold">{request.department}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Submitted</dt>
                          <dd className="text-sm font-semibold">{formatDate(request.submittedDate)}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Approved By</dt>
                          <dd className="text-sm font-semibold">{request.managerName}</dd>
                        </div>
                      </dl>
                    </CardContent>

                    <CardFooter className="justify-end pt-0">
                      <Button
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-600"
                        onClick={() => handleMarkAsCredited(request.id)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Mark as Credited
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No pending requests found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="processed" className="mt-4">
            {creditedRequests.length > 0 ? (
              <div className="grid gap-4">
                {creditedRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {request.type} - {request.id}
                        </CardTitle>
                        <Badge>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                          <dd className="text-sm font-semibold">{formatAmount(request.amount)}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                          <dd className="text-sm font-semibold">{request.department}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Submitted</dt>
                          <dd className="text-sm font-semibold">{formatDate(request.submittedDate)}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Processed Date</dt>
                          <dd className="text-sm font-semibold">Apr 15, 2025</dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No processed requests found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
