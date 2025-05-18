import mongoose from "mongoose";

const CallSchema = new mongoose.Schema({

    name  : {
        type : String, 
        required : [true , "Name is Required"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Phone number must be 10 digits"] 
    },  
    school : {
        type : String ,
        required : [true , "School / College is Required"],
    },
    sem : {
        type : String ,
        required : [true , "class / semester is Required"],
    },
    status: {
        type: String,
        enum: ["pending", "scheduled", "completed", "cancelled", "rejected" , "contacted" , "resolved"],
        default: "pending"
    }
    

} , {timestamps : true})

const Calls = mongoose.model("Calls" , CallSchema)

export default Calls