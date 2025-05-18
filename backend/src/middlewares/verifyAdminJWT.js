import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import Admin from "../models/admin.models.js"
import apiError from "../utils/apiError.js"
import dotenv from "dotenv"
dotenv.config()

const VerifyAdminJWT = asyncHandler(async(req,res,next)=>{

    const accessToken = req.cookies.AdminAccessToken || req.header("Authorization")?.replace("Bearer " , "")
    // console.log(accessToken)
    if(!accessToken){
        throw new apiError(403 , "No accessToken present , Unauthorized access")
    }

    const decodedToken = jwt.verify(accessToken , process.env.ADMIN_ACCESS_TOKEN_SECRET)
    if(!decodedToken){
         throw new apiError(403 , "Invalid accessToken present , Unauthorized access")
    }

    const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    if(!admin){
        throw new apiError(403 , "Invalid accessToken present , Unauthorized access")
    }
    req.user = admin
    next()
})

export default VerifyAdminJWT