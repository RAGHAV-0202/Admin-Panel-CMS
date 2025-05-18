import express from "express"
const router = express.Router()
import { createCareerRequest } from "../controllers/career.controllers.js"

router.route("/create").post(createCareerRequest)


export default router