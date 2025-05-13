import { useState } from "react"
import { CheckCircle, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Reimbursement = {
  id: string
  employee: string
  purpose: string
  amount: number
  date: string
  status: "Pending" | "Credited"
}

const initialData: Reimbursement[] = [
  {
    id: "RB201",
    employee: "Amit Kumar",
    purpose: "Client Visit",
    amount: 1800,
    date: "2025-05-08",
    status: "Pending",
  },
  {
    id: "RB202",
    employee: "Neha Sharma",
    purpose: "Training Travel",
    amount: 2300,
    date: "2025-05-09",
    status: "Pending",
  },
]

export default function FinanceCreditTab() {
  const [requests, setRequests] = useState<Reimbursement[]>(initialData)

  const handleCredit = (id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Credited" } : req
      )
    )
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Pending Reimbursements</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="mb-2 text-sm text-gray-500">#{req.id}</div>
            <h3 className="text-lg font-semibold">{req.purpose}</h3>
            <p className="text-sm text-muted-foreground">
              Employee: {req.employee}
            </p>
            <p className="text-sm mt-1">Date: {req.date}</p>
            <p className="text-sm mt-1 flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              {req.amount}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span
                className={cn(
                  "text-xs px-3 py-1 rounded-full font-medium",
                  req.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-700"
                )}
              >
                {req.status}
              </span>
              {req.status === "Pending" && (
                <Button
                  size="sm"
                  onClick={() => handleCredit(req.id)}
                  className="text-xs"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Credit
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}