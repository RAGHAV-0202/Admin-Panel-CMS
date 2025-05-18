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
    origin: ['http://localhost:3000' , 'https://teen-xcel-theta.vercel.app', 'http://localhost:8080' , "http://localhost:8080/payments", 'https://preview-cb194ffb--site-manager-dashboard.lovable.app', "http://172.20.10.2:3000" , "http://localhost:8080", "http://192.168.29.76" , "http://127.0.0.1:5500","http://192.168.29.76" , "https://teen-xcel-uz7r.vercel.app" , 'https://raghav-0202.github.io/teenxcel-h' , 'https://raghav-0202.github.io'],
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