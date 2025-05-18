import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllNotifications, createNotification, deleteNotification } from "../services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

const Notifications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(location.search.includes('new=true'));
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewNotification, setPreviewNotification] = useState(null);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  
  // Form state
  const [text, setText] = useState("");
  const [secondaryText, setSecondaryText] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [image, setImage] = useState("");
  const [isCoupon, setIsCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getAllNotifications,
  });

  console.log(notifications)

  const createNotificationMutation = useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification Created",
        description: "The notification has been created successfully",
      });
      resetForm();
      setIsCreating(false);
      navigate('/notification', { replace: true });
    },
    onError: (error) => {
      console.error("Failed to create notification:", error);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification Deleted",
        description: "The notification has been deleted successfully",
      });
      setNotificationToDelete(null);
    },
    onError: (error) => {
      console.error("Failed to delete notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!text) {
      toast({
        title: "Validation Error",
        description: "Please provide notification text",
        variant: "destructive",
      });
      return;
    }

    if (isCoupon && !couponCode) {
      toast({
        title: "Validation Error",
        description: "Please provide a coupon code",
        variant: "destructive",
      });
      return;
    }

    const notificationData = {
      text,
      secondaryText: secondaryText || undefined,
      backgroundImage: backgroundImage || undefined,
      image: image || undefined,
      coupon: isCoupon,
      couponCode: isCoupon ? couponCode : undefined,
    };

    createNotificationMutation.mutate(notificationData);
  };

  const handleDelete = () => {
    if (notificationToDelete) {
      deleteNotificationMutation.mutate(notificationToDelete);
    }
  };

  const resetForm = () => {
    setText("");
    setSecondaryText("");
    setBackgroundImage("");
    setImage("");
    setIsCoupon(false);
    setCouponCode("");
  };

  const openPreview = (notification) => {
    setPreviewNotification(notification);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Notification
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Notification</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new notification
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="text">Notification Text*</Label>
                  <Input
                    id="text"
                    placeholder="Enter notification message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secondaryText">Secondary Text (Optional)</Label>
                  <Input
                    id="secondaryText"
                    placeholder="Enter additional message or description"
                    value={secondaryText}
                    onChange={(e) => setSecondaryText(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="backgroundImage">Background Image URL (Optional)</Label>
                  <Input
                    id="backgroundImage"
                    placeholder="https://example.com/background.jpg"
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL (Optional)</Label>
                  <Input
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isCoupon" 
                    checked={isCoupon}
                    onCheckedChange={setIsCoupon}
                  />
                  <Label htmlFor="isCoupon">This notification includes a coupon</Label>
                </div>
                {isCoupon && (
                  <div className="grid gap-2">
                    <Label htmlFor="couponCode">Coupon Code*</Label>
                    <Input
                      id="couponCode"
                      placeholder="e.g. WELCOME20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  resetForm();
                  setIsCreating(false);
                  navigate('/notification', { replace: true });
                }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createNotificationMutation.isPending}>
                  {createNotificationMutation.isPending ? "Creating..." : "Create Notification"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading notifications...</div>
      ) : notifications?.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No notifications found</p>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Notification
          </Button>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Text</TableHead>
                <TableHead>Has Coupon</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications?.map((notification) => (
                <TableRow key={notification._id}>
                  <TableCell className="font-medium max-w-[300px] truncate">{notification.text}</TableCell>
                  <TableCell>
                    {notification.coupon ? `Yes (${notification.couponCode})` : "No"}
                  </TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openPreview(notification)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500"
                            onClick={() => setNotificationToDelete(notification._id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this notification? This action cannot be undone.
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Notification Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Notification Preview</DialogTitle>
          </DialogHeader>
          {previewNotification && (
  <div className="rounded-lg overflow-hidden shadow-md w-full max-w-sm mx-auto">
    
    {/* Top image/logo */}
    {previewNotification.image && (
      <div className="w-full">
        <img 
          src={previewNotification.image} 
          alt="notification image" 
          className="w-full object-cover"
        />
      </div>
    )}

    {/* Background & content */}
    <div 
      className="p-6 text-center" 
      style={{ 
        backgroundImage: `url(${previewNotification.backgroundImage || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <h2 className="text-2xl font-bold text-yellow-400">{previewNotification.text}</h2>
      {previewNotification.secondaryText && (
        <p className="text-yellow-300 mt-2">{previewNotification.secondaryText}</p>
      )}

      {/* Coupon Code Section */}
      {previewNotification.coupon && (
        <div className="mt-6 bg-white rounded-full flex justify-between items-center px-4 py-2 max-w-xs mx-auto shadow">
          <span className="text-gray-600 font-medium">USE CODE:</span>
          <span className="text-black font-bold">{previewNotification.couponCode}</span>
        </div>
      )}
    </div>
  </div>
)}


          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;