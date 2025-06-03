"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { AlertCircle, Check, Loader2, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useBillManagement } from "@/hooks/use-bill-management";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Bill } from "@/services/bill-service";

export default function Manager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allBills, setAllBills] = useState<Bill[]>([]);
  const {
    pendingBills,
    fetchPendingBills,
    isLoadingPendingBills,
    pendingBillsError,
    approveBill,
    rejectBill,
    isApprovingBill,
    isRejectingBill,
    myBills,
    approvedBills,
    fetchMyBills
  } = useBillManagement();

  // State for approval/rejection dialog
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    billId: number | null;
    action: "approve" | "reject";
    comments: string;
  }>({
    isOpen: false,
    billId: null,
    action: "approve",
    comments: "",
  });

  // Fetch pending bills on component mount
  useEffect(() => {
    fetchPendingBills();
    fetchMyBills();
    // Combine all bills for search
    const combinedBills = [
      ...(pendingBills || []),
      ...(myBills || []),
      ...(approvedBills || []),
    ];
    setAllBills(combinedBills);
  }, []);

  // Filter based on search
  const filteredBills = allBills?.filter(
    (bill) =>
      bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.requester &&
        `${bill.requester.firstName} ${bill.requester.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Open the action dialog
  const openActionDialog = (bill: Bill, action: "approve" | "reject") => {
    setActionDialog({
      isOpen: true,
      billId: bill.id,
      action,
      comments: "",
    });
  };

  // Handle the action submission
  const handleActionSubmit = async () => {
    if (!actionDialog.billId || !actionDialog.comments) return;

    try {
      if (actionDialog.action === "approve") {
        await approveBill(actionDialog.billId, actionDialog.comments);
      } else {
        await rejectBill(actionDialog.billId, actionDialog.comments);
      }
      // Close dialog on success
      setActionDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Action error:", error);
      // Error is shown by the toast from the hook
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manager Review</h1>
          <p className="text-muted-foreground">
            Review and approve bill submissions from your team
          </p>
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
            <TabsTrigger value="pending">
              Pending Review ({pendingBills?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="all">All Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {isLoadingPendingBills ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : pendingBillsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {pendingBillsError.message ||
                    "Failed to load pending requests. Please try again."}
                </AlertDescription>
              </Alert>
            ) : filteredBills && filteredBills.length > 0 ? (
              <div className="grid gap-4">
                {filteredBills.map((bill) => (
                  <Card key={bill.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{bill.title}</CardTitle>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <CardDescription>
                        Submitted: {formatDate(bill.createdAt)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Amount
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatAmount(bill.amount)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Date
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatDate(bill.date)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Employee
                          </dt>
                          <dd className="text-sm font-semibold">
                            {bill.requester.firstName} {bill.requester.lastName}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          Description:
                        </span>
                        <p className="text-sm mt-1">{bill.description}</p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between pt-0">
                      <Link to={`/request/${bill.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-600"
                          onClick={() => openActionDialog(bill, "reject")}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-600"
                          onClick={() => openActionDialog(bill, "approve")}
                        >
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
                <p className="text-muted-foreground">
                  No pending requests found
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4">
          {allBills.length > 0 ? (
              <div className="grid gap-4">
                {allBills.map((bill) => (
                  <Card key={bill.id}>
                    <CardHeader className="pb-2">
                      {/* <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{bill.title}</CardTitle>
                        <Badge variant="outline">Pending</Badge>
                      </div> */}
                      <CardDescription>
                        Submitted: {formatDate(bill.createdAt)}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Amount
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatAmount(bill.amount)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Date
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatDate(bill.date)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Employee
                          </dt>
                          <dd className="text-sm font-semibold">
                            {bill.requester.firstName} {bill.requester.lastName}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4">
                        <span className="text-sm font-medium text-muted-foreground">
                          Description:
                        </span>
                        <p className="text-sm mt-1">{bill.description}</p>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between pt-0">
                      <Link to={`/request/${bill.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="bg-red-50 hover:bg-red-100 text-red-600"
                          onClick={() => openActionDialog(bill, "reject")}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-green-50 hover:bg-green-100 text-green-600"
                          onClick={() => openActionDialog(bill, "approve")}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
          ) : 
           (<div className="text-center py-12">
              <p className="text-muted-foreground">
                No requests found
              </p>
            </div>)
          }
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.isOpen}
        onOpenChange={(open) =>
          setActionDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve"
                ? "Approve Bill Request"
                : "Reject Bill Request"}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.action === "approve"
                ? "Please provide comments for approving this bill request."
                : "Please provide a reason for rejecting this bill request."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                placeholder={
                  actionDialog.action === "approve"
                    ? "Approved with the following comments..."
                    : "Reason for rejection..."
                }
                value={actionDialog.comments}
                onChange={(e) =>
                  setActionDialog((prev) => ({
                    ...prev,
                    comments: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleActionSubmit}
              disabled={
                !actionDialog.comments || isApprovingBill || isRejectingBill
              }
              variant={
                actionDialog.action === "approve" ? "default" : "destructive"
              }
            >
              {(actionDialog.action === "approve" && isApprovingBill) ||
              (actionDialog.action === "reject" && isRejectingBill) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {actionDialog.action === "approve"
                    ? "Approving..."
                    : "Rejecting..."}
                </>
              ) : actionDialog.action === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
