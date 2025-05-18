
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Course from "../models/course.models.js";

const createCourse = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { 
        courseCode, 
        title, 
        price, 
        duration, 
        level, 
        description, 
        objectives, 
        mentorName, 
        mentorDesignation, 
        mentorDesc, 
        img, 
        mentorImg ,
        courseType,
        category
    } = req.body;
    
    // Validate required fields
    if (!courseCode || !title || !price) {
        throw new apiError(400, "Course code, title, and price are required");
    }
    
    // Check if course with the same course code already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
        throw new apiError(400, "Course with this course code already exists");
    }
    const course = await Course.create({
        courseCode,
        title,
        price,
        duration: duration || null,
        level: level || null,
        description: description || null,
        objectives: objectives || null,
        mentorName: mentorName || null,
        mentorDesignation: mentorDesignation || null,
        mentorDesc: mentorDesc || null,
        mentorImg: mentorImg || null,
        img: img || null,
        courseType : courseType || "short",
        category
    });
    
    return res.status(201).json(new ApiResponse(201, course, "Course created successfully"));
  });

  const updateCourse = asyncHandler(async (req, res) => {
    const { courseCode } = req.body;

    // Validate ID
    if (!courseCode) {
        throw new apiError(400, "Course code is required");
    }

    const course = await Course.findOne({courseCode : courseCode});
    if (!course) {
        throw new apiError(404, "Course not found");
    }

    const { 
        title, 
        price, 
        duration, 
        level, 
        description, 
        img, 
        objectives, 
        mentorName, 
        mentorDesignation, 
        mentorDesc,
        mentorImg,
        courseType,
        category
    } = req.body;

    // Check if courseCode is being changed and is unique
    if (courseCode && courseCode !== course.courseCode) {
        const existingCourse = await Course.findOne({ courseCode : courseCode });
        if (existingCourse) {
            throw new apiError(409, "Course with this code already exists");
        }
    }

    // Validate price if provided
    if (price !== undefined && (isNaN(price) || price < 0)) {
        throw new apiError(400, "Invalid price");
    }

    const updatedCourse = await Course.findOneAndUpdate(
        {courseCode : courseCode},
        {
            courseCode: courseCode?.trim() || course.courseCode,
            title: title?.trim() || course.title,
            price: price || course.price,
            duration: duration?.trim() || course.duration,
            level: level?.trim() || course.level,
            description: description?.trim() || course.description,
            img: img?.trim() || course.img,
            objectives: objectives || course.objectives,
            mentorName: mentorName?.trim() || course.mentorName,
            mentorDesignation: mentorDesignation?.trim() || course.mentorDesignation,
            mentorDesc: mentorDesc?.trim() || course.mentorDesc,
            mentorImg: mentorImg?.trim() || course.mentorImg,
            courseType : courseType?.trim() || course.courseType || "short",
            category : category?.trim() || course.category || "Most popular"
        },
        { 
            new: true,
            runValidators: true 
        }
    );

    return res.status(200).json(
        new ApiResponse(200, updatedCourse, "Course updated successfully")
    );
});

const deleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
        throw new apiError(404, "Course not found");
    }

    await Course.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, {}, "Course deleted successfully")
    );
});

const getAllCourses = asyncHandler(async (req, res, next) => {
    const courses = await Course.find({});

    res.status(200).json(
        new ApiResponse(200, courses, "Courses fetched successfully")
    );
});

const getCourseById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findOne({courseCode : id});
    if (!course) {
        throw new apiError(404, "Course not found");
    }

    res.status(200).json(
        new ApiResponse(200, course, "Course fetched successfully")
    );
});



export { 
    updateCourse, 
    deleteCourse,
    getAllCourses,
    getCourseById,
    createCourse
};