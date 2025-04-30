"use client"

import { useState } from "react"
import AppShell from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { mockBillRequests } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Check, Search, X } from "lucide-react"
import {Link} from "react-router-dom"

export default function Manager() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter for pending requests only
  const pendingRequests = mockBillRequests.filter((request) => request.status === "pending")

  // Filter based on search
  const filteredRequests = pendingRequests.filter(
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

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manager Review</h1>
          <p className="text-muted-foreground">Review and approve bill submissions from your team</p>
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
            <TabsTrigger value="pending">Pending Review ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {filteredRequests.length > 0 ? (
              <div className="grid gap-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {request.type} - {request.id}
                        </CardTitle>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <CardDescription>Submitted: {formatDate(request.submittedDate)}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                          <dd className="text-sm font-semibold">{formatAmount(request.amount)}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                          <dd className="text-sm font-semibold">{request.department}</dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">Employee</dt>
                          <dd className="text-sm font-semibold">John Doe</dd>
                        </div>
                      </dl>

                      <div className="mt-4">
                        <span className="text-sm font-medium text-muted-foreground">Description:</span>
                        <p className="text-sm mt-1">{request.description}</p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between pt-0">
                      <Link to={`/manager/review/${request.id}`}>
                        <Button variant="outline">Review Details</Button>
                      </Link>
                      <div className="flex gap-2">
                        <Button variant="outline" className="bg-red-50 hover:bg-red-100 text-red-600">
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button variant="outline" className="bg-green-50 hover:bg-green-100 text-green-600">
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
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

          <TabsContent value="all" className="mt-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">All requests history would appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
