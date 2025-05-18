import mongoose from "mongoose";

const PaymentsSchema = new mongoose.Schema({
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
        // required : [true , "School / College is Required"],
    },
    sem : {
        type : String ,
        // required : [true , "class / semester is Required"],
    },
    status: {
        type: String,
        enum: ["pending", "accepted","rejected"],
        default: "pending"
    },
    courseCode : {
        type : String ,
        required : [true , "course code is Required"],
    },
    paid : {
        type : Number,
        // required : [true , "payment details are required"]
    },
    proof : {
        type : String , 
        required : [true , "payment proof is required"]
    },
    couponCode : {
        type : String , 
    },
    originalAmount: {
        type: Number,
        // default: function() {
        //     return this.paid;
        // }
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String,
        default: null
    },
    couponPercentage: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending"
    }
    
} , {timestamps : true})


const Payments = mongoose.model("Payments" , PaymentsSchema)
export default Payments