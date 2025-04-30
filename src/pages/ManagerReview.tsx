"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AppShell from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { mockBillRequests, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X } from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"

export default function ManagerReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  // Get the request by ID
  const request = mockBillRequests.find((req) => req.id === id)

  // State for review actions
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!request) {
    navigate("/manager")
    return null
  }

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Handle action submission
  const handleSubmitAction = async () => {
    if (!actionType || !comment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: actionType === "approve" ? "Request approved" : "Request rejected",
      description: "The request has been processed successfully",
    })

    setIsSubmitting(false)
    navigate("/manager")
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Button variant="outline" className="mb-6" onClick={() => navigate("/manager")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Review Request #{request.id}</CardTitle>
                <CardDescription>Submitted on {formatDate(request.submittedDate)}</CardDescription>
              </div>
              <Badge variant="outline">Pending</Badge>
            </div>
          </CardHeader>

          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Employee</dt>
                <dd className="text-sm font-semibold mt-1">John Doe</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Department</dt>
                <dd className="text-sm font-semibold mt-1">{request.department}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                <dd className="text-sm font-semibold mt-1">{request.type}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                <dd className="text-sm font-semibold mt-1">{formatAmount(request.amount)}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                <dd className="text-sm mt-1">{request.description}</dd>
              </div>
            </dl>
          </CardContent>

          <CardFooter className="justify-between border-t pt-6">
            <Button variant="outline" onClick={() => navigate("/manager")}>
              Cancel
            </Button>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 text-red-600"
                    onClick={() => setActionType("reject")}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reject Request</DialogTitle>
                    <DialogDescription>Please provide a reason for rejecting this request.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Enter your comments..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setComment("")}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleSubmitAction}
                      disabled={!comment.trim() || isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Confirm Rejection"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 text-green-600"
                    onClick={() => setActionType("approve")}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Request</DialogTitle>
                    <DialogDescription>Add any comments before approving this request.</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Textarea
                      placeholder="Enter your comments (optional)..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setComment("")}>
                      Cancel
                    </Button>
                    <Button variant="default" onClick={handleSubmitAction} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Confirm Approval"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppShell>
  )
}
