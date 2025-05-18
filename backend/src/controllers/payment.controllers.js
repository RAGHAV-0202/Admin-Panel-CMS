import express from "express";
import multer from "multer";
import path from "path";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Payments from "../models/payment.models.js";
import Coupons from "../models/coupons.models.js";
import fs from "fs";
import Course from "../models/course.models.js";
import dotenv from "dotenv"
dotenv.config()

const router = express.Router();
const uploadDir = path.resolve("./public/temp");
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Created upload directory:", uploadDir);
  } catch (error) {
    console.error("Failed to create upload directory:", error);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadDir)) {
      return cb(new Error(`Upload directory doesn't exist: ${uploadDir}`));
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json(new ApiResponse(413, null, "File too large. Maximum size is 10MB"));
    }
    return res.status(400).json(new ApiResponse(400, null, `File upload error: ${err.message}`));
  } else if (err) {
    return res.status(500).json(new ApiResponse(500, null, `Upload error: ${err.message}`));
  }
  next();
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

const cleanupTempFiles = (files) => {
  if (!files) return;
  
  const imagesToCleanup = files.images || [];
  imagesToCleanup.forEach(file => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    } catch (error) {
      console.error(`Failed to delete temporary file ${file.path}:`, error);
    }
  });
};




const handlePaymentVerification = asyncHandler(async (req, res) => {
  console.log("request received");

  let uploadedImage = "NA";
  let finalAmount, originalAmount, discountAmount, appliedCoupon;
  
  try {
    const { name, phone, school, sem, courseCode, couponCode } = req.body;
    const requiredFields = { name, phone, school, sem, courseCode };
    const missingFields = Object.keys(requiredFields).filter(
      (field) => !requiredFields[field]
    );

    if (missingFields.length > 0) {
      throw new apiError(400, `Required fields missing: ${missingFields.join(", ")}`);
    }

    if (!req.files || !req.files.image) {
      throw new apiError(400, "payment proof image is required");
    }

    const course = await Course.findOne({ courseCode });
    if (!course) {
      throw new apiError(404, "Course not found");
    }

    originalAmount = course.price;
    finalAmount = originalAmount;
    discountAmount = 0;

    // Apply coupon if provided
    if (couponCode) {
      appliedCoupon = await Coupons.findOne({ code: couponCode });
      
      if (!appliedCoupon) {
        throw new apiError(400, "Invalid coupon code");
      }
      
      // Check if coupon is expired
      if (appliedCoupon.expiryDate && new Date(appliedCoupon.expiryDate) < new Date()) {
        throw new apiError(400, "Coupon has expired");
      }
      
      // Check if coupon is valid for this course (if there's course restriction)
      if (appliedCoupon.validCourses && appliedCoupon.validCourses.length > 0) {
        if (!appliedCoupon.validCourses.includes(courseCode)) {
          throw new apiError(400, "Coupon not valid for this course");
        }
      }
      
      const { offPercentage, maxDiscount } = appliedCoupon;
      discountAmount = Math.min(
        ((originalAmount * offPercentage) / 100).toFixed(0),
        maxDiscount || Infinity
      );
      finalAmount = originalAmount - discountAmount;
    }

    const imageFile = req.files.image;
    const localFilePath = imageFile[0].path; 
    if (!fs.existsSync(localFilePath)) {
      throw new apiError(400, `File not found: ${path.basename(localFilePath)}`);
    }
    
    const result = await uploadOnCloudinary(localFilePath);
    if (!result || !result.url) {
      throw new apiError(500, "Failed to upload image to Cloudinary");
    }
    uploadedImage = result;

    const payment = await Payments.create({
      name, 
      phone, 
      school, 
      sem, 
      courseCode, 
      paid: finalAmount,
      originalAmount,
      discountAmount,
      couponCode: couponCode || null,
      couponPercentage: appliedCoupon?.offPercentage || null,
      proof: uploadedImage.url,
    });

    console.log(payment);
    cleanupTempFiles(req.files);
    
    return res.status(201).json(new ApiResponse(201, payment, "Payment Verification Request Created Successfully"));
  } catch (error) {
    cleanupTempFiles(req.files);
    
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "An unexpected error occurred";
    
    console.error("Payment verification error:", error);
    throw new apiError(statusCode, errorMessage);
  }
});

router.post(
  "/create",
  (req, res, next) => {
    upload.fields([{ name: "image", maxCount: 1 }])(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  handlePaymentVerification
);





export default router;

