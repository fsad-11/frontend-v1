import { useState, useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import BillRequestCard from "@/components/bill-request-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  AlertCircle,
  Loader2,
  Users,
  Settings,
  BarChart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBillManagement } from "@/hooks/use-bill-management";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { myBills, isLoadingMyBills, myBillsError, fetchMyBills } =
    useBillManagement();
  const { userRole } = useUser();

  const isAdmin = userRole === "admin";

  // Fetch bills on component mount if not admin
  useEffect(() => {
    if (!isAdmin) {
      fetchMyBills();
    }
  }, [fetchMyBills, isAdmin]);

  // Filter bills based on search
  const filteredBills = myBills?.filter(
    (bill) =>
      bill.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bill.manager &&
        `${bill.manager.firstName || ""} ${bill.manager.lastName || ""}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()))
  );

  // Admin dashboard content
  const renderAdminDashboard = () => (
    <>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and administrative actions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin" className="block">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User Management
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage Users</div>
              <p className="text-xs text-muted-foreground">
                Create, edit, and manage user accounts
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin" className="block">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Settings
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Configuration</div>
              <p className="text-xs text-muted-foreground">
                Manage system settings and preferences
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin" className="block">
          <Card className="h-full hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">System Analytics</div>
              <p className="text-xs text-muted-foreground">
                View usage statistics and system reports
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-4 mb-2">Recent Activity</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground text-center py-6">
              Activity log will be implemented here
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );

  // Employee dashboard content
  const renderEmployeeDashboard = () => (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            My Reimbursement Requests
          </h1>
          <p className="text-muted-foreground">
            View and manage your bill submission requests
          </p>
        </div>
        <Link to="/new-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </Link>
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

      {isLoadingMyBills ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : myBillsError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {myBillsError.message ||
              "Failed to load your reimbursement requests. Please try again."}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBills && filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <BillRequestCard
                key={bill.id}
                bill={bill}
                viewLink={`/request/${bill.id}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                {myBills && myBills.length > 0
                  ? "No matching requests found"
                  : "You don't have any reimbursement requests yet"}
              </p>
              <Link to="/new-request" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create new request
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {isAdmin ? renderAdminDashboard() : renderEmployeeDashboard()}
      </div>
    </AppShell>
  );
}
