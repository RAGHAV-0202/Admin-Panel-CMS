import {verifyCoupon  , createCoupon , deleteCoupon , getCoupons} from "../controllers/coupons.controller.js"
import express from "express"
import VerifyAdminJWT from "../middlewares/verifyAdminJWT.js";

const router = express.Router();

router.route("/verify").post(verifyCoupon)

router.route("/create").post(VerifyAdminJWT , createCoupon)
router.route("/delete/:id").post(VerifyAdminJWT , deleteCoupon)
router.route("/get").get(VerifyAdminJWT , getCoupons)

export default router