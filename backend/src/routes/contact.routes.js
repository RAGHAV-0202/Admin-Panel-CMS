import express from "express"
const router = express.Router()
import { createCallRequest } from "../controllers/contact.controllers.js"

router.route("/request").post(createCallRequest)


export default router