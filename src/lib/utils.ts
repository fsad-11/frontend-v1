import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

// Mock bill request data
export const mockBillRequests = [
  {
    id: "BIL-1001",
    type: "Travel Expense",
    amount: 450.75,
    status: "pending",
    submittedDate: "2025-04-12T10:30:00Z",
    managerName: "Sarah Johnson",
    description: "Flight tickets for client meeting in Boston",
    department: "Sales",
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
  {
    id: "BIL-1002",
    type: "Office Supplies",
    amount: 125.3,
    status: "approved",
    submittedDate: "2025-04-10T14:15:00Z",
    managerName: "Sarah Johnson",
    description: "Printer toner and paper supplies",
    department: "Marketing",
    documentUrl: null
  },
  {
    id: "BIL-1003",
    type: "Client Lunch",
    amount: 89.5,
    status: "rejected",
    submittedDate: "2025-04-08T12:45:00Z",
    managerName: "Michael Chen",
    description: "Client lunch meeting at Downtown Cafe",
    department: "Sales",
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
  {
    id: "BIL-1004",
    type: "Software License",
    amount: 299.99,
    status: "approved",
    submittedDate: "2025-04-05T09:20:00Z",
    managerName: "Sarah Johnson",
    description: "Annual license for design software",
    department: "Engineering",
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
  {
    id: "BIL-1005",
    type: "Conference Fee",
    amount: 750.0,
    status: "credited",
    submittedDate: "2025-04-01T16:30:00Z",
    managerName: "Michael Chen",
    description: "Registration for industry conference",
    department: "Product",
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
  {
    id: "BIL-1006",
    type: "Equipment Repair",
    amount: 215.45,
    status: "closed",
    submittedDate: "2025-03-28T11:10:00Z",
    managerName: "Sarah Johnson",
    description: "Repair for office printer",
    department: "Operations",
    documentUrl: "https://pdfobject.com/pdf/sample.pdf"
  },
] as const;

// Mock employees data
export const mockEmployees = [
  {
    id: "EMP-1001",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    role: "Employee",
    manager: "Sarah Johnson",
  },
  {
    id: "EMP-1002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Marketing",
    role: "Employee",
    manager: "Michael Chen",
  },
  {
    id: "EMP-1003",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    department: "Sales",
    role: "Manager",
    manager: "",
  },
  {
    id: "EMP-1004",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    department: "Engineering",
    role: "Manager",
    manager: "",
  },
  {
    id: "EMP-1005",
    name: "David Williams",
    email: "david.williams@example.com",
    department: "Finance",
    role: "Finance Manager",
    manager: "",
  },
  {
    id: "EMP-1006",
    name: "Lisa Garcia",
    email: "lisa.garcia@example.com",
    department: "HR",
    role: "Admin",
    manager: "",
  },
] as const;

// Departments in the organization
export const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
  "Product",
  "Customer Support",
] as const;

// Bill types
export const billTypes = [
  "Travel Expense",
  "Office Supplies",
  "Software License",
  "Hardware Purchase",
  "Client Lunch",
  "Conference Fee",
  "Training Materials",
  "Equipment Repair",
  "Team Building",
  "Professional Services",
] as const;
