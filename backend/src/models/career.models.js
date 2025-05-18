import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema({

    name  : {
        type : String, 
        required : [true , "Name is Required"],
    },
    skills : {
        type : String,
        required : [true , "skills are Required"],
    },
    experience : {
        type : String,
        required : [true , "experience are Required"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Phone number must be 10 digits"] 
    },  
    email  : {
        type : String, 
        required : [true , "email is Required"],
    },
    location  : {
        type : String, 
        required : [true , "location is Required"],
    },
    

} , {timestamps : true})

const Career = mongoose.model("Career" , CareerSchema)

export default Career