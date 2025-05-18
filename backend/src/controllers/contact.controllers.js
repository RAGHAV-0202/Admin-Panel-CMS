import Calls from "../models/Calls.models.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";



const createCallRequest = asyncHandler(async(req,res,next)=>{
    const {name , phone , school , sem} = req.body ;
    console.log(req.body)
    if(!name?.trim() || !phone?.trim() || !school?.trim() || !sem?.trim()){
        throw new apiError(400 , "All 4 fields are required");
    }

    const call = await Calls.create({name , phone , school , sem})

    res.status(200).json(new ApiResponse(200 , call , "Call Request has been created"))
})


export {createCallRequest}