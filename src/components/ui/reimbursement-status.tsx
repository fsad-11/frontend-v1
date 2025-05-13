import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { TableIcon, LayoutGrid } from "lucide-react"

const mockData = [
  {
    id: "RB123",
    title: "Travel to Client",
    amount: 450,
    date: "2025-05-01",
    status: "Approved",
  },
  {
    id: "RB124",
    title: "Hotel Stay",
    amount: 1200,
    date: "2025-05-02",
    status: "Pending",
  },
  {
    id: "RB125",
    title: "Conference Ticket",
    amount: 800,
    date: "2025-05-03",
    status: "Rejected",
  },
]

export default function ReimbursementStatus() {
  const [view, setView] = useState<"card" | "table">("card")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Reimbursement Status</h2>
        <div className="flex gap-2">
          <Button
            variant={view === "card" ? "default" : "outline"}
            onClick={() => setView("card")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" /> Cards
          </Button>
          <Button
            variant={view === "table" ? "default" : "outline"}
            onClick={() => setView("table")}
          >
            <TableIcon className="h-4 w-4 mr-2" /> Table
          </Button>
        </div>
      </div>

      {view === "card" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockData.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="font-semibold text-lg mb-1">{item.title}</div>
              <div className="text-sm text-muted-foreground mb-2">
                Submitted: {item.date}
              </div>
              <div className="text-sm">Amount: ₹{item.amount}</div>
              <div
                className={cn(
                  "mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium",
                  item.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-800"
                )}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-auto rounded-lg border">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.title}</td>
                  <td className="px-4 py-2">₹{item.amount}</td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        item.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}