import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, FileText, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import API service functions
import { getAllPayments, updatePaymentStatus, deletePayment } from "../services/api.ts";

interface PaymentRequest {
  _id: string;
  name: string;
  phone: string;
  school: string;
  sem: string;
  status: "pending" | "verified" | "rejected";
  courseCode: string;
  paid: number;
  proof: string;
  couponCode?: string;
  originalAmount?: number;
  discountAmount?: number;
  couponPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

const PaymentRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ["paymentRequests"],
    queryFn: getAllPayments,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updatePaymentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentRequests"] });
      toast({ title: "Status updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentRequests"] });
      toast({ title: "Payment request deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete payment",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["paymentRequests"] }).then(() => {
      setIsRefreshing(false);
      toast({ title: "Data refreshed" });
    });
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "pending":
        return "outline";
      case "verified":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Log payments for debugging
  if (payments) {
    console.log("Payments data:", payments);
  }

  // Handle API error
  if (error) {
    return (
      <div className="flex justify-center py-8 text-red-500">
        Failed to load payment requests: {error.message}
      </div>
    );
  }

  console.log(payments)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Payment Requests</CardTitle>
            <CardDescription>
              Manage course payment verification requests
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading...</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payment requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Original Amount</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Coupon</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment: PaymentRequest) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      <div className="font-medium">{payment.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.phone}
                      </div>
                    </TableCell>
                    <TableCell>{payment.courseCode}</TableCell>
                    <TableCell>
                      {payment.originalAmount !== undefined
                        ? `₹${payment.originalAmount.toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {payment.discountAmount !== undefined
                        ? `₹${payment.discountAmount.toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {payment.paid !== undefined
                        ? `₹${payment.paid.toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {payment.couponCode ? `${payment.couponCode}` : "Direct"}
                    </TableCell>
                    <TableCell>
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={payment.status}
                        onValueChange={(value) =>
                          updateStatusMutation.mutate({
                            id: payment._id,
                            status: value,
                          })
                        }
                      >
                        <SelectTrigger
                          className={`w-[120px] ${
                            updateStatusMutation.isPending &&
                            updateStatusMutation.variables?.id === payment._id
                              ? "opacity-50"
                              : ""
                          }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="View Payment Proof"
                        >
                          <a
                            href={payment.proof}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText size={16} />
                          </a>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Trash2 size={16} className="text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Payment Request
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this payment
                                request? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deletePaymentMutation.mutate(payment._id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentRequests;