import { apiRequest } from "./api-client";

// Types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface HistoryItem {
  id: number;
  status: BillStatus;
  comments: string;
  timestamp: string;
  username: string;
}

export type BillStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";

export interface Bill {
  id: number;
  title: string;
  description: string;
  amount: number;
  status: BillStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
  receiptUrl: string;
  requester: User;
  manager?: User;
  history: HistoryItem[];
}

export interface CreateBillRequest {
  title: string;
  description: string;
  amount: number;
  date: string;
  receiptUrl: string;
}

export interface StatusUpdateRequest {
  comments: string;
}

// Bill/Reimbursement API methods
export const billService = {
  /**
   * Submit a new bill reimbursement request
   */
  createBill: async (data: CreateBillRequest): Promise<Bill> => {
    return apiRequest<Bill>({
      method: "POST",
      url: "/api/bills",
      data,
    });
  },

  /**
   * Get all bills for the current user
   */
  getMyBills: async (): Promise<Bill[]> => {
    return apiRequest<Bill[]>({
      method: "GET",
      url: "/api/bills/mine",
    });
  },

  /**
   * Get pending bills (for managers)
   */
  getPendingBills: async (): Promise<Bill[]> => {
    return apiRequest<Bill[]>({
      method: "GET",
      url: "/api/bills/pending",
    });
  },

  /**
   * Get approved bills (for finance)
   */
  getApprovedBills: async (): Promise<Bill[]> => {
    return apiRequest<Bill[]>({
      method: "GET",
      url: "/api/bills/approved",
    });
  },

  /**
   * Get a specific bill by ID
   */
  getBillById: async (id: number): Promise<Bill> => {
    return apiRequest<Bill>({
      method: "GET",
      url: `/api/bills/${id}`,
    });
  },

  /**
   * Approve a bill (manager action)
   */
  approveBill: async (id: number, data: StatusUpdateRequest): Promise<Bill> => {
    return apiRequest<Bill>({
      method: "PATCH",
      url: `/api/bills/${id}/approve`,
      data,
    });
  },

  /**
   * Reject a bill (manager action)
   */
  rejectBill: async (id: number, data: StatusUpdateRequest): Promise<Bill> => {
    return apiRequest<Bill>({
      method: "PATCH",
      url: `/api/bills/${id}/reject`,
      data,
    });
  },

  /**
   * Close a bill (finance action)
   */
  closeBill: async (id: number, data: StatusUpdateRequest): Promise<Bill> => {
    return apiRequest<Bill>({
      method: "PATCH",
      url: `/api/bills/${id}/close`,
      data,
    });
  },
};

export default billService;
