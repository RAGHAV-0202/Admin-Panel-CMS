import express from "express"
const router = express.Router()
import VerifyAdminJWT from "../middlewares/verifyAdminJWT.js"
import {updateCourse,deleteCourse,getAllCourses,getCourseById , createCourse} from "../controllers/course.controllers.js"


router.route("/create").post(VerifyAdminJWT , createCourse)
router.route("/update").post(VerifyAdminJWT , updateCourse)
router.route("/delete/:id").post(VerifyAdminJWT , deleteCourse)

router.route("/get-all").get(getAllCourses)
router.route("/get-course/:id").get(getCourseById)


export default router