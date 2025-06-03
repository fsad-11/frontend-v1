"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CalendarIcon } from "lucide-react";
import { useBillManagement } from "@/hooks/use-bill-management";
import { useUser } from "@/context/UserContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function NewRequest() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { submitBill, isSubmittingBill, submitBillError } = useBillManagement();
  const [billDate, setBillDate] = useState<Date | undefined>(new Date());

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    receiptUrl: "https://example.com/receipts/new.pdf", // In a real app, you'd upload this to a storage service
  });

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!billDate) {
      return;
    }

    try {
      await submitBill({
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: billDate.toISOString(),
        receiptUrl: formData.receiptUrl,
      });

      // On successful submission, navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      // Error is handled by the useBillManagement hook
      console.error("Submission error:", error);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight mb-6">
          New Reimbursement Request
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Reimbursement Request Form</CardTitle>
            <CardDescription>
              Fill out the details below to submit a new reimbursement request
            </CardDescription>
          </CardHeader>

          {submitBillError && (
            <Alert variant="destructive" className="mx-6 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {submitBillError.message ||
                  "An error occurred while submitting your request. Please try again."}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {user && (
                <div className="space-y-2">
                  <Label>Employee Name</Label>
                  <Input
                    value={`${user.username} (${user.email})`}
                    readOnly
                    disabled
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief title for your expense"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Expense Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !billDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {billDate ? (
                        format(billDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={billDate}
                      onSelect={setBillDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about this expense"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="receiptUrl">Receipt URL</Label>
                <Input
                  id="receiptUrl"
                  name="receiptUrl"
                  type="text"
                  value={formData.receiptUrl}
                  onChange={handleChange}
                  placeholder="URL to your receipt image/PDF"
                />
                {/* <p className="text-sm text-muted-foreground mt-1">
                  In a real app, you would upload the receipt file instead
                </p> */}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmittingBill}>
                {isSubmittingBill ? "Submitting..." : "Submit Request"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
