import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv"
dotenv.config()

const AdminSchema = new mongoose.Schema({
    email : {
        type : String , 
        required : [true , "email is required"],
        unique : [true , "email already in use"]
    },
    password : {
        type : String , 
        required : [true , "Password is required"] ,
        minlength : 6 , 
    },
    isAdmin : {
        type : Boolean ,
        default : true
    }
} , {timestamps : true})


AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

AdminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateAccessToken = function () {
    // console.log(process.env.ADMIN_ACCESS_TOKEN_EXPIRY ,process.env.ADMIN_ACCESS_TOKEN_SECRET )
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username, fullName: this.fullName },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY }
    );
};

const Admin = mongoose.model("Admin" , AdminSchema)
export default Admin