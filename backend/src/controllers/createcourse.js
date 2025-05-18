// import express from "express";
// import multer from "multer";
// import path from "path";
// import asyncHandler from "../utils/asyncHandler.js";
// import apiError from "../utils/apiError.js";
// import ApiResponse from "../utils/apiResponse.js";
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import Course from "../models/course.models.js";
// import fs from "fs";
// import verifyAdminJWT from "../middlewares/verifyAdminJWT.js"

// const router = express.Router();
// const uploadDir = path.resolve("./public/temp");
// if (!fs.existsSync(uploadDir)) {
//   try {
//     fs.mkdirSync(uploadDir, { recursive: true });
//     console.log("Created upload directory:", uploadDir);
//   } catch (error) {
//     console.error("Failed to create upload directory:", error);
//   }
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (!fs.existsSync(uploadDir)) {
//       return cb(new Error(`Upload directory doesn't exist: ${uploadDir}`));
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const handleMulterError = (err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     if (err.code === 'LIMIT_FILE_SIZE') {
//       return res.status(413).json(new ApiResponse(413, null, "File too large. Maximum size is 10MB"));
//     }
//     return res.status(400).json(new ApiResponse(400, null, `File upload error: ${err.message}`));
//   } else if (err) {
//     return res.status(500).json(new ApiResponse(500, null, `Upload error: ${err.message}`));
//   }
//   next();
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
//       return cb(new Error("Only image files are allowed!"));
//     }
//     cb(null, true);
//   },
// });

// const cleanupTempFiles = (files) => {
//   if (!files) return;
  
//   Object.keys(files).forEach(fieldname => {
//     files[fieldname].forEach(file => {
//       try {
//         if (fs.existsSync(file.path)) {
//           fs.unlinkSync(file.path);
//         }
//       } catch (error) {
//         console.error(`Failed to delete temporary file ${file.path}:`, error);
//       }
//     });
//   });
// };

// const createCourse = asyncHandler(async (req, res, next) => {
//   try {
//     // Note: The actual file upload middleware is applied in the route definition
//     // This function assumes the files are already handled by that middleware
    
//     const {courseCode, title, price, duration, level, description, objectives, mentorName, mentorDesignation, mentorDesc} = req.body;

//     console.log(req.body)
//     console.log(req.files)

//     if (
//       !courseCode?.trim() || 
//       !title?.trim() || 
//       !price || 
//       !duration?.trim() || 
//       !level?.trim() ||
//       !description?.trim() || 
//       !objectives?.trim() || 
//       !mentorName?.trim() || 
//       !mentorDesignation?.trim() || 
//       !mentorDesc?.trim()
//     ) {
//       if (req.files) {
//         cleanupTempFiles(req.files);
//       }
//       throw new apiError(400, "All fields are required");
//     }

//     // Check if course already exists
//     const existingCourse = await Course.findOne({ courseCode });
//     if (existingCourse) {
//       cleanupTempFiles(req.files);
//       throw new apiError(409, "Course with this code already exists");
//     }

//     let courseImageUrl;
//     let mentorImageUrl;

//     if (req.files && req.files.img && req.files.img[0]) {
//       const courseImageLocalPath = req.files.img[0].path;
//       const cloudinaryResponse = await uploadOnCloudinary(courseImageLocalPath);
      
//       if (!cloudinaryResponse || !cloudinaryResponse.url) {
//         cleanupTempFiles(req.files);
//         throw new apiError(500, "Failed to upload course image to Cloudinary");
//       }
      
//       courseImageUrl = cloudinaryResponse.url;
//     } else {
//       cleanupTempFiles(req.files);
//       throw new apiError(400, "Course image is required");
//     }

//     if (req.files && req.files.mentorImg && req.files.mentorImg[0]) {
//       const mentorImageLocalPath = req.files.mentorImg[0].path;
//       const cloudinaryResponse = await uploadOnCloudinary(mentorImageLocalPath);
      
//       if (!cloudinaryResponse || !cloudinaryResponse.url) {
//         cleanupTempFiles(req.files);
//         throw new apiError(500, "Failed to upload mentor image to Cloudinary");
//       }
      
//       mentorImageUrl = cloudinaryResponse.url;
//     } else {
//       mentorImageUrl = "";
//     }

//     cleanupTempFiles(req.files);

//     const course = await Course.create({
//       courseCode,
//       title,
//       price: Number(price),
//       duration,
//       level,
//       description,
//       img: courseImageUrl,
//       objectives, // Now storing objectives as a string
//       mentorName,
//       mentorDesignation,
//       mentorDesc,
//       mentorImg: mentorImageUrl
//     });

//     res.status(201).json(
//       new ApiResponse(201, course, "Course created successfully")
//     );
//   } catch (error) {
//     next(error);
//   }
// });


// router.post(
//   "/create",
//   verifyAdminJWT,
//   (req, res, next) => {
//     upload.fields([
//       { name: "img", maxCount: 1 },
//       { name: "mentorImg", maxCount: 1 }
//     ])(req, res, (err) => {
//       if (err) {
//         return handleMulterError(err, req, res, next);
//       }
//       next();
//     });
//   },
//   createCourse
// );

// export default router;

import express from "express";
import path from "path";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Course from "../models/course.models.js";
import verifyAdminJWT from "../middlewares/verifyAdminJWT.js";

const router = express.Router();

// Course creation handler
const createCourse = asyncHandler(async (req, res) => {
  try {
    // Destructure course details from request body
    // console.log(req.body)
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
      img,           // Image URL for course
      mentorImg,     // Image URL for mentor
      category,      // Category field - now properly included
      courseType     // This is also present in the request body but not used
    } = req.body;

    // Validate required fields
    const requiredFields = [
      courseCode, title, price, duration, level, 
      description, objectives, mentorName, 
      mentorDesignation, mentorDesc, img, category
    ];
    
    if (requiredFields.some(field => !field || field.toString().trim() === '')) {
      throw new apiError(400, "All fields are required");
    }

    // Check if course already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      throw new apiError(409, "Course with this code already exists");
    }


    // Create course in database
    const course = await Course.create({
      courseCode,
      title,
      price: Number(price),
      duration,
      level,
      description,
      img,              
      objectives,
      mentorName,
      mentorDesignation,
      mentorDesc,
      mentorImg: mentorImg || "", 
      category,         
      courseType       
    });

    console.log("Course created successfully:", course);
    res.status(201).json(
      new ApiResponse(201, course, "Course created successfully")
    );
  } catch (error) {
    throw error;
  }
});

// Route for course creation
router.route("/create").post(verifyAdminJWT, createCourse);

export default router;