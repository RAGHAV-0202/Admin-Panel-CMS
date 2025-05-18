
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCoupons, createCoupon, deleteCoupon } from "../services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Coupons = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(location.search.includes('new=true'));
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  
  // Form state
  const [code, setCode] = useState("");
  const [offPercentage, setOffPercentage] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: getAllCoupons,
  });

  const createCouponMutation = useMutation({
    mutationFn: createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({
        title: "Coupon Created",
        description: "The coupon has been created successfully",
      });
      resetForm();
      setIsCreating(false);
      navigate('/coupons', { replace: true });
    },
    onError: (error) => {
      console.error("Failed to create coupon:", error);
      toast({
        title: "Error",
        description: "Failed to create coupon",
        variant: "destructive",
      });
    },
  });

  const deleteCouponMutation = useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast({
        title: "Coupon Deleted",
        description: "The coupon has been deleted successfully",
      });
      setCouponToDelete(null);
    },
    onError: (error) => {
      console.error("Failed to delete coupon:", error);
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !offPercentage) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const couponData = {
      code,
      offPercentage: Number(offPercentage),
      ...(maxDiscount && { maxDiscount: Number(maxDiscount) }),
    };

    createCouponMutation.mutate(couponData);
  };

  const handleDelete = () => {
    if (couponToDelete) {
      deleteCouponMutation.mutate(couponToDelete);
    }
  };

  const resetForm = () => {
    setCode("");
    setOffPercentage("");
    setMaxDiscount("");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new coupon code
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Coupon Code*</Label>
                  <Input
                    id="code"
                    placeholder="e.g. SUMMER20"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="offPercentage">Discount Percentage*</Label>
                  <Input
                    id="offPercentage"
                    type="number"
                    placeholder="e.g. 20"
                    value={offPercentage}
                    onChange={(e) => setOffPercentage(e.target.value)}
                    min="1"
                    max="100"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxDiscount">Max Discount (Optional)</Label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="e.g. 500"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  resetForm();
                  setIsCreating(false);
                  navigate('/coupons', { replace: true });
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCouponMutation.isPending}>
                  {createCouponMutation.isPending ? "Creating..." : "Create Coupon"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading coupons...</div>
      ) : coupons?.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No coupons found</p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Coupon
          </Button>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount %</TableHead>
                <TableHead>Max Discount</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coupons?.map((coupon: any) => (
                <TableRow key={coupon._id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell>{coupon.offPercentage}%</TableCell>
                  <TableCell>
                    {coupon.maxDiscount ? `₹${coupon.maxDiscount}` : "-"}
                  </TableCell>
                  <TableCell>
                    {new Date(coupon.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500"
                          onClick={() => setCouponToDelete(coupon._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the coupon code "{coupon.code}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={handleDelete}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Coupons;
