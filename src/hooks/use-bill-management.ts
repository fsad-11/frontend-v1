import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  billService,
  Bill,
  CreateBillRequest,
  StatusUpdateRequest,
} from "@/services/bill-service";
import useApi from "@/hooks/use-api";

export const useBillManagement = () => {
  const { toast } = useToast();
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Get bills for current user (employee)
  const {
    data: myBills,
    isLoading: isLoadingMyBills,
    error: myBillsError,
    execute: fetchMyBills,
  } = useApi(billService.getMyBills);

  // Get pending bills (manager)
  const {
    data: pendingBills,
    isLoading: isLoadingPendingBills,
    error: pendingBillsError,
    execute: fetchPendingBills,
  } = useApi(billService.getPendingBills);

  // Get approved bills (finance)
  const {
    data: approvedBills,
    isLoading: isLoadingApprovedBills,
    error: approvedBillsError,
    execute: fetchApprovedBills,
  } = useApi(billService.getApprovedBills);

  // Get bill by ID
  const {
    data: billDetails,
    isLoading: isLoadingBillDetails,
    error: billDetailsError,
    execute: fetchBillDetails,
  } = useApi(billService.getBillById);

  // Create new bill
  const {
    isLoading: isSubmittingBill,
    error: submitBillError,
    execute: executeCreateBill,
  } = useApi(billService.createBill, {
    onSuccess: (data) => {
      toast({
        title: "Bill submitted successfully",
        description: `Your reimbursement request for ${data.title} has been submitted.`,
      });
      // Refresh my bills after successful submission
      fetchMyBills();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to submit bill",
        description:
          error.message ||
          "An error occurred while submitting your request. Please try again.",
      });
    },
  });

  // Create a bill
  const submitBill = async (billData: CreateBillRequest) => {
    return executeCreateBill(billData);
  };

  // Approve bill
  const {
    isLoading: isApprovingBill,
    error: approveBillError,
    execute: executeApproveBill,
  } = useApi(
    async ({ id, data }: { id: number; data: StatusUpdateRequest }) =>
      billService.approveBill(id, data),
    {
      onSuccess: () => {
        toast({
          title: "Bill approved",
          description:
            "The reimbursement request has been approved successfully.",
        });
        // Refresh pending bills after approval
        fetchPendingBills();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to approve bill",
          description:
            error.message ||
            "An error occurred while approving the request. Please try again.",
        });
      },
    }
  );

  // Approve a bill
  const approveBill = async (id: number, comments: string) => {
    return executeApproveBill({ id, data: { comments } });
  };

  // Reject bill
  const {
    isLoading: isRejectingBill,
    error: rejectBillError,
    execute: executeRejectBill,
  } = useApi(
    async ({ id, data }: { id: number; data: StatusUpdateRequest }) =>
      billService.rejectBill(id, data),
    {
      onSuccess: () => {
        toast({
          title: "Bill rejected",
          description: "The reimbursement request has been rejected.",
        });
        // Refresh pending bills after rejection
        fetchPendingBills();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to reject bill",
          description:
            error.message ||
            "An error occurred while rejecting the request. Please try again.",
        });
      },
    }
  );

  // Reject a bill
  const rejectBill = async (id: number, comments: string) => {
    return executeRejectBill({ id, data: { comments } });
  };

  // Close bill (finance)
  const {
    isLoading: isClosingBill,
    error: closeBillError,
    execute: executeCloseBill,
  } = useApi(
    async ({ id, data }: { id: number; data: StatusUpdateRequest }) =>
      billService.closeBill(id, data),
    {
      onSuccess: () => {
        toast({
          title: "Bill closed",
          description: "The reimbursement has been processed and closed.",
        });
        // Refresh approved bills after closing
        fetchApprovedBills();
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Failed to close bill",
          description:
            error.message ||
            "An error occurred while closing the request. Please try again.",
        });
      },
    }
  );

  // Close a bill
  const closeBill = async (id: number, comments: string) => {
    return executeCloseBill({ id, data: { comments } });
  };

  return {
    // Data
    myBills,
    pendingBills,
    approvedBills,
    billDetails,
    selectedBill,
    setSelectedBill,

    // Loading states
    isLoadingMyBills,
    isLoadingPendingBills,
    isLoadingApprovedBills,
    isLoadingBillDetails,
    isSubmittingBill,
    isApprovingBill,
    isRejectingBill,
    isClosingBill,

    // Error states
    myBillsError,
    pendingBillsError,
    approvedBillsError,
    billDetailsError,
    submitBillError,
    approveBillError,
    rejectBillError,
    closeBillError,

    // Actions
    fetchMyBills,
    fetchPendingBills,
    fetchApprovedBills,
    fetchBillDetails,
    submitBill,
    approveBill,
    rejectBill,
    closeBill,
  };
};

export default useBillManagement;
