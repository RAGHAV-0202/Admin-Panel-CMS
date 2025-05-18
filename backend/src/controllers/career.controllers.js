import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import Career from "../models/career.models.js";



const createCareerRequest = asyncHandler(async(req,res,next)=>{
    const {name , skills , experience, phone,email,location} = req.body ;
    console.log(req.body)
    if(!name?.trim() || !phone?.trim() || !skills?.trim() || !email?.trim() || !experience?.trim() || !location?.trim()){
        throw new apiError(400 , "All fields are required");
    }

    const career = await Career.create({name , skills,  experience , phone , location , email})

    res.status(200).json(new ApiResponse(200 , career , "Call Request has been created"))
})


export {createCareerRequest}