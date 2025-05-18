import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Coupons from "../models/coupons.models.js";
import Course from "../models/course.models.js";

const createCoupon = asyncHandler(async (req, res) => {
    const { code, offPercentage, maxDiscount } = req.body;
    
    if (!code || !offPercentage) {
      throw new apiError(400, "Coupon code and discount percentage are required");
    }
    
    // Check if coupon already exists
    const existingCoupon = await Coupons.findOne({ code });
    if (existingCoupon) {
      throw new apiError(400, "Coupon code already exists");
    }
    
    const coupon = await Coupons.create({
      code,
      offPercentage,
      maxDiscount: maxDiscount || null
    });
    
    return res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"));
  });
  
const getCoupons =  asyncHandler(async (req, res) => {
const coupons = await Coupons.find({});
return res.status(200).json(new ApiResponse(200, coupons, "Coupons retrieved successfully"));
});
  
  
const deleteCoupon = asyncHandler(async (req, res) => {
const coupon = await Coupons.findByIdAndDelete(req.params.id);

if (!coupon) {
    throw new apiError(404, "Coupon not found");
}

return res.status(200).json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});
  
const verifyCoupon = asyncHandler(async (req, res) => {
  const { couponCode, courseCode } = req.body;

  if (!couponCode) {
      throw new apiError(400, "Coupon code is required");
  }

  if (!courseCode) {
      throw new apiError(400, "Valid CourseCodeis required");
  }

  const coupon = await Coupons.findOne({ code: couponCode });
  
  if (!coupon) {
    throw new apiError(404, "Invalid coupon code");
  }
  const {offPercentage , maxDiscount} = coupon;

  const course = await Course.findOne({courseCode : courseCode})

  let discountAmount = Math.min(((course.price * coupon.offPercentage) / 100).toFixed(0) , maxDiscount);

  const finalAmount = course.price - discountAmount;

  return res.status(200).json(
      new ApiResponse(200, {
      couponCode,
      maxDiscount: coupon.maxDiscount || null,
      discountPercentage: coupon.offPercentage,
      originalAmount : course.price, 
      discountAmount,
      finalAmount,
      }, "Coupon applied successfully")
  );
});

export {verifyCoupon  , createCoupon , deleteCoupon , getCoupons }