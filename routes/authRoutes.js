// backend/routes/authRoutes.js
import express from "express";
import { registerUser, verifyOTP } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);

export default router;
