"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CreditCard, Loader2, Search } from "lucide-react";
import { useBillManagement } from "@/hooks/use-bill-management";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bill } from "@/services/bill-service";

export default function FinancePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    approvedBills,
    fetchApprovedBills,
    isLoadingApprovedBills,
    approvedBillsError,
    closeBill,
    isClosingBill,
  } = useBillManagement();

  // State for close dialog
  const [closeDialog, setCloseDialog] = useState<{
    isOpen: boolean;
    billId: number | null;
    comments: string;
  }>({
    isOpen: false,
    billId: null,
    comments: "",
  });

  // Fetch approved bills on component mount
  useEffect(() => {
    fetchApprovedBills();
  }, []);

  // Filter bills based on status
  const approvedOnly =
    approvedBills?.filter((bill) => bill.status === "APPROVED") || [];
  const closedOnly =
    approvedBills?.filter((bill) => bill.status === "CLOSED") || [];

  // Filter based on search
  const filteredApproved = approvedOnly.filter(
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

  // Open the close dialog
  const openCloseDialog = (bill: Bill) => {
    setCloseDialog({
      isOpen: true,
      billId: bill.id,
      comments: "",
    });
  };

  // Handle the dialog submission
  const handleCloseSubmit = async () => {
    if (!closeDialog.billId || !closeDialog.comments) return;

    try {
      await closeBill(closeDialog.billId, closeDialog.comments);
      // Dialog will close on success through useBillManagement hook
      setCloseDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error("Close bill error:", error);
      // Error is handled in useBillManagement hook
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finance Manager</h1>
          <p className="text-muted-foreground">
            Process approved bill requests and mark them as closed
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
              Pending Payment ({approvedOnly.length})
            </TabsTrigger>
            <TabsTrigger value="processed">
              Processed ({closedOnly.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {isLoadingApprovedBills ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : approvedBillsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {approvedBillsError.message ||
                    "Failed to load approved requests. Please try again."}
                </AlertDescription>
              </Alert>
            ) : filteredApproved.length > 0 ? (
              <div className="grid gap-4">
                {filteredApproved.map((bill) => (
                  <Card key={bill.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{bill.title}</CardTitle>
                        <Badge variant="success">Approved</Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                            Expense Date
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatDate(bill.date)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Submitted
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatDate(bill.createdAt)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Requester
                          </dt>
                          <dd className="text-sm font-semibold">
                            {bill.requester.firstName} {bill.requester.lastName}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>

                    <CardFooter className="justify-end pt-0">
                      <Button
                        variant="outline"
                        className="bg-green-50 hover:bg-green-100 text-green-600"
                        onClick={() => openCloseDialog(bill)}
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Mark as Paid
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No pending payment requests found
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="processed" className="mt-4">
            {isLoadingApprovedBills ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : closedOnly.length > 0 ? (
              <div className="grid gap-4">
                {closedOnly.map((bill) => (
                  <Card key={bill.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{bill.title}</CardTitle>
                        <Badge>Closed</Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <dl className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                            Expense Date
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatDate(bill.date)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Submitted
                          </dt>
                          <dd className="text-sm font-semibold">
                            {formatDate(bill.createdAt)}
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium text-muted-foreground">
                            Requester
                          </dt>
                          <dd className="text-sm font-semibold">
                            {bill.requester.firstName} {bill.requester.lastName}
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No processed requests found
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Close Dialog */}
      <Dialog
        open={closeDialog.isOpen}
        onOpenChange={(open) =>
          setCloseDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Bill as Paid</DialogTitle>
            <DialogDescription>
              Please provide payment details for this bill request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comments">Payment Details</Label>
              <Textarea
                id="comments"
                placeholder="Payment reference number, date, or other important details..."
                value={closeDialog.comments}
                onChange={(e) =>
                  setCloseDialog((prev) => ({
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
                setCloseDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleCloseSubmit}
              disabled={!closeDialog.comments || isClosingBill}
            >
              {isClosingBill ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Payment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
