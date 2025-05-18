import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseCode : {
        type : String ,
        required : [true , "Course code is Required"]
    },
    title : {
        type : String ,
        required : [true , "Course Title is Required"]
    },
    price : {
        type : Number ,
        required : [true , "Course Price is Required"]
    },
    duration : {
        type : String ,
        required : [true , "Course duration is Required"]
    },
    level : {
        type : String ,
        required : [true , "Course level is Required"] 
    },
    description : {
        type : String ,
        required : [true , "Course description is Required"] 
    },
    img : {
        type : String ,
        required : [true , "Course image is Required"] 
    },
    objectives : {
        type : String ,
        required : [true , "Course objective is Required"] 
    },
    mentorName : {
        type : String ,
        // required : [true , "mentor name is Required"] 
    },
    mentorImg : {
        type : String ,
        // required : [true , "mentor img is Required"] 
    },
    mentorDesignation : {
        type : String ,
        // required : [true , "mentorDesignation is Required"] 
    },
    mentorDesc : {
        type : String ,
        // required : [true , "mentorDesc is Required"] 
    },
    courseType: {
        type: String,
        enum: ["live", "short"],
        default : "short"
    },
    category: {
        type: String,
        enum: [
          "Cyber security",
          "AI",
          "Development",
          "Most popular",
          "Design & Multimedia"
        ],
        // required: true
        default : "Most popular"
      }
    

} , {timestamps : true})

const Course = mongoose.model("Course" , courseSchema)
export default Course