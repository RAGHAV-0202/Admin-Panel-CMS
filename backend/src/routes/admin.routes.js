import express from "express"
import  VerifyAdminJWT  from "../middlewares/verifyAdminJWT.js"
import {adminLogin,adminLogout, getAllCallRequests,deleteCallRequest,updateCallRequestStatus , checkLoggedIn , getAllPaymentRequests , updatePaymentRequestStatus , createCoupon , deleteCoupon , deletePaymentRequest , deleteCareerRequest , getAllJoiningRequests} from "../controllers/admin.controllers.js"
const router = express.Router()

router.route("/login").post(adminLogin)
router.route("/logout").post(adminLogout)
router.route("/loggedin").get(checkLoggedIn)

router.route("/calls").get(VerifyAdminJWT , getAllCallRequests)
router.route("/delete-call/:id").post(VerifyAdminJWT , deleteCallRequest)
router.route("/update-call/:id").post(VerifyAdminJWT , updateCallRequestStatus)

router.route("/payments").get(VerifyAdminJWT , getAllPaymentRequests)
router.route("/update-payment/:id").post(VerifyAdminJWT , updatePaymentRequestStatus)
router.route("/delete-payment/:id").post(VerifyAdminJWT , deletePaymentRequest)

router.route("/create-coupon").post(VerifyAdminJWT , createCoupon)
router.route("/delete-coupon").post(VerifyAdminJWT , deleteCoupon)

router.route("/delete-join-request/:id").post(VerifyAdminJWT , deleteCareerRequest)
router.route("/career-requests").get(VerifyAdminJWT , getAllJoiningRequests)

export default router