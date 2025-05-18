import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();
import ApiResponse from "./utils/apiResponse.js"
import contactRouter from "./routes/contact.routes.js"
import adminRouter from "./routes/admin.routes.js"
import paymentRouter from "./controllers/payment.controllers.js"
import createCourse from "./controllers/createcourse.js"
import courseRouter from "./routes/course.routes.js"
import couponRouter from "./routes/coupons.routes.js"
import notificationRouter from "./routes/notification.routes.js"
import careerRouter from "./routes/career.routes.js"

const app = express();
app.use(express.json({limit : "100kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));    


const corsOptions = {
    origin: ['http://localhost:5000' , 'https://raghav-0202.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true ,
    sameSite: 'None'
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.get("/" , async(req,res)=>{
    res.status(200).json(new ApiResponse(200 , "Server is live"))
})

app.use("/api/contact" ,contactRouter)
app.use("/api/admin" ,adminRouter)
app.use("/api/payment" ,paymentRouter)
// app.use("/api/courses" ,createCourse)
app.use("/api/courses" ,courseRouter)
app.use("/api/coupons" ,couponRouter)
app.use("/api/notifications" , notificationRouter)
app.use("/api/career" , careerRouter)


export default app
