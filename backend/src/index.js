import mongoose from "mongoose";
import connectDB from "./db/connectDB.js";
import app from "./app.js";


const port = process.env.PORT || 8080;

async function Host(){
    try{
        await connectDB()
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
    }catch(err){
        console.log("error while hosting !!!")
        console.log(err)
    }
}

Host()