import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCourses, createCourse, updateCourse, deleteCourse } from "../services/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Pencil } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface CourseFormData {
  _id?: string;
  courseCode: string;
  title: string;
  price: string;
  duration: string;
  level: string;
  courseType: string; // Added course type field
  description: string;
  objectives: string;
  mentorName: string;
  mentorDesignation: string;
  mentorDesc: string;
  img?: string;
  mentorImg?: string;
  category?: string
}

const defaultCourseData: CourseFormData = {
  courseCode: "",
  title: "",
  price: "",
  duration: "",
  level: "",
  courseType: "live", // Default value for course type
  description: "",
  objectives: "",
  mentorName: "",
  mentorDesignation: "",
  mentorDesc: "",
  img: "",
  mentorImg: "",
  category : ""
};

const Courses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(location.search.includes('new=true'));
  const [isEditing, setIsEditing] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(defaultCourseData);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: any) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Created",
        description: "The course has been created successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      navigate('/courses', { replace: true });
    },
    onError: (error: any) => {
      console.error("Create course error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (data: any) => updateCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Updated",
        description: "The course has been updated successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error("Update course error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update course",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully",
      });
      setCourseToDelete(null);
    },
    onError: (error: any) => {
      console.error("Delete course error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
   
  };

  // Handle select change for course type
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, courseType: value }));
    console.log(formData)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.category) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive",
      });
      return;
    }
  
    // Validate image links
    if (!isEditing && (!formData.img || !formData.mentorImg)) {
      toast({
        title: "Error",
        description: "Course and mentor image links are required for new courses",
        variant: "destructive",
      });
      return;
    }

    // Create an object for submission (not FormData)
    const courseData = {
      ...formData,
      // Only include _id if editing
      ...(isEditing && formData._id ? { _id: formData._id } : {})
    };
  
    // Submit to appropriate mutation
    if (isEditing) {
      updateCourseMutation.mutate(courseData);
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  const handleEdit = (course: CourseFormData) => {
    setFormData({
      _id: course._id,
      courseCode: course.courseCode || "",
      title: course.title || "",
      price: String(course.price) || "",
      duration: course.duration || "",
      level: course.level || "",
      courseType: course.courseType || "live", // Default to "live" if not specified
      description: course.description || "",
      objectives: course.objectives || "",
      mentorName: course.mentorName || "",
      mentorDesignation: course.mentorDesignation || "",
      mentorDesc: course.mentorDesc || "",
      img: course.img || "",
      mentorImg: course.mentorImg || "",
      category : course.category || ""
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = () => {
    if (courseToDelete) {
      deleteCourseMutation.mutate(courseToDelete);
    }
  };

  const resetForm = () => {
    setFormData(defaultCourseData);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsEditing(false);
      resetForm();
      if (location.search.includes('new=true')) {
        navigate('/courses', { replace: true });
      }
    }
  };

  const courseForm = (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="courseCode">Course Code*</Label>
            <Input
              id="courseCode"
              name="courseCode"
              placeholder="e.g. CS101"
              value={formData.courseCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              name="title"
              placeholder="Course Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Price*</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="e.g. 5000"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration*</Label>
            <Input
              id="duration"
              name="duration"
              placeholder="e.g. 8 weeks"
              value={formData.duration}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
          <Label htmlFor="level">Level*</Label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="" disabled>Select level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        </div>
        {/* Added Course Type Select Field */}
        <div className="flex gap-4">
          {/* Course Type */}
          <div className="grid gap-2 w-full">
            <Label htmlFor="courseType">Course Type*</Label>
            <Select value={formData.courseType} onValueChange={handleSelectChange}>
              <SelectTrigger id="courseType">
                <SelectValue placeholder="Select course type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="grid gap-2 w-full">
          <Label htmlFor="category">Category*</Label>
            <Select
              value={formData.category || ""} // Ensure empty string for empty value
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, category: value }));
                console.log("Category changed to:", value); // Debug log
              }}
              required
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cyber security">Cyber Security</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Most popular">Most Popular</SelectItem>
                <SelectItem value="Design & Multimedia">Design & Multimedia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="img">Course Image Link*</Label>
          <Input
            id="img"
            name="img"
            placeholder="Paste image URL"
            value={formData.img}
            onChange={handleChange}
            required={!isEditing}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description*</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Course description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="objectives">Objectives*</Label>
          <Textarea
            id="objectives"
            name="objectives"
            placeholder="Course objectives"
            rows={3}
            value={formData.objectives}
            onChange={handleChange}
            required
          />
        </div>
        <h3 className="text-lg font-medium mt-4">Mentor Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="mentorName">Mentor Name*</Label>
            <Input
              id="mentorName"
              name="mentorName"
              placeholder="Full name"
              value={formData.mentorName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mentorDesignation">Designation*</Label>
            <Input
              id="mentorDesignation"
              name="mentorDesignation"
              placeholder="e.g. Professor"
              value={formData.mentorDesignation}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mentorImg">Mentor Image Link*</Label>
          <Input
            id="mentorImg"
            name="mentorImg"
            placeholder="Paste mentor image URL"
            value={formData.mentorImg}
            onChange={handleChange}
            required={!isEditing}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mentorDesc">Mentor Description*</Label>
          <Textarea
            id="mentorDesc"
            name="mentorDesc"
            placeholder="Mentor biography"
            rows={3}
            value={formData.mentorDesc}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
        >
          {isEditing
            ? (updateCourseMutation.isPending ? "Updating..." : "Update Course")
            : (createCourseMutation.isPending ? "Creating..." : "Create Course")
          }
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Course" : "Create New Course"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the course information" : "Fill in the details below to create a new course"}
            </DialogDescription>
          </DialogHeader>
          {courseForm}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="text-center py-8">Loading courses...</div>
      ) : courses?.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No courses found</p>
          <Button onClick={() => {
            setIsEditing(false);
            setIsDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Course
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course: any) => (
            <Card key={course._id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={course.img || "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM="}
                  alt={course.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                  }}
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">Code: {course.courseCode}</p>
                  </div>
                  <p className="font-bold">₹{course.price}</p>
                </div>
                <div className="flex gap-2 mt-2">
                  <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {course.duration}
                  </p>
                  <p className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {course.level}
                  </p>
                  {/* Display course type badge */}
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    course.courseType === 'live' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {course.courseType === 'live' ? 'Live' : 'Short'}
                  </p>
                </div>
                <p className="mt-4 text-sm line-clamp-2">{course.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2">
                    <img
                      src={course.mentorImg || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"}
                      alt={course.mentorName}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
                      }}
                    />
                    <div className="text-xs">
                      <p className="font-medium">{course.mentorName}</p>
                      <p className="text-muted-foreground">{course.mentorDesignation}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(course)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => setCourseToDelete(course._id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the course "{course.title}"? This action cannot be undone.
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;