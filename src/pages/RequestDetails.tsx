"use client";

import { useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useBillManagement } from "@/hooks/use-bill-management";
import { PDFViewer } from "@/components/ui/pdf-viewer";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    fetchBillDetails,
    billDetails,
    isLoadingBillDetails,
    billDetailsError,
  } = useBillManagement();

  useEffect(() => {
    if (id) {
      fetchBillDetails(parseInt(id, 10));
    }
  }, [id]);

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "outline";
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      case "CLOSED":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {isLoadingBillDetails ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : billDetailsError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {billDetailsError.message ||
                "Failed to load the request details. Please try again."}
            </AlertDescription>
          </Alert>
        ) : billDetails ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                {billDetails.title}
              </CardTitle>
              <Badge variant={getBadgeVariant(billDetails.status)}>
                {billDetails.status.charAt(0) +
                  billDetails.status.slice(1).toLowerCase()}
              </Badge>
            </CardHeader>

            <CardContent className="pt-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    ID
                  </dt>
                  <dd className="text-sm font-semibold mt-1">
                    {billDetails.id}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Amount
                  </dt>
                  <dd className="text-sm font-semibold mt-1">
                    {formatAmount(billDetails.amount)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Expense Date
                  </dt>
                  <dd className="text-sm font-semibold mt-1">
                    {formatDate(billDetails.date)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Submission Date
                  </dt>
                  <dd className="text-sm font-semibold mt-1">
                    {formatDate(billDetails.createdAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    Requester
                  </dt>
                  <dd className="text-sm font-semibold mt-1">
                    {billDetails.requester.firstName}{" "}
                    {billDetails.requester.lastName}
                  </dd>
                </div>

                {billDetails.manager && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      Manager
                    </dt>
                    <dd className="text-sm font-semibold mt-1">
                      {billDetails.manager.firstName}{" "}
                      {billDetails.manager.lastName}
                    </dd>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Description
                  </dt>
                  <dd className="text-sm mt-1">{billDetails.description}</dd>
                </div>

                {billDetails.history && billDetails.history.length > 0 && (
                  <div className="sm:col-span-2 mt-4">
                    <dt className="text-sm font-medium text-muted-foreground mb-2">
                      Status History
                    </dt>
                    <dd>
                      <ul className="space-y-2">
                        {billDetails.history.map((item) => (
                          <li
                            key={item.id}
                            className="text-sm border-l-2 pl-3 py-1"
                          >
                            <div className="font-medium">
                              {item.status.charAt(0) +
                                item.status.slice(1).toLowerCase()}
                            </div>
                            <div className="text-muted-foreground">
                              {item.comments} - by {item.username} on{" "}
                              {formatDate(item.timestamp)}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Document PDF Viewer */}
              {billDetails.receiptUrl && (
                <div className="mt-8">
                  <h3 className="text-md font-medium mb-3">
                    Supporting Document
                  </h3>
                  <PDFViewer
                    url={billDetails.receiptUrl}
                    title={`Receipt for ${billDetails.title}`}
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Request not found. The ID may be invalid.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </AppShell>
  );
}
