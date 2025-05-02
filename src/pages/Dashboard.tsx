"use client";

import { useState } from "react";
import AppShell from "@/components/layout/app-shell";
import BillRequestCard, {
  type BillRequest,
} from "@/components/bill-request-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockBillRequests } from "@/lib/utils";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [requests] = useState<BillRequest[]>([...mockBillRequests]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter requests based on search
  const filteredRequests = requests.filter(
    (request) =>
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.managerName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Open Requests
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <BillRequestCard
                key={request.id}
                request={request}
                viewLink={`/request/${request.id}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No requests found</p>
              <Link to="/new-request" className="mt-4 inline-block">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create new request
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
