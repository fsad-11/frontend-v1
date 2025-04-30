import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

export interface BillRequest {
  id: string;
  type: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "credited" | "closed";
  submittedDate: string;
  managerName: string;
  description?: string;
  department?: string;
}

interface BillRequestCardProps {
  request: BillRequest;
  viewLink: string;
}

export default function BillRequestCard({
  request,
  viewLink,
}: BillRequestCardProps) {
  // Determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "outline";
      case "approved":
        return "success";
      case "rejected":
        return "destructive";
      case "credited":
      case "closed":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Bill #{request.id}</div>
            <Badge
              variant={
                getBadgeVariant(request.status) as
                  | "outline"
                  | "success"
                  | "destructive"
                  | "default"
                  | "secondary"
                  | null
                  | undefined
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Type: {request.type}
          </div>
          <div className="text-sm font-semibold">
            Amount: {formatAmount(request.amount)}
          </div>
          <div className="text-sm text-muted-foreground">
            Submitted: {formatDate(request.submittedDate)}
          </div>
          <div className="text-sm text-muted-foreground">
            Manager: {request.managerName}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={viewLink} className="w-full">
          <Button variant="outline" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
