import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

async function connectDB(){
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
    }catch(error){
        console.log("Error while connecting to the database")
        console.log(Error)
    }
}

export default connectDB

