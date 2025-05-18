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
  import { Trash2, Phone, RefreshCw } from "lucide-react";
  import { useToast } from "@/hooks/use-toast";

  // Import the API functions from your API client
  import { getAllCalls, updateCallStatus, deleteCall } from "../services/api.ts"; // Update this import path

  interface CallRequest {
    _id: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    status: "pending" | "completed" | "rejected";
    createdAt: string;
  }

  const CallRequests = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Use the API client functions instead of direct fetch
    const { data: calls = [], isLoading } = useQuery({
      queryKey: ["callRequests"],
      queryFn: getAllCalls,
    });

    const updateStatusMutation = useMutation({
      mutationFn: ({ id, status }: { id: string; status: string }) =>
        updateCallStatus(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["callRequests"] });
        toast({ title: "Status updated successfully" });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const deleteCallMutation = useMutation({
      mutationFn: deleteCall,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["callRequests"] });
        toast({ title: "Call request deleted successfully" });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

    const handleRefresh = () => {
      setIsRefreshing(true);
      queryClient.invalidateQueries({ queryKey: ["callRequests"] }).then(() => {
        setIsRefreshing(false);
        toast({ title: "Data refreshed" });
      });
    };

    const getStatusVariant = (status: string) => {
      switch (status) {
        case "pending":
          return "outline";
        case "rejected":
          return "secondary";
        case "completed":
          return "default";
        default:
          return "outline";
      }
    };

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Call Requests</CardTitle>
              <CardDescription>
                Manage customer call back requests
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
            ) : calls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No call requests found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call: CallRequest) => (
                    <TableRow key={call._id}>
                      <TableCell className="font-medium">{call.name}</TableCell>
                      <TableCell>
                        <div>{call.phone}</div>
                        <div className="text-sm text-muted-foreground">
                          {call.email}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {call.message}
                      </TableCell>
                      <TableCell>
                        {new Date(call.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={call.status}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({
                              id: call._id,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={`w-[120px] ${
                              updateStatusMutation.isPending &&
                              updateStatusMutation.variables?.id === call._id
                                ? "opacity-50"
                                : ""
                            }`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
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
                          >
                            <a href={`tel:${call.phone}`} aria-label="Call">
                              <Phone size={16} />
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
                                  Delete Call Request
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this call
                                  request? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    deleteCallMutation.mutate(call._id)
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

  export default CallRequests;