// backend/routes/authRoutes.js
import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendOTPEmail } from "../utils/emailService.js";
import { generateToken } from "../controllers/tokenController.js"; // Import generateToken function

const router = express.Router();

// Registration route with OTP generation and temporary token setup
router.post("/register", async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !mobile || !password) {
    return res.status(500).json({ message: "All fields are required" });
  }

  // Check if a user with this email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Generate OTP and hash password
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  // Temporarily store user details and OTP without saving to DB
  const user = new User({
    username,
    email,
    mobile,
    password: hashedPassword,
    otp,
    otpExpiresAt: Date.now() + 5 * 60 * 1000, // OTP valid for 5 mins
  });

  try {
    // Save the user to the database
    await user.save();

    // Log OTP for testing
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Generate a temporary token for OTP verification
    const tempToken = generateToken(email);
    res.cookie("tempToken", tempToken, { httpOnly: true });

    res
      .status(200)
      .json({ message: "OTP generated. Check console for testing.", otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving user to the database" });
  }
});

// OTP Verification route to complete registration
router.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;

  // Retrieve the email from the temporary token
  const tempToken = req.cookies.tempToken;
  if (!tempToken) {
    return res
      .status(401)
      .json({ message: "No token found. Session expired." });
  }

  let email;
  try {
    // Decode the temporary token to extract the email
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    email = decoded.email;
    console.log(email);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  // Fetch the user from the database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if OTP matches and has not expired
  if (user.otp !== otp || Date.now() > user.otpExpiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Mark user as verified
  user.isVerified = true;
  user.otp = null; // Clear OTP
  await user.save();

  // Generate final token
  const finalToken = generateToken(email);
  res.cookie("finalToken", finalToken, { httpOnly: true });

  res.status(200).json({ message: "Registration complete" });
});

export default router;
