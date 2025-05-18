import express from "express"
const router = express.Router()
import VerifyAdminJWT from "../middlewares/verifyAdminJWT.js"

import { 
    createNotification, 
    getNotifications, 
    deleteNotification,
    getNotificationById,
    updateNotification
} from "../controllers/notification.controller.js"


router.route("/create").post(VerifyAdminJWT , createNotification)
router.route("/get").get(getNotifications)
router.route("/delete/:id").post(VerifyAdminJWT , deleteNotification)
router.route("/get-single/:id").get(VerifyAdminJWT , getNotificationById)
router.route("/update/:id").post(VerifyAdminJWT , updateNotification)


export default router