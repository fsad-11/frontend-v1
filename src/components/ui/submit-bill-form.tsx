import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CalendarIcon, UploadCloud } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function SubmitBillForm() {
  const [date, setDate] = useState<Date | undefined>()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError("")

    const form = e.currentTarget
    const formData = new FormData(form)

    if (date) formData.append("date", date.toISOString())
    if (file) formData.append("file", file)

    try {
      const res = await fetch("/api/reimbursements", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to submit form")
      }

      setSuccess(true)
      form.reset()
      setDate(undefined)
      setFile(null)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="E.g., Travel to client site" required />
      </div>

      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Date of Expense</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the expense"
        />
      </div>

      <div>
        <Label htmlFor="billUpload">Upload Bill</Label>
        <Input
          id="billUpload"
          name="bill"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && (
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            <UploadCloud className="h-4 w-4" /> {file.name}
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">Reimbursement submitted!</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Submitting..." : "Submit Reimbursement"}
      </Button>
    </form>
  )
}