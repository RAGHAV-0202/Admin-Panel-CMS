import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME , 
    api_key: process.env.CLOUDINARY_KEY , 
    api_secret: process.env.CLOUDINARY_SECRET 
});


const uploadOnCloudinary = async (localFilePath)=>{
    try{        
        if(!localFilePath){
            return null ;
        }
        const response = await cloudinary.uploader.upload(localFilePath , {resource_type : "auto"})
        // console.log("Successfully Uploaded")
        fs.unlinkSync(localFilePath)
        return response;
    }catch(error){
        console.log(error)
        fs.unlinkSync(localFilePath) // removes the file as the file upload got failed
        return null ;
    }
}

export {uploadOnCloudinary}