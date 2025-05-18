import mongoose from "mongoose";

const CouponsSchema = new mongoose.Schema({

    code  : {
        type : String, 
        required : [true , "coupon code is Required"],
    },
    offPercentage : {
        type: Number,
        required: [true, "Coupon Off percentage is required"],
    },
    maxDiscount : {
        type: Number,
    } 

} , {timestamps : true})

const Coupons = mongoose.model("Coupons" , CouponsSchema)

export default Coupons