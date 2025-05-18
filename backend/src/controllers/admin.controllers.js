import Calls from "../models/Calls.models.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import Payments from "../models/payment.models.js";
import Coupons from "../models/coupons.models.js";
import Admin from "../models/admin.models.js";
import dotenv from "dotenv"
dotenv.config()
import jwt from "jsonwebtoken"
import Career from "../models/career.models.js";

async function generateAccessToken(userId){
    try{
        const admin = await Admin.findById(userId)
        const accessToken = admin.generateAccessToken() ;

        return {accessToken}
        
    }catch(Error){
        throw new apiError(500 , "Something went wrong while generating token")
    }
}

const adminLogin = asyncHandler(async(req,res)=>{
    const {email , password} = req.body 
    if(!email || !password ){
        throw new apiError(400 , "enter email and passoword")
    }
    const admin = await Admin.findOne({email : email})
    if(!admin){
        throw new apiError(400 , "Invalid Login or Password , admin not found")
    }
    const isPassValid = password == admin.password
    if(!isPassValid){
        throw new apiError(400 , "Invalid Login or Password")
    }
    const {accessToken} = await generateAccessToken(admin._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 10 * 24 * 60 * 60 * 1000
    };

    return res.status(200)
        .cookie("AdminAccessToken" , accessToken , options)
        .json(
            new ApiResponse(200 , {accessToken : accessToken} , "Welcome Admin")
        )    

})

const adminLogout = asyncHandler(async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: true, 
        sameSite: 'None', 
        path: '/' 
    };

    // Clear both accessToken and refreshToken cookies
    res.clearCookie('AdminAccessToken', cookieOptions);
    return res.status(200).json(new ApiResponse(200, "user logged out"));
});

const checkLoggedIn = asyncHandler(async(req,res,next)=>{
    let AT = req.cookies.AdminAccessToken;  
    console.log(AT)

    if (!AT && req.headers.authorization?.startsWith("Bearer ")) {
        AT = req.headers.authorization.split(" ")[1];
    }
    if (!AT) {
        throw new apiError(400, "No token present");
    }

    let decoded;
    try {
        console.log(process.env.ADMIN_ACCESS_TOKEN_SECRET)
        decoded = jwt.verify(AT, process.env.ADMIN_ACCESS_TOKEN_SECRET);
        console.log(decoded)
    } catch (err) {
        console.log("Token verification failed", err);
        throw new apiError(401, "Invalid or expired token");
    }

    res.status(200).json(new ApiResponse(200, decoded, "Admin is logged in"));
})

const getAllCallRequests = asyncHandler(async(req,res,next)=>{
    const calls = await Calls.find();
    console.log("requested calls")
    res.status(200).json(new ApiResponse(200 , calls , "All calls have been fetched"))
})

const deleteCallRequest = asyncHandler(async(req,res,next)=>{
    const {id} = req.params
    const call = await Calls.findById(id)

    if(!call){
        throw new apiError(400 , "No call request with that id found")
    }

    await Calls.findByIdAndDelete(id)

    res.status(200).json(new ApiResponse(200 , [] , "Call Request has been deleted"))
   
})

const updateCallRequestStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "scheduled", "in-progress", "completed", "cancelled", "rejected"];
    if (!validStatuses.includes(status)) {
        throw new apiError(400, "Invalid status provided");
    }

    const updatedCall = await Calls.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!updatedCall) {
        throw new apiError(404, "Call request not found");
    }

    res.status(200).json(
        new ApiResponse(200, updatedCall, "Call request status updated successfully")
    );
});

const getAllPaymentRequests = asyncHandler(async (req, res, next) => {
    const payments = await Payments.find();
    res.status(200).json(new ApiResponse(200, payments, "All payment requests have been fetched"));
});

const updatePaymentRequestStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
        throw new apiError(400, "Invalid status provided");
    }

    const updatedPayment = await Payments.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!updatedPayment) {
        throw new apiError(404, "Payment request not found");
    }

    res.status(200).json(
        new ApiResponse(200, updatedPayment, "Payment request status updated successfully")
    );
});

const deletePaymentRequest = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const payment = await Payments.findById(id);
    if (!id) {
        throw new apiError(404, "Coupon not found");
    }

    await Payments.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, [], "Payment deleted successfully")
    );
})

const createCoupon = asyncHandler(async (req, res, next) => {
    const { code, offPercentage, maxDiscount } = req.body;

    if (!code?.trim() || !offPercentage) {
        throw new apiError(400, "Coupon code and offPercentage are required");
    }

    const existingCoupon = await Coupons.findOne({ code });
    if (existingCoupon) {
        throw new apiError(400, "Coupon with this code already exists");
    }

    const coupon = await Coupons.create({ code, offPercentage, maxDiscount });

    res.status(201).json(
        new ApiResponse(201, coupon, "Coupon created successfully")
    );
});

const deleteCoupon = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const coupon = await Coupons.findById(id);
    if (!coupon) {
        throw new apiError(404, "Coupon not found");
    }

    await Coupons.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, [], "Coupon deleted successfully")
    );
})

const deleteCareerRequest = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const career = await Career.findById(id);
    if (!career) {
        throw new apiError(404, "career request not found");
    }

    await Career.findByIdAndDelete(id);

    res.status(200).json(
        new ApiResponse(200, [], "Join request deleted successfully")
    );
})


const getAllJoiningRequests = asyncHandler(async (req, res, next) => {
    const payments = await Career.find();
    res.status(200).json(new ApiResponse(200, payments, "All joining requests have been fetched"));
});


export {adminLogin,adminLogout ,getAllCallRequests,deleteCallRequest,updateCallRequestStatus , getAllPaymentRequests , updatePaymentRequestStatus , createCoupon , deleteCoupon ,checkLoggedIn,deletePaymentRequest , deleteCareerRequest , getAllJoiningRequests}