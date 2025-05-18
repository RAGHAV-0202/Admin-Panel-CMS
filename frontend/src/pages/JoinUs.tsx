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
import { Trash2, Mail, Phone, MapPin, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import API service functions
import { getAllCareers, deleteCareer } from "../services/api.ts";

interface CareerApplication {
  _id: string;
  name: string;
  skills: string;
  experience: string;
  phone: string;
  email: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

const JoinUs = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: careers = [], isLoading, error } = useQuery({
    queryKey: ["careerApplications"],
    queryFn: getAllCareers,
  });

  const deleteCareerMutation = useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careerApplications"] });
      toast({ title: "Career application deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete application",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["careerApplications"] }).then(() => {
      setIsRefreshing(false);
      toast({ title: "Data refreshed" });
    });
  };

  // Log careers for debugging
  if (careers) {
    console.log("Career applications data:", careers);
  }

  // Handle API error
  if (error) {
    return (
      <div className="flex justify-center py-8 text-red-500">
        Failed to load career applications: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Career Applications</CardTitle>
            <CardDescription>
              View and manage job applications
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
          ) : careers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No career applications found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careers.map((career: CareerApplication) => (
                  <TableRow key={career._id}>
                    <TableCell>
                      <div className="font-medium">{career.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {career.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={career.skills}>
                        {career.skills}
                      </div>
                    </TableCell>
                    <TableCell>{career.experience}</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone size={14} className="mr-2" />
                          {career.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-2" />
                          {career.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin size={14} className="mr-2" />
                        {career.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(career.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          asChild
                          title="Send Email"
                        >
                          <a href={`mailto:${career.email}`}>
                            <Mail size={16} />
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
                                Delete Career Application
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this career
                                application? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteCareerMutation.mutate(career._id)
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

export default JoinUs;