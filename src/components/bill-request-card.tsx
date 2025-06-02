import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Bill } from "@/services/bill-service";

interface BillRequestCardProps {
  bill: Bill;
  viewLink: string;
}

export default function BillRequestCard({
  bill,
  viewLink,
}: BillRequestCardProps) {
  // Determine badge color based on status
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
            <div className="font-medium">{bill.title}</div>
            <Badge variant={getBadgeVariant(bill.status)}>
              {bill.status.charAt(0) + bill.status.slice(1).toLowerCase()}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {bill.description}
          </div>
          <div className="text-sm font-semibold">
            Amount: {formatAmount(bill.amount)}
          </div>
          <div className="text-sm text-muted-foreground">
            Submitted: {formatDate(bill.createdAt)}
          </div>
          <div className="text-sm text-muted-foreground">
            Date: {formatDate(bill.date)}
          </div>
          {bill.manager && (
            <div className="text-sm text-muted-foreground">
              Manager: {bill.manager.firstName} {bill.manager.lastName}
            </div>
          )}
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
